import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../data/montevideo.json", import.meta.url), "utf8"));
const errors = [];
const fail = (message) => errors.push(message);

function walk(node, visit) {
  if (Array.isArray(node)) node.forEach((item) => walk(item, visit));
  else if (node && typeof node === "object") {
    Object.entries(node).forEach(([key, value]) => {
      visit(key, value);
      walk(value, visit);
    });
  }
}

const ediles = [];
for (const bancada of data.bancadas) {
  for (const lista of bancada.listas || []) ediles.push(...lista.ediles);
  for (const partido of bancada.partidos || []) {
    for (const lista of partido.listas) ediles.push(...lista.ediles);
  }
}

if (ediles.length !== 31) fail(`ediles ${ediles.length}`);
const fa = ediles.filter((edil) => edil.sigla === "FA");
const cr = ediles.filter((edil) => edil.bancada === "Coalición Republicana");
if (fa.length !== 17 || cr.length !== 14) fail(`FA ${fa.length} CR ${cr.length}`);
if (fa.some((edil) => edil.equipo.disponibilidad !== "sin_datos" || edil.equipo.totalNominalMensual != null)) {
  fail("un edil del FA tiene costo o nómina");
}
if (cr.some((edil) => edil.equipo.disponibilidad !== "publicado" || !(edil.equipo.totalNominalMensual > 0))) {
  fail("un edil de la CR no tiene costo publicado");
}

let contratados = 0;
let comision = 0;
for (const edil of ediles) {
  contratados += edil.equipo.contratados.length;
  comision += edil.equipo.comision.length;
  if (edil.email && !edil.email.valor.endsWith("@juntamvd.gub.uy")) fail("correo no institucional " + edil.email.valor);
  if (edil.telefono && !String(edil.telefono.valor).includes("2915 2126")) fail("teléfono no institucional " + edil.telefono.valor);
  for (const person of edil.equipo.contratados) {
    if (!(person.sueldoNominal > 0)) fail("sueldo vacío " + person.nombre);
    if (!person.fuente) fail("contratado sin fuente " + person.nombre);
  }
  for (const person of edil.equipo.comision) {
    if (!person.estado) fail("comisión sin estado " + person.nombre);
    if (person.sueldoNominal != null) fail("comisión con sueldo " + person.nombre);
    if (!person.fuente) fail("comisión sin fuente " + person.nombre);
  }
}
if (contratados !== 69 || comision !== 65 || data.secretaria.length !== 5) {
  fail(`conteos contratados ${contratados} comisión ${comision} secretaría ${data.secretaria.length}`);
}
if (data.comisiones.length !== 21) fail("comisiones " + data.comisiones.length);
if (!data.bancadas.some((bancada) => bancada.partidos && bancada.partidos.map((partido) => partido.sigla).join() === "PN,PC")) {
  fail("la Coalición Republicana no separa PN y PC");
}

const sensitiveKey = /cedula|cédula|domicilio|celular|nacimiento/i;
const sensitiveValue = /\b09\d{6,}\b|\b\d{1,2}\.\d{3}\.\d{3}-?\d\b|domicilio particular/i;
walk(data, (key, value) => {
  if (sensitiveKey.test(key)) fail("clave sensible " + key);
  if (typeof value === "string" && sensitiveValue.test(value)) fail("valor sensible en " + key + ": " + value.slice(0, 80));
});

const hosts = new Set();
walk(data, (key, value) => {
  if (key === "url" && typeof value === "string" && /instagram|x\.com|linkedin|facebook|twitter/.test(value)) {
    hosts.add(new URL(value).hostname.replace(/^www\./, ""));
  }
});
for (const host of hosts) {
  if (!["x.com", "twitter.com", "instagram.com", "facebook.com", "linkedin.com"].includes(host)) fail("red no permitida " + host);
}

if (!data.meta.notaFa.toLowerCase().includes("sin datos")) fail("falta la nota de sin datos");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK ${ediles.length} ediles, ${contratados} contratados, ${comision} en comisión, ${data.comisiones.length} comisiones`);
