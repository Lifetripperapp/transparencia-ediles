window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

const DEPARTAMENTOS_DATA = {
  "Montevideo": {
    junta: "Junta Departamental de Montevideo",
    sede: "25 de Mayo 629, Montevideo",
    telefono: "(+598) 2915 2126",
    email_mesa: "junta@juntamvd.gub.uy",
    has_individual_emails: true,
    ediles: [
      { name: "Juan Ignacio Abdala", email: "iabdala@juntamvd.gub.uy", party: "CR" },
      { name: "Fernanda Araujo", email: "maraujo@juntamvd.gub.uy", party: "CR" },
      { name: "Juan Martín Bárcena", email: "jbarcena@juntamvd.gub.uy", party: "CR" },
      { name: "Fabiana Berros", email: "fberros@juntamvd.gub.uy", party: "FA" },
      { name: "Nicolás Botana", email: "nbotana@juntamvd.gub.uy", party: "CR" },
      { name: "Joaquín Campos", email: "jcampos@juntamvd.gub.uy", party: "CR" },
      { name: "Juan Ceretta", email: "jceretta@juntamvd.gub.uy", party: "FA" },
      { name: "Gabriel Cunha", email: "gcunha@juntamvd.gub.uy", party: "CR" },
      { name: "Néstor Delgado", email: "ndelgado@juntamvd.gub.uy", party: "FA" },
      { name: "Sofía Espillar", email: "sespillar@juntamvd.gub.uy", party: "FA" },
      { name: "Gonzalo Gómez", email: "ggomez@juntamvd.gub.uy", party: "CR" },
      { name: "Mayo González", email: "mgonzalez@juntamvd.gub.uy", party: "FA" },
      { name: "Ricardo González", email: "rgonzalez@juntamvd.gub.uy", party: "FA" },
      { name: "Nicolás Hernández", email: "nhernandez@juntamvd.gub.uy", party: "CR" },
      { name: "Guillermo Kruse", email: "hkruse@juntamvd.gub.uy", party: "CR" },
      { name: "Alejandro Milano", email: "amilano@juntamvd.gub.uy", party: "FA" },
      { name: "Federico Paganini", email: "fpaganini@juntamvd.gub.uy", party: "CR" },
      { name: "Pedro Pastorín", email: "ppastorin@juntamvd.gub.uy", party: "FA" },
      { name: "Diego Revetria", email: "drevetria@juntamvd.gub.uy", party: "FA" },
      { name: "Diego Rodríguez", email: "drodriguezsalomon@juntamvd.gub.uy", party: "CR" },
      { name: "Margarita Rodríguez", email: "mvrodriguez@juntamvd.gub.uy", party: "FA" },
      { name: "Diego Romaniello", email: "dromaniello@juntamvd.gub.uy", party: "FA" },
      { name: "Gonzalo Sánchez", email: "gsanchez@juntamvd.gub.uy", party: "FA" },
      { name: "Estefanía Schiavone", email: "eschivone@juntamvd.gub.uy", party: "FA" },
      { name: "Rafael Seijas", email: "rseijas@juntamvd.gub.uy", party: "CR" },
      { name: "Juana Silva", email: "jsilva@juntamvd.gub.uy", party: "FA" },
      { name: "Laura Soto", email: "msoto@juntamvd.gub.uy", party: "CR" },
      { name: "Gimena Urta", email: "murta@juntamvd.gub.uy", party: "FA" },
      { name: "Judith Varela", email: "jvarela@juntamvd.gub.uy", party: "CR" },
      { name: "Fátima Vázquez", email: "fvazquez@juntamvd.gub.uy", party: "FA" },
      { name: "Gonzalo Zuvela", email: "gzuvela@juntamvd.gub.uy", party: "FA" }
    ]
  },
  "Canelones": {
    junta: "Junta Departamental de Canelones",
    sede: "Luis Alberto de Herrera 283, Canelones",
    telefono: "(+598) 4332 2011 / 4332 2420",
    email_mesa: "secretaria@juntadecanelones.gub.uy",
    email_secundario: "contacto@juntadecanelones.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Maldonado": {
    junta: "Junta Departamental de Maldonado",
    sede: "18 de Julio 543, Maldonado",
    telefono: "(+598) 4222 3680 / 4222 3530",
    email_mesa: "mesadeentrada@juntamaldonado.gub.uy",
    email_secundario: "junta@juntamaldonado.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Colonia": {
    junta: "Junta Departamental de Colonia",
    sede: "Rivadavia 467, Colonia del Sacramento",
    telefono: "(+598) 4522 2038",
    email_mesa: "secretaria@juntacolonia.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Salto": {
    junta: "Junta Departamental de Salto",
    sede: "Uruguay 1324, Salto",
    telefono: "(+598) 4733 2470",
    email_mesa: "juntadepartamentaldedesalto@gmail.com",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Paysandú": {
    junta: "Junta Departamental de Paysandú",
    sede: "18 de Julio 1039, Paysandú",
    telefono: "(+598) 4722 2450",
    email_mesa: "secretaria@juntapaysandu.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "San José": {
    junta: "Junta Departamental de San José",
    sede: "18 de Julio 543, San José de Mayo",
    telefono: "(+598) 4342 2212",
    email_mesa: "junta@juntasanjose.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Florida": {
    junta: "Junta Departamental de Florida",
    sede: "Ursino Barreiro 385, Florida",
    telefono: "(+598) 4352 2012",
    email_mesa: "secretaria@juntaflorida.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Río Negro": {
    junta: "Junta Departamental de Río Negro",
    sede: "25 de Mayo 3169, Fray Bentos",
    telefono: "(+598) 4562 2012",
    email_mesa: "junta@juntarionegro.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Rocha": {
    junta: "Junta Departamental de Rocha",
    sede: "Gral. Artigas 140, Rocha",
    telefono: "(+598) 4472 2012",
    email_mesa: "secretaria@juntarocha.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Soriano": {
    junta: "Junta Departamental de Soriano",
    sede: "18 de Julio y Giménez, Mercedes",
    telefono: "(+598) 4532 2012",
    email_mesa: "junta@juntasoriano.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Tacuarembó": {
    junta: "Junta Departamental de Tacuarembó",
    sede: "18 de Julio 164, Tacuarembó",
    telefono: "(+598) 4632 2012",
    email_mesa: "secretaria@juntatacuarembo.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Rivera": {
    junta: "Junta Departamental de Rivera",
    sede: "Uruguay 727, Rivera",
    telefono: "(+598) 4622 2012",
    email_mesa: "secretaria@juntarivera.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Cerro Largo": {
    junta: "Junta Departamental de Cerro Largo",
    sede: "Remigio Castellanos 722, Melo",
    telefono: "(+598) 4642 2012",
    email_mesa: "junta@juntacerrolargo.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Durazno": {
    junta: "Junta Departamental de Durazno",
    sede: "Artigas 449, Durazno",
    telefono: "(+598) 4362 2212",
    email_mesa: "secretaria@juntadurazno.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Lavalleja": {
    junta: "Junta Departamental de Lavalleja",
    sede: "Rodó 581, Minas",
    telefono: "(+598) 4442 2312",
    email_mesa: "junta@juntalavalleja.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Treinta y Tres": {
    junta: "Junta Departamental de Treinta y Tres",
    sede: "Juan Antonio Lavalleja 1248, Treinta y Tres",
    telefono: "(+598) 4452 2012",
    email_mesa: "secretaria@juntatreintaytres.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Artigas": {
    junta: "Junta Departamental de Artigas",
    sede: "Garzón 475, Artigas",
    telefono: "(+598) 4772 2112",
    email_mesa: "junta@juntaartigas.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  },
  "Flores": {
    junta: "Junta Departamental de Flores",
    sede: "Santísima Trinidad 520, Trinidad",
    telefono: "(+598) 4364 2012",
    email_mesa: "secretaria@juntaflores.gub.uy",
    has_individual_emails: false,
    total_ediles: 31
  }
};

const FILTER_ACTIVE = {
  all: "px-3 py-1 rounded-lg text-white font-medium transition bg-blue-600",
  FA: "px-3 py-1 rounded-lg font-medium transition bg-red-800 text-red-100",
  CR: "px-3 py-1 rounded-lg font-medium transition bg-sky-700 text-sky-100"
};

const FILTER_IDLE = {
  all: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-slate-300",
  FA: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-red-300 border border-red-900/50",
  CR: "px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition text-sky-300 border border-sky-900/50"
};

const PARTY_BADGE = {
  FA: "text-xs px-1.5 py-0.5 rounded font-semibold bg-red-950/80 text-red-300 border border-red-800",
  CR: "text-xs px-1.5 py-0.5 rounded font-semibold bg-sky-950/80 text-sky-300 border border-sky-800"
};

let currentDept = "Montevideo";
let selectedEmails = new Set(DEPARTAMENTOS_DATA["Montevideo"].ediles.map((e) => e.email));
let currentFilter = "all";
let copyToastTimer = 0;

function changeDepartment() {
  const select = document.getElementById("deptSelect");
  currentDept = select.value;
  const deptData = DEPARTAMENTOS_DATA[currentDept];

  document.getElementById("badgeJuntaCity").textContent = currentDept;
  document.getElementById("deptNameHeading").textContent = currentDept;
  document.getElementById("mesaEntradaEmailDisplay").textContent = deptData.email_mesa;

  const selButtons = document.getElementById("selectionButtonsWrap");
  const filterButtons = document.getElementById("filterButtonsContainer");

  if (deptData.has_individual_emails) {
    if (selButtons) selButtons.classList.remove("hidden");
    if (filterButtons) filterButtons.classList.remove("hidden");
    selectedEmails = new Set(deptData.ediles.map((e) => e.email));
    renderCountLabels();
    renderEdiles();
  } else {
    if (selButtons) selButtons.classList.add("hidden");
    if (filterButtons) filterButtons.classList.add("hidden");
    selectedEmails = new Set();
    renderDepartmentInfo(deptData);
  }

  updatePreview();
}

function renderDepartmentInfo(deptData) {
  const container = document.getElementById("edilesList");
  container.innerHTML = `
    <div class="p-3 bg-slate-900 rounded-xl space-y-2 text-xs">
      <div class="text-white font-semibold flex items-center justify-between">
        <span>🏛️ ${deptData.junta}</span>
        <span class="text-emerald-400 font-mono text-[11px] font-normal">31 Ediles Titulares</span>
      </div>
      <div class="text-slate-300">
        📍 <strong>Sede:</strong> ${deptData.sede}<br>
        📞 <strong>Teléfono de contacto:</strong> ${deptData.telefono}<br>
        ✉️ <strong>Mesa de Entrada / Secretaría:</strong> <span class="text-blue-400 font-mono">${deptData.email_mesa}</span>
      </div>
      <div class="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
        El correo será remitido formalmente a la Mesa de Entrada y Secretaría de la Junta Departamental para que sea cursado y notificado a los <strong>31 ediles titulares y secretarías de bancada</strong> de ${currentDept}.
      </div>
    </div>
  `;
  document.getElementById("selectedCount").textContent = "31 Ediles (vía Mesa Oficial)";
}

function partyCounts() {
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  const counts = { FA: 0, CR: 0 };
  if (deptData.has_individual_emails) {
    deptData.ediles.forEach((edil) => {
      counts[edil.party] = (counts[edil.party] || 0) + 1;
    });
  }
  return counts;
}

function renderCountLabels() {
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  if (!deptData.has_individual_emails) return;

  const counts = partyCounts();
  const edilesList = deptData.ediles;

  document.getElementById("edilesTotal").textContent = String(edilesList.length);
  document.getElementById("filterBtn-all").textContent = `Todos (${edilesList.length})`;
  document.getElementById("filterBtn-FA").textContent = `Frente Amplio (${counts.FA})`;
  document.getElementById("filterBtn-CR").textContent = `Coalición Republicana (${counts.CR})`;
}

function inputIdFor(email) {
  return "edil-" + email.replace(/[^a-z0-9]+/gi, "-");
}

function renderEdiles(filter = currentFilter) {
  currentFilter = filter;
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  if (!deptData.has_individual_emails) return;

  const container = document.getElementById("edilesList");
  container.replaceChildren();

  const filtered = deptData.ediles.filter((edil) => filter === "all" || edil.party === filter);

  filtered.forEach((edil) => {
    const inputId = inputIdFor(edil.email);
    const label = document.createElement("label");
    label.htmlFor = inputId;
    label.className = "flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-slate-900/80 cursor-pointer text-xs transition border border-transparent hover:border-slate-800";

    const left = document.createElement("span");
    left.className = "flex items-center gap-2.5 min-w-0";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = inputId;
    input.className = "rounded border-slate-700 bg-slate-950 accent-blue-600 focus:outline-none";
    input.checked = selectedEmails.has(edil.email);
    input.addEventListener("change", () => toggleEmail(edil.email));

    const name = document.createElement("span");
    name.className = "text-slate-200 font-medium";
    name.textContent = edil.name;

    const badge = document.createElement("span");
    badge.className = PARTY_BADGE[edil.party] || PARTY_BADGE.CR;
    badge.textContent = edil.party;

    const email = document.createElement("span");
    email.className = "text-slate-400 font-mono text-xs shrink-0";
    email.textContent = edil.email;

    left.append(input, name, badge);
    label.append(left, email);
    container.appendChild(label);
  });

  document.getElementById("selectedCount").textContent = String(selectedEmails.size);
  updateFilterButtons();
  updatePreview();
}

function toggleEmail(email) {
  if (selectedEmails.has(email)) selectedEmails.delete(email);
  else selectedEmails.add(email);
  document.getElementById("selectedCount").textContent = String(selectedEmails.size);
  updatePreview();
}

function selectAll(check) {
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  if (!deptData.has_individual_emails) return;

  if (check) {
    if (currentFilter === "all") {
      selectedEmails = new Set(deptData.ediles.map((edil) => edil.email));
    } else {
      deptData.ediles.filter((edil) => edil.party === currentFilter).forEach((edil) => selectedEmails.add(edil.email));
    }
  } else if (currentFilter === "all") {
    selectedEmails.clear();
  } else {
    deptData.ediles.filter((edil) => edil.party === currentFilter).forEach((edil) => selectedEmails.delete(edil.email));
  }
  renderEdiles();
}

function filterParty(party) {
  currentFilter = party;
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  if (deptData.has_individual_emails) {
    if (party === "all") {
      selectedEmails = new Set(deptData.ediles.map((edil) => edil.email));
    } else {
      selectedEmails = new Set(deptData.ediles.filter((edil) => edil.party === party).map((edil) => edil.email));
    }
  }
  renderEdiles(party);
}

function updateFilterButtons() {
  ["all", "FA", "CR"].forEach((party) => {
    const button = document.getElementById(`filterBtn-${party}`);
    if (!button) return;
    const active = party === currentFilter;
    button.className = active ? FILTER_ACTIVE[party] : FILTER_IDLE[party];
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function readNombre() {
  return document.getElementById("nombre").value.trim();
}

function generateMailContent() {
  const nombre = readNombre();
  const ci = document.getElementById("cedula").value.trim();
  const signatureLine = nombre ? `${nombre}${ci ? ` (C.I. ${ci})` : ""}\n` : "";
  const deptData = DEPARTAMENTOS_DATA[currentDept];

  const subject = `Consulta ciudadana sobre equipo de asesores – ${deptData.junta}`;
  const body = `Estimados/as Sres. y Sras. Ediles de la ${deptData.junta},

Me dirijo a ustedes en mi condición de ciudadano y vecino del departamento de ${currentDept}, en el marco del interés público y los principios republicanos de transparencia activa en la función legislativa departamental.

A través del presente mensaje, me pongo en contacto directo con sus despachos y bancadas para solicitarles información relativa a las personas que figuran o desempeñan funciones de asesoría y secretaría vinculadas a sus respectivas bancas:

1. Nómina y cantidad: Nombres y cantidad de personas contratadas, designadas o asignadas como asesores técnicos, políticos, secretarios o pases en comisión para cada despacho o bancada.
2. Destino real de funciones y dependencia: Si dichas personas prestan funciones directamente para los ediles y su labor parlamentaria en la Junta, si responden a la estructura de sus respectivos sectores o partidos políticos, si desempeñan tareas en otro ámbito, o si se desconocen sus funciones efectivas.
3. Perfil y tareas: Cometidos principales, áreas de especialidad y régimen de contratación de cada uno.
4. Remuneraciones y partidas: Montos mensuales asignados o partidas públicas destinadas a tales efectos.

Considero fundamental para el fortalecimiento democrático y el control ciudadano que se conozca con claridad el destino y la utilidad del gasto público en el legislativo departamental de ${currentDept}.

Dejo constancia de que, en caso de no obtener respuesta en el plazo de una semana (7 días), procederé a formalizar el correspondiente Pedido de Acceso a la Información Pública al amparo de la Ley N° 18.381 ante la Mesa de Entrada oficial de la Junta.

Agradezco de antemano su tiempo y respuesta.

Saludos cordiales,
${signatureLine}Departamento de ${currentDept}, Uruguay`;

  return { subject, body, nombre };
}

function updatePreview() {
  const { body, subject } = generateMailContent();
  const deptData = DEPARTAMENTOS_DATA[currentDept];

  const previewEl = document.getElementById("emailBodyPreview");
  if (previewEl) previewEl.textContent = body;
  const toEl = document.getElementById("previewTo");
  if (toEl) toEl.textContent = deptData.email_mesa;
  const subjectEl = document.getElementById("previewSubject");
  if (subjectEl) subjectEl.textContent = subject;
  const bccEl = document.getElementById("previewBcc");
  if (bccEl) {
    if (deptData.has_individual_emails) {
      bccEl.textContent = `${selectedEmails.size} casillas seleccionadas`;
    } else if (deptData.email_secundario) {
      bccEl.textContent = `${deptData.email_secundario} (Secretaría / Bancadas)`;
    } else {
      bccEl.textContent = `Secretaría General y Bancadas de ${currentDept}`;
    }
  }
}

function recipientBlock() {
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  let bcc = "";
  if (deptData.has_individual_emails) {
    bcc = Array.from(selectedEmails).join(", ");
  } else if (deptData.email_secundario) {
    bcc = deptData.email_secundario;
  }
  return `Para: ${deptData.email_mesa}${bcc ? `\nCCO: ${bcc}` : ""}`;
}

function triggerSend(target) {
  if (typeof window.va === "function") {
    window.va("event", { name: "send_click", department: currentDept });
  }
  const { subject, body } = generateMailContent();
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  const to = deptData.email_mesa;
  let bcc = "";

  if (deptData.has_individual_emails) {
    bcc = Array.from(selectedEmails).join(",");
  } else if (deptData.email_secundario) {
    bcc = deptData.email_secundario;
  }

  if (target === "gmail") {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&bcc=${encodeURIComponent(bcc)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener");
  } else {
    const mailtoUrl = `mailto:${to}?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }
}

function showToast(message) {
  const toast = document.getElementById("copyToast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => toast.classList.add("hidden"), 3500);
}

function copyText(text, successMessage) {
  navigator.clipboard.writeText(text).then(
    () => showToast(successMessage),
    () => showToast("No se pudo copiar. Revisá el permiso del navegador.")
  );
}

function copyRecipients() {
  copyText(recipientBlock(), "Destinatarios copiados (Para y CCO).");
}

function copySubject() {
  const deptData = DEPARTAMENTOS_DATA[currentDept];
  copyText(`Consulta ciudadana sobre equipo de asesores – ${deptData.junta}`, "Asunto copiado.");
}

function copyAll() {
  const { subject, body } = generateMailContent();
  const fullText = `${recipientBlock()}\nAsunto: ${subject}\n\n${body}`;
  copyText(fullText, "Datos completos copiados (Para, CCO, Asunto y Texto).");
}

document.getElementById("deptSelect").addEventListener("change", changeDepartment);
document.getElementById("nombre").addEventListener("input", updatePreview);
document.getElementById("cedula").addEventListener("input", updatePreview);
document.getElementById("btnSelectAll").addEventListener("click", () => selectAll(true));
document.getElementById("btnDeselectAll").addEventListener("click", () => selectAll(false));
document.getElementById("filterBtn-all").addEventListener("click", () => filterParty("all"));
document.getElementById("filterBtn-FA").addEventListener("click", () => filterParty("FA"));
document.getElementById("filterBtn-CR").addEventListener("click", () => filterParty("CR"));
document.getElementById("btnSendMail").addEventListener("click", () => triggerSend("default"));
document.getElementById("btnSendGmail").addEventListener("click", () => triggerSend("gmail"));
document.getElementById("btnCopyRecipients").addEventListener("click", copyRecipients);
document.getElementById("btnCopySubject").addEventListener("click", copySubject);
document.getElementById("btnCopyAll").addEventListener("click", copyAll);

renderCountLabels();
renderEdiles();
updatePreview();