# Transparencia Ediles 🏛️🇺🇾

Iniciativa cívica abierta y comunitaria para facilitar el ejercicio del derecho ciudadano de **Acceso a la Información Pública (Ley N° 18.381)** ante las **19 Juntas Departamentales** del Uruguay.

Una sola página. El selector de arriba cambia el departamento (`?d=montevideo`, `?d=canelones`, `?d=maldonado`, …). Si no hay parámetro, abre Montevideo. `/maldonado` redirige a `/?d=maldonado`.

## 🎯 Objetivo
Permitir a cualquier ciudadano consultar, con los correos que cada Junta publica, sobre:
1. **Nómina y cantidad:** Identidad de las personas contratadas o asignadas como secretarios y asesores técnicos/políticos.
2. **Dependencia real:** Si prestan servicios directos para el edil en la Junta, para el sector/partido, o en otros ámbitos.
3. **Tareas y perfiles:** Especialidad y funciones desempeñadas.
4. **Remuneraciones:** Partidas y montos públicos destinados a tales efectos.

## Cómo se arma el correo
La página no inventa direcciones. Según lo que publica cada Junta:

1. **Ediles en copia oculta** (Artigas, Canelones, Durazno, Lavalleja, Montevideo y Soriano): el mensaje va a la casilla general y los ediles elegidos van en CCO. Se omiten filas sin correo y correos que la fuente marca como erróneos o inentregables.
2. **Bancadas en copia** (Maldonado y Treinta y Tres): la Junta no publica correos individuales. El mensaje va a la Junta, con copia visible a las bancadas.
3. **Solo la casilla general** (Cerro Largo, Colonia, Flores, Florida, Paysandú, Río Negro, Rivera, San José y Tacuarembó).
4. **Solo formulario** (Rocha y Salto): no hay correo publicado. Los botones de envío quedan deshabilitados y se puede copiar el asunto y el texto para el formulario oficial.

## 🚀 Probar la Aplicación
🔗 **Sitio:** [https://transparencia-ediles.vercel.app/](https://transparencia-ediles.vercel.app/)

Ejemplos: [Montevideo](https://transparencia-ediles.vercel.app/?d=montevideo) · [Canelones](https://transparencia-ediles.vercel.app/?d=canelones) · [Maldonado](https://transparencia-ediles.vercel.app/maldonado) · [Rocha](https://transparencia-ediles.vercel.app/?d=rocha)

Espejo en GitHub Pages: [https://lifetripperapp.github.io/transparencia-ediles/](https://lifetripperapp.github.io/transparencia-ediles/)

Código: [https://github.com/Lifetripperapp/transparencia-ediles](https://github.com/Lifetripperapp/transparencia-ediles)

## 🛠️ Tecnologías
- HTML5 / Vanilla JS (`index.html`, `departments.js`, `app.js`)
- Tailwind CSS compilado a `assets/styles.css` (sin CDN en producción)
- Integración directa con clientes de correo (`mailto:` y Gmail Web) sin servidores intermedios para máxima privacidad del usuario.

## Estilos
El CSS ya está generado y versionado. Vercel y GitHub Pages sirven el archivo estático; no hace falta un build al desplegar.

Para regenerarlo después de cambiar clases en `index.html`, `app.js` o `departments.js`:

```bash
npm install
npm run build:css
```

Eso ejecuta Tailwind CLI 3.4 (`tailwindcss -i src/input.css -o assets/styles.css --minify`) y vuelve a escribir `assets/styles.css`.

Los controles del correo se prueban con `npm test`.

## 📜 Licencia
MIT License — Copyright (c) 2026 Martín Canabal. Código libre y abierto para que cualquier persona, colectivo o departamento de Uruguay pueda replicarlo o adaptarlo.
