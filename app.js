window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

const PARTY_LABEL = {
  FA: "Frente Amplio",
  PN: "Partido Nacional",
  PC: "Partido Colorado",
  CR: "Coalición Republicana",
  CA: "Cabildo Abierto"
};

const PARTY_BADGE = {
  FA: "text-sm px-1.5 py-0.5 rounded font-semibold bg-red-950/80 text-red-300 border border-red-800 shrink-0",
  PN: "text-sm px-1.5 py-0.5 rounded font-semibold bg-sky-950/80 text-sky-300 border border-sky-800 shrink-0",
  PC: "text-sm px-1.5 py-0.5 rounded font-semibold bg-rose-950/80 text-rose-200 border border-rose-800 shrink-0",
  CR: "text-sm px-1.5 py-0.5 rounded font-semibold bg-sky-950/80 text-sky-300 border border-sky-800 shrink-0",
  CA: "text-sm px-1.5 py-0.5 rounded font-semibold bg-amber-950/80 text-amber-200 border border-amber-800 shrink-0"
};

const FILTER_ACTIVE = {
  all: "px-3 py-1.5 rounded-lg text-sm text-white font-medium bg-blue-600",
  FA: "px-3 py-1.5 rounded-lg text-sm font-medium bg-red-800 text-red-100",
  PN: "px-3 py-1.5 rounded-lg text-sm font-medium bg-sky-700 text-sky-100",
  PC: "px-3 py-1.5 rounded-lg text-sm font-medium bg-rose-800 text-rose-100",
  CR: "px-3 py-1.5 rounded-lg text-sm font-medium bg-sky-700 text-sky-100",
  CA: "px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-700 text-amber-50"
};

const FILTER_IDLE = {
  all: "px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 font-medium text-slate-200",
  FA: "px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 font-medium text-red-300 border border-red-900/50",
  PN: "px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 font-medium text-sky-300 border border-sky-900/50",
  PC: "px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 font-medium text-rose-200 border border-rose-900/50",
  CR: "px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 font-medium text-sky-300 border border-sky-900/50",
  CA: "px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 font-medium text-amber-200 border border-amber-900/50"
};

const MAILTO_LIMIT = 1900;
const GMAIL_LIMIT = 7500;

const DEPARTAMENTOS_DATA = {
  "Montevideo": {
    junta: "Junta Departamental de Montevideo",
    sede: "25 de Mayo 629, Montevideo",
    telefono: "(+598) 2915 2126",
    email: "junta@juntamvd.gub.uy",
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
    sede: "Artigas 271, entre L.A. de Herrera y F. Sánchez, Canelones",
    telefono: "4332 2420",
    email: "contacto@juntadecanelones.gub.uy",
    ediles: [
      { name: "Daniel Pereira", party: "FA", email: "edil.danielpereira@juntadecanelones.gub.uy" },
      { name: "Nathali Muniz", party: "FA", email: "edila.nathalimuniz@juntadecanelones.gub.uy" },
      { name: "César Lista", party: "FA", email: "edil.cesarlista@juntadecanelones.gub.uy" },
      { name: "María José Martínez", party: "FA", email: "edila.mariajosemartinez@juntadecanelones.gub.uy" },
      { name: "Juan Ripoll", party: "FA", email: "edil.juanripoll@juntadecanelones.gub.uy" },
      { name: "Florencia Bielli", party: "FA", email: "edila.florenciabielli@juntadecanelones.gub.uy" },
      { name: "Mariela Alamilla", party: "FA", email: "edila.marielaalamilla@juntadecanelones.gub.uy" },
      { name: "María del Rosario Larrea", party: "FA", email: "edila.rosariolarrea@juntadecanelones.gub.uy" },
      { name: "Loredana Morando", party: "FA", email: "edila.loredanamorando@juntadecanelones.gub.uy" },
      { name: "Javier Heredia", party: "FA", email: "edil.javierheredia@juntadecanelones.gub.uy" },
      { name: "Roberto Vázquez", party: "FA", email: "edil.robertovazquez@juntadecanelones.gub.uy" },
      { name: "Marisol D´Albora", party: "FA", email: "edila.marisoldalbora@juntadecanelones.gub.uy" },
      { name: "Liber Moreno", party: "FA", email: "edil.libermoreno@juntadecanelones.gub.uy" },
      { name: "Víctor Rossi", party: "FA", email: "edil.victorrossi@juntadecanelones.gub.uy" },
      { name: "Silvia Núñez", party: "FA", email: "edila.silvianunez@juntadecanelones.gub.uy" },
      { name: "Manuel De León", party: "FA", email: "edil.manueldeleon@juntadecanelones.gub.uy" },
      { name: "Katherin Martínez", party: "FA", email: "edila.katherinmartinez@juntadecanelones.gub.uy" },
      { name: "Leonardo Borges", party: "FA", email: "edil.leonardoborges@juntadecanelones.gub.uy" },
      { name: "Richard Pérez", party: "PN", email: "edil.richardperez@juntadecanelones.gub.uy" },
      { name: "Juan Andrés Marteluna", party: "PN", email: "edil.juanmarteluna@juntadecanelones.gub.uy" },
      { name: "Marcelo Tamborini", party: "PN", email: "edil.marcelotamborini@juntadecanelones.gub.uy" },
      { name: "Beatriz Lamas", party: "PN", email: "edila.beatrizlamas@juntadecanelones.gub.uy" },
      { name: "Agustín Oliver", party: "PN", email: "edil.agustinoliver@juntadecanelones.gub.uy" },
      { name: "Alejandro Repetto", party: "PN", email: "edil.alejandrorepetto@juntadecanelones.gub.uy" },
      { name: "Betiana Britos", party: "PN", email: "edila.betianabritos@juntadecanelones.gub.uy" },
      { name: "Raúl Detomasi", party: "PN", email: "edil.rauldetomasi@juntadecanelones.gub.uy" },
      { name: "Gustavo Morandi", party: "PN", email: "edil.gustavomorandi@juntadecanelones.gub.uy" },
      { name: "Emiliano Quintero", party: "PN", email: "edil.emilianoquintero@juntadecanelones.gub.uy" },
      { name: "Fernando Melgar", party: "PC", email: "edil.fernandomelgar@juntadecanelones.gub.uy" },
      { name: "Noemí Pulitano", party: "PC", email: "edila.noemipulitano@juntadecanelones.gub.uy" },
      { name: "Jerónimo Costa", party: "PC", email: "edil.jeronimocosta@juntadecanelones.gub.uy" }
    ]
  },
  "Maldonado": {
    junta: "Junta Departamental de Maldonado",
    sede: "18 de Julio 547 y Manuel Ledesma, Maldonado",
    telefono: "4222 3530",
    email: "junta@juntamaldonado.gub.uy",
    rosterNote: "Nómina de titulares: sin verificar. El sitio la publica como imágenes, no como texto. Se usan las tres casillas de bancada.",
    bancadas: [
      { name: "Bancada Partido Nacional", party: "PN", email: "pnacional@juntamaldonado.gub.uy" },
      { name: "Bancada Frente Amplio", party: "FA", email: "fa@juntamaldonado.gub.uy" },
      { name: "Bancada Partido Colorado", party: "PC", email: "pcolorado@juntamaldonado.gub.uy" }
    ]
  },
  "Colonia": {
    junta: "Junta Departamental de Colonia",
    sede: "Rivadavia y Alberto Méndez, Colonia del Sacramento",
    telefono: "4522 2195",
    email: "legislativo@juntacolonia.gub.uy",
    rosterNote: "Nómina de titulares: sin verificar."
  },
  "Salto": {
    junta: "Junta Departamental de Salto",
    sede: "Uruguay 1324, Salto",
    telefono: "4733 2346",
    email: "jdsalto@juntadesalto.gub.uy",
    rosterNote: "Nómina de titulares: sin verificar. La página de autoridades mezcla más de 30 nombres sin marcar titular o suplente."
  },
  "Paysandú": {
    junta: "Junta Departamental de Paysandú",
    sede: "Zorrilla de San Martín y Sarandí, Paysandú",
    telefono: "4722 4811",
    email: "direcciondesecretaria@juntadepaysandu.gub.uy",
    rosterNote: "Nómina de titulares: sin verificar. La página de ediles no indica el partido de cada nombre."
  },
  "San José": {
    junta: "Junta Departamental de San José",
    sede: "Dr. Evaristo Ciganda 679, San José de Mayo",
    telefono: "4342 2043",
    email: "junta@juntasanjose.gub.uy",
    rosterNote: "Nómina de titulares: sin verificar. El listado oficial mezcla titulares y suplentes."
  },
  "Florida": {
    junta: "Junta Departamental de Florida",
    sede: "José E. Rodó 3545, Florida",
    telefono: "4352 2237",
    email: "info@juntaflorida.gub.uy",
    rosterNote: "Nómina de titulares: sin verificar."
  },
  "Río Negro": {
    junta: "Junta Departamental de Río Negro",
    sede: "18 de Julio 1181, Fray Bentos",
    telefono: "4562 2257 / 4562 1027",
    email: "secretaria@juntarionegro.gub.uy",
    rosterNote: "Nómina de titulares: sin verificar."
  },
  "Rocha": {
    junta: "Junta Departamental de Rocha",
    sede: "Lavalleja 86, Rocha",
    telefono: "4472 2473",
    email: null,
    rosterNote: "No hay un correo institucional publicado en el formulario de contacto. No se inventa una casilla.",
    ediles: [
      { name: "Leonardo Abreu", party: "PN" },
      { name: "Martina Acosta", party: "PN" },
      { name: "Mauro Amorín", party: "PN" },
      { name: "Cecilia Berni", party: "PN" },
      { name: "Joel Cedrés", party: "PN" },
      { name: "Joaquín de los Santos", party: "PN" },
      { name: "Maximiliano Ferreira", party: "PN" },
      { name: "Daniel Fontes", party: "PN" },
      { name: "Daniel Introini", party: "PN" },
      { name: "Rafael Iza", party: "PN" },
      { name: "Cosme Molina", party: "PN" },
      { name: "Juan Manuel Olivera", party: "PN" },
      { name: "Alejandra Piñeiro", party: "PN" },
      { name: "Sebastián Pintos", party: "PN" },
      { name: "María Inés Rocha", party: "PN" },
      { name: "Mario Sacia", party: "PN" },
      { name: "Miguel Sanguinetti", party: "PN" },
      { name: "Dardo Techera", party: "PN" },
      { name: "Miguel Vitancurt", party: "PN" },
      { name: "Juan Da Silva", party: "FA" },
      { name: "Graciela Fonseca", party: "FA" },
      { name: "Felipe González", party: "FA" },
      { name: "Pablo Larrosa", party: "FA" },
      { name: "Virginia Molina", party: "FA" },
      { name: "Laura Moreno", party: "FA" },
      { name: "Susana Núñez", party: "FA" },
      { name: "Alda Pérez", party: "FA" },
      { name: "Irineu Riet", party: "FA" },
      { name: "Manuel Rodríguez", party: "FA" },
      { name: "Fernando Rodríguez", party: "FA" },
      { name: "Angel Silva", party: "FA" },
      { name: "Alejandro Vaselli", party: "FA" }
    ]
  },
  "Soriano": {
    junta: "Junta Departamental de Soriano",
    sede: "18 de Julio y Eusebio Giménez, Mercedes",
    telefono: "4532 2206",
    email: "info@juntadesoriano.gub.uy",
    rosterNote: "La web oficial muestra 30 nombres, no 31. No se agrega el faltante. José Martín Spoturno no tiene partido en la ficha (listas 9, 119 y 9999); no se le asigna uno.",
    ediles: [
      { name: "Gonzalo Novales", party: "PN" },
      { name: "Raúl Bruno", party: "PN" },
      { name: "Amparo Madrid", party: "PN" },
      { name: "Damián Valentín", party: "PN" },
      { name: "Nilda Costa", party: "PN" },
      { name: "Mayka Acuña", party: "PN" },
      { name: "Oscar Raúl Morossini", party: "PN" },
      { name: "Nicolás Azanza", party: "PN" },
      { name: "Mateo Viurrarena", party: "PN" },
      { name: "Graciela Benquet", party: "PN" },
      { name: "Marcelo Arballo", party: "PN" },
      { name: "Gerardo Gándara", party: "PN" },
      { name: "Daniel Barrozo", party: "PN" },
      { name: "Alexis Suhr", party: "PN" },
      { name: "Claudia Bertalot", party: "PN" },
      { name: "María Dolores Romero", party: "FA" },
      { name: "Matías Ortiz", party: "FA" },
      { name: "Javier Siniestro", party: "FA" },
      { name: "Claudia Barrientos", party: "FA" },
      { name: "Daniela Saravia", party: "FA" },
      { name: "Raphael Núñez", party: "FA" },
      { name: "Pablo Ponce", party: "FA" },
      { name: "Damián Alonso", party: "FA" },
      { name: "Diego Guevara", party: "FA" },
      { name: "José Martín Spoturno" },
      { name: "Jorge Izaguirre", party: "FA" },
      { name: "Andrés Centurión", party: "PC" },
      { name: "María Alejandra Nuez", party: "PC" },
      { name: "Atanasio Echániz", party: "PC" },
      { name: "Santiago Fiorelli", party: "PC" }
    ]
  },
  "Tacuarembó": {
    junta: "Junta Departamental de Tacuarembó",
    sede: "25 de Mayo 132, Tacuarembó",
    telefono: "4632 4451",
    email: "legislativo@juntatacuarembo.com.uy",
    rosterNote: "Nómina de titulares: sin verificar. La página de bancadas no separa con claridad titular y suplente."
  },
  "Rivera": {
    junta: "Junta Departamental de Rivera",
    sede: "José G. Artigas 1025, Rivera",
    telefono: "4622 5850 / 4622 9927",
    email: "juntarivera@adinet.com.uy",
    rosterNote: "Nómina de titulares: sin verificar. El inicio solo nombra a la mesa, no a los 31."
  },
  "Cerro Largo": {
    junta: "Junta Departamental de Cerro Largo",
    sede: "José Pedro Varela 725, Melo",
    telefono: "4642 2283",
    email: null,
    rosterNote: "Correo institucional: sin verificar. La página de contacto no publica una casilla. Nómina de titulares: sin verificar."
  },
  "Durazno": {
    junta: "Junta Departamental de Durazno",
    sede: "Luis A. de Herrera 880, Durazno",
    telefono: "4362 2630",
    email: "contacto@juntadedurazno.gub.uy",
    rosterNote: "Carla Píriz figura sin casilla: el sitio repite el correo de otro edil.",
    ediles: [
      { name: "Luis Gelos", party: "PN", email: "lgelos@juntadedurazno.gub.uy" },
      { name: "Marcos Motta", party: "PN", email: "mmotta@juntadedurazno.gub.uy" },
      { name: "Jesús Delgado", party: "PN", email: "jdelgado@juntadedurazno.gub.uy" },
      { name: "Andrés Dupouy", party: "PN", email: "adupouy@juntadedurazno.gub.uy" },
      { name: "Juan Carlos Torres", party: "PN", email: "jtorres@juntadedurazno.gub.uy" },
      { name: "Anabel Fuentes", party: "PN", email: "afuentes@juntadedurazno.gub.uy" },
      { name: "Alejandro Petutto", party: "FA", email: "apetutto@juntadedurazno.gub.uy" },
      { name: "Pedro Hernández", party: "FA", email: "phernandez@juntadedurazno.gub.uy" },
      { name: "María Bochiardo", party: "FA", email: "mbochiardo@juntadedurazno.gub.uy" },
      { name: "Raúl Curbelo", party: "FA", email: "rcurbelo@juntadedurazno.gub.uy" },
      { name: "Martín Sastre", party: "PN", email: "msastre@juntadedurazno.gub.uy" },
      { name: "Martín Vidalín", party: "PN", email: "mvidalin@juntadedurazno.gub.uy" },
      { name: "Libertad Pintos", party: "PN", email: "lpintos@juntadedurazno.gub.uy" },
      { name: "Santiago Icasuriaga", party: "PN", email: "sicasuriaga@juntadedurazno.gub.uy" },
      { name: "Juan Bruno", party: "PN", email: "jbruno@juntadedurazno.gub.uy" },
      { name: "Henry Morales", party: "PN", email: "hmorales@juntadedurazno.gub.uy" },
      { name: "José Rizzo", party: "FA", email: "rlicandro@juntadedurazno.gub.uy" },
      { name: "Pablo Revello", party: "FA", email: "prevello@juntadedurazno.gub.uy" },
      { name: "Claudio González", party: "FA", email: "cgonzalez@juntadedurazno.gub.uy" },
      { name: "Ester Rodríguez", party: "FA", email: "erodriguez@juntadedurazno.gub.uy" },
      { name: "Carla Píriz", party: "FA" },
      { name: "Andrés Pereyra", party: "PN", email: "apereyra@juntadedurazno.gub.uy" },
      { name: "Pablo Langone", party: "PN", email: "plangone@juntadedurazno.gub.uy" },
      { name: "Jonny Baldenegro", party: "PN", email: "jbaldenegro@juntadedurazno.gub.uy" },
      { name: "Niria de Oliveira", party: "PN", email: "ndeoliveira@juntadedurazno.gub.uy" },
      { name: "Gabriel Díaz", party: "PN", email: "gdiaz@juntadedurazno.gub.uy" },
      { name: "Carlos Pereira Elso", party: "PN", email: "cpiriz@juntadedurazno.gub.uy" },
      { name: "Carlos Carrica", party: "FA", email: "ccarrica@juntadedurazno.gub.uy" },
      { name: "Rodrigo Castro", party: "FA", email: "rcastro@juntadedurazno.gub.uy" },
      { name: "Gabriel Montes de Oca", party: "PC", email: "gmontesdeoca@juntadedurazno.gub.uy" },
      { name: "Daniel Lerena", party: "PC", email: "dlerena@juntadedurazno.gub.uy" }
    ]
  },
  "Lavalleja": {
    junta: "Junta Departamental de Lavalleja",
    sede: "Av. José Pedro Varela 1252, Minas",
    telefono: "4442 2202",
    email: "juntalav@vera.com.uy",
    rosterNote: "La integración publicada tiene 30 nombres, no 31. Las casillas son las que el sitio muestra; varias son personales.",
    ediles: [
      { name: "Carla Calabuig", party: "FA", email: "carlacalabuig34@gmail.com" },
      { name: "Enrique Foderé", party: "FA", email: "enriqueleo69@gmail.com" },
      { name: "Eugenia Duarte", party: "FA" },
      { name: "Ezequiel Larrea", party: "FA", email: "ezequiellarrea43@gmail.com" },
      { name: "Gastón Díaz", party: "FA", email: "gaston.diaz.castro@gmail.com" },
      { name: "Gonzalo Gómez", party: "FA", email: "ggomezcaraballo@gmail.com" },
      { name: "Hugo Garcia", party: "FA", email: "hugogar8409@gmail.com" },
      { name: "Hugo Migliani", party: "FA" },
      { name: "Isabel Urquiola", party: "FA" },
      { name: "Joaquín López", party: "FA", email: "joaquinlopezh95@gmail.com" },
      { name: "Luisa Mazzoni", party: "FA", email: "luisamazzonipiriz@gmail.com" },
      { name: "Mauro Álvarez", party: "FA", email: "mr.alvareztito@gmail.com" },
      { name: "Miguel Sanz", party: "FA" },
      { name: "Paola Rojas", party: "FA" },
      { name: "Sara Mazzoni", party: "FA", email: "saramazzonif2019@gmail.com" },
      { name: "Alcides Larrosa", party: "PN", email: "larrosamoreno1952@gmail.com" },
      { name: "Ana Laura Nis", party: "PN", email: "anisppe@gmail.com" },
      { name: "Carol Aviaga", party: "PN", email: "carolaviaga@gmail.com" },
      { name: "Dolores García Pintos", party: "PN", email: "doloresgpa@gmail.com" },
      { name: "Gabriel Gutiérrez", party: "PN", email: "gabrielgutierrezper@gmail.com" },
      { name: "Gabriela Umpierrez", party: "PN", email: "draumpierrez@gmail.com" },
      { name: "Gastón Elola", party: "PN", email: "gastonelola56@hotmail.com" },
      { name: "Gerardo Effinger", party: "PN", email: "gerardoeffinger@icloud.com" },
      { name: "Hugo Olascoaga", party: "PN", email: "hugo.olascoaga@gmail.com" },
      { name: "Joaquín Hernández", party: "PN", email: "joaquinhp2012@hotmail.com" },
      { name: "José Rojas", party: "PN", email: "ingagr.joserojas@gmail.com" },
      { name: "Verónica Machado", party: "PN", email: "dramachadosolis@gmail.com" },
      { name: "Julio Sánchez", party: "PC", email: "jcg955@hotmail.com" },
      { name: "Luis Carresse", party: "PC", email: "luismacarresse@gmail.com" },
      { name: "Néstor Calvo", party: "PC", email: "nestorac1974@gmail.com" }
    ]
  },
  "Treinta y Tres": {
    junta: "Junta Departamental de Treinta y Tres",
    sede: null,
    telefono: null,
    email: null,
    rosterNote: "Sede, teléfono y correo de mesa: sin verificar. El contacto oficial es un formulario. Nómina de titulares: sin verificar. Sí hay casillas de bancada.",
    bancadas: [
      { name: "Bancada Partido Nacional", party: "PN", email: "partidonacional@juntatreintaytres.gub.uy" },
      { name: "Bancada Frente Amplio", party: "FA", email: "frenteamplio@juntatreintaytres.gub.uy" }
    ]
  },
  "Artigas": {
    junta: "Junta Departamental de Artigas",
    sede: "Av. Carlos Lecueder 510, Artigas",
    telefono: "4772 4859",
    email: "jda@juntadeartigas.gub.uy",
    ediles: [
      { name: "Nelton Barreda", party: "PN" },
      { name: "Andrés Rodríguez Vanuffelen", party: "PC" },
      { name: "Guillermo Gasteasoro Nallen", party: "FA" },
      { name: "Monica Vaz Martins", party: "PN" },
      { name: "Wilfredo Correa", party: "CA" },
      { name: "Gabriela Balbi", party: "PN" },
      { name: "Eduardo García", party: "PN" },
      { name: "Adolfo Cebey", party: "PN" },
      { name: "Alejandro Pablo Silvera Iturralde", party: "PN" },
      { name: "Angel Omar Dos Santos", party: "PN" },
      { name: "Carolina Lorenzo", party: "FA" },
      { name: "Daniel Argañaraz", party: "PC" },
      { name: "David Da Costa", party: "PN" },
      { name: "Eliss Acuña", party: "FA" },
      { name: "Estela Ferreira", party: "PN" },
      { name: "Gastón Silva", party: "FA" },
      { name: "Graciela Echegoyen", party: "PN" },
      { name: "Jorge Ariel Paiva de Souza", party: "PN" },
      { name: "José Moscardi Fagundez", party: "FA" },
      { name: "Juan Carlos Brandon Godoy", party: "PN" },
      { name: "Juan Obiedo", party: "FA" },
      { name: "Mari Esther Izaguirre", party: "FA" },
      { name: "Marisa Correa", party: "CA" },
      { name: "Mateo Ayala Alegre", party: "PN" },
      { name: "Mercedes Barboza", party: "PN" },
      { name: "Miguel Ángel Gimenez Viera", party: "PN" },
      { name: "Miguel Castro", party: "FA" },
      { name: "Natalia Bruno", party: "PN" },
      { name: "Paola Zapata Lima", party: "FA" },
      { name: "Roberto Rodríguez Sant'Anna", party: "CA" },
      { name: "Sebastián Paz Ayala", party: "PN" }
    ]
  },
  "Flores": {
    junta: "Junta Departamental de Flores",
    sede: "Treinta y Tres 520, Trinidad",
    telefono: "4364 2553 / 4364 3865",
    email: "jdflores@adinet.com.uy",
    rosterNote: "Nómina de titulares: sin verificar. El sitio publica la mesa 2026-2027, no los 31 nombres."
  }
};

let currentDept = "Montevideo";
let currentFilter = "all";
let selectedEmails = new Set();
let copyToastTimer = 0;

function deptData() {
  return DEPARTAMENTOS_DATA[currentDept];
}

function edilesOf(dept) {
  return dept.ediles || [];
}

function bancadasOf(dept) {
  return dept.bancadas || [];
}

function partiesIn(dept) {
  const found = [];
  [...edilesOf(dept), ...bancadasOf(dept)].forEach((item) => {
    if (item.party && !found.includes(item.party)) found.push(item.party);
  });
  return found;
}

function rowsFor(dept, filter) {
  const rows = [];
  edilesOf(dept).forEach((edil) => {
    if (filter !== "all" && edil.party !== filter) return;
    rows.push({ kind: "edil", ...edil });
  });
  bancadasOf(dept).forEach((bancada) => {
    if (filter !== "all" && bancada.party !== filter) return;
    rows.push({ kind: "bancada", ...bancada });
  });
  return rows;
}

function selectableEmails(dept, filter = "all") {
  return rowsFor(dept, filter).filter((row) => row.email).map((row) => row.email);
}

function showField(value) {
  return value ? value : "sin verificar";
}

function trackEvent(name, data) {
  if (typeof window.va === "function") {
    window.va("event", { name: name, data: data });
  }
}

function delivery() {
  const dept = deptData();
  const bccList = Array.from(selectedEmails);
  if (dept.email) {
    return { to: dept.email, bcc: bccList };
  }
  return { to: bccList.join(","), bcc: [] };
}

function canSend() {
  const dept = deptData();
  const selectable = selectableEmails(dept);
  if (selectable.length > 0) return selectedEmails.size > 0;
  return Boolean(dept.email);
}

function changeDepartment() {
  currentDept = document.getElementById("deptSelect").value;
  currentFilter = "all";
  selectedEmails = new Set(selectableEmails(deptData()));
  renderDepartment();
}

function renderDepartment() {
  const dept = deptData();
  document.getElementById("badgeJuntaCity").textContent = currentDept;
  const named = edilesOf(dept).length;
  document.getElementById("edilesTotal").textContent = named ? String(named) : "—";
  document.getElementById("edilesCaption").textContent = named ? "titulares publicados" : "nómina sin verificar";

  const strip = document.getElementById("contactStrip");
  strip.replaceChildren();
  const lines = [
    ["Sede", showField(dept.sede)],
    ["Teléfono", showField(dept.telefono)],
    ["Correo institucional", showField(dept.email)]
  ];
  lines.forEach(([label, value]) => {
    const row = document.createElement("div");
    const strong = document.createElement("strong");
    strong.className = "text-slate-100";
    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(value));
    if (value === "sin verificar") row.className = "text-amber-200";
    strip.appendChild(row);
  });
  if (dept.rosterNote) {
    const note = document.createElement("p");
    note.className = "mt-2 text-amber-200";
    note.textContent = dept.rosterNote;
    strip.appendChild(note);
  }

  const hasSelectable = selectableEmails(dept).length > 0;
  document.getElementById("selectionButtonsWrap").classList.toggle("hidden", !hasSelectable);
  renderFilters(dept);
  renderRows();

  const mesa = document.getElementById("mesaEntradaNote");
  mesa.textContent = dept.email
    ? `Para: ${dept.email}. La copia oculta incluye solo las casillas marcadas.`
    : "Sin correo institucional verificado: el envío usa únicamente las casillas marcadas.";
  updatePreview();
}

function renderFilters(dept) {
  const container = document.getElementById("filterButtonsContainer");
  const parties = partiesIn(dept);
  container.replaceChildren();
  if (parties.length === 0) {
    container.classList.add("hidden");
    return;
  }
  container.classList.remove("hidden");
  ["all", ...parties].forEach((party) => {
    const button = document.createElement("button");
    button.type = "button";
    button.id = `filterBtn-${party}`;
    const count = party === "all"
      ? edilesOf(dept).length + bancadasOf(dept).length
      : [...edilesOf(dept), ...bancadasOf(dept)].filter((item) => item.party === party).length;
    button.textContent = party === "all" ? `Todos (${count})` : `${PARTY_LABEL[party]} (${count})`;
    const active = party === currentFilter;
    button.className = active ? FILTER_ACTIVE[party] : FILTER_IDLE[party];
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.addEventListener("click", () => filterParty(party));
    container.appendChild(button);
  });
}

function renderRows() {
  const dept = deptData();
  const container = document.getElementById("edilesList");
  container.replaceChildren();
  const rows = rowsFor(dept, currentFilter);
  if (rows.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-sm text-slate-300";
    empty.textContent = dept.rosterNote || "Sin filas para este filtro.";
    container.appendChild(empty);
  }
  rows.forEach((row) => {
    const label = document.createElement(row.email ? "label" : "div");
    label.className = "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-2 rounded-lg border border-transparent text-sm min-w-0";
    if (row.email) label.className += " hover:bg-slate-900/80 cursor-pointer hover:border-slate-800";

    const left = document.createElement("span");
    left.className = "flex items-center gap-2 min-w-0";

    if (row.email) {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "rounded border-slate-700 bg-slate-950 accent-blue-600 shrink-0";
      input.checked = selectedEmails.has(row.email);
      input.setAttribute("aria-label", row.name);
      input.addEventListener("change", () => toggleEmail(row.email));
      left.appendChild(input);
    }

    const name = document.createElement("span");
    name.className = "text-slate-100 font-medium break-words";
    name.textContent = row.name;
    left.appendChild(name);

    if (row.party && PARTY_BADGE[row.party]) {
      const badge = document.createElement("span");
      badge.className = PARTY_BADGE[row.party];
      badge.textContent = row.party;
      left.appendChild(badge);
    }

    label.appendChild(left);

    const email = document.createElement("span");
    email.className = "text-slate-300 font-mono text-sm break-all sm:text-right sm:max-w-[58%]";
    email.textContent = row.email || "sin casilla publicada";
    if (!row.email) email.className += " text-amber-200";
    label.appendChild(email);
    container.appendChild(label);
  });

  const selectedCount = selectedEmails.size;
  const summary = `${currentDept} · ${selectedCount} seleccionado${selectedCount === 1 ? "" : "s"}`;
  document.getElementById("deptRecipientSummary").textContent = summary;
  updateFilterButtons();
}

function updateFilterButtons() {
  ["all", "FA", "PN", "PC", "CR", "CA"].forEach((party) => {
    const button = document.getElementById(`filterBtn-${party}`);
    if (!button || !FILTER_ACTIVE[party]) return;
    const active = party === currentFilter;
    button.className = active ? FILTER_ACTIVE[party] : FILTER_IDLE[party];
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function toggleEmail(email) {
  if (selectedEmails.has(email)) selectedEmails.delete(email);
  else selectedEmails.add(email);
  const selectedCount = selectedEmails.size;
  document.getElementById("deptRecipientSummary").textContent = `${currentDept} · ${selectedCount} seleccionado${selectedCount === 1 ? "" : "s"}`;
  updatePreview();
}

function selectAll(check) {
  const emails = selectableEmails(deptData(), currentFilter);
  if (check) emails.forEach((email) => selectedEmails.add(email));
  else emails.forEach((email) => selectedEmails.delete(email));
  renderRows();
  updatePreview();
}

function filterParty(party) {
  currentFilter = party;
  const dept = deptData();
  if (selectableEmails(dept).length > 0) {
    selectedEmails = new Set(selectableEmails(dept, party));
  }
  renderRows();
  updatePreview();
}

function readNombre() {
  return document.getElementById("nombre").value.trim();
}

function generateMailContent() {
  const nombre = readNombre();
  const ci = document.getElementById("cedula").value.trim();
  const dept = deptData();
  const subject = `Pedido de información sobre asesores – ${dept.junta}`;
  const firma = nombre ? `${nombre}${ci ? ` (C.I. ${ci})` : ""}` : "";
  const canal = currentDept === "Montevideo"
    ? "En Montevideo este mensaje va a la Mesa de Entrada y a las casillas de despacho marcadas."
    : "Este mensaje va a la casilla institucional verificada y, si las hay, a las casillas de edil o de bancada publicadas por la Junta.";
  const body = `Estimados/as ediles de la ${dept.junta}:

Soy ciudadano/a de ${currentDept}. ${canal}

Pido, en forma voluntaria, esta información sobre asesores y secretarios de cada banca:
1. Nómina y cantidad.
2. Si trabajan para el edil, para el partido o en otro ámbito.
3. Tareas y régimen de contratación.
4. Remuneración o partida mensual.

La Ley 18.381, art. 15, da 20 días hábiles para responder un pedido formal. Estos 7 días son solo un pedido voluntario. Si no hay respuesta, formalizaré el pedido ante la Mesa de Entrada, con identificación, domicilio y contacto (art. 13).

${firma}
${currentDept}, Uruguay`;
  return { subject, body };
}

function recipientBlock() {
  const { to, bcc } = delivery();
  const para = to || "—";
  const cco = bcc.length ? bcc.join(", ") : "—";
  return `Para: ${para}\nCCO: ${cco}`;
}

function mailtoUrl() {
  const { subject, body } = generateMailContent();
  const { to, bcc } = delivery();
  const params = [];
  if (bcc.length) params.push(`bcc=${encodeURIComponent(bcc.join(","))}`);
  params.push(`subject=${encodeURIComponent(subject)}`);
  params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}?${params.join("&")}`;
}

function gmailUrl() {
  const { subject, body } = generateMailContent();
  const { to, bcc } = delivery();
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&bcc=${encodeURIComponent(bcc.join(","))}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function updatePreview() {
  const { body, subject } = generateMailContent();
  const { to, bcc } = delivery();
  document.getElementById("emailBodyPreview").textContent = body;
  document.getElementById("previewTo").textContent = to || "—";
  document.getElementById("previewBcc").textContent = bcc.length ? bcc.join(", ") : "—";
  document.getElementById("previewSubject").textContent = subject;

  const sendEnabled = canSend();
  document.getElementById("btnSendMail").disabled = !sendEnabled;
  document.getElementById("btnSendGmail").disabled = !sendEnabled;
  document.getElementById("btnCopyRecipients").disabled = !to && bcc.length === 0;
  document.getElementById("btnCopySubject").disabled = false;
  document.getElementById("btnCopyAll").disabled = !to && bcc.length === 0;

  const hint = document.getElementById("mailtoHint");
  if (!sendEnabled) {
    hint.textContent = "Elegí al menos una casilla, o un departamento con correo institucional verificado, para abrir el borrador.";
    return;
  }
  const mailLength = mailtoUrl().length;
  hint.textContent = mailLength <= MAILTO_LIMIT
    ? `El enlace de la app de correo mide ${mailLength} caracteres.`
    : `El enlace de la app de correo mide ${mailLength} caracteres y se pasa de ~2000. En ese caso el botón copia el texto completo, igual al de la vista previa. Gmail sigue disponible si el enlace entra.`;
}

function showToast(message) {
  const toast = document.getElementById("copyToast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => toast.classList.add("hidden"), 4000);
}

function copyText(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => showToast(successMessage),
      () => showToast("No se pudo copiar. Revisá el permiso del navegador.")
    );
    return;
  }
  showToast("No se pudo copiar. Revisá el permiso del navegador.");
}

function triggerSend(target) {
  if (!canSend()) return;
  trackEvent(target === "gmail" ? "send_gmail_click" : "send_mail_click", { department: currentDept });
  const { subject, body } = generateMailContent();
  if (target === "gmail") {
    const url = gmailUrl();
    if (url.length > GMAIL_LIMIT) {
      copyText(`${recipientBlock()}\nAsunto: ${subject}\n\n${body}`, "El enlace de Gmail es demasiado largo. Copiamos el correo completo.");
      return;
    }
    window.open(url, "_blank", "noopener");
    return;
  }
  const url = mailtoUrl();
  if (url.length > MAILTO_LIMIT) {
    copyText(`${recipientBlock()}\nAsunto: ${subject}\n\n${body}`, "El enlace mailto supera ~2000 caracteres. Copiamos Para, CCO, asunto y texto.");
    return;
  }
  window.location.href = url;
}

function copyRecipients() {
  copyText(recipientBlock(), "Destinatarios copiados (Para y CCO).");
}

function copySubject() {
  copyText(generateMailContent().subject, "Asunto copiado.");
}

function copyAll() {
  trackEvent("copy_all_click", { department: currentDept });
  const { subject, body } = generateMailContent();
  copyText(`${recipientBlock()}\nAsunto: ${subject}\n\n${body}`, "Datos completos copiados (Para, CCO, asunto y texto).");
}

document.getElementById("deptSelect").addEventListener("change", changeDepartment);
document.getElementById("nombre").addEventListener("input", updatePreview);
document.getElementById("cedula").addEventListener("input", updatePreview);
document.getElementById("btnSelectAll").addEventListener("click", () => selectAll(true));
document.getElementById("btnDeselectAll").addEventListener("click", () => selectAll(false));
document.getElementById("btnSendMail").addEventListener("click", () => triggerSend("mail"));
document.getElementById("btnSendGmail").addEventListener("click", () => triggerSend("gmail"));
document.getElementById("btnCopyRecipients").addEventListener("click", copyRecipients);
document.getElementById("btnCopySubject").addEventListener("click", copySubject);
document.getElementById("btnCopyAll").addEventListener("click", copyAll);

selectedEmails = new Set(selectableEmails(deptData()));
renderDepartment();
