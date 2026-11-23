// Revisa el Storybook compilado antes de publicarlo. Falla (código 1) si encuentra algo que no
// debe ser público: referencias internas del proyecto, rutas locales, source maps o secretos.
// Uso: node scripts/revisar-build.mjs <carpeta-del-build>
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("Uso: node scripts/revisar-build.mjs <carpeta-del-build>");
  process.exit(2);
}
if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`No existe la carpeta ${dir}`);
  process.exit(2);
}

const TEXTO = new Set([
  ".html",
  ".js",
  ".mjs",
  ".cjs",
  ".css",
  ".json",
  ".txt",
  ".svg",
  ".md",
  ".xml",
]);

const REGLAS = [
  // Referencias internas del proyecto.
  {
    nombre: "carpeta reference/",
    re: /\breference\/(notas|documentacion|tokens)\b/,
  },
  { nombre: "inventario interno", re: /docs\/inventory/ },
  { nombre: "plan maestro", re: /PLAN-MAESTRO/ },
  { nombre: "decisión interna (D-123)", re: /\bD-\d{2,3}\b/ },
  { nombre: "sección del HTML del DS", re: /\bHTML \d{2}(\.\d+)?\b/ },
  { nombre: "fase o lote del proyecto", re: /\b(fase|lote) \d+\b/i },
  // Rutas de una máquina.
  { nombre: "ruta local de Windows", re: /[A-Za-z]:[\\/]{1,2}Users[\\/]{1,2}/ },
  {
    nombre: "ruta local de Linux o macOS",
    re: /\/(home\/runner|Users\/[A-Za-z][\w.-]*)\//,
  },
  // Source maps incrustados (los archivos .map se revisan aparte). Una referencia a un .map que no
  // está en el build, como la que traen algunas librerías de terceros, no expone código.
  { nombre: "source map incrustado", re: /[#@] sourceMappingURL=data:/ },
  // Secretos.
  {
    nombre: "token de GitHub",
    re: /\b(ghp|gho|ghs|ghu|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{40,}/,
  },
  { nombre: "token de npm", re: /\bnpm_[A-Za-z0-9]{36}\b/ },
  { nombre: "llave privada", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { nombre: "token de registro", re: /_authToken\s*=/ },
];

const archivos = [];
const recorrer = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) recorrer(p);
    else archivos.push(p);
  }
};
recorrer(dir);

const hallazgos = [];
for (const archivo of archivos) {
  const rel = relative(dir, archivo).replaceAll("\\", "/");
  if (extname(archivo) === ".map") {
    hallazgos.push({ rel, nombre: "archivo de source map", muestra: "" });
    continue;
  }
  if (!TEXTO.has(extname(archivo))) continue;
  const texto = readFileSync(archivo, "utf8");
  for (const { nombre, re } of REGLAS) {
    for (const m of texto.matchAll(new RegExp(re.source, re.flags + "g"))) {
      const ini = Math.max(0, m.index - 60);
      const muestra = texto
        .slice(ini, m.index + m[0].length + 60)
        .replace(/\s+/g, " ");
      hallazgos.push({ rel, nombre, muestra });
    }
  }
}

if (hallazgos.length) {
  console.error(
    `La revisión encontró ${hallazgos.length} problema(s); no se publica:\n`,
  );
  for (const h of hallazgos) {
    console.error(`- ${h.rel}: ${h.nombre}`);
    if (h.muestra) console.error(`    …${h.muestra}…`);
  }
  process.exit(1);
}

console.log(
  `Revisión correcta: ${archivos.length} archivos sin referencias internas, rutas locales, source maps ni secretos.`,
);
