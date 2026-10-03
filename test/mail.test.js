const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const TE = require("../departments");
const identity = require("./fixtures/identity.json");

const CSV_DEPARTMENTS = ["artigas", "canelones", "durazno", "lavalleja", "montevideo", "soriano"];

const EXPECTED_TO = {
  artigas: ["jda@juntadeartigas.gub.uy"],
  canelones: ["contacto@juntadecanelones.gub.uy"],
  "cerro-largo": ["contacto@juntacerrolargo.gub.uy"],
  colonia: ["legislativo@juntacolonia.gub.uy"],
  durazno: ["contacto@juntadedurazno.gub.uy", "juntadedurazno@gmail.com"],
  flores: ["jdflores@adinet.com.uy"],
  florida: ["info@juntaflorida.gub.uy"],
  lavalleja: ["juntalav@vera.com.uy"],
  maldonado: ["junta@juntamaldonado.gub.uy"],
  montevideo: ["junta@juntamvd.gub.uy"],
  paysandu: ["direcciondesecretaria@juntadepaysandu.gub.uy"],
  "rio-negro": ["secretaria@juntarionegro.gub.uy"],
  rivera: ["juntarivera@adinet.com.uy", "presidenciajdr@gmail.com"],
  rocha: [],
  salto: [],
  "san-jose": ["junta@juntasanjose.gub.uy"],
  soriano: ["info@juntadesoriano.gub.uy"],
  tacuarembo: ["legislativo@juntatacuarembo.com.uy"],
  "treinta-y-tres": ["correo@juntatreintaytres.gub.uy"]
};

const EXPECTED_CC = {
  maldonado: [
    "pnacional@juntamaldonado.gub.uy",
    "fa@juntamaldonado.gub.uy",
    "pcolorado@juntamaldonado.gub.uy"
  ],
  "treinta-y-tres": [
    "partidonacional@juntatreintaytres.gub.uy",
    "frenteamplio@juntatreintaytres.gub.uy"
  ]
};

const MODES = {
  artigas: "ediles",
  canelones: "ediles",
  durazno: "ediles",
  lavalleja: "ediles",
  montevideo: "ediles",
  soriano: "ediles",
  maldonado: "bancadas",
  "treinta-y-tres": "bancadas",
  "cerro-largo": "junta",
  colonia: "junta",
  flores: "junta",
  florida: "junta",
  paysandu: "junta",
  "rio-negro": "junta",
  rivera: "junta",
  "san-jose": "junta",
  tacuarembo: "junta",
  rocha: "form",
  salto: "form"
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === "\"") {
        if (text[i + 1] === "\"") {
          field += "\"";
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift();
  return rows.filter((cells) => cells.some((cell) => cell !== "")).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] || "";
    });
    return record;
  });
}

function isUndeliverable(observacion, email) {
  if (!String(email || "").trim()) return true;
  return /no entregable|inentregable|posible error del sitio|no coincide con el nombre/i.test(observacion || "");
}

function partyCode(partido) {
  const value = String(partido || "").trim();
  if (!value) return "SP";
  const normalized = value.toLowerCase();
  if (normalized.includes("frente amplio")) return "FA";
  if (normalized.includes("partido colorado")) return "PC";
  if (normalized.includes("partido nacional")) return "PN";
  if (normalized.includes("cabildo abierto")) return "CA";
  if (normalized.includes("coalición republicana") || normalized.includes("coalicion republicana")) return "CR";
  return "SP";
}

function csvRows(slug) {
  const text = fs.readFileSync(path.join(__dirname, "..", "data", slug + ".csv"), "utf8");
  return parseCsv(text);
}

function keptRows(slug) {
  return csvRows(slug).filter((row) => !isUndeliverable(row.observacion, row.email));
}

function splitList(value) {
  return value ? value.split(",").filter(Boolean) : [];
}

function parseMailto(url) {
  assert.equal(typeof url, "string");
  assert.ok(url.startsWith("mailto:"), url);
  const queryAt = url.indexOf("?");
  const toPart = url.slice("mailto:".length, queryAt);
  const params = new URLSearchParams(url.slice(queryAt + 1));
  return {
    to: toPart ? toPart.split(",") : [],
    cc: params.has("cc") ? splitList(params.get("cc")) : [],
    bcc: params.has("bcc") ? splitList(params.get("bcc")) : [],
    ccPresent: params.has("cc"),
    bccPresent: params.has("bcc"),
    subject: params.get("subject"),
    body: params.get("body")
  };
}

function parseGmail(url) {
  const parsed = new URL(url);
  assert.equal(parsed.origin + parsed.pathname, "https://mail.google.com/mail/");
  assert.equal(parsed.searchParams.get("view"), "cm");
  assert.equal(parsed.searchParams.get("fs"), "1");
  return {
    to: splitList(parsed.searchParams.get("to")),
    cc: parsed.searchParams.has("cc") ? splitList(parsed.searchParams.get("cc")) : [],
    bcc: parsed.searchParams.has("bcc") ? splitList(parsed.searchParams.get("bcc")) : [],
    ccPresent: parsed.searchParams.has("cc"),
    bccPresent: parsed.searchParams.has("bcc"),
    subject: parsed.searchParams.get("su"),
    body: parsed.searchParams.get("body")
  };
}

test("Montevideo and Maldonado stay byte-identical to the current main version", () => {
  for (const row of identity.montevideo) {
    const message = TE.buildMessage("montevideo", {
      nombre: row.nombre,
      cedula: row.cedula,
      selected: identity.montevideoSelections[row.selection]
    });
    assert.equal(message.subject, row.message.subject);
    assert.equal(message.body, row.message.body);
    assert.equal(message.mailto, row.message.mailto);
    assert.equal(message.gmail, row.message.gmail);
    assert.deepEqual(message.to, row.message.to);
    assert.deepEqual(message.cc, []);
    assert.deepEqual(message.bcc, row.message.bcc);
  }

  const defaultMontevideo = TE.buildMessage("montevideo");
  const allMontevideo = identity.montevideo.find((row) => row.selection === "all" && row.nombre === "" && row.cedula === "");
  assert.equal(defaultMontevideo.mailto, allMontevideo.message.mailto);

  for (const row of identity.maldonado) {
    const message = TE.buildMessage("maldonado", {
      nombre: row.nombre,
      cedula: row.cedula,
      selected: identity.maldonadoSelections[row.selection]
    });
    assert.equal(message.subject, row.message.subject);
    assert.equal(message.body, row.message.body);
    assert.equal(message.mailto, row.message.mailto);
    assert.equal(message.gmail, row.message.gmail);
    assert.deepEqual(message.to, row.message.to);
    assert.deepEqual(message.cc, row.message.cc);
    assert.deepEqual(message.bcc, []);
  }

  const defaultMaldonado = TE.buildMessage("maldonado");
  const allMaldonado = identity.maldonado.find((row) => row.selection === "all" && row.nombre === "" && row.cedula === "");
  assert.equal(defaultMaldonado.mailto, allMaldonado.message.mailto);
});

test("every department exposes the published To, CC and BCC counts", () => {
  assert.equal(TE.DEPARTMENTS.length, 19);
  assert.deepEqual(TE.DEPARTMENTS.map((dept) => dept.slug).sort(), Object.keys(MODES).sort());

  for (const dept of TE.DEPARTMENTS) {
    assert.equal(dept.mode, MODES[dept.slug], dept.slug);
    const message = TE.buildMessage(dept.slug, { nombre: "Ana Pérez", cedula: "1.234.567-8" });
    assert.deepEqual(message.to, EXPECTED_TO[dept.slug], dept.slug);
    assert.equal(message.subject, "Consulta ciudadana sobre equipo de asesores – Junta Departamental de " + dept.name);

    if (dept.mode === "form") {
      assert.equal(message.mailto, null);
      assert.equal(message.gmail, null);
      assert.deepEqual(message.cc, []);
      assert.deepEqual(message.bcc, []);
      assert.ok(message.body.includes("vecino de " + dept.name));
      assert.ok(message.body.endsWith(dept.name + ", Uruguay"));
      continue;
    }

    const mailto = parseMailto(message.mailto);
    const gmail = parseGmail(message.gmail);
    assert.deepEqual(mailto.to, message.to, dept.slug);
    assert.deepEqual(gmail.to, message.to, dept.slug);
    assert.deepEqual(mailto.cc, message.cc, dept.slug);
    assert.deepEqual(gmail.cc, message.cc, dept.slug);
    assert.deepEqual(mailto.bcc, message.bcc, dept.slug);
    assert.deepEqual(gmail.bcc, message.bcc, dept.slug);
    assert.equal(mailto.subject, message.subject);
    assert.equal(gmail.subject, message.subject);
    assert.equal(mailto.body, message.body);
    assert.equal(gmail.body, message.body);
    assert.ok(message.body.includes("Ana Pérez (C.I. 1.234.567-8)"));

    const empty = TE.buildMessage(dept.slug, { selected: [] });
    const emptyMailto = parseMailto(empty.mailto);
    const emptyGmail = parseGmail(empty.gmail);
    assert.deepEqual(emptyMailto.to, EXPECTED_TO[dept.slug], dept.slug + " empty");
    assert.deepEqual(emptyGmail.to, EXPECTED_TO[dept.slug]);
    if (dept.mode === "ediles") {
      assert.equal(empty.bcc.length, 0);
      assert.equal(emptyMailto.bccPresent, true);
      assert.equal(emptyMailto.bcc.length, 0);
      assert.equal(emptyGmail.bccPresent, true);
      assert.equal(message.bcc.length, dept.ediles.length);
      assert.deepEqual(message.cc, []);
    } else if (dept.mode === "bancadas") {
      assert.deepEqual(message.cc, EXPECTED_CC[dept.slug], dept.slug);
      assert.equal(message.bcc.length, 0);
      assert.equal(empty.cc.length, 0);
      assert.equal(emptyMailto.ccPresent, false);
      assert.equal(emptyGmail.ccPresent, false);
      assert.equal(emptyMailto.bccPresent, false);
    } else {
      assert.deepEqual(message.cc, []);
      assert.deepEqual(message.bcc, []);
      assert.equal(emptyMailto.ccPresent, false);
      assert.equal(emptyMailto.bccPresent, false);
    }
  }
});

test("individual departments use only the kept CSV addresses, in order", () => {
  for (const slug of CSV_DEPARTMENTS) {
    if (slug === "montevideo") continue;
    const rows = keptRows(slug);
    const dept = TE.getDepartment(slug);
    assert.deepEqual(dept.ediles.map((edil) => edil.email), rows.map((row) => row.email.trim()), slug);
    assert.deepEqual(dept.ediles.map((edil) => edil.name), rows.map((row) => row.nombre), slug);
    assert.deepEqual(dept.ediles.map((edil) => edil.party), rows.map((row) => partyCode(row.partido)), slug);
    const dropped = csvRows(slug).filter((row) => isUndeliverable(row.observacion, row.email));
    for (const row of dropped) {
      assert.equal(dept.ediles.some((edil) => edil.name === row.nombre), false, slug + " " + row.nombre);
    }
  }

  const montevideoEmails = new Set(keptRows("montevideo").map((row) => row.email.trim()));
  const pageEmails = TE.getDepartment("montevideo").ediles.map((edil) => edil.email);
  assert.equal(pageEmails.length, 31);
  assert.deepEqual(new Set(pageEmails), montevideoEmails);
  assert.deepEqual(TE.getDepartment("montevideo").ediles, identity.montevideoEdiles);

  assert.deepEqual(TE.partyCounts("canelones"), { FA: 18, PN: 10, PC: 3 });
  assert.deepEqual(TE.partyCounts("artigas"), { PN: 17, PC: 2, FA: 9, CA: 3 });
  assert.deepEqual(TE.partyCounts("durazno"), { PN: 17, FA: 9, PC: 2 });
  assert.deepEqual(TE.partyCounts("lavalleja"), { FA: 10, PN: 12, PC: 3 });
  assert.deepEqual(TE.partyCounts("soriano"), { PN: 14, FA: 10, SP: 1, PC: 4 });
  assert.deepEqual(TE.partyCounts("montevideo"), { CR: 14, FA: 17 });

  const durazno = TE.buildMessage("durazno");
  assert.equal(durazno.bcc.length, 28);
  assert.equal(durazno.bcc.includes("rlicandro@juntadedurazno.gub.uy"), false);
  assert.equal(durazno.bcc.includes("cpiriz@juntadedurazno.gub.uy"), false);
  assert.equal(durazno.bcc.filter((email) => email === "rcurbelo@juntadedurazno.gub.uy").length, 1);

  const soriano = TE.buildMessage("soriano");
  assert.equal(soriano.bcc.length, 29);
  assert.equal(soriano.bcc.includes("mayka.acuña@juntadesoriano.gub.uy"), false);
  assert.equal(soriano.bcc.includes("nicolas.asansa@juntadesoriano.gub.uy"), true);
  assert.equal(TE.getDepartment("lavalleja").ediles.length, 25);
  assert.equal(TE.getDepartment("lavalleja").ediles.some((edil) => !edil.email), false);
});

test("other departments reuse the Montevideo or Maldonado wording with the department name", () => {
  const montevideo = TE.buildMessage("montevideo", { nombre: "Ana", cedula: "1" });
  const canelones = TE.buildMessage("canelones", { nombre: "Ana", cedula: "1" });
  assert.equal(canelones.body, montevideo.body.replaceAll("Montevideo", "Canelones"));
  assert.equal(canelones.subject, montevideo.subject.replaceAll("Montevideo", "Canelones"));

  const maldonado = TE.buildMessage("maldonado");
  for (const slug of ["treinta-y-tres", "colonia", "rocha", "paysandu", "rio-negro", "san-jose", "tacuarembo", "cerro-largo"]) {
    const message = TE.buildMessage(slug);
    const name = TE.getDepartment(slug).name;
    assert.equal(message.body, maldonado.body.replaceAll("Maldonado", name), slug);
    assert.equal(message.subject, maldonado.subject.replaceAll("Maldonado", name), slug);
  }

  const noName = TE.buildMessage("florida", { nombre: "", cedula: "1.234.567-8" });
  const bare = TE.buildMessage("florida");
  assert.equal(noName.body, bare.body);
  assert.equal(noName.body.includes("C.I."), false);
});

test("the department comes from ?d=, then the hash, and defaults to Montevideo", () => {
  assert.equal(TE.departmentFromLocation({ search: "", hash: "" }), "montevideo");
  assert.equal(TE.departmentFromLocation({ search: "?d=canelones", hash: "" }), "canelones");
  assert.equal(TE.departmentFromLocation({ search: "?d=RIO-NEGRO", hash: "#maldonado" }), "rio-negro");
  assert.equal(TE.departmentFromLocation({ search: "", hash: "#treinta-y-tres" }), "treinta-y-tres");
  assert.equal(TE.departmentFromLocation({ search: "?d=no-existe", hash: "" }), "montevideo");
});

test("the page keeps a strict script policy and /maldonado points at the selector", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.equal(/<script(?![^>]*\bsrc=)/i.test(html), false);
  assert.equal(/\son[a-z]+=/i.test(html), false);
  assert.equal(fs.existsSync(path.join(__dirname, "..", "maldonado.html")), false);
  assert.equal(fs.existsSync(path.join(__dirname, "..", "maldonado.js")), false);

  const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "vercel.json"), "utf8"));
  const policy = vercel.headers[0].headers.find((header) => header.key === "Content-Security-Policy").value;
  assert.match(policy, /script-src 'self'/);
  assert.equal(policy.includes("unsafe-inline"), false);
  const maldonado = vercel.redirects.find((rule) => rule.source === "/maldonado");
  assert.equal(maldonado.destination, "/?d=maldonado");
  assert.equal(JSON.stringify(vercel).includes("maldonado.html"), false);

  const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
  for (const name of ["Artigas", "Canelones", "Maldonado", "Montevideo", "Paysandú", "Rocha", "Treinta y Tres"]) {
    assert.equal(readme.includes(name), true, name);
  }
  assert.equal(html.includes("Paysandú"), true);
  assert.equal(html.includes("Treinta y Tres"), true);
});
