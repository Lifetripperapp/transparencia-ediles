(function () {
  const FUENTE_COMISIONES = "https://www.juntamvd.gub.uy/public/actividades-parlamentarias/comisiones";
  const COLOR_INSTITUCION = "#0f766e";
  const COLOR_COMISION = "#b45309";
  const COLOR_ORGANO = "#334155";

  const moneyFmt = new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: 2,
  });
  const milesFmt = new Intl.NumberFormat("es-UY");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const estado = document.getElementById("estado");
  const notaFa = document.getElementById("notaFa");
  const notaTamano = document.getElementById("notaTamano");
  const ficha = document.getElementById("ficha");
  const fichaContenido = document.getElementById("fichaContenido");
  const velo = document.getElementById("velo");
  const resultados = document.getElementById("resultados");
  const busqueda = document.getElementById("busqueda");
  const listaTexto = document.getElementById("listaTexto");
  const advertencias = document.getElementById("advertencias");
  const departamento = document.getElementById("departamento");

  let cy = null;
  let childMap = new Map();
  let fichas = new Map();
  let indice = [];
  let resultadoActivo = -1;
  let dataset = null;

  function money(value) {
    return moneyFmt.format(value);
  }

  function moneyCompact(value) {
    return "$ " + milesFmt.format(Math.round(value / 1000)) + " mil";
  }

  function fecha(iso) {
    if (!iso) return null;
    const parts = String(iso).split("-");
    if (parts.length !== 3) return String(iso);
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  function norm(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function setEstado(text) {
    estado.textContent = text || "";
    estado.hidden = !text;
  }

  function etiquetaUrl(url) {
    const clean = String(url).replace(/^https?:\/\//, "").replace(/^www\./, "");
    return clean.length > 52 ? clean.slice(0, 50) + "…" : clean;
  }

  function appendFuente(parent, fuente) {
    if (!fuente) return;
    const wrap = document.createElement("span");
    wrap.className = "fuente";
    wrap.append(document.createTextNode("Fuente: "));
    const text = String(fuente);
    const match = text.match(/https?:\/\/[^\s)]+/);
    if (match && match[0] === text) {
      wrap.append(link(text, etiquetaUrl(text)));
    } else if (match) {
      const before = text.slice(0, match.index).trim();
      const after = text.slice(match.index + match[0].length).trim();
      if (before) wrap.append(document.createTextNode(before + " "));
      wrap.append(link(match[0], etiquetaUrl(match[0])));
      if (after) wrap.append(document.createTextNode(" " + after));
    } else {
      wrap.append(document.createTextNode(text));
    }
    parent.append(wrap);
  }

  function link(href, text) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.textContent = text;
    if (!href.startsWith("mailto:")) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  }

  function campo(etiqueta, valor, fuente, href) {
    if (valor == null || valor === "") return null;
    return { etiqueta, valor: String(valor), fuente: fuente || null, href: href || null };
  }

  function paragraph(className, text) {
    const node = document.createElement("p");
    node.className = className;
    node.textContent = text;
    return node;
  }

  function abrirFicha(model) {
    renderFicha(model);
    ficha.classList.add("abierta");
    const mobile = window.matchMedia("(max-width: 860px)").matches;
    if (mobile) {
      document.body.classList.add("ficha-abierta");
      window.scrollTo(0, 0);
      const stage = document.querySelector(".stage");
      if (stage) stage.getBoundingClientRect();
    } else {
      velo.hidden = true;
    }
    if (cy) cy.resize();
  }

  function cerrarFicha() {
    ficha.classList.remove("abierta");
    velo.hidden = true;
    document.body.classList.remove("ficha-abierta");
    if (cy) {
      cy.elements().removeClass("foco");
      cy.resize();
    }
  }

  function todosLosEdiles() {
    const ediles = [];
    dataset.bancadas.forEach((bancada) => {
      (bancada.listas || []).forEach((lista) => ediles.push(...lista.ediles));
      (bancada.partidos || []).forEach((partido) => {
        partido.listas.forEach((lista) => ediles.push(...lista.ediles));
      });
    });
    return ediles;
  }

  function fichaEdil(edil, contexto) {
    const campos = [];
    if (contexto) campos.push(campo("En este nodo", contexto.valor, contexto.fuente));
    campos.push(campo("Cargo", edil.cargo, edil.fuentes.cargo));
    (edil.roles || []).forEach((role) => campos.push(campo("Rol", role.valor, role.fuente)));
    campos.push(campo("Partido", edil.partido, edil.fuentes.partido));
    campos.push(campo("Bancada", edil.bancada, edil.fuentes.partido));
    campos.push(campo("Lista", edil.lista ? "Lista " + edil.lista : null, edil.fuentes.lista));
    if (edil.sector) campos.push(campo("Sector", edil.sector.valor, edil.sector.fuente));
    if (edil.equipo.disponibilidad !== "publicado") {
      campos.push(campo("Equipo", "sin datos", edil.equipo.fuente));
    }
    if (edil.email) campos.push(campo("Correo institucional", edil.email.valor, edil.email.fuente, "mailto:" + edil.email.valor));
    if (edil.telefono) campos.push(campo("Teléfono institucional", edil.telefono.valor, edil.telefono.fuente));
    (edil.redes || []).forEach((red) => {
      const confianza = red.confianza ? "Confianza de la identificación: " + red.confianza + "." : "Perfil público.";
      const nota = red.nota ? " " + red.nota : "";
      campos.push(campo(red.red, red.url, (confianza + nota).trim(), red.url));
    });
    if (edil.equipo.disponibilidad === "publicado" && edil.equipo.totalNominalMensual != null) {
      campos.push(campo(
        "Sueldo nominal mensual del equipo contratado",
        money(edil.equipo.totalNominalMensual),
        edil.equipo.fuente
      ));
      const pase = edil.equipo.comision.length;
      if (pase) {
        campos.push(campo(
          "Funcionarios en comisión",
          String(pase) + " (sin sueldo en la fuente; no entran en la suma)",
          edil.equipo.comision[0] && edil.equipo.comision[0].fuente
        ));
      }
    }
    if (edil.comisiones && edil.comisiones.length) {
      campos.push(campo(
        "Comisiones",
        edil.comisiones.map((item) => item.comision + " (" + item.rol + ")").join(" · "),
        edil.fuentes.comisiones || FUENTE_COMISIONES
      ));
    }
    if (edil.fichaUrl) campos.push(campo("Ficha en la Junta", edil.fichaUrl, edil.fichaUrl, edil.fichaUrl));
    return {
      kicker: contexto ? contexto.kicker : "Edil titular",
      titulo: edil.nombre,
      subtitulo: edil.partido + " · lista " + edil.lista,
      aviso: edil.equipo.disponibilidad === "sin_datos" ? edil.equipo.nota : null,
      campos: campos.filter(Boolean),
      aclaracion: edil.nota || null,
    };
  }

  function renderFicha(model) {
    fichaContenido.replaceChildren();
    if (!model) {
      fichaContenido.append(paragraph("ficha-vacia", "Tocá un nodo para ver el cargo, el correo, el sueldo nominal si existe y la fuente de cada dato."));
      return;
    }
    const head = document.createElement("div");
    head.className = "ficha-head";
    if (model.kicker) head.append(paragraph("kicker", model.kicker));
    const title = document.createElement("h2");
    title.textContent = model.titulo;
    head.append(title);
    if (model.subtitulo) head.append(paragraph("sub", model.subtitulo));
    fichaContenido.append(head);
    if (model.aviso) fichaContenido.append(paragraph("aviso", model.aviso));
    const list = document.createElement("dl");
    (model.campos || []).forEach((item) => {
      if (!item || item.valor == null || item.valor === "") return;
      const term = document.createElement("dt");
      term.textContent = item.etiqueta;
      const detail = document.createElement("dd");
      if (item.href) detail.append(link(item.href, item.valor));
      else detail.append(document.createTextNode(item.valor));
      appendFuente(detail, item.fuente);
      list.append(term, detail);
    });
    if (list.childNodes.length) fichaContenido.append(list);
    if (model.aclaracion) fichaContenido.append(paragraph("aclaracion", model.aclaracion));
  }

  function makeLabel(data) {
    const mark = data.hasChildren ? (data.expanded ? "▾ " : "▸ ") : "";
    const body = data.titulo + (data.meta ? "\n" + data.meta : "");
    if (data.forma === "persona") return body;
    return mark + body;
  }

  function addNode(elements, spec) {
    const data = {
      id: spec.id,
      parentId: spec.parentId || null,
      depth: spec.depth,
      forma: spec.forma,
      titulo: spec.titulo,
      tituloPlano: spec.tituloPlano || spec.titulo.replace(/\n/g, " "),
      meta: spec.meta || "",
      label: spec.titulo,
      hasChildren: false,
      expanded: false,
      color: spec.color,
      border: spec.border || "rgba(255,255,255,0.35)",
      borderStyle: spec.borderStyle || "solid",
      size: spec.size || 48,
      w: spec.w || spec.size || 120,
      h: spec.h || 68,
      justShown: false,
    };
    elements.push({
      group: "nodes",
      data: data,
      classes: spec.borderStyle === "dashed" ? "sindatos" : "",
    });
    if (spec.parentId) {
      elements.push({
        group: "edges",
        data: {
          id: "e-" + spec.parentId + "-" + spec.id,
          source: spec.parentId,
          target: spec.id,
          color: spec.edge || spec.color,
        },
      });
      if (!childMap.has(spec.parentId)) childMap.set(spec.parentId, []);
      childMap.get(spec.parentId).push(spec.id);
    }
    fichas.set(spec.id, spec.ficha);
    if (spec.buscar) {
      indice.push({
        nodeId: spec.id,
        nombre: spec.buscar.nombre,
        linea: spec.buscar.linea,
        texto: norm(spec.buscar.nombre + " " + spec.buscar.linea),
      });
    }
  }

  function sizeFor(edil, min, max) {
    if (edil.equipo.disponibilidad !== "publicado" || edil.equipo.totalNominalMensual == null) return 54;
    if (max === min) return 64;
    const ratio = (edil.equipo.totalNominalMensual - min) / (max - min);
    return Math.round(46 + ratio * 40);
  }

  function buildElements(data) {
    const elements = [];
    const ediles = todosLosEdiles();
    const publicados = ediles.filter((edil) => edil.equipo.disponibilidad === "publicado" && edil.equipo.totalNominalMensual != null);
    const min = publicados.length ? Math.min(...publicados.map((edil) => edil.equipo.totalNominalMensual)) : 0;
    const max = publicados.length ? Math.max(...publicados.map((edil) => edil.equipo.totalNominalMensual)) : 0;
    const suma = publicados.reduce((total, edil) => total + edil.equipo.totalNominalMensual, 0);
    const sinDatos = ediles.filter((edil) => edil.equipo.disponibilidad === "sin_datos");

    addNode(elements, {
      id: "junta",
      depth: 0,
      forma: "raiz",
      titulo: "Junta\nDepartamental",
      tituloPlano: data.titulo,
      color: COLOR_INSTITUCION,
      w: 132,
      h: 132,
      size: 132,
      ficha: {
        kicker: "Órgano",
        titulo: data.titulo,
        subtitulo: "Legislatura " + data.legislatura,
        campos: [
          campo("Sede institucional", data.junta.sede.valor, data.junta.sede.fuente),
          campo("Correo institucional", data.junta.email.valor, data.junta.email.fuente, "mailto:" + data.junta.email.valor),
          campo("Teléfono institucional", data.junta.telefono.valor, data.junta.telefono.fuente),
          campo("Ediles titulares", String(ediles.length), data.junta.fuente),
          campo("Suma nominal mensual publicada", money(suma), "Suma de los sueldos nominales de asesores contratados con nómina en las fuentes cargadas. " + data.meta.notaComision),
          campo("Ediles sin nómina de equipo", sinDatos.length + " ediles del Frente Amplio. No entran en la suma y no se dibujan como costo cero.", data.meta.notaFa),
        ].filter(Boolean),
      },
    });

    addNode(elements, {
      id: "mesa",
      parentId: "junta",
      depth: 1,
      forma: "grupo",
      titulo: "Mesa\n" + data.mesa.periodo,
      tituloPlano: "Mesa " + data.mesa.periodo,
      meta: data.mesa.integrantes.length + " cargos",
      color: COLOR_INSTITUCION,
      w: 128,
      h: 74,
      ficha: {
        kicker: "Mesa",
        titulo: "Mesa de la Junta",
        subtitulo: "Período " + data.mesa.periodo,
        campos: [
          campo("Integrantes", String(data.mesa.integrantes.length), data.mesa.fuente),
          data.mesa.presidenteAnterior && data.mesa.presidenteAnterior.nombre
            ? campo("Presidencia anterior", data.mesa.presidenteAnterior.nombre + " (" + data.mesa.presidenteAnterior.periodo + ")", data.mesa.presidenteAnterior.fuente)
            : null,
        ].filter(Boolean),
      },
    });

    const edilPorId = new Map(ediles.map((edil) => [edil.id, edil]));
    data.mesa.integrantes.forEach((item) => {
      const edil = edilPorId.get(item.edilId);
      const model = fichaEdil(edil, { kicker: "Mesa", valor: item.cargo, fuente: item.fuente });
      model.kicker = "Mesa · " + item.cargo;
      addNode(elements, {
        id: "mesa-" + edil.id,
        parentId: "mesa",
        depth: 2,
        forma: "persona",
        titulo: edil.nombre,
        meta: item.cargo,
        color: edil.color,
        size: 58,
        ficha: model,
        buscar: { nombre: edil.nombre, linea: item.cargo + " · Mesa" },
      });
    });

    addNode(elements, {
      id: "secretaria",
      parentId: "junta",
      depth: 1,
      forma: "grupo",
      titulo: "Secretaría",
      tituloPlano: "Secretaría",
      meta: data.secretaria.length + " cargos",
      color: COLOR_INSTITUCION,
      w: 132,
      h: 64,
      ficha: {
        kicker: "Secretaría",
        titulo: "Secretaría de la Junta",
        subtitulo: data.secretaria.length + " autoridades administrativas",
        campos: [campo("Fuente", data.junta.fuente, data.junta.fuente, data.junta.fuente)],
      },
    });
    data.secretaria.forEach((person) => {
      const campos = [
        campo("Cargo", person.cargo, person.fuente),
        person.email ? campo("Correo institucional", person.email.valor, person.email.fuente, "mailto:" + person.email.valor) : null,
        person.telefono ? campo("Teléfono institucional", person.telefono.valor, person.telefono.fuente) : null,
      ].filter(Boolean);
      addNode(elements, {
        id: "autoridad-" + person.id,
        parentId: "secretaria",
        depth: 2,
        forma: "persona",
        titulo: person.nombre,
        meta: person.cargo,
        color: COLOR_INSTITUCION,
        size: 52,
        ficha: { kicker: "Secretaría", titulo: person.nombre, subtitulo: person.cargo, campos: campos },
        buscar: { nombre: person.nombre, linea: person.cargo + " · Secretaría" },
      });
    });

    data.bancadas.forEach((bancada) => addBancada(elements, bancada, edilPorId, min, max));

    const conIntegrantes = data.comisiones.filter((item) => item.integrantes.length).length;
    addNode(elements, {
      id: "comisiones",
      parentId: "junta",
      depth: 1,
      forma: "grupo",
      titulo: "Comisiones",
      tituloPlano: "Comisiones",
      meta: data.comisiones.length + " en total",
      color: COLOR_ORGANO,
      border: "#94a3b8",
      w: 132,
      h: 64,
      ficha: {
        kicker: "Comisiones",
        titulo: "Comisiones de la Junta",
        subtitulo: data.comisiones.length + " comisiones",
        campos: [
          campo("Con integrantes publicados", String(conIntegrantes), FUENTE_COMISIONES),
          campo("Sin integrantes publicados", String(data.comisiones.length - conIntegrantes), FUENTE_COMISIONES),
        ],
      },
    });
    data.comisiones.forEach((comision) => addComision(elements, comision, edilPorId));

    elements.forEach((element) => {
      if (element.group !== "nodes") return;
      element.data.hasChildren = (childMap.get(element.data.id) || []).length > 0;
      element.data.label = makeLabel(element.data);
    });
    return elements;
  }

  function addBancada(elements, bancada, edilPorId, min, max) {
    const id = "bancada-" + bancada.id;
    const cantidad = contarEdiles(bancada);
    const campos = [
      campo("Ediles", String(cantidad), FUENTE_INTEGRACION_LOCAL),
      bancada.coordinador && bancada.coordinador.publicado
        ? campo("Coordinación", bancada.coordinador.nombre, bancada.coordinador.fuente)
        : null,
    ].filter(Boolean);
    addNode(elements, {
      id: id,
      parentId: "junta",
      depth: 1,
      forma: "grupo",
      titulo: tituloBancada(bancada),
      tituloPlano: bancada.nombre,
      meta: cantidad + " ediles",
      color: bancada.color,
      w: 148,
      h: 78,
      ficha: {
        kicker: "Bancada",
        titulo: bancada.nombre,
        subtitulo: cantidad + " ediles titulares",
        campos: campos,
      },
    });
    if (bancada.partidos) {
      bancada.partidos.forEach((partido) => addPartido(elements, partido, id, min, max));
    } else {
      bancada.listas.forEach((lista) => addLista(elements, lista, id, min, max));
    }
  }

  const FUENTE_INTEGRACION_LOCAL = "https://www.juntamvd.gub.uy/public/institucional/integracion";

  function tituloBancada(bancada) {
    if (bancada.sigla === "FA") return "Frente\nAmplio";
    if (bancada.sigla === "CR") return "Coalición\nRepublicana";
    return bancada.nombre;
  }

  function contarEdiles(bancada) {
    if (bancada.listas) return bancada.listas.reduce((sum, lista) => sum + lista.ediles.length, 0);
    return (bancada.partidos || []).reduce((sum, partido) => sum + partido.listas.reduce((inner, lista) => inner + lista.ediles.length, 0), 0);
  }

  function addPartido(elements, partido, parentId, min, max) {
    const id = "partido-" + partido.id;
    const cantidad = partido.listas.reduce((sum, lista) => sum + lista.ediles.length, 0);
    addNode(elements, {
      id: id,
      parentId: parentId,
      depth: 2,
      forma: "grupo",
      titulo: partido.sigla === "PN" ? "Partido\nNacional" : "Partido\nColorado",
      tituloPlano: partido.nombre,
      color: partido.color,
      w: 136,
      h: 74,
      ficha: {
        kicker: "Partido · Coalición Republicana",
        titulo: partido.nombre,
        subtitulo: cantidad + (cantidad === 1 ? " edil" : " ediles"),
        campos: [
          campo("Ediles", String(cantidad), FUENTE_INTEGRACION_LOCAL),
          partido.coordinador && partido.coordinador.publicado
            ? campo("Coordinación", partido.coordinador.nombre, partido.coordinador.fuente)
            : null,
        ].filter(Boolean),
      },
    });
    partido.listas.forEach((lista) => addLista(elements, lista, id, min, max));
  }

  function addLista(elements, lista, parentId, min, max) {
    const id = "lista-" + parentId + "-" + lista.numero;
    const publicados = lista.ediles.filter((edil) => edil.equipo.disponibilidad === "publicado");
    const suma = publicados.reduce((total, edil) => total + edil.equipo.totalNominalMensual, 0);
    const sin = lista.ediles.length - publicados.length;
    const campos = [
      campo("Partido", lista.partido, FUENTE_INTEGRACION_LOCAL),
      campo("Ediles", String(lista.ediles.length), FUENTE_INTEGRACION_LOCAL),
    ];
    lista.sectores.forEach((sector) => campos.push(campo("Sector", sector.valor, sector.fuente)));
    if (publicados.length) campos.push(campo("Suma nominal mensual de asesores contratados", money(suma), publicados[0].equipo.fuente));
    if (sin) campos.push(campo("Ediles sin datos de equipo", String(sin) + ". No es costo cero.", dataset.meta.notaFa));
    addNode(elements, {
      id: id,
      parentId: parentId,
      depth: parentId.startsWith("partido-") ? 3 : 2,
      forma: "grupo",
      titulo: "Lista " + lista.numero,
      tituloPlano: "Lista " + lista.numero + " · " + lista.partido,
      meta: lista.ediles.length + (lista.ediles.length === 1 ? " edil" : " ediles"),
      color: lista.color,
      w: 118,
      h: 62,
      ficha: {
        kicker: "Lista",
        titulo: "Lista " + lista.numero,
        subtitulo: lista.partido,
        campos: campos.filter(Boolean),
      },
    });
    lista.ediles.forEach((edil) => addEdil(elements, edil, id, min, max));
  }

  function addEdil(elements, edil, parentId, min, max) {
    const sinDatos = edil.equipo.disponibilidad !== "publicado";
    const depth = parentId.startsWith("lista-partido") || parentId.includes("-partido-") ? 4 : 3;
    addNode(elements, {
      id: "edil-" + edil.id,
      parentId: parentId,
      depth: depth,
      forma: "persona",
      titulo: edil.nombre,
      meta: sinDatos ? "sin datos" : moneyCompact(edil.equipo.totalNominalMensual),
      color: edil.color,
      border: sinDatos ? "#fecdd3" : "rgba(255,255,255,0.55)",
      borderStyle: sinDatos ? "dashed" : "solid",
      size: sizeFor(edil, min, max),
      ficha: fichaEdil(edil),
      buscar: { nombre: edil.nombre, linea: "Edil · " + edil.partido + " · lista " + edil.lista },
    });
    const staffParent = "edil-" + edil.id;
    const staffDepth = depth + 1;
    if (sinDatos) {
      addNode(elements, {
        id: staffParent + "-sindatos",
        parentId: staffParent,
        depth: staffDepth,
        forma: "grupo",
        titulo: "Sin datos\nde equipo",
        tituloPlano: "Sin datos de equipo · " + edil.nombre,
        color: "#4c0519",
        border: "#fecdd3",
        borderStyle: "dashed",
        w: 120,
        h: 68,
        ficha: {
          kicker: "Equipo",
          titulo: "Sin datos de equipo",
          subtitulo: edil.nombre,
          aviso: edil.equipo.nota,
          campos: [campo("Situación", "sin datos", edil.equipo.fuente)].filter(Boolean),
        },
      });
      return;
    }
    if (edil.equipo.contratados.length) {
      const groupId = staffParent + "-contratados";
      addNode(elements, {
        id: groupId,
        parentId: staffParent,
        depth: staffDepth,
        forma: "grupo",
        titulo: "Asesores\ncontratados",
        tituloPlano: "Asesores contratados de " + edil.nombre,
        color: edil.color,
        w: 132,
        h: 70,
        ficha: {
          kicker: "Asesores contratados",
          titulo: edil.nombre,
          subtitulo: edil.equipo.contratados.length + " contratos",
          campos: [
            campo("Cantidad", String(edil.equipo.contratados.length), edil.equipo.fuente),
            campo("Suma nominal mensual", money(edil.equipo.totalNominalMensual), edil.equipo.fuente),
          ],
        },
      });
      edil.equipo.contratados.forEach((person) => {
        const campos = [
          campo("Cargo", person.cargo, person.fuente),
          campo("Edil", edil.nombre, FUENTE_INTEGRACION_LOCAL),
          campo("Sueldo nominal mensual", money(person.sueldoNominal), person.fuente),
          campo("Fecha de ingreso", fecha(person.fechaIngreso), person.fuente),
        ];
        (person.redes || []).forEach((red) => {
          campos.push(campo(red.red, red.url, "Confianza de la identificación: " + (red.confianza || "no indicada") + (red.nota ? ". " + red.nota : ""), red.url));
        });
        addNode(elements, {
          id: person.id,
          parentId: groupId,
          depth: staffDepth + 1,
          forma: "persona",
          titulo: person.nombre,
          meta: moneyCompact(person.sueldoNominal),
          color: edil.color,
          size: 36,
          ficha: { kicker: "Asesor contratado", titulo: person.nombre, subtitulo: "Equipo de " + edil.nombre, campos: campos.filter(Boolean) },
          buscar: { nombre: person.nombre, linea: "Asesor contratado · " + edil.nombre },
        });
      });
    }
    if (edil.equipo.comision.length) {
      const groupId = staffParent + "-comision";
      addNode(elements, {
        id: groupId,
        parentId: staffParent,
        depth: staffDepth,
        forma: "grupo",
        titulo: "En comisión",
        tituloPlano: "Funcionarios en comisión de " + edil.nombre,
        color: COLOR_COMISION,
        border: "#fdba74",
        w: 132,
        h: 64,
        ficha: {
          kicker: "Funcionarios en comisión",
          titulo: edil.nombre,
          subtitulo: edil.equipo.comision.length + " registros",
          aviso: dataset.meta.notaComision,
          campos: [campo("Cantidad de registros", String(edil.equipo.comision.length), edil.equipo.comision[0].fuente)],
        },
      });
      const repetidos = new Map();
      edil.equipo.comision.forEach((person) => {
        repetidos.set(person.nombre, (repetidos.get(person.nombre) || 0) + 1);
      });
      edil.equipo.comision.forEach((person) => {
        const campos = [
          campo("Estado", person.estado, person.fuente),
          campo("Edil vinculado", edil.nombre, person.fuente),
          campo("Organismo de origen", person.origen, person.fuente),
          campo("Desde", fecha(person.desde), person.fuente),
          campo("Hasta", person.hasta, person.fuente),
          campo("Expediente", person.expediente, person.fuente),
          campo("Resolución", person.resolucion, person.fuente),
          campo("Observaciones", person.observaciones, person.fuente),
        ];
        addNode(elements, {
          id: person.id,
          parentId: groupId,
          depth: staffDepth + 1,
          forma: "persona",
          titulo: person.nombre,
          meta: repetidos.get(person.nombre) > 1 && person.expediente ? person.estado + " · " + person.expediente : person.estado,
          color: COLOR_COMISION,
          border: "#fdba74",
          size: 36,
          ficha: { kicker: "Funcionario en comisión", titulo: person.nombre, subtitulo: person.estado || "Pase en comisión", campos: campos.filter(Boolean) },
          buscar: { nombre: person.nombre, linea: "En comisión · " + (person.estado || "") + " · " + edil.nombre },
        });
      });
    }
  }

  function addComision(elements, comision, edilPorId) {
    const id = "comision-" + comision.id;
    const campos = [
      campo("Integrantes publicados", comision.integrantes.length ? String(comision.integrantes.length) : "Sin integrantes publicados", comision.url),
      campo("Sesión", comision.sesion, comision.url),
      campo("Ficha de la comisión", comision.url, comision.url, comision.url),
    ].filter(Boolean);
    addNode(elements, {
      id: id,
      parentId: "comisiones",
      depth: 2,
      forma: "grupo",
      titulo: comision.nombreCorto,
      tituloPlano: comision.nombre,
      color: COLOR_ORGANO,
      border: "#94a3b8",
      w: 150,
      h: 72,
      ficha: {
        kicker: "Comisión",
        titulo: comision.nombre,
        subtitulo: comision.sesion || "Horario no publicado",
        aviso: comision.integrantes.length ? null : "Esta comisión no tiene integrantes publicados en la fuente.",
        campos: campos,
      },
    });
    comision.integrantes.forEach((member) => {
      const edil = member.edilId ? edilPorId.get(member.edilId) : null;
      const nodeId = id + "-" + (member.edilId || norm(member.nombre).replace(/[^a-z0-9]+/g, "-")) + "-" + norm(member.rol || "integrante").replace(/[^a-z0-9]+/g, "-");
      const model = edil
        ? fichaEdil(edil, { kicker: "Comisión", valor: member.rol + " · " + comision.nombre, fuente: member.fuente || comision.url })
        : {
            kicker: "Comisión",
            titulo: member.nombre,
            campos: [campo("Rol", member.rol, member.fuente), campo("Comisión", comision.nombre, comision.url)].filter(Boolean),
          };
      if (edil) model.kicker = "Comisión · " + member.rol;
      addNode(elements, {
        id: nodeId,
        parentId: id,
        depth: 3,
        forma: "persona",
        titulo: member.nombre,
        meta: member.rol,
        color: edil ? edil.color : COLOR_ORGANO,
        size: 42,
        ficha: model,
        buscar: { nombre: member.nombre, linea: member.rol + " · " + comision.nombreCorto },
      });
    });
  }

  function visibleChildren(id) {
    return (childMap.get(id) || [])
      .map((childId) => cy.getElementById(childId))
      .filter((node) => node && node.length && node.visible());
  }

  function leafCount(id) {
    const kids = visibleChildren(id);
    if (!kids.length) return 1;
    return kids.reduce((sum, kid) => sum + leafCount(kid.id()), 0);
  }

  function polar(angle, radius) {
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  }

  function computePositions() {
    const positions = new Map();
    positions.set("junta", { x: 0, y: 0 });
    const rootKids = visibleChildren("junta");
    const count = Math.max(rootKids.length, 1);
    rootKids.forEach((kid, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
      positions.set(kid.id(), polar(angle, 280));
      placeChildren(kid.id(), angle, ((2 * Math.PI) / count) * 0.9, 280, positions);
    });
    return positions;
  }

  function placeChildren(id, angle, span, radius, positions) {
    const kids = visibleChildren(id);
    if (!kids.length) return;
    const weights = kids.map((kid) => leafCount(kid.id()));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    const maxSize = Math.max(...kids.map((kid) => Number(kid.data("size")) || Number(kid.data("w")) || 48));
    const needed = kids.length * (maxSize + 128);
    const step = Math.max(190, needed / Math.max(span, 0.4));
    const nextRadius = radius + step;
    let cursor = angle - span / 2;
    kids.forEach((kid, index) => {
      const width = (weights[index] / total) * span;
      const mid = cursor + width / 2;
      positions.set(kid.id(), polar(mid, nextRadius));
      placeChildren(kid.id(), mid, Math.max(width * 0.94, 0.18), nextRadius, positions);
      cursor += width;
    });
  }

  function runLayout(animate, options) {
    const settings = options || {};
    const positions = computePositions();
    const duration = animate && !reducedMotion ? 260 : 0;
    cy.nodes().forEach((node) => {
      if (!node.visible()) return;
      const next = positions.get(node.id());
      if (!next) return;
      if (!duration || node.data("justShown")) node.position(next);
      else node.animate({ position: next }, { duration: duration });
      node.data("justShown", false);
    });
    const finish = function () {
      if (settings.fit !== false) fitVisible();
      if (settings.onDone) settings.onDone();
    };
    if (duration) window.setTimeout(finish, duration + 40);
    else finish();
  }

  function fitVisible() {
    fitCollection(cy.elements().filter((element) => element.visible()), 48, 1.5);
  }

  function fitCollection(collection, padding, maxZoom) {
    cy.resize();
    cy.fit(collection, padding);
    if (cy.zoom() > maxZoom) {
      cy.zoom(maxZoom);
      cy.center(collection);
    }
  }

  function visibleSubtree(node) {
    const ids = [node.id()];
    const parentId = node.data("parentId");
    if (parentId) ids.push(parentId);
    const stack = [node.id()];
    while (stack.length) {
      const id = stack.pop();
      (childMap.get(id) || []).forEach((childId) => {
        const child = cy.getElementById(childId);
        if (!child.visible()) return;
        ids.push(childId);
        stack.push(childId);
      });
    }
    let collection = cy.collection();
    ids.forEach((id) => {
      collection = collection.union(cy.getElementById(id));
    });
    return collection;
  }

  function focusNode(node) {
    const level = Math.max(0.95, Math.min(1.35, cy.zoom()));
    const duration = reducedMotion ? 0 : 320;
    cy.animate({ center: { eles: node }, zoom: level }, { duration: duration });
  }

  function showChildren(id) {
    (childMap.get(id) || []).forEach((childId) => {
      const child = cy.getElementById(childId);
      child.data("justShown", true);
      child.show();
    });
  }

  function hideDescendants(id) {
    (childMap.get(id) || []).forEach((childId) => {
      const child = cy.getElementById(childId);
      child.data("expanded", false);
      child.data("label", makeLabel(child.data()));
      hideDescendants(childId);
      child.hide();
    });
  }

  function toggle(node) {
    if (!node.data("hasChildren")) return;
    const expanded = !node.data("expanded");
    node.data("expanded", expanded);
    if (expanded) showChildren(node.id());
    else hideDescendants(node.id());
    node.data("label", makeLabel(node.data()));
    runLayout(true, {
      fit: false,
      onDone: function () {
        fitCollection(visibleSubtree(node), 64, 1.35);
      },
    });
  }

  function expandPath(node) {
    const chain = [];
    let current = node;
    while (current && current.length) {
      chain.push(current);
      const parentId = current.data("parentId");
      if (!parentId) break;
      current = cy.getElementById(parentId);
    }
    chain.reverse().forEach((item, index) => {
      if (index === chain.length - 1) return;
      item.data("expanded", true);
      item.data("label", makeLabel(item.data()));
      showChildren(item.id());
    });
    runLayout(true, { fit: false, onDone: function () { focusNode(node); } });
  }

  function marcar(node) {
    cy.elements().removeClass("foco");
    node.addClass("foco");
    abrirFicha(fichas.get(node.id()));
  }

  function colapsarTodo() {
    cy.nodes().forEach((node) => {
      node.data("expanded", false);
      node.removeClass("foco");
      if (node.data("depth") > 1) node.hide();
      else node.show();
      node.data("label", makeLabel(node.data()));
    });
    cerrarFicha();
    renderFicha(null);
    runLayout(true);
  }

  function zoomBy(factor) {
    const box = cy.container().getBoundingClientRect();
    const level = Math.min(cy.maxZoom(), Math.max(cy.minZoom(), cy.zoom() * factor));
    cy.zoom({ level: level, renderedPosition: { x: box.width / 2, y: box.height / 2 } });
  }

  function pintarLista() {
    listaTexto.replaceChildren();
    listaTexto.append(rama("junta"));
  }

  function rama(id) {
    const list = document.createElement("ul");
    (childMap.get(id) || []).forEach((childId) => {
      const node = cy.getElementById(childId);
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = node.data("tituloPlano") + (node.data("meta") ? " — " + node.data("meta") : "");
      button.addEventListener("click", function () {
        marcar(node);
        expandPath(node);
        resultados.hidden = true;
      });
      item.append(button);
      if ((childMap.get(childId) || []).length) item.append(rama(childId));
      list.append(item);
    });
    return list;
  }

  function pintarAdvertencias() {
    advertencias.replaceChildren();
    (dataset.meta.advertencias || []).forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      advertencias.append(item);
    });
  }

  function buscar(query) {
    const needle = norm(query).trim();
    resultadoActivo = -1;
    resultados.replaceChildren();
    if (needle.length < 2) {
      resultados.hidden = true;
      busqueda.setAttribute("aria-expanded", "false");
      return;
    }
    const matches = indice.filter((item) => item.texto.includes(needle)).slice(0, 12);
    if (!matches.length) {
      const empty = document.createElement("li");
      empty.className = "vacio";
      empty.textContent = "Ninguna persona coincide.";
      resultados.append(empty);
      resultados.hidden = false;
      busqueda.setAttribute("aria-expanded", "true");
      return;
    }
    matches.forEach((item, index) => {
      const row = document.createElement("li");
      row.setAttribute("role", "option");
      const button = document.createElement("button");
      button.type = "button";
      button.id = "resultado-" + index;
      const name = document.createElement("strong");
      name.textContent = item.nombre;
      const line = document.createElement("span");
      line.textContent = item.linea;
      button.append(name, line);
      button.addEventListener("click", function () {
        const node = cy.getElementById(item.nodeId);
        busqueda.value = item.nombre;
        resultados.hidden = true;
        busqueda.setAttribute("aria-expanded", "false");
        marcar(node);
        expandPath(node);
      });
      row.append(button);
      resultados.append(row);
    });
    resultados.hidden = false;
    busqueda.setAttribute("aria-expanded", "true");
  }

  function crearGrafo(elements) {
    if (cy) {
      cy.destroy();
      cy = null;
    }
    cy = cytoscape({
      container: document.getElementById("cy"),
      elements: elements,
      minZoom: 0.12,
      maxZoom: 2.8,
      boxSelectionEnabled: false,
      autoungrabify: true,
      selectionType: "single",
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            color: "#f8fafc",
            "background-color": "data(color)",
            "border-width": 2,
            "border-color": "data(border)",
            "border-style": "data(borderStyle)",
            "font-family": "Inter, ui-sans-serif, system-ui, sans-serif",
            "font-size": 12,
            "font-weight": 600,
            "text-wrap": "wrap",
            "text-max-width": 120,
            "text-halign": "center",
            "text-valign": "center",
            "text-background-color": "#020617",
            "text-background-opacity": 0,
            "text-background-padding": "3px",
            "min-zoomed-font-size": 8,
            "overlay-opacity": 0,
            "background-opacity": 1,
          },
        },
        {
          selector: 'node[forma = "raiz"]',
          style: {
            shape: "ellipse",
            width: "data(w)",
            height: "data(h)",
            "font-size": 15,
            "font-weight": 800,
            "text-max-width": 110,
          },
        },
        {
          selector: 'node[forma = "grupo"]',
          style: {
            shape: "round-rectangle",
            width: "data(w)",
            height: "data(h)",
            "font-size": 13,
            "font-weight": 700,
            "text-max-width": 132,
          },
        },
        {
          selector: 'node[forma = "persona"]',
          style: {
            shape: "ellipse",
            width: "data(size)",
            height: "data(size)",
            "text-valign": "bottom",
            "text-margin-y": 8,
            "text-background-opacity": 0.92,
            "text-background-shape": "roundrectangle",
            "font-size": 11,
            "font-weight": 600,
          },
        },
        {
          selector: "node.sindatos",
          style: {
            "border-style": "dashed",
            "border-width": 3,
            "border-color": "#fecdd3",
          },
        },
        {
          selector: "node.foco",
          style: {
            "border-width": 4,
            "border-color": "#f8fafc",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.6,
            "line-color": "data(color)",
            opacity: 0.55,
            "curve-style": "straight",
            "target-arrow-shape": "none",
          },
        },
      ],
      layout: { name: "preset" },
    });

    cy.nodes().forEach((node) => {
      if (node.data("depth") > 1) node.hide();
    });

    cy.on("tap", "node", function (event) {
      const node = event.target;
      marcar(node);
      if (node.data("hasChildren")) toggle(node);
      else focusNode(node);
    });
    cy.on("tap", function (event) {
      if (event.target === cy && window.matchMedia("(max-width: 860px)").matches) cerrarFicha();
    });

    requestAnimationFrame(function () {
      runLayout(false);
    });
  }

  function cargar(url) {
    setEstado("Cargando organigrama…");
    renderFicha(null);
    cerrarFicha();
    return fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("No se pudo cargar " + url);
        return response.json();
      })
      .then(function (data) {
        dataset = data;
        childMap = new Map();
        fichas = new Map();
        indice = [];
        notaFa.textContent = data.meta.notaFa;
        notaTamano.textContent = data.meta.notaTamano + " " + data.meta.notaComision;
        document.getElementById("tituloOrganigrama").textContent = "Organigrama de " + data.titulo.replace("Junta Departamental de ", "la Junta de ");
        pintarAdvertencias();
        crearGrafo(buildElements(data));
        pintarLista();
        setEstado("");
      })
      .catch(function () {
        setEstado("No se pudo cargar el organigrama de este departamento.");
      });
  }

  departamento.addEventListener("change", function () {
    const option = departamento.selectedOptions[0];
    if (!option || !option.dataset.archivo) {
      setEstado("Todavía no hay organigrama publicado para ese departamento.");
      departamento.value = "montevideo";
      return;
    }
    cargar(option.dataset.archivo);
  });

  busqueda.addEventListener("input", function () {
    buscar(busqueda.value);
  });
  busqueda.addEventListener("keydown", function (event) {
    const items = Array.prototype.slice.call(resultados.querySelectorAll("button"));
    if (event.key === "ArrowDown" && items.length) {
      resultadoActivo = Math.min(items.length - 1, resultadoActivo + 1);
      items.forEach((item, index) => item.classList.toggle("activo", index === resultadoActivo));
      event.preventDefault();
    } else if (event.key === "ArrowUp" && items.length) {
      resultadoActivo = Math.max(0, resultadoActivo - 1);
      items.forEach((item, index) => item.classList.toggle("activo", index === resultadoActivo));
      event.preventDefault();
    } else if (event.key === "Enter" && resultadoActivo >= 0 && items[resultadoActivo]) {
      items[resultadoActivo].click();
      event.preventDefault();
    } else if (event.key === "Escape") {
      resultados.hidden = true;
      busqueda.setAttribute("aria-expanded", "false");
    }
  });

  document.getElementById("colapsar").addEventListener("click", colapsarTodo);
  document.getElementById("centrar").addEventListener("click", function () {
    if (cy) fitVisible();
  });
  document.getElementById("zoomIn").addEventListener("click", function () { if (cy) zoomBy(1.25); });
  document.getElementById("zoomOut").addEventListener("click", function () { if (cy) zoomBy(0.8); });
  document.getElementById("cerrarFicha").addEventListener("click", function () {
    cerrarFicha();
    renderFicha(null);
  });
  velo.addEventListener("click", function () {
    cerrarFicha();
    renderFicha(null);
  });

  const handle = document.getElementById("sheetHandle");
  let touchStartY = 0;
  handle.addEventListener("touchstart", function (event) {
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });
  handle.addEventListener("touchend", function (event) {
    if (event.changedTouches[0].clientY - touchStartY > 48) {
      cerrarFicha();
      renderFicha(null);
    }
  }, { passive: true });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".buscar")) resultados.hidden = true;
  });

  window.addEventListener("resize", function () {
    if (cy) cy.resize();
  });

  const inicial = departamento.selectedOptions[0];
  cargar(inicial.dataset.archivo);
})();
