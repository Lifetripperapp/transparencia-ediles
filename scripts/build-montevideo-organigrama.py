#!/usr/bin/env python3
"""Adapt the Montevideo organigrama export into data/montevideo.json.

Reads the structured JSON (and, if given, the flat CSV) and writes only
public fields: names, posts, nominal salaries, institutional contacts and
public social profiles. Cédulas, personal addresses and personal phones
are rejected if they appear.
"""

from __future__ import annotations

import csv
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "montevideo.json"

FUENTE_INTEGRACION = "https://www.juntamvd.gub.uy/public/institucional/integracion"
FUENTE_AUTORIDADES = "https://www.juntamvd.gub.uy/public/institucional/autoridades"
FUENTE_COMISIONES = "https://www.juntamvd.gub.uy/public/actividades-parlamentarias/comisiones"

COLORS = {
    "FA": "#e11d48",
    "PN": "#1d4ed8",
    "PC": "#d97706",
    "CR": "#0284c7",
}

SOCIAL_HOSTS = ("x.com", "twitter.com", "instagram.com", "facebook.com", "linkedin.com")
SENSITIVE_VALUE = re.compile(
    r"(\b09\d{6,}\b|\b\d{1,2}\.\d{3}\.\d{3}-?\d\b|domicilio particular|tel[eé]fono personal|celular)",
    re.I,
)
SENSITIVE_KEY = re.compile(r"(cedula|cédula|domicilio|celular|nacimiento|documento)", re.I)


def slug(value: str) -> str:
    text = unicodedata.normalize("NFKD", value)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or "item"


def norm_name(value: str) -> str:
    text = unicodedata.normalize("NFKD", value or "")
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", text).strip().lower()


def clean(value):
    if value is None:
        return None
    if isinstance(value, str):
        value = value.strip()
        return value or None
    return value


def social(redes):
    public = []
    for red in redes or []:
        url = clean(red.get("url"))
        if not url:
            continue
        host = re.sub(r"^https?://", "", url).split("/")[0].lower()
        host = host[4:] if host.startswith("www.") else host
        if host not in SOCIAL_HOSTS:
            raise SystemExit(f"Red no pública o no reconocida: {url}")
        public.append(
            {
                "red": clean(red.get("red")) or "Red",
                "url": url,
                "confianza": clean(red.get("confianza")),
                "nota": clean(red.get("nota")),
            }
        )
    return public


def short_comision(nombre: str) -> str:
    text = re.sub(r"(?i)^comisi[oó]n especial\s*", "Especial: ", nombre).strip()
    text = re.sub(r"\s+", " ", text)
    if len(text) > 52:
        text = text[:50].rstrip(" ,.;:-") + "…"
    return text


def cargo_unico(value: str | None) -> str:
    if value and re.sub(r"\s+", "", value).lower() in {"cargounico", "cargounico"}:
        return "Cargo único"
    if value and value.lower().replace("ú", "u") == "cargo unico":
        return "Cargo único"
    return value or "Cargo único"


def reject_sensitive(node, path="") -> None:
    if isinstance(node, dict):
        for key, value in node.items():
            if SENSITIVE_KEY.search(key):
                raise SystemExit(f"Clave sensible {path}.{key}")
            reject_sensitive(value, f"{path}.{key}")
    elif isinstance(node, list):
        for index, value in enumerate(node):
            reject_sensitive(value, f"{path}[{index}]")
    elif isinstance(node, str):
        match = SENSITIVE_VALUE.search(node)
        if match:
            raise SystemExit(f"Dato sensible en {path}: {node[max(0, match.start() - 30):match.end() + 30]!r}")


def lista_sort_key(numero: str):
    return (0, int(numero)) if numero.isdigit() else (1, numero)


def build(source: dict) -> dict:
    ediles_src = source["ediles"]
    ids: dict[str, str] = {}
    used = set()

    def unique_id(name: str) -> str:
        base = slug(name)
        if base not in used:
            used.add(base)
            return base
        n = 2
        while f"{base}-{n}" in used:
            n += 1
        used.add(f"{base}-{n}")
        return f"{base}-{n}"

    ediles = []
    for raw in ediles_src:
        edil_id = unique_id(raw["nombre"])
        ids[norm_name(raw["nombre"])] = edil_id
        contratados = []
        for index, person in enumerate(raw.get("contratados") or [], start=1):
            contratados.append(
                {
                    "id": f"{edil_id}-contratado-{index}",
                    "nombre": person["nombre"],
                    "cargo": cargo_unico(person.get("cargo")),
                    "sueldoNominal": round(float(person["sueldo_nominal"]), 2),
                    "fechaIngreso": clean(person.get("fecha_ingreso")),
                    "redes": social(person.get("redes")),
                    "fuente": person.get("fuente"),
                }
            )
        comision = []
        for index, person in enumerate(raw.get("funcionarios_en_comision") or [], start=1):
            comision.append(
                {
                    "id": f"{edil_id}-comision-{index}",
                    "nombre": person["nombre"],
                    "estado": clean(person.get("estado")),
                    "origen": clean(person.get("origen")),
                    "expediente": clean(person.get("exp_jdm")),
                    "resolucion": clean(person.get("resolucion")),
                    "desde": clean(person.get("fecha_inicio")),
                    "hasta": clean(person.get("hasta")),
                    "observaciones": clean(person.get("observaciones")),
                    "redes": social(person.get("redes")),
                    "fuente": person.get("fuente"),
                }
            )
        publicado = bool(contratados or comision)
        total = round(sum(item["sueldoNominal"] for item in contratados), 2) if contratados else None
        declared = raw.get("contratados_total_sueldos_nominales")
        if total is not None and declared is not None and abs(total - float(declared)) > 0.05:
            raise SystemExit(f"Total de sueldos no cierra para {raw['nombre']}: {total} != {declared}")
        sigla = raw.get("subbancada") or ("FA" if raw.get("bancada") == "FA" else None)
        ediles.append(
            {
                "id": edil_id,
                "nombre": raw["nombre"],
                "cargo": "Edil titular",
                "partido": raw.get("partido"),
                "sigla": sigla,
                "bancada": raw.get("bancada"),
                "lista": str(raw.get("lista") or ""),
                "sector": {"valor": clean(raw.get("sector")), "fuente": clean(raw.get("sector_fuente"))}
                if clean(raw.get("sector"))
                else None,
                "roles": [
                    {"valor": role.get("rol"), "fuente": role.get("fuente")}
                    for role in (raw.get("roles") or [])
                    if clean(role.get("rol"))
                ],
                "comisiones": [
                    {"comision": item.get("comision"), "rol": item.get("rol")}
                    for item in (raw.get("comisiones") or [])
                ],
                "email": {"valor": clean(raw.get("email")), "fuente": clean(raw.get("ficha_url")) or FUENTE_INTEGRACION}
                if clean(raw.get("email"))
                else None,
                "telefono": {
                    "valor": clean(raw.get("telefono")),
                    "fuente": clean(raw.get("ficha_url")) or FUENTE_AUTORIDADES,
                }
                if clean(raw.get("telefono"))
                else None,
                "fichaUrl": clean(raw.get("ficha_url")),
                "redes": social(raw.get("redes")),
                "nota": clean(raw.get("nota")),
                "fuentes": {
                    "cargo": FUENTE_INTEGRACION,
                    "partido": FUENTE_INTEGRACION,
                    "lista": FUENTE_INTEGRACION,
                    "comisiones": FUENTE_COMISIONES,
                },
                "color": COLORS.get(sigla, COLORS["CR"]),
                "equipo": {
                    "disponibilidad": "publicado" if publicado else "sin_datos",
                    "totalNominalMensual": total,
                    "fuente": raw.get("contratados_fuente") or "sin nómina publicada en las fuentes cargadas",
                    "nota": None
                    if publicado
                    else "Sin datos: no hay nómina de asesores contratados ni de funcionarios en comisión para este edil en las fuentes cargadas. No equivale a costo cero.",
                    "contratados": contratados,
                    "comision": comision,
                },
            }
        )

    by_id = {edil["id"]: edil for edil in ediles}

    def edil_id_for(name: str | None):
        if not name or norm_name(name) in {"", "no publicado"}:
            return None
        return ids.get(norm_name(name))

    grupos: dict[tuple, list] = defaultdict(list)
    for edil in ediles:
        key = (edil["bancada"], edil["sigla"], edil["lista"])
        grupos[key].append(edil)

    def listas_de(bancada: str, sigla: str):
        listas = []
        keys = [key for key in grupos if key[0] == bancada and key[1] == sigla]
        for key in sorted(keys, key=lambda item: lista_sort_key(item[2])):
            miembros = sorted(grupos[key], key=lambda item: item["nombre"])
            sectores = []
            vistos = set()
            for miembro in miembros:
                sector = miembro.get("sector")
                if not sector:
                    continue
                marca = (sector["valor"], sector.get("fuente"))
                if marca in vistos:
                    continue
                vistos.add(marca)
                sectores.append(sector)
            listas.append(
                {
                    "numero": key[2],
                    "partido": miembros[0]["partido"],
                    "sigla": sigla,
                    "color": COLORS[sigla],
                    "sectores": sectores,
                    "ediles": miembros,
                }
            )
        return listas

    def coordinador(nombre: str, fuente: str | None):
        found = edil_id_for(nombre.split("(")[0].strip()) if nombre and nombre != "no publicado" else None
        return {
            "nombre": None if nombre == "no publicado" else nombre,
            "edilId": found,
            "fuente": fuente,
            "publicado": bool(nombre and nombre != "no publicado"),
        }

    coordinadores = {item["bancada"]: item for item in source["junta"].get("coordinadores_bancada") or []}
    bancadas = [
        {
            "id": "fa",
            "nombre": "Frente Amplio",
            "sigla": "FA",
            "color": COLORS["FA"],
            "coordinador": coordinador(
                (coordinadores.get("Frente Amplio") or {}).get("nombre"),
                (coordinadores.get("Frente Amplio") or {}).get("fuente"),
            ),
            "listas": listas_de("FA", "FA"),
        },
        {
            "id": "cr",
            "nombre": "Coalición Republicana",
            "sigla": "CR",
            "color": COLORS["CR"],
            "partidos": [
                {
                    "id": "pn",
                    "nombre": "Partido Nacional",
                    "sigla": "PN",
                    "color": COLORS["PN"],
                    "coordinador": coordinador(
                        (coordinadores.get("Partido Nacional (lista 1)") or {}).get("nombre"),
                        (coordinadores.get("Partido Nacional (lista 1)") or {}).get("fuente"),
                    ),
                    "listas": listas_de("Coalición Republicana", "PN"),
                },
                {
                    "id": "pc",
                    "nombre": "Partido Colorado",
                    "sigla": "PC",
                    "color": COLORS["PC"],
                    "coordinador": coordinador(
                        "Federico Paganini",
                        (coordinadores.get("Partido Colorado") or {}).get("fuente") or FUENTE_INTEGRACION,
                    ),
                    "listas": listas_de("Coalición Republicana", "PC"),
                },
            ],
        },
    ]

    mesa = []
    for item in source["junta"]["mesa_2026_2027"]:
        found = edil_id_for(item["nombre"])
        if not found:
            raise SystemExit(f"Integrante de la Mesa sin edil: {item['nombre']}")
        mesa.append({"cargo": item["cargo"], "edilId": found, "fuente": item.get("fuente")})

    anterior = source["junta"].get("presidente_anterior_2025_2026")
    anterior_id = edil_id_for(anterior)
    anterior_fuente = None
    if anterior_id:
        for role in by_id[anterior_id]["roles"]:
            if "saliente" in (role["valor"] or "").lower() or "2025-2026" in (role["valor"] or ""):
                anterior_fuente = role["fuente"]
                break

    secretaria = []
    for person in source["junta"]["secretaria"]:
        secretaria.append(
            {
                "id": unique_id(person["nombre"]),
                "nombre": person["nombre"],
                "cargo": person["cargo"],
                "email": {"valor": clean(person.get("email")), "fuente": person.get("fuente") or FUENTE_AUTORIDADES}
                if clean(person.get("email"))
                else None,
                "telefono": {
                    "valor": clean(person.get("telefono")),
                    "fuente": person.get("fuente") or FUENTE_AUTORIDADES,
                }
                if clean(person.get("telefono"))
                else None,
                "fuente": person.get("fuente") or FUENTE_AUTORIDADES,
            }
        )

    comisiones = []
    sin_match = []
    for raw in source["junta"]["comisiones"]:
        integrantes = []
        for member in raw.get("integrantes") or []:
            found = edil_id_for(member.get("nombre"))
            if not found:
                sin_match.append((raw["nombre"], member.get("nombre")))
            integrantes.append(
                {
                    "nombre": member.get("nombre"),
                    "rol": member.get("rol"),
                    "edilId": found,
                    "fuente": raw.get("url") or FUENTE_COMISIONES,
                }
            )
        sesion = clean(raw.get("sesion"))
        if sesion and "00:00" in sesion:
            sesion = None
        comisiones.append(
            {
                "id": str(raw["id"]),
                "nombre": raw["nombre"],
                "nombreCorto": short_comision(raw["nombre"]),
                "sesion": sesion,
                "url": raw.get("url"),
                "integrantes": integrantes,
            }
        )
    if sin_match:
        raise SystemExit(f"Integrantes de comisión sin edil: {sin_match[:8]}")

    fa = [edil for edil in ediles if edil["sigla"] == "FA"]
    cr = [edil for edil in ediles if edil["bancada"] == "Coalición Republicana"]
    if len(ediles) != 31 or len(fa) != 17 or len(cr) != 14:
        raise SystemExit(f"Conteo inesperado: {len(ediles)} ediles, FA {len(fa)}, CR {len(cr)}")
    if any(edil["equipo"]["disponibilidad"] != "sin_datos" for edil in fa):
        raise SystemExit("Un edil del FA tiene nómina: revisar la nota «sin datos».")
    if any(edil["equipo"]["disponibilidad"] != "publicado" for edil in cr):
        raise SystemExit("Un edil de la CR quedó sin nómina.")

    return {
        "id": "montevideo",
        "nombre": "Montevideo",
        "titulo": "Junta Departamental de Montevideo",
        "legislatura": "2025-2030",
        "actualizado": "2026-10-01",
        "junta": {
            "sede": {
                "valor": source["junta"]["sede"],
                "fuente": FUENTE_AUTORIDADES,
            },
            "telefono": {"valor": source["junta"]["telefono"], "fuente": FUENTE_AUTORIDADES},
            "email": {"valor": source["junta"]["email"], "fuente": FUENTE_AUTORIDADES},
            "fuente": FUENTE_AUTORIDADES,
        },
        "mesa": {
            "periodo": "2026-2027",
            "fuente": FUENTE_AUTORIDADES,
            "presidenteAnterior": {
                "nombre": anterior,
                "periodo": "2025-2026",
                "edilId": anterior_id,
                "fuente": anterior_fuente,
            },
            "integrantes": mesa,
        },
        "secretaria": secretaria,
        "bancadas": bancadas,
        "comisiones": comisiones,
        "meta": {
            "notaFa": "Los 17 ediles del Frente Amplio figuran como «sin datos»: las fuentes cargadas no traen la nómina de sus equipos. No significa que el costo sea cero.",
            "notaTamano": "El tamaño de cada edil compara el sueldo nominal mensual de sus asesores contratados con el del resto de los ediles que sí tienen nómina. No es una escala desde cero.",
            "notaComision": "Los pases en comisión no incluyen sueldo en la planilla. Ese gasto no entra en el tamaño del nodo.",
            "privacidad": "Solo datos públicos: nombres, cargos, sueldos nominales, correos y teléfonos institucionales, y perfiles públicos. No se publican cédulas, domicilios personales ni teléfonos particulares.",
            "fuentes": source["meta"].get("fuentes_principales") or [],
            "advertencias": [
                "Los 17 ediles del Frente Amplio no tienen, en las fuentes cargadas, nómina de asesores contratados ni de pases en comisión.",
                "María Ximena Benitez Piñeyro figura dos veces en Gonzalo Gómez (estados esperando y negado). Mirna Guadalupe Perez (negado y autorizado) y Vera Carolina Ortiz De Taranco (dos registros negados) figuran dos veces en Judith Varela. Se conservan porque el estado o el expediente no es el mismo.",
                "Sergio Andrés Añasco Viera figura en Nicolás Hernández (esperando) y en Laura Soto (cesado).",
                "La Junta registra a Joaquín Campos en la hoja 601 y a Nicolás Hernández en la lista 22; las notas de sector los vinculan a la lista 22 del PN. Laura Soto está en la hoja 901 y Alejandro Milano en la lista 3128.",
                "Dos comisiones especiales no publican integrantes.",
                "Algunos correos institucionales no coinciden con el primer nombre de pila (Kruse, Schiavone, Soto, Urta). La nota del edil lo aclara.",
                "Los perfiles en redes se muestran con el nivel de confianza con que fueron identificados.",
            ],
        },
    }


def crosscheck_csv(path: Path, data: dict) -> None:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    tipos = defaultdict(int)
    for row in rows:
        tipo = (row.get("tipo") or row.get("\ufefftipo") or "").strip()
        tipos[tipo] += 1
    expected = {
        "edil titular": 31,
        "asesor contratado (partida secretaría)": 69,
        "funcionario en comisión": 65,
        "autoridad administrativa": 5,
    }
    if dict(tipos) != expected or len(rows) != 170:
        raise SystemExit(f"El CSV no coincide con el conteo esperado: {len(rows)} {dict(tipos)}")
    ediles = []
    for bancada in data["bancadas"]:
        listas = bancada.get("listas") or []
        for partido in bancada.get("partidos") or []:
            listas = listas + partido["listas"]
        for lista in listas:
            ediles.extend(lista["ediles"])
    contratados = sum(len(edil["equipo"]["contratados"]) for edil in ediles)
    comision = sum(len(edil["equipo"]["comision"]) for edil in ediles)
    if contratados != 69 or comision != 65 or len(data["secretaria"]) != 5:
        raise SystemExit(f"Conteo JSON {len(ediles)} ediles, {contratados} contratados, {comision} comisión, {len(data['secretaria'])} secretaría")


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Uso: build-montevideo-organigrama.py <montevideo.json> [montevideo.csv]")
    source = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    data = build(source)
    if len(sys.argv) > 2:
        crosscheck_csv(Path(sys.argv[2]), data)
    reject_sensitive(data)
    encoded = json.dumps(data, ensure_ascii=False, indent=2)
    OUT.write_text(encoded + "\n", encoding="utf-8")
    print(f"Escribí {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
