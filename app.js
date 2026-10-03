window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

var TE = globalThis.TransparenciaEdiles;

var DEPT_ACTIVE = "px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-semibold transition";
var DEPT_IDLE = "px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition border border-slate-700";

var FILTER_ACTIVE = {
  all: "px-3 py-1 rounded-lg text-white font-medium transition bg-blue-600",
  FA: "px-3 py-1 rounded-lg font-medium transition bg-red-800 text-red-100",
  CR: "px-3 py-1 rounded-lg font-medium transition bg-sky-700 text-sky-100",
  PN: "px-3 py-1 rounded-lg font-medium transition bg-sky-700 text-sky-100",
  PC: "px-3 py-1 rounded-lg font-medium transition bg-amber-700 text-amber-100",
  CA: "px-3 py-1 rounded-lg font-medium transition bg-emerald-800 text-emerald-100",
  SP: "px-3 py-1 rounded-lg font-medium transition bg-slate-600 text-slate-100"
};

var FILTER_IDLE = {
  all: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-slate-300",
  FA: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-red-300 border border-red-900/50",
  CR: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-sky-300 border border-sky-900/50",
  PN: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-sky-300 border border-sky-900/50",
  PC: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-amber-300 border border-amber-900/50",
  CA: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-emerald-300 border border-emerald-900/50",
  SP: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-slate-300 border border-slate-700"
};

var PARTY_BADGE = {
  FA: "text-xs px-1.5 py-0.5 rounded font-semibold bg-red-950/80 text-red-300 border border-red-800",
  CR: "text-xs px-1.5 py-0.5 rounded font-semibold bg-sky-950/80 text-sky-300 border border-sky-800",
  PN: "text-xs px-1.5 py-0.5 rounded font-semibold bg-sky-950/80 text-sky-300 border border-sky-800",
  PC: "text-xs px-1.5 py-0.5 rounded font-semibold bg-amber-950/80 text-amber-300 border border-amber-800",
  CA: "text-xs px-1.5 py-0.5 rounded font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800",
  SP: "text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-600"
};

var NOTE_EDILES = "bg-blue-950/30 border border-blue-800/40 rounded-xl p-3.5 text-xs text-blue-200 flex items-start gap-3";
var NOTE_OTHER = "bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 text-xs text-amber-200 flex items-start gap-3";
var LINK_NOTE = "underline hover:text-white";
var LINK_FOOT = "text-slate-300 underline hover:text-white";

var currentSlug = "montevideo";
var selected = [];
var currentFilter = "all";
var copyToastTimer = 0;

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  $(id).textContent = value;
}

function makeLink(href, text, className) {
  var anchor = document.createElement("a");
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.className = className;
  anchor.textContent = text;
  return anchor;
}

function fillParts(el, parts) {
  el.replaceChildren();
  parts.forEach(function (part) {
    if (typeof part === "string") {
      el.append(part);
      return;
    }
    if (part.strong) {
      var strong = document.createElement("strong");
      strong.textContent = part.strong;
      el.append(strong);
      return;
    }
    if (part.em) {
      var em = document.createElement("em");
      em.textContent = part.em;
      el.append(em);
      return;
    }
    if (part.link) {
      el.append(makeLink(part.link.href, part.link.text, part.link.className || LINK_NOTE));
    }
  });
}

function currentDept() {
  return TE.getDepartment(currentSlug);
}

function allEmails(dept) {
  if (dept.mode === "ediles") return dept.ediles.map(function (edil) { return edil.email; });
  if (dept.mode === "bancadas") return dept.bancadas.map(function (bancada) { return bancada.email; });
  return [];
}

function currentMessage() {
  return TE.buildMessage(currentSlug, {
    nombre: $("nombre").value,
    cedula: $("cedula").value,
    selected: selected.slice()
  });
}

function inputIdFor(email) {
  return "edil-" + email.replace(/[^a-z0-9]+/gi, "-");
}

function partyCounts(dept) {
  var counts = {};
  dept.ediles.forEach(function (edil) {
    counts[edil.party] = (counts[edil.party] || 0) + 1;
  });
  return counts;
}

function renderDeptButtons() {
  var bar = $("deptSelector");
  bar.replaceChildren();
  TE.DEPARTMENTS.forEach(function (dept) {
    var button = document.createElement("button");
    button.type = "button";
    button.dataset.slug = dept.slug;
    button.textContent = dept.name;
    bar.appendChild(button);
  });
  updateDeptButtons();
}

function updateDeptButtons() {
  var buttons = $("deptSelector").querySelectorAll("button");
  buttons.forEach(function (button) {
    var active = button.dataset.slug === currentSlug;
    button.className = active ? DEPT_ACTIVE : DEPT_IDLE;
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderStats(dept) {
  if (dept.mode === "ediles") {
    var counts = partyCounts(dept);
    var parties = TE.PARTY_ORDER.filter(function (party) { return counts[party]; });
    setText("edilesLabel", "Ediles");
    setText("edilesTotal", String(dept.ediles.length));
    setText("edilesHint", dept.omitted ? "con correo publicado" : "titulares en funciones");
    setText("bancadasLabel", "Bancadas");
    setText("bancadasTotal", String(parties.length));
    setText("partySplit", parties.map(function (party) { return party + " (" + counts[party] + ")"; }).join(" • "));
    return;
  }
  if (dept.mode === "bancadas") {
    setText("edilesLabel", "Destinatario");
    setText("edilesTotal", "Junta");
    setText("edilesHint", "casilla oficial");
    setText("bancadasLabel", "Bancadas en copia");
    setText("bancadasTotal", String(dept.bancadas.length));
    setText("partySplit", dept.bancadas.map(function (bancada) { return bancada.id; }).join(" • "));
    return;
  }
  if (dept.mode === "form") {
    setText("edilesLabel", "Destinatario");
    setText("edilesTotal", "Formulario");
    setText("edilesHint", "sin correo publicado");
    setText("bancadasLabel", "Bancadas");
    setText("bancadasTotal", "0");
    setText("partySplit", "sin correos publicados");
    return;
  }
  setText("edilesLabel", "Destinatario");
  setText("edilesTotal", "Junta");
  setText("edilesHint", "casilla general");
  setText("bancadasLabel", "Bancadas");
  setText("bancadasTotal", "0");
  setText("partySplit", "sin correos publicados");
}

function renderWhat(dept) {
  var restEdiles = " para saber quiénes integran sus equipos de asesores, qué tareas cumplen, cuánto cobran y si realmente trabajan para el edil o para la estructura de su partido político.";
  var restBancadas = " para saber quiénes integran los equipos de asesores de cada bancada y de cada edil, qué tareas cumplen, cuánto cobran y si realmente trabajan para el edil o para la estructura de su partido político.";
  if (dept.mode === "ediles") {
    fillParts($("whatText"), [
      "Te permite ",
      { strong: "consultar a los " + dept.ediles.length + " ediles de " + dept.name },
      restEdiles
    ]);
  } else if (dept.mode === "bancadas") {
    fillParts($("whatText"), [
      "Te permite ",
      { strong: "consultar a la Junta Departamental de " + dept.name + " y a sus bancadas" },
      restBancadas
    ]);
  } else if (dept.mode === "form") {
    fillParts($("whatText"), [
      "Te permite ",
      { strong: "redactar una consulta a la Junta Departamental de " + dept.name },
      " sobre los equipos de asesores. Esta Junta no publica un correo: el texto se copia y se envía por su formulario oficial."
    ]);
  } else {
    fillParts($("whatText"), [
      "Te permite ",
      { strong: "consultar a la Junta Departamental de " + dept.name },
      " para saber quiénes integran los equipos de asesores de sus ediles, qué tareas cumplen, cuánto cobran y si realmente trabajan para el edil o para la estructura de su partido político."
    ]);
  }

  if (dept.mode === "ediles") {
    fillParts($("etapaText"), [
      "Es un pedido voluntario inicial. Si los ediles no responden en ",
      { strong: "una semana (7 días)" },
      ", se formalizará el ",
      { em: "Pedido de Acceso a la Información Pública (Ley 18.381)" },
      " con obligación legal de respuesta ante la Mesa de Entrada."
    ]);
  } else {
    fillParts($("etapaText"), [
      "Es un pedido voluntario inicial. Si no hay respuesta en ",
      { strong: "una semana (7 días)" },
      ", se formalizará el ",
      { em: "Pedido de Acceso a la Información Pública (Ley 18.381)" },
      " con obligación legal de respuesta ante la Mesa de Entrada."
    ]);
  }
}

function renderNote(dept) {
  var note = $("modeNote");
  note.className = dept.mode === "ediles" ? NOTE_EDILES : NOTE_OTHER;
  var parts = [];
  if (dept.slug === "maldonado") {
    parts.push("¿Por qué no aparecen los ediles uno por uno? La Junta Departamental de Maldonado no publica en su web los correos individuales de sus ediles. Por eso el mensaje va a la casilla oficial de la Junta, con copia a las tres bancadas (Partido Nacional, Frente Amplio y Partido Colorado), usando las direcciones que figuran en su ");
    parts.push({ link: { href: dept.sources[0].href, text: "página de contactos" } });
    parts.push(".");
  } else if (dept.mode === "ediles") {
    parts.push("Esta Junta publica los correos individuales de sus ediles. El mensaje va a la casilla general de la Junta, con copia oculta a los ediles que elijas.");
    if (dept.omitted) {
      parts.push(" No se incluyen ediles sin correo publicado, ni correos que la fuente marca como erróneos o inentregables.");
    }
  } else if (dept.mode === "bancadas") {
    parts.push("Esta Junta no publica los correos individuales de sus ediles; el mensaje va a la Junta con copia a las bancadas.");
  } else if (dept.mode === "form") {
    parts.push("Esta Junta no publica los correos individuales de sus ediles ni de sus bancadas, ni una casilla general: solo recibe mensajes a través de su formulario web. ");
    parts.push({ link: { href: dept.formUrl, text: "Abrir el formulario oficial" } });
    parts.push(".");
  } else {
    parts.push("Esta Junta no publica los correos individuales de sus ediles ni de sus bancadas; el mensaje va solo a la casilla general de la Junta.");
  }
  if (dept.extraNote) parts.push(" " + dept.extraNote);
  if (dept.slug !== "maldonado" && dept.mode !== "form") {
    parts.push(" Fuente: ");
    dept.sources.forEach(function (item, index) {
      if (index) parts.push(" · ");
      parts.push({ link: { href: item.href, text: item.label } });
    });
    parts.push(".");
  }
  fillParts($("modeNoteText"), parts);
}

function renderSource(dept) {
  var line = $("sourceLine");
  if (dept.slug === "montevideo") {
    fillParts(line, [
      "Datos oficiales públicos obtenidos del portal de la ",
      { link: { href: dept.sources[0].href, text: "Junta Departamental de Montevideo", className: LINK_FOOT } },
      "."
    ]);
    return;
  }
  if (dept.slug === "maldonado") {
    fillParts(line, [
      "Direcciones tomadas de la ",
      { link: { href: dept.sources[0].href, text: "página oficial de contactos de la Junta Departamental de Maldonado", className: LINK_FOOT } },
      "."
    ]);
    return;
  }
  var parts = [
    "Datos oficiales públicos obtenidos del sitio de la ",
    { link: { href: dept.sources[0].href, text: "Junta Departamental de " + dept.name, className: LINK_FOOT } },
    "."
  ];
  if (dept.sources.length > 1) {
    parts.push(" También: ");
    dept.sources.slice(1).forEach(function (item, index) {
      if (index) parts.push(", ");
      parts.push({ link: { href: item.href, text: item.label, className: LINK_FOOT } });
    });
    parts.push(".");
  }
  fillParts(line, parts);
}

function renderHeading(dept) {
  var title = $("recipientsTitle");
  title.replaceChildren();
  if (dept.mode === "ediles" || dept.mode === "bancadas") {
    title.append("Destinatarios (");
    var count = document.createElement("span");
    count.id = "selectedCount";
    count.textContent = String(selected.length);
    var suffix = document.createElement("span");
    suffix.id = "selectedSuffix";
    suffix.textContent = dept.mode === "ediles" ? " seleccionados" : " bancadas en copia";
    title.append(count, suffix, ")");
    return;
  }
  title.textContent = dept.mode === "form" ? "Cómo enviar el mensaje" : (dept.to.length > 1 ? "Destinatarios" : "Destinatario");
}

function renderFilters(dept) {
  var bar = $("filterBar");
  bar.replaceChildren();
  if (dept.mode !== "ediles") {
    bar.classList.add("hidden");
    return;
  }
  bar.classList.remove("hidden");
  var counts = partyCounts(dept);
  var parties = ["all"].concat(TE.PARTY_ORDER.filter(function (party) { return counts[party]; }));
  parties.forEach(function (party) {
    var button = document.createElement("button");
    button.type = "button";
    button.dataset.party = party;
    button.id = "filterBtn-" + party;
    button.textContent = party === "all"
      ? "Todos (" + dept.ediles.length + ")"
      : (TE.PARTY_LABEL[party] || party) + " (" + counts[party] + ")";
    bar.appendChild(button);
  });
  updateFilterButtons();
}

function updateFilterButtons() {
  var buttons = $("filterBar").querySelectorAll("button");
  buttons.forEach(function (button) {
    var party = button.dataset.party;
    var active = party === currentFilter;
    var activeClass = FILTER_ACTIVE[party] || FILTER_ACTIVE.SP;
    var idleClass = FILTER_IDLE[party] || FILTER_IDLE.SP;
    button.className = active ? activeClass : idleClass;
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderList(dept) {
  var container = $("edilesList");
  var show = dept.mode === "ediles" || dept.mode === "bancadas";
  container.classList.toggle("hidden", !show);
  container.replaceChildren();
  if (!show) return;

  var rows = dept.mode === "ediles"
    ? dept.ediles.filter(function (edil) { return currentFilter === "all" || edil.party === currentFilter; })
    : dept.bancadas;

  rows.forEach(function (row) {
    var email = row.email;
    var inputId = dept.mode === "bancadas" ? "bancada-" + row.id : inputIdFor(email);
    var label = document.createElement("label");
    label.htmlFor = inputId;
    label.className = "flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-slate-900/80 cursor-pointer text-xs transition border border-transparent hover:border-slate-800";

    var left = document.createElement("span");
    left.className = "flex items-center gap-2.5 min-w-0";

    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = inputId;
    input.dataset.email = email;
    input.className = "rounded border-slate-700 bg-slate-950 accent-blue-600 focus:outline-none";
    input.checked = selected.indexOf(email) !== -1;

    var name = document.createElement("span");
    name.className = "text-slate-200 font-medium";
    name.textContent = row.name;

    left.append(input, name);
    if (dept.mode === "ediles") {
      var badge = document.createElement("span");
      badge.className = PARTY_BADGE[row.party] || PARTY_BADGE.SP;
      badge.textContent = row.party;
      left.append(badge);
    }

    var emailEl = document.createElement("span");
    emailEl.className = "text-slate-400 font-mono text-xs shrink-0 break-all text-right";
    emailEl.textContent = email;

    label.append(left, emailEl);
    container.appendChild(label);
  });
}

function renderFoot(dept) {
  var foot = $("recipientFoot");
  var hint = $("recipientHint");
  var icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "📌 ";
  var strong = document.createElement("strong");
  var address = document.createElement("span");
  address.className = "text-blue-400 font-mono break-all";
  address.textContent = dept.to.join(", ");

  foot.replaceChildren();
  if (dept.mode === "ediles") {
    strong.textContent = dept.to.length > 1 ? "Mesa de Entrada:" : "Mesa de Entrada:";
    foot.append(icon, strong, " Se incluye automáticamente como destinatario formal ", address, ".");
    hint.textContent = "Si destildás todos, el correo igual sale a la casilla de la Junta, sin copia oculta.";
    hint.classList.remove("hidden");
  } else if (dept.mode === "bancadas") {
    strong.textContent = "Para:";
    foot.append(icon, strong, " el mensaje siempre va a la casilla oficial de la Junta ", address, ". Elegí qué bancadas van en copia (CC, visible):");
    hint.textContent = "Si destildás todas, el correo igual sale a la casilla de la Junta, sin copia.";
    hint.classList.remove("hidden");
  } else if (dept.mode === "form") {
    foot.append("No hay casilla de correo publicada. Copiá el texto y envialo desde el ");
    foot.append(makeLink(dept.formUrl, "formulario oficial", LINK_NOTE));
    foot.append(".");
    hint.textContent = "";
    hint.classList.add("hidden");
  } else {
    strong.textContent = dept.to.length > 1 ? "Casillas generales:" : "Casilla general:";
    foot.append(icon, strong, " ", address, ". No hay correos de ediles ni de bancadas para poner en copia.");
    hint.textContent = "";
    hint.classList.add("hidden");
  }

  $("recipientActions").classList.toggle("hidden", dept.mode !== "ediles");
}

function renderSendControls(dept) {
  var disabled = dept.mode === "form";
  $("btnSendMail").disabled = disabled;
  $("btnSendGmail").disabled = disabled;
  $("btnCopyRecipients").classList.toggle("hidden", disabled);
  $("longLinkHint").classList.toggle("hidden", disabled);
  $("copyAllLabel").textContent = disabled
    ? " Copiar todo (asunto y texto)"
    : " Copiar todo (destinatarios, asunto y texto)";
}

function updatePreview() {
  var dept = currentDept();
  var message = currentMessage();
  $("emailBodyPreview").textContent = message.body;
  $("previewSubject").textContent = message.subject;
  var copyRow = $("previewCopyRow");
  if (dept.mode === "form") {
    $("previewToLabel").textContent = "Formulario:";
    $("previewTo").replaceChildren(makeLink(dept.formUrl, dept.formUrl, "underline hover:text-white break-all"));
    copyRow.classList.add("hidden");
  } else {
    $("previewToLabel").textContent = "Para:";
    $("previewTo").textContent = message.to.join(", ");
    if (dept.mode === "ediles") {
      copyRow.classList.remove("hidden");
      $("previewCopyLabel").textContent = "CCO:";
      $("previewCopy").textContent = message.bcc.length + " casillas seleccionadas";
    } else if (dept.mode === "bancadas") {
      copyRow.classList.remove("hidden");
      $("previewCopyLabel").textContent = "CC:";
      $("previewCopy").textContent = message.cc.length ? message.cc.join(", ") : "(sin copia)";
    } else {
      copyRow.classList.add("hidden");
    }
  }
  var countEl = $("selectedCount");
  if (countEl) countEl.textContent = String(selected.length);
}

function renderDepartment(slug) {
  var dept = TE.getDepartment(slug) || TE.getDepartment("montevideo");
  currentSlug = dept.slug;
  currentFilter = "all";
  selected = allEmails(dept);
  document.title = "Transparencia Ediles " + dept.name + " — Consulta Ciudadana Abierta";
  setText("badgeText", " Transparencia Activa • Junta Departamental de " + dept.name);
  setText("pageHeading", "¿Quiénes son los asesores de los Ediles de " + dept.name + "?");
  renderStats(dept);
  renderWhat(dept);
  renderNote(dept);
  renderSource(dept);
  renderHeading(dept);
  renderFilters(dept);
  renderList(dept);
  renderFoot(dept);
  renderSendControls(dept);
  updateDeptButtons();
  updatePreview();
}

function toggleEmail(email, checked) {
  if (checked) {
    if (selected.indexOf(email) === -1) selected.push(email);
  } else {
    selected = selected.filter(function (item) { return item !== email; });
  }
  var countEl = $("selectedCount");
  if (countEl) countEl.textContent = String(selected.length);
  updatePreview();
}

function selectAll(check) {
  var dept = currentDept();
  if (dept.mode !== "ediles") return;
  if (check) {
    if (currentFilter === "all") {
      selected = dept.ediles.map(function (edil) { return edil.email; });
    } else {
      var have = {};
      selected.forEach(function (email) { have[email] = true; });
      dept.ediles.filter(function (edil) { return edil.party === currentFilter; }).forEach(function (edil) {
        if (!have[edil.email]) selected.push(edil.email);
      });
    }
  } else if (currentFilter === "all") {
    selected = [];
  } else {
    var drop = {};
    dept.ediles.filter(function (edil) { return edil.party === currentFilter; }).forEach(function (edil) {
      drop[edil.email] = true;
    });
    selected = selected.filter(function (email) { return !drop[email]; });
  }
  renderList(dept);
  updatePreview();
}

function filterParty(party) {
  var dept = currentDept();
  if (dept.mode !== "ediles") return;
  currentFilter = party;
  if (party === "all") selected = dept.ediles.map(function (edil) { return edil.email; });
  else selected = dept.ediles.filter(function (edil) { return edil.party === party; }).map(function (edil) { return edil.email; });
  renderList(dept);
  updateFilterButtons();
  updatePreview();
}

function selectDepartment(slug, historyMode) {
  if (!TE.getDepartment(slug)) slug = "montevideo";
  renderDepartment(slug);
  if (historyMode === "none") return;
  var url = new URL(window.location.href);
  url.searchParams.set("d", slug);
  url.hash = "";
  if (historyMode === "replace") history.replaceState({ slug: slug }, "", url);
  else history.pushState({ slug: slug }, "", url);
}

function showToast(message) {
  var toast = $("copyToast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(function () { toast.classList.add("hidden"); }, 3500);
}

function copyText(text, successMessage) {
  navigator.clipboard.writeText(text).then(
    function () { showToast(successMessage); },
    function () { showToast("No se pudo copiar. Revisá el permiso del navegador."); }
  );
}

function recipientBlock(message) {
  var para = "Para: " + message.to.join(", ");
  if (message.mode === "ediles") return para + "\nCCO: " + message.bcc.join(", ");
  if (message.mode === "bancadas") return message.cc.length ? para + "\nCC: " + message.cc.join(", ") : para;
  if (message.mode === "junta") return para;
  return "";
}

function triggerSend(target) {
  var dept = currentDept();
  if (dept.mode === "form") return;
  if (typeof window.va === "function") {
    window.va("event", { name: "send_click", data: { department: currentSlug } });
  }
  var message = currentMessage();
  if (target === "gmail") window.open(message.gmail, "_blank", "noopener");
  else window.location.href = message.mailto;
}

function copyRecipients() {
  var message = currentMessage();
  if (message.mode === "form") return;
  var toast = message.mode === "ediles"
    ? "Destinatarios copiados (Para y CCO)."
    : message.mode === "bancadas"
      ? "Destinatarios copiados (Para y CC)."
      : "Destinatarios copiados (Para).";
  copyText(recipientBlock(message), toast);
}

function copySubject() {
  copyText(currentMessage().subject, "Asunto copiado.");
}

function copyAll() {
  var message = currentMessage();
  var fullText = message.mode === "form"
    ? "Asunto: " + message.subject + "\n\n" + message.body
    : recipientBlock(message) + "\nAsunto: " + message.subject + "\n\n" + message.body;
  var toast = message.mode === "ediles"
    ? "Datos completos copiados (Para, CCO, Asunto y Texto)."
    : message.mode === "bancadas"
      ? "Datos completos copiados (Para, CC, Asunto y Texto)."
      : message.mode === "form"
        ? "Asunto y texto copiados."
        : "Datos completos copiados (Para, Asunto y Texto).";
  copyText(fullText, toast);
}

function boot() {
  renderDeptButtons();
  var slug = TE.departmentFromLocation(window.location);
  var params = new URLSearchParams(window.location.search);
  var cameFromHash = !params.get("d") && window.location.hash && TE.getDepartment(window.location.hash.replace(/^#/, "").toLowerCase());
  renderDepartment(slug);
  if (cameFromHash) {
    var url = new URL(window.location.href);
    url.searchParams.set("d", slug);
    url.hash = "";
    history.replaceState({ slug: slug }, "", url);
  }

  $("deptSelector").addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button || !button.dataset.slug) return;
    if (button.dataset.slug === currentSlug) return;
    selectDepartment(button.dataset.slug, "push");
  });
  $("nombre").addEventListener("input", updatePreview);
  $("cedula").addEventListener("input", updatePreview);
  $("btnSelectAll").addEventListener("click", function () { selectAll(true); });
  $("btnDeselectAll").addEventListener("click", function () { selectAll(false); });
  $("filterBar").addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button || !button.dataset.party) return;
    filterParty(button.dataset.party);
  });
  $("edilesList").addEventListener("change", function (event) {
    var input = event.target;
    if (!input || input.type !== "checkbox" || !input.dataset.email) return;
    toggleEmail(input.dataset.email, input.checked);
  });
  $("btnSendMail").addEventListener("click", function () { triggerSend("default"); });
  $("btnSendGmail").addEventListener("click", function () { triggerSend("gmail"); });
  $("btnCopyRecipients").addEventListener("click", copyRecipients);
  $("btnCopySubject").addEventListener("click", copySubject);
  $("btnCopyAll").addEventListener("click", copyAll);
  window.addEventListener("popstate", function () {
    renderDepartment(TE.departmentFromLocation(window.location));
  });
}

boot();
