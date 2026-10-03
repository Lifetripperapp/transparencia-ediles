const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const http = require("http");
const path = require("path");
const TE = require("../departments");

const ROOT = path.join(__dirname, "..");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json"
};

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    const file = path.normalize(path.join(ROOT, pathname));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

describe("rendered department pages", () => {
  let server;
  let browser;
  let base;

  before(async () => {
    const puppeteer = require("puppeteer-core");
    server = await startServer();
    base = "http://127.0.0.1:" + server.address().port;
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
    });
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  async function open(urlPath, viewport) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    if (viewport) await page.setViewport(viewport);
    await page.goto(base + urlPath, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#pageHeading");
    return { page, errors };
  }

  test("each ?d= value renders that department", async () => {
    for (const dept of TE.DEPARTMENTS) {
      const { page, errors } = await open("/?d=" + dept.slug);
      try {
        assert.deepEqual(errors, [], dept.slug);
        const state = await page.evaluate(() => ({
          heading: document.getElementById("pageHeading").textContent,
          badge: document.getElementById("badgeText").textContent,
          title: document.title,
          subject: document.getElementById("previewSubject").textContent,
          note: document.getElementById("modeNoteText").textContent,
          to: document.getElementById("previewTo").textContent,
          buttons: document.querySelectorAll("#deptSelector button").length,
          pressed: document.querySelector("#deptSelector button[aria-pressed='true']").textContent,
          sendDisabled: document.getElementById("btnSendMail").disabled,
          copyRecipientsHidden: document.getElementById("btnCopyRecipients").classList.contains("hidden"),
          checks: document.querySelectorAll("#edilesList input[type='checkbox']").length,
          checked: document.querySelectorAll("#edilesList input:checked").length,
          legal: document.querySelector("footer").textContent
        }));
        assert.equal(state.buttons, 19, dept.slug);
        assert.equal(state.pressed, dept.name, dept.slug);
        assert.ok(state.heading.includes(dept.name), dept.slug);
        assert.ok(state.badge.includes(dept.name), dept.slug);
        assert.ok(state.title.includes(dept.name), dept.slug);
        assert.ok(state.subject.includes(dept.name), dept.slug);
        assert.ok(state.legal.includes("Ley N° 18.381"), dept.slug);
        if (dept.mode === "form") {
          assert.equal(state.sendDisabled, true, dept.slug);
          assert.equal(state.copyRecipientsHidden, true, dept.slug);
          assert.equal(state.checks, 0, dept.slug);
          assert.ok(state.note.includes("formulario"), dept.slug);
          const formHref = await page.$eval("#modeNoteText a", (anchor) => anchor.href);
          assert.equal(formHref, dept.formUrl);
        } else if (dept.mode === "ediles") {
          assert.equal(state.sendDisabled, false, dept.slug);
          assert.equal(state.checks, dept.ediles.length, dept.slug);
          assert.equal(state.checked, dept.ediles.length, dept.slug);
          assert.ok(state.to.includes(dept.to[0]), dept.slug);
          assert.ok(state.note.includes("copia oculta"), dept.slug);
        } else if (dept.mode === "bancadas") {
          assert.equal(state.checks, dept.bancadas.length, dept.slug);
          assert.equal(state.checked, dept.bancadas.length, dept.slug);
          assert.ok(state.to.includes(dept.to[0]), dept.slug);
          assert.ok(state.note.toLowerCase().includes("bancada"), dept.slug);
        } else {
          assert.equal(state.checks, 0, dept.slug);
          assert.equal(state.sendDisabled, false, dept.slug);
          assert.ok(state.to.includes(dept.to[0]), dept.slug);
          assert.ok(state.note.includes("casilla general"), dept.slug);
        }
      } finally {
        await page.close();
      }
    }
  });

  test("the selector, filters and empty selection stay usable", async () => {
    const { page, errors } = await open("/");
    try {
      assert.deepEqual(errors, []);
      assert.equal(await page.$eval("#pageHeading", (el) => el.textContent.includes("Montevideo")), true);
      assert.equal(new URL(page.url()).searchParams.get("d"), null);

      await page.click("#deptSelector button[data-slug='canelones']");
      await page.waitForFunction(() => document.getElementById("pageHeading").textContent.includes("Canelones"));
      assert.equal(new URL(page.url()).searchParams.get("d"), "canelones");
      assert.equal(await page.$$eval("#edilesList input", (nodes) => nodes.length), 31);

      await page.click("#filterBtn-FA");
      assert.equal(await page.$eval("#selectedCount", (el) => el.textContent), "18");
      assert.equal(await page.$$eval("#edilesList input", (nodes) => nodes.length), 18);

      await page.click("#filterBtn-PN");
      assert.equal(await page.$eval("#selectedCount", (el) => el.textContent), "10");
      await page.click("#filterBtn-PC");
      assert.equal(await page.$eval("#selectedCount", (el) => el.textContent), "3");
      await page.click("#btnDeselectAll");
      assert.equal(await page.$eval("#selectedCount", (el) => el.textContent), "0");
      assert.equal(await page.$eval("#btnSendMail", (el) => el.disabled), false);
      assert.equal(await page.$eval("#previewCopy", (el) => el.textContent), "0 casillas seleccionadas");

      await page.type("#nombre", "Ana Pérez");
      await page.type("#cedula", "1.234.567-8");
      const body = await page.$eval("#emailBodyPreview", (el) => el.textContent);
      assert.ok(body.includes("vecino de Canelones"));
      assert.ok(body.includes("Ana Pérez (C.I. 1.234.567-8)"));
      assert.ok(body.endsWith("Canelones, Uruguay"));

      await page.evaluate(() => {
        document.getElementById("nombre").value = "";
        document.getElementById("nombre").dispatchEvent(new Event("input"));
      });
      const unsigned = await page.$eval("#emailBodyPreview", (el) => el.textContent);
      assert.equal(unsigned.includes("C.I."), false);
      assert.equal(unsigned.includes("Ana Pérez"), false);
    } finally {
      await page.close();
    }
  });

  test("a hash and a narrow viewport still resolve a department", async () => {
    const hashed = await open("/#maldonado");
    try {
      assert.deepEqual(hashed.errors, []);
      assert.ok((await hashed.page.$eval("#pageHeading", (el) => el.textContent)).includes("Maldonado"));
      assert.equal(new URL(hashed.page.url()).searchParams.get("d"), "maldonado");
      assert.equal(await hashed.page.$$eval("#edilesList input:checked", (nodes) => nodes.length), 3);
      const preview = await hashed.page.$eval("#previewCopy", (el) => el.textContent);
      assert.ok(preview.includes("pnacional@juntamaldonado.gub.uy"));
      assert.ok(preview.includes("fa@juntamaldonado.gub.uy"));
      assert.ok(preview.includes("pcolorado@juntamaldonado.gub.uy"));
    } finally {
      await hashed.page.close();
    }

    const mobile = await open("/?d=montevideo", { width: 390, height: 844 });
    try {
      const fits = await mobile.page.evaluate(() => {
        const box = document.querySelector(".max-w-3xl");
        return box.scrollWidth <= box.clientWidth + 1;
      });
      assert.equal(fits, true);
      assert.equal(await mobile.page.$$eval("#deptSelector button", (nodes) => nodes.length), 19);
    } finally {
      await mobile.page.close();
    }
  });
});
