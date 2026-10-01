# Transparencia Ediles Uruguay

Iniciativa cívica abierta para redactar un pedido de **acceso a la información pública (Ley N° 18.381)** a la Junta Departamental de cualquiera de los 19 departamentos.

Los contactos y las nóminas están en `app.js`. La fecha y la URL de cada uno están en [`data/SOURCES.md`](data/SOURCES.md). Lo que no se pudo confirmar aparece en la página como «sin verificar» y no se usa como destinatario.

## 🎯 Objetivo
Permitir a cualquier ciudadano consultar de forma directa, ágil y transparente a los 31 ediles departamentales sobre:
1. **Nómina y cantidad:** Identidad de las personas contratadas o asignadas como secretarios y asesores técnicos/políticos.
2. **Dependencia real:** Si prestan servicios directos para el edil en la Junta, para el sector/partido, o en otros ámbitos.
3. **Tareas y perfiles:** Especialidad y funciones desempeñadas.
4. **Remuneraciones:** Partidas y montos públicos destinados a tales efectos.

## 🚀 Probar la Aplicación
🔗 **Sitio principal:** [https://transparencia-ediles.vercel.app/](https://transparencia-ediles.vercel.app/)

Espejo en GitHub Pages: [https://lifetripperapp.github.io/transparencia-ediles/](https://lifetripperapp.github.io/transparencia-ediles/)

Código: [https://github.com/Lifetripperapp/transparencia-ediles](https://github.com/Lifetripperapp/transparencia-ediles)

## 🛠️ Tecnologías
- HTML5 / Vanilla JS
- Tailwind CSS compilado a `assets/styles.css` (sin CDN en producción)
- Integración directa con clientes de correo (`mailto:` y Gmail Web) sin servidores intermedios para máxima privacidad del usuario.

## Estilos
El CSS ya está generado y versionado. Vercel y GitHub Pages sirven el archivo estático; no hace falta un build al desplegar.

Para regenerarlo después de cambiar clases en `index.html` o `app.js`:

```bash
npm install
npm run build:css
```

Eso ejecuta Tailwind CLI 3.4 (`tailwindcss -i src/input.css -o assets/styles.css --minify`) y vuelve a escribir `assets/styles.css`.

## 📜 Licencia
MIT License — Copyright (c) 2026 Martín Canabal. Código libre y abierto para que cualquier persona, colectivo o departamento de Uruguay pueda replicarlo o adaptarlo.
