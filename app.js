window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

const EDILES = [
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
];

const MAIL_TO = "junta@juntamvd.gub.uy";
const MAIL_SUBJECT = "Consulta ciudadana sobre equipo de asesores – Junta Departamental de Montevideo";

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

let selectedEmails = new Set(EDILES.map((e) => e.email));
let currentFilter = "all";
let copyToastTimer = 0;

function partyCounts() {
  const counts = { FA: 0, CR: 0 };
  EDILES.forEach((edil) => {
    counts[edil.party] = (counts[edil.party] || 0) + 1;
  });
  return counts;
}

function renderCountLabels() {
  const counts = partyCounts();
  const parties = new Set(EDILES.map((edil) => edil.party));
  document.getElementById("edilesTotal").textContent = String(EDILES.length);
  document.getElementById("bancadasTotal").textContent = String(parties.size);
  document.getElementById("partySplit").textContent = `FA (${counts.FA}) • CR (${counts.CR})`;
  document.getElementById("filterBtn-all").textContent = `Todos (${EDILES.length})`;
  document.getElementById("filterBtn-FA").textContent = `Frente Amplio (${counts.FA})`;
  document.getElementById("filterBtn-CR").textContent = `Coalición Republicana (${counts.CR})`;
}

function inputIdFor(email) {
  return "edil-" + email.replace(/[^a-z0-9]+/gi, "-");
}

function renderEdiles(filter = currentFilter) {
  currentFilter = filter;
  const container = document.getElementById("edilesList");
  container.replaceChildren();

  const filtered = EDILES.filter((edil) => filter === "all" || edil.party === filter);

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
  if (check) {
    if (currentFilter === "all") {
      selectedEmails = new Set(EDILES.map((edil) => edil.email));
    } else {
      EDILES.filter((edil) => edil.party === currentFilter).forEach((edil) => selectedEmails.add(edil.email));
    }
  } else if (currentFilter === "all") {
    selectedEmails.clear();
  } else {
    EDILES.filter((edil) => edil.party === currentFilter).forEach((edil) => selectedEmails.delete(edil.email));
  }
  renderEdiles();
}

function filterParty(party) {
  currentFilter = party;
  if (party === "all") {
    selectedEmails = new Set(EDILES.map((edil) => edil.email));
  } else {
    selectedEmails = new Set(EDILES.filter((edil) => edil.party === party).map((edil) => edil.email));
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

function syncNameGate() {
  const ok = readNombre().length > 0;
  ["btnSendMail", "btnSendGmail", "btnCopyRecipients", "btnCopySubject", "btnCopyAll"].forEach((id) => {
    document.getElementById(id).disabled = !ok;
  });
  const error = document.getElementById("nombreError");
  error.classList.toggle("hidden", ok);
  document.getElementById("nombre").setAttribute("aria-invalid", ok ? "false" : "true");
  return ok;
}

function generateMailContent() {
  const nombre = readNombre();
  const ci = document.getElementById("cedula").value.trim();
  const ciText = ci ? ` (C.I. ${ci})` : "";
  const body = `Estimado/a Edil/a,

Me dirijo a usted en mi condición de ciudadano y vecino de Montevideo, en el marco del interés público y los principios republicanos de transparencia activa en la función legislativa departamental.

A través del presente mensaje, me pongo en contacto directo con su despacho para solicitarle información relativa a las personas que figuran o desempeñan funciones de asesoría vinculadas a su banca:

1. Nómina y cantidad: Nombres y cantidad de personas contratadas, designadas o asignadas como asesores técnicos, políticos, secretarios o pases en comisión para su despacho o bancada.
2. Destino real de funciones y dependencia: Si dichas personas prestan funciones directamente para usted y su trabajo en la Junta, si responden a la estructura de su sector/partido político, si desempeñan tareas en otro ámbito, o si usted desconoce sus funciones efectivas.
3. Perfil y tareas: Cometidos principales, áreas de especialidad y régimen de contratación de cada uno.
4. Remuneraciones y partidas: Montos mensuales asignados o partidas públicas destinadas a tales efectos.

Considero fundamental para el fortalecimiento democrático y el control ciudadano que se conozca con claridad el destino y la utilidad del gasto público en el legislativo departamental.

Dejo constancia de que, en caso de no obtener respuesta en el plazo de una semana (7 días), procederé a formalizar el correspondiente Pedido de Acceso a la Información Pública al amparo de la Ley N° 18.381 ante la Mesa de Entrada de la Junta Departamental.

Agradezco de antemano su tiempo y respuesta.

Saludos cordiales,
${nombre}${ciText}
Montevideo, Uruguay`;

  return { subject: MAIL_SUBJECT, body, nombre };
}

function updatePreview() {
  const { body, subject } = generateMailContent();
  const previewEl = document.getElementById("emailBodyPreview");
  if (previewEl) previewEl.textContent = body;
  const subjectEl = document.getElementById("previewSubject");
  if (subjectEl) subjectEl.textContent = subject;
  const bccEl = document.getElementById("previewBcc");
  if (bccEl) bccEl.textContent = `${selectedEmails.size} casillas seleccionadas`;
  syncNameGate();
}

function recipientBlock() {
  const bcc = Array.from(selectedEmails).join(", ");
  return `Para: ${MAIL_TO}\nCCO: ${bcc}`;
}

function triggerSend(target) {
  if (!syncNameGate()) return;
  if (typeof window.va === "function") {
    window.va("event", { name: "send_click" });
  }
  const { subject, body } = generateMailContent();
  const bcc = Array.from(selectedEmails).join(",");

  if (target === "gmail") {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAIL_TO)}&bcc=${encodeURIComponent(bcc)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener");
  } else {
    const mailtoUrl = `mailto:${MAIL_TO}?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
  if (!syncNameGate()) return;
  navigator.clipboard.writeText(text).then(
    () => showToast(successMessage),
    () => showToast("No se pudo copiar. Revisá el permiso del navegador.")
  );
}

function copyRecipients() {
  copyText(recipientBlock(), "Destinatarios copiados (Para y CCO).");
}

function copySubject() {
  copyText(MAIL_SUBJECT, "Asunto copiado.");
}

function copyAll() {
  const { subject, body } = generateMailContent();
  const fullText = `${recipientBlock()}\nAsunto: ${subject}\n\n${body}`;
  copyText(fullText, "Datos completos copiados (Para, CCO, Asunto y Texto).");
}

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
