window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

// Direcciones verificadas en la página oficial de contactos:
// https://juntamaldonado.gub.uy/index.php/comunicacion/contactos
const MAIL_TO = "junta@juntamaldonado.gub.uy";
const MAIL_SUBJECT = "Consulta ciudadana sobre equipo de asesores – Junta Departamental de Maldonado";

const BANCADAS = [
  { id: "PN", name: "Partido Nacional", email: "pnacional@juntamaldonado.gub.uy" },
  { id: "FA", name: "Frente Amplio", email: "fa@juntamaldonado.gub.uy" },
  { id: "PC", name: "Partido Colorado", email: "pcolorado@juntamaldonado.gub.uy" }
];

let copyToastTimer = 0;

function selectedCc() {
  return BANCADAS.filter((bancada) => {
    const input = document.getElementById(`bancada-${bancada.id}`);
    return input && input.checked;
  }).map((bancada) => bancada.email);
}

function generateMailContent() {
  const nombre = document.getElementById("nombre").value.trim();
  const ci = document.getElementById("cedula").value.trim();
  const signatureLine = nombre ? `${nombre}${ci ? ` (C.I. ${ci})` : ""}\n` : "";
  const body = `Estimados/as integrantes de la Junta Departamental y sus bancadas,

Me dirijo a ustedes en mi condición de ciudadano y vecino de Maldonado, en el marco del interés público y los principios republicanos de transparencia activa en la función legislativa departamental.

A través del presente mensaje, me pongo en contacto con la Junta Departamental y con cada una de sus bancadas para solicitarles información relativa a las personas que figuran o desempeñan funciones de asesoría vinculadas a cada bancada y a cada edil que la integra:

1. Nómina y cantidad: Nombres y cantidad de personas contratadas, designadas o asignadas como asesores técnicos, políticos, secretarios o pases en comisión, detallado por bancada y por cada edil de cada bancada.
2. Destino real de funciones y dependencia: Si dichas personas prestan funciones directamente para el edil o la bancada y su trabajo en la Junta, si responden a la estructura de su sector/partido político, si desempeñan tareas en otro ámbito, o si se desconocen sus funciones efectivas.
3. Perfil y tareas: Cometidos principales, áreas de especialidad y régimen de contratación de cada uno.
4. Remuneraciones y partidas: Montos mensuales asignados o partidas públicas destinadas a tales efectos, por bancada y por edil.

Considero fundamental para el fortalecimiento democrático y el control ciudadano que se conozca con claridad el destino y la utilidad del gasto público en el legislativo departamental.

Dejo constancia de que, en caso de no obtener respuesta en el plazo de una semana (7 días), procederé a formalizar el correspondiente Pedido de Acceso a la Información Pública al amparo de la Ley N° 18.381 ante la Mesa de Entrada de la Junta Departamental.

Agradezco de antemano su tiempo y respuesta.

Saludos cordiales,
${signatureLine}Maldonado, Uruguay`;

  return { subject: MAIL_SUBJECT, body, nombre };
}

function buildMailtoUrl(cc, subject, body) {
  const ccPart = cc.length ? `cc=${encodeURIComponent(cc.join(","))}&` : "";
  return `mailto:${MAIL_TO}?${ccPart}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildGmailUrl(cc, subject, body) {
  const ccPart = cc.length ? `&cc=${encodeURIComponent(cc.join(","))}` : "";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAIL_TO)}${ccPart}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function updatePreview() {
  const { body, subject } = generateMailContent();
  const cc = selectedCc();
  document.getElementById("emailBodyPreview").textContent = body;
  document.getElementById("previewSubject").textContent = subject;
  document.getElementById("previewCc").textContent = cc.length ? cc.join(", ") : "(sin copia)";
  document.getElementById("selectedCount").textContent = String(cc.length);
}

function recipientBlock() {
  const cc = selectedCc();
  return cc.length ? `Para: ${MAIL_TO}\nCC: ${cc.join(", ")}` : `Para: ${MAIL_TO}`;
}

function triggerSend(target) {
  if (typeof window.va === "function") {
    window.va("event", { name: "send_click" });
  }
  const { subject, body } = generateMailContent();
  const cc = selectedCc();

  if (target === "gmail") {
    window.open(buildGmailUrl(cc, subject, body), "_blank", "noopener");
  } else {
    window.location.href = buildMailtoUrl(cc, subject, body);
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
  copyText(recipientBlock(), "Destinatarios copiados (Para y CC).");
}

function copySubject() {
  copyText(MAIL_SUBJECT, "Asunto copiado.");
}

function copyAll() {
  const { subject, body } = generateMailContent();
  const fullText = `${recipientBlock()}\nAsunto: ${subject}\n\n${body}`;
  copyText(fullText, "Datos completos copiados (Para, CC, Asunto y Texto).");
}

document.getElementById("nombre").addEventListener("input", updatePreview);
document.getElementById("cedula").addEventListener("input", updatePreview);
BANCADAS.forEach((bancada) => {
  document.getElementById(`bancada-${bancada.id}`).addEventListener("change", updatePreview);
});
document.getElementById("btnSendMail").addEventListener("click", () => triggerSend("default"));
document.getElementById("btnSendGmail").addEventListener("click", () => triggerSend("gmail"));
document.getElementById("btnCopyRecipients").addEventListener("click", copyRecipients);
document.getElementById("btnCopySubject").addEventListener("click", copySubject);
document.getElementById("btnCopyAll").addEventListener("click", copyAll);

updatePreview();
