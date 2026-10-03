# Transparencia Ediles Montevideo 🏛️🇺🇾

Iniciativa cívica abierta y comunitaria para facilitar el ejercicio del derecho ciudadano de **Acceso a la Información Pública (Ley N° 18.381)** ante la **Junta Departamental de Montevideo**.

## 🎯 Objetivo
Permitir a cualquier ciudadano consultar de forma directa, ágil y transparente a los 31 ediles departamentales sobre:
1. **Nómina y cantidad:** Identidad de las personas contratadas o asignadas como secretarios y asesores técnicos/políticos.
2. **Dependencia real:** Si prestan servicios directos para el edil en la Junta, para el sector/partido, o en otros ámbitos.
3. **Tareas y perfiles:** Especialidad y funciones desempeñadas.
4. **Remuneraciones:** Partidas y montos públicos destinados a tales efectos.

## 🚀 Probar la Aplicación
🔗 **Sitio principal:** [https://transparencia-ediles.vercel.app/](https://transparencia-ediles.vercel.app/)

🔗 **Versión Maldonado:** [https://transparencia-ediles.vercel.app/maldonado](https://transparencia-ediles.vercel.app/maldonado) — la Junta de Maldonado no publica correos individuales de ediles, así que el mensaje va a `junta@juntamaldonado.gub.uy` con copia a las bancadas (direcciones de su [página oficial de contactos](https://juntamaldonado.gub.uy/index.php/comunicacion/contactos)).

Espejo en GitHub Pages: [https://lifetripperapp.github.io/transparencia-ediles/](https://lifetripperapp.github.io/transparencia-ediles/)

Código: [https://github.com/Lifetripperapp/transparencia-ediles](https://github.com/Lifetripperapp/transparencia-ediles)

## 🛠️ Tecnologías
- HTML5 / Vanilla JS
- Tailwind CSS compilado a `assets/styles.css` (sin CDN en producción)
- Integración directa con clientes de correo (`mailto:` y Gmail Web) sin servidores intermedios para máxima privacidad del usuario.

## Estilos
El CSS ya está generado y versionado. Vercel y GitHub Pages sirven el archivo estático; no hace falta un build al desplegar.

Para regenerarlo después de cambiar clases en `index.html`, `app.js`, `maldonado.html` o `maldonado.js`:

```bash
npm install
npm run build:css
```

Eso ejecuta Tailwind CLI 3.4 (`tailwindcss -i src/input.css -o assets/styles.css --minify`) y vuelve a escribir `assets/styles.css`.

## 📜 Licencia
MIT License — Copyright (c) 2026 Martín Canabal. Código libre y abierto para que cualquier persona, colectivo o departamento de Uruguay pueda replicarlo o adaptarlo.
