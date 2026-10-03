(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.TransparenciaEdiles = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var PARTY_LABEL = {
    FA: "Frente Amplio",
    CR: "Coalición Republicana",
    PN: "Partido Nacional",
    PC: "Partido Colorado",
    CA: "Cabildo Abierto",
    SP: "Sin partido"
  };

  var PARTY_ORDER = ["FA", "CR", "PN", "PC", "CA", "SP"];

  var SUBJECT_PREFIX = "Consulta ciudadana sobre equipo de asesores \u2013 Junta Departamental de ";

  var MONTEVIDEO_EDILES = [
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
  var EXTRA_EDILES = {
  "artigas": {
    "omitted": 0,
    "ediles": [
      {
        "name": "Nelton Barreda",
        "email": "neltonbarreda@gmail.com",
        "party": "PN"
      },
      {
        "name": "Andrés Rodríguez Vanuffelen",
        "email": "andreseli72@yahoo.com.ar",
        "party": "PC"
      },
      {
        "name": "Guillermo Gasteasoro Nallen",
        "email": "guillermogasteasoro@gmail.com",
        "party": "FA"
      },
      {
        "name": "Monica Vaz Martins",
        "email": "monicavazmartins@gmail.com",
        "party": "PN"
      },
      {
        "name": "Wilfredo Correa",
        "email": "wilfredocorrea.2017@gmail.com",
        "party": "CA"
      },
      {
        "name": "Gabriela Balbi",
        "email": "gabi.balbi.64@hotmail.com",
        "party": "PN"
      },
      {
        "name": "Eduardo García",
        "email": "edudelfi210889@gmail.com",
        "party": "PN"
      },
      {
        "name": "Adolfo Cebey",
        "email": "adolfocebey@gmail.com",
        "party": "PN"
      },
      {
        "name": "Alejandro Pablo Silvera Iturralde",
        "email": "escribanosilvera@gmail.com",
        "party": "PN"
      },
      {
        "name": "Angel Omar Dos Santos",
        "email": "grupoamerican1@hotmail.com",
        "party": "PN"
      },
      {
        "name": "Carolina Lorenzo Machado",
        "email": "Clorenzom20@gmail.com",
        "party": "FA"
      },
      {
        "name": "Daniel Argañaraz Bicera",
        "email": "ardaniel27961@gmail.com",
        "party": "PC"
      },
      {
        "name": "David Da Costa",
        "email": "dacostadavid14@outlook.com",
        "party": "PN"
      },
      {
        "name": "Eliss Acuña",
        "email": "acunadacunha@gmail.com",
        "party": "FA"
      },
      {
        "name": "Estela Ferreira",
        "email": "blancaestelaferreirabueno@gmail.com",
        "party": "PN"
      },
      {
        "name": "Gastón Silva",
        "email": "gsdo20597@gmail.com",
        "party": "FA"
      },
      {
        "name": "Graciela Echegoyen",
        "email": "gracielaechegoyen@gmail.com",
        "party": "PN"
      },
      {
        "name": "Jorge Ariel Paiva de Souza",
        "email": "quiquepaiva52@gmail.com",
        "party": "PN"
      },
      {
        "name": "José Moscardi Fagundez",
        "email": "papomoscardi73@gmail.com",
        "party": "FA"
      },
      {
        "name": "Juan Carlos Brandon Godoy",
        "email": "jbrandongodoy@gmail.com",
        "party": "PN"
      },
      {
        "name": "Juan Obiedo",
        "email": "juanobiedo@gmail.com",
        "party": "FA"
      },
      {
        "name": "Mari Esther Izaguirre",
        "email": "almani-03@hotmail.com",
        "party": "FA"
      },
      {
        "name": "Marisa Correa",
        "email": "marsanvencocorreaguilar@gmail.com",
        "party": "CA"
      },
      {
        "name": "Mateo Ayala Alegre",
        "email": "maaefilhos2@hotmail.com",
        "party": "PN"
      },
      {
        "name": "Mercedes Barboza",
        "email": "mercedesbarboza83@gmail.com",
        "party": "PN"
      },
      {
        "name": "Miguel Ángel Gimenez Viera",
        "email": "magimenezviera@hotmail.com",
        "party": "PN"
      },
      {
        "name": "Miguel Castro",
        "email": "mac21equipout@gmail.com",
        "party": "FA"
      },
      {
        "name": "Natalia Bruno",
        "email": "nataliabruno@gmail.com",
        "party": "PN"
      },
      {
        "name": "Paola Zapata Lima",
        "email": "lorenapaola26@gmail.com",
        "party": "FA"
      },
      {
        "name": "Roberto Rodríguez Sant'Anna",
        "email": "roberto.santanna@vera.com.uy",
        "party": "CA"
      },
      {
        "name": "Sebastián Paz Ayala",
        "email": "sebapaz019@gmail.com",
        "party": "PN"
      }
    ]
  },
  "canelones": {
    "omitted": 0,
    "ediles": [
      {
        "name": "Daniel Pereira",
        "email": "edil.danielpereira@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Nathali Muniz",
        "email": "edila.nathalimuniz@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "César Lista",
        "email": "edil.cesarlista@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "María José Martínez",
        "email": "edila.mariajosemartinez@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Juan Ripoll",
        "email": "edil.juanripoll@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Florencia Bielli",
        "email": "edila.florenciabielli@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Mariela Alamilla",
        "email": "edila.marielaalamilla@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "María del Rosario Larrea",
        "email": "edila.rosariolarrea@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Loredana Morando",
        "email": "edila.loredanamorando@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Javier Heredia",
        "email": "edil.javierheredia@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Roberto Vázquez",
        "email": "edil.robertovazquez@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Marisol D´Albora",
        "email": "edila.marisoldalbora@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Liber Moreno",
        "email": "edil.libermoreno@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Víctor Rossi",
        "email": "edil.victorrossi@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Silvia Núñez",
        "email": "edila.silvianunez@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Manuel De León",
        "email": "edil.manueldeleon@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Katherin Martínez",
        "email": "edila.katherinmartinez@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Leonardo Borges",
        "email": "edil.leonardoborges@juntadecanelones.gub.uy",
        "party": "FA"
      },
      {
        "name": "Richard Pérez",
        "email": "edil.richardperez@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Juan Andrés Marteluna",
        "email": "edil.juanmarteluna@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Marcelo Tamborini",
        "email": "edil.marcelotamborini@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Beatriz Lamas",
        "email": "edila.beatrizlamas@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Agustín Oliver",
        "email": "edil.agustinoliver@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Alejandro Repetto",
        "email": "edil.alejandrorepetto@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Betiana Britos",
        "email": "edila.betianabritos@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Raúl Detomasi",
        "email": "edil.rauldetomasi@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Gustavo Morandi",
        "email": "edil.gustavomorandi@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Emiliano Quintero",
        "email": "edil.emilianoquintero@juntadecanelones.gub.uy",
        "party": "PN"
      },
      {
        "name": "Fernando Melgar",
        "email": "edil.fernandomelgar@juntadecanelones.gub.uy",
        "party": "PC"
      },
      {
        "name": "Noemí Pulitano",
        "email": "edila.noemipulitano@juntadecanelones.gub.uy",
        "party": "PC"
      },
      {
        "name": "Jerónimo Costa",
        "email": "edil.jeronimocosta@juntadecanelones.gub.uy",
        "party": "PC"
      }
    ]
  },
  "durazno": {
    "omitted": 3,
    "ediles": [
      {
        "name": "Luis Gelos",
        "email": "lgelos@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Marcos Motta",
        "email": "mmotta@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Jesús Delgado",
        "email": "jdelgado@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Andrés Dupouy",
        "email": "adupouy@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Juan Carlos Torres",
        "email": "jtorres@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Anabel Fuentes",
        "email": "afuentes@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Alejandro Petutto",
        "email": "apetutto@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Pedro Hernández",
        "email": "phernandez@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "María Bochiardo",
        "email": "mbochiardo@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Raúl Curbelo",
        "email": "rcurbelo@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Martín Sastre",
        "email": "msastre@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Martín Vidalín",
        "email": "mvidalin@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Libertad Pintos",
        "email": "lpintos@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Santiago Icasuriaga",
        "email": "sicasuriaga@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Juan Bruno",
        "email": "jbruno@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Henry Morales",
        "email": "hmorales@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Pablo Revello",
        "email": "prevello@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Claudio González",
        "email": "cgonzalez@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Ester Rodríguez",
        "email": "erodriguez@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Andrés Pereyra",
        "email": "apereyra@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Pablo Langone",
        "email": "plangone@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Jonny Baldenegro",
        "email": "jbaldenegro@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Niria de Oliveira",
        "email": "ndeoliveira@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Gabriel Díaz",
        "email": "gdiaz@juntadedurazno.gub.uy",
        "party": "PN"
      },
      {
        "name": "Carlos Carrica",
        "email": "ccarrica@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Rodrigo Castro",
        "email": "rcastro@juntadedurazno.gub.uy",
        "party": "FA"
      },
      {
        "name": "Gabriel Montes de Oca",
        "email": "gmontesdeoca@juntadedurazno.gub.uy",
        "party": "PC"
      },
      {
        "name": "Daniel Lerena",
        "email": "dlerena@juntadedurazno.gub.uy",
        "party": "PC"
      }
    ]
  },
  "lavalleja": {
    "omitted": 5,
    "ediles": [
      {
        "name": "Carla Calabuig",
        "email": "carlacalabuig34@gmail.com",
        "party": "FA"
      },
      {
        "name": "Enrique Foderé",
        "email": "enriqueleo69@gmail.com",
        "party": "FA"
      },
      {
        "name": "Ezequiel Larrea",
        "email": "ezequiellarrea43@gmail.com",
        "party": "FA"
      },
      {
        "name": "Gastón Díaz",
        "email": "gaston.diaz.castro@gmail.com",
        "party": "FA"
      },
      {
        "name": "Gonzalo Gómez",
        "email": "ggomezcaraballo@gmail.com",
        "party": "FA"
      },
      {
        "name": "Hugo Garcia",
        "email": "hugogar8409@gmail.com",
        "party": "FA"
      },
      {
        "name": "Joaquín López",
        "email": "joaquinlopezh95@gmail.com",
        "party": "FA"
      },
      {
        "name": "Luisa Mazzoni",
        "email": "luisamazzonipiriz@gmail.com",
        "party": "FA"
      },
      {
        "name": "Mauro Álvarez",
        "email": "mr.alvareztito@gmail.com",
        "party": "FA"
      },
      {
        "name": "Sara Mazzoni",
        "email": "saramazzonif2019@gmail.com",
        "party": "FA"
      },
      {
        "name": "Alcides Larrosa",
        "email": "larrosamoreno1952@gmail.com",
        "party": "PN"
      },
      {
        "name": "Ana Laura Nis",
        "email": "anisppe@gmail.com",
        "party": "PN"
      },
      {
        "name": "Carol Aviaga",
        "email": "carolaviaga@gmail.com",
        "party": "PN"
      },
      {
        "name": "Dolores García Pintos",
        "email": "doloresgpa@gmail.com",
        "party": "PN"
      },
      {
        "name": "Gabriel Gutiérrez",
        "email": "gabrielgutierrezper@gmail.com",
        "party": "PN"
      },
      {
        "name": "Gabriela Umpierrez",
        "email": "draumpierrez@gmail.com",
        "party": "PN"
      },
      {
        "name": "Gastón Elola",
        "email": "gastonelola56@hotmail.com",
        "party": "PN"
      },
      {
        "name": "Gerardo Effinger",
        "email": "gerardoeffinger@icloud.com",
        "party": "PN"
      },
      {
        "name": "Hugo Olascoaga",
        "email": "hugo.olascoaga@gmail.com",
        "party": "PN"
      },
      {
        "name": "Joaquín Hernández",
        "email": "joaquinhp2012@hotmail.com",
        "party": "PN"
      },
      {
        "name": "José Rojas",
        "email": "ingagr.joserojas@gmail.com",
        "party": "PN"
      },
      {
        "name": "Verónica Machado",
        "email": "dramachadosolis@gmail.com",
        "party": "PN"
      },
      {
        "name": "Julio Sánchez",
        "email": "jcg955@hotmail.com",
        "party": "PC"
      },
      {
        "name": "Luis Carresse",
        "email": "luismacarresse@gmail.com",
        "party": "PC"
      },
      {
        "name": "Néstor Calvo",
        "email": "nestorac1974@gmail.com",
        "party": "PC"
      }
    ]
  },
  "soriano": {
    "omitted": 1,
    "ediles": [
      {
        "name": "Gonzalo Novales",
        "email": "gonzalo.novales@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Raúl Bruno",
        "email": "raul.bruno@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Amparo Madrid",
        "email": "amparo.madrid@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Damián Valentín",
        "email": "jdamianvr@hotmail.com",
        "party": "PN"
      },
      {
        "name": "Nilda Costa",
        "email": "nilda.costa1954@gmail.com",
        "party": "PN"
      },
      {
        "name": "Oscar Raúl Morossini",
        "email": "raul.morossini@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Nicolás Azanza",
        "email": "nicolas.asansa@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Mateo Viurrarena",
        "email": "mateo.viurrarena@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Graciela Benquet",
        "email": "grasol@adinet.com.uy",
        "party": "PN"
      },
      {
        "name": "Marcelo Arballo",
        "email": "marcelo.arballo@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Gerardo Gándara",
        "email": "gerardo.gandara@juntadesoriano.gub.uy",
        "party": "PN"
      },
      {
        "name": "Daniel Barrozo",
        "email": "daniel.barrozo1980@gmail.com",
        "party": "PN"
      },
      {
        "name": "Alexis Suhr",
        "email": "suhr18alex@gmail.com",
        "party": "PN"
      },
      {
        "name": "Claudia Bertalot",
        "email": "claudia.bertalotgrana@gmail.com",
        "party": "PN"
      },
      {
        "name": "María Dolores Romero",
        "email": "doloresromero881@gmail.com",
        "party": "FA"
      },
      {
        "name": "Matías Ortiz",
        "email": "matto4395@gmail.com",
        "party": "FA"
      },
      {
        "name": "Javier Siniestro",
        "email": "javier.siniestro@juntadesoriano.gub.uy",
        "party": "FA"
      },
      {
        "name": "Claudia Barrientos",
        "email": "claudia.barrientos@juntadesoriano.gub.uy",
        "party": "FA"
      },
      {
        "name": "Daniela Saravia",
        "email": "chistelara@hotmail.com",
        "party": "FA"
      },
      {
        "name": "Raphael Núñez",
        "email": "rafaconaprole2@gmail.com",
        "party": "FA"
      },
      {
        "name": "Pablo Ponce",
        "email": "pabloponces1970@gmail.com",
        "party": "FA"
      },
      {
        "name": "Damián Alonso",
        "email": "damianalonso@adinet.com.uy",
        "party": "FA"
      },
      {
        "name": "Diego Guevara",
        "email": "diego.guevara@juntadesoriano.gub.uy",
        "party": "FA"
      },
      {
        "name": "José Martín Spoturno",
        "email": "josespoturno@outlook.com",
        "party": "SP"
      },
      {
        "name": "Jorge Izaguirre",
        "email": "jorgiza.sand@gmail.com",
        "party": "FA"
      },
      {
        "name": "Andrés Centurión",
        "email": "andres.centurion@juntadesoriano.gub.uy",
        "party": "PC"
      },
      {
        "name": "María Alejandra Nuez",
        "email": "alenuez@vera.com.uy",
        "party": "PC"
      },
      {
        "name": "Atanasio Echániz",
        "email": "echanizmateuatanasio@gmail.com",
        "party": "PC"
      },
      {
        "name": "Santiago Fiorelli",
        "email": "santiago.fiorelli@juntadesoriano.gub.uy",
        "party": "PC"
      }
    ]
  }
};

  function individualBody(department, signatureLine) {
    return `Estimado/a Edil/a,

Me dirijo a usted en mi condición de ciudadano y vecino de ${department}, en el marco del interés público y los principios republicanos de transparencia activa en la función legislativa departamental.

A través del presente mensaje, me pongo en contacto directo con su despacho para solicitarle información relativa a las personas que figuran o desempeñan funciones de asesoría vinculadas a su banca:

1. Nómina y cantidad: Nombres y cantidad de personas contratadas, designadas o asignadas como asesores técnicos, políticos, secretarios o pases en comisión para su despacho o bancada.
2. Destino real de funciones y dependencia: Si dichas personas prestan funciones directamente para usted y su trabajo en la Junta, si responden a la estructura de su sector/partido político, si desempeñan tareas en otro ámbito, o si usted desconoce sus funciones efectivas.
3. Perfil y tareas: Cometidos principales, áreas de especialidad y régimen de contratación de cada uno.
4. Remuneraciones y partidas: Montos mensuales asignados o partidas públicas destinadas a tales efectos.

Considero fundamental para el fortalecimiento democrático y el control ciudadano que se conozca con claridad el destino y la utilidad del gasto público en el legislativo departamental.

Dejo constancia de que, en caso de no obtener respuesta en el plazo de una semana (7 días), procederé a formalizar el correspondiente Pedido de Acceso a la Información Pública al amparo de la Ley N° 18.381 ante la Mesa de Entrada de la Junta Departamental.

Agradezco de antemano su tiempo y respuesta.

Saludos cordiales,
${signatureLine}${department}, Uruguay`;
  }

  function bancadaBody(department, signatureLine) {
    return `Estimados/as integrantes de la Junta Departamental y sus bancadas,

Me dirijo a ustedes en mi condición de ciudadano y vecino de ${department}, en el marco del interés público y los principios republicanos de transparencia activa en la función legislativa departamental.

A través del presente mensaje, me pongo en contacto con la Junta Departamental y con cada una de sus bancadas para solicitarles información relativa a las personas que figuran o desempeñan funciones de asesoría vinculadas a cada bancada y a cada edil que la integra:

1. Nómina y cantidad: Nombres y cantidad de personas contratadas, designadas o asignadas como asesores técnicos, políticos, secretarios o pases en comisión, detallado por bancada y por cada edil de cada bancada.
2. Destino real de funciones y dependencia: Si dichas personas prestan funciones directamente para el edil o la bancada y su trabajo en la Junta, si responden a la estructura de su sector/partido político, si desempeñan tareas en otro ámbito, o si se desconocen sus funciones efectivas.
3. Perfil y tareas: Cometidos principales, áreas de especialidad y régimen de contratación de cada uno.
4. Remuneraciones y partidas: Montos mensuales asignados o partidas públicas destinadas a tales efectos, por bancada y por edil.

Considero fundamental para el fortalecimiento democrático y el control ciudadano que se conozca con claridad el destino y la utilidad del gasto público en el legislativo departamental.

Dejo constancia de que, en caso de no obtener respuesta en el plazo de una semana (7 días), procederé a formalizar el correspondiente Pedido de Acceso a la Información Pública al amparo de la Ley N° 18.381 ante la Mesa de Entrada de la Junta Departamental.

Agradezco de antemano su tiempo y respuesta.

Saludos cordiales,
${signatureLine}${department}, Uruguay`;
  }

  function source(href, label) {
    return { href: href, label: label };
  }

  var DEPARTMENTS = [
    {
      slug: "artigas",
      name: "Artigas",
      mode: "ediles",
      to: ["jda@juntadeartigas.gub.uy"],
      omitted: EXTRA_EDILES.artigas.omitted,
      ediles: EXTRA_EDILES.artigas.ediles,
      bancadas: [],
      sources: [source("https://juntadeartigas.gub.uy/ediles-y-edilas", "Ediles y edilas")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "canelones",
      name: "Canelones",
      mode: "ediles",
      to: ["contacto@juntadecanelones.gub.uy"],
      omitted: EXTRA_EDILES.canelones.omitted,
      ediles: EXTRA_EDILES.canelones.ediles,
      bancadas: [],
      sources: [source("https://www.juntadecanelones.gub.uy/plenario.php", "Plenario")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "cerro-largo",
      name: "Cerro Largo",
      mode: "junta",
      to: ["contacto@juntacerrolargo.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://juntacerrolargo.gub.uy/our-team/", "Integración")],
      formUrl: null,
      extraNote: "Esa casilla figura en el directorio de la ONSC y no está publicada en el sitio de la Junta."
    },
    {
      slug: "colonia",
      name: "Colonia",
      mode: "junta",
      to: ["legislativo@juntacolonia.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://www.juntacolonia.gub.uy/ediles-departamentales/", "Ediles departamentales")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "durazno",
      name: "Durazno",
      mode: "ediles",
      to: ["contacto@juntadedurazno.gub.uy", "juntadedurazno@gmail.com"],
      omitted: EXTRA_EDILES.durazno.omitted,
      ediles: EXTRA_EDILES.durazno.ediles,
      bancadas: [],
      sources: [source("https://juntadedurazno.gub.uy/ediles/", "Ediles")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "flores",
      name: "Flores",
      mode: "junta",
      to: ["jdflores@adinet.com.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://www.juntadeflores.gub.uy/index.php/ediles/", "Ediles")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "florida",
      name: "Florida",
      mode: "junta",
      to: ["info@juntaflorida.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://juntaflorida.gub.uy/index.php?option=com_content&view=article&id=13089", "Autoridades 2025-2030")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "lavalleja",
      name: "Lavalleja",
      mode: "ediles",
      to: ["juntalav@vera.com.uy"],
      omitted: EXTRA_EDILES.lavalleja.omitted,
      ediles: EXTRA_EDILES.lavalleja.ediles,
      bancadas: [],
      sources: [source("https://juntadepartamentallavalleja.gub.uy/page-team/", "Ediles")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "maldonado",
      name: "Maldonado",
      mode: "bancadas",
      to: ["junta@juntamaldonado.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [
        { id: "PN", name: "Partido Nacional", email: "pnacional@juntamaldonado.gub.uy" },
        { id: "FA", name: "Frente Amplio", email: "fa@juntamaldonado.gub.uy" },
        { id: "PC", name: "Partido Colorado", email: "pcolorado@juntamaldonado.gub.uy" }
      ],
      sources: [source("https://juntamaldonado.gub.uy/index.php/comunicacion/contactos", "Contactos")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "montevideo",
      name: "Montevideo",
      mode: "ediles",
      to: ["junta@juntamvd.gub.uy"],
      omitted: 0,
      ediles: MONTEVIDEO_EDILES,
      bancadas: [],
      sources: [source("https://www.juntamvd.gub.uy/public/institucional/integracion", "Integración")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "paysandu",
      name: "Paysandú",
      mode: "junta",
      to: ["direcciondesecretaria@juntadepaysandu.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://www.juntadepaysandu.gub.uy/institucional/ediles/", "Ediles")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "rio-negro",
      name: "Río Negro",
      mode: "junta",
      to: ["secretaria@juntarionegro.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://juntarionegro.gub.uy/page/plenario", "Plenario")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "rivera",
      name: "Rivera",
      mode: "junta",
      to: ["juntarivera@adinet.com.uy", "presidenciajdr@gmail.com"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://www.juntaderivera.gub.uy/bancadas/", "Bancadas")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "rocha",
      name: "Rocha",
      mode: "form",
      to: [],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://juntarocha.gub.uy/jun26/ediles", "Ediles")],
      formUrl: "https://juntarocha.gub.uy/jun26/contactos",
      extraNote: ""
    },
    {
      slug: "salto",
      name: "Salto",
      mode: "form",
      to: [],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://juntadesalto.gub.uy/autoridades-y-ediles/", "Autoridades y ediles")],
      formUrl: "https://juntadesalto.gub.uy/contacto/",
      extraNote: ""
    },
    {
      slug: "san-jose",
      name: "San José",
      mode: "junta",
      to: ["junta@juntasanjose.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://portal.juntasanjose.gub.uy/web/ediles", "Ediles")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "soriano",
      name: "Soriano",
      mode: "ediles",
      to: ["info@juntadesoriano.gub.uy"],
      omitted: EXTRA_EDILES.soriano.omitted,
      ediles: EXTRA_EDILES.soriano.ediles,
      bancadas: [],
      sources: [source("https://www.juntadesoriano.gub.uy/ediles/", "Ediles")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "tacuarembo",
      name: "Tacuarembó",
      mode: "junta",
      to: ["legislativo@juntatacuarembo.com.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [],
      sources: [source("https://juntatacuarembo.com.uy/bancadas/", "Bancadas")],
      formUrl: null,
      extraNote: ""
    },
    {
      slug: "treinta-y-tres",
      name: "Treinta y Tres",
      mode: "bancadas",
      to: ["correo@juntatreintaytres.gub.uy"],
      omitted: 0,
      ediles: [],
      bancadas: [
        { id: "PN", name: "Partido Nacional", email: "partidonacional@juntatreintaytres.gub.uy" },
        { id: "FA", name: "Frente Amplio", email: "frenteamplio@juntatreintaytres.gub.uy" }
      ],
      sources: [
        source("https://juntatreintaytres.gub.uy/?page_id=2632", "Bancada del Partido Nacional"),
        source("https://juntatreintaytres.gub.uy/?page_id=2636", "Bancada del Frente Amplio")
      ],
      formUrl: null,
      extraNote: ""
    }
  ];

  var BY_SLUG = {};
  DEPARTMENTS.forEach(function (dept) {
    BY_SLUG[dept.slug] = dept;
  });

  function signatureLine(nombre, cedula) {
    var name = String(nombre || "").trim();
    var ci = String(cedula || "").trim();
    return name ? name + (ci ? " (C.I. " + ci + ")" : "") + "\n" : "";
  }

  function poolOf(dept) {
    if (dept.mode === "ediles") return dept.ediles.map(function (edil) { return edil.email; });
    if (dept.mode === "bancadas") return dept.bancadas.map(function (bancada) { return bancada.email; });
    return [];
  }

  function buildLinks(mode, to, cc, bcc, subject, body) {
    if (mode === "form" || !to.length) {
      return { mailto: null, gmail: null };
    }
    var toHeader = to.join(",");
    if (mode === "ediles") {
      var bccJoined = bcc.join(",");
      return {
        mailto: "mailto:" + toHeader + "?bcc=" + encodeURIComponent(bccJoined) + "&subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body),
        gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(toHeader) + "&bcc=" + encodeURIComponent(bccJoined) + "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
      };
    }
    if (mode === "bancadas") {
      var ccPart = cc.length ? "cc=" + encodeURIComponent(cc.join(",")) + "&" : "";
      var gmailCc = cc.length ? "&cc=" + encodeURIComponent(cc.join(",")) : "";
      return {
        mailto: "mailto:" + toHeader + "?" + ccPart + "subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body),
        gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(toHeader) + gmailCc + "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
      };
    }
    return {
      mailto: "mailto:" + toHeader + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body),
      gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(toHeader) + "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
    };
  }

  function buildMessage(slug, options) {
    var dept = BY_SLUG[slug];
    if (!dept) throw new Error("Departamento desconocido: " + slug);
    var opts = options || {};
    var sig = signatureLine(opts.nombre, opts.cedula);
    var body = dept.mode === "ediles" ? individualBody(dept.name, sig) : bancadaBody(dept.name, sig);
    var subject = SUBJECT_PREFIX + dept.name;
    var pool = poolOf(dept);
    var allowed = {};
    pool.forEach(function (email) { allowed[email] = true; });
    var selected = opts.selected === undefined
      ? pool.slice()
      : opts.selected.filter(function (email) { return allowed[email]; });
    var cc = dept.mode === "bancadas" ? selected : [];
    var bcc = dept.mode === "ediles" ? selected : [];
    var links = buildLinks(dept.mode, dept.to, cc, bcc, subject, body);
    return {
      slug: dept.slug,
      name: dept.name,
      mode: dept.mode,
      to: dept.to.slice(),
      cc: cc,
      bcc: bcc,
      subject: subject,
      body: body,
      mailto: links.mailto,
      gmail: links.gmail
    };
  }

  function departmentFromLocation(loc) {
    var search = loc && loc.search ? loc.search : "";
    var hash = loc && loc.hash ? loc.hash : "";
    var params = new URLSearchParams(search.charAt(0) === "?" ? search.slice(1) : search);
    var query = String(params.get("d") || "").trim().toLowerCase();
    if (BY_SLUG[query]) return query;
    var hashSlug = String(hash || "").replace(/^#/, "").trim().toLowerCase();
    if (BY_SLUG[hashSlug]) return hashSlug;
    return "montevideo";
  }

  function getDepartment(slug) {
    return BY_SLUG[slug] || null;
  }

  function partyCounts(slug) {
    var dept = BY_SLUG[slug];
    var counts = {};
    (dept.ediles || []).forEach(function (edil) {
      counts[edil.party] = (counts[edil.party] || 0) + 1;
    });
    return counts;
  }

  return {
    DEPARTMENTS: DEPARTMENTS,
    PARTY_LABEL: PARTY_LABEL,
    PARTY_ORDER: PARTY_ORDER,
    buildMessage: buildMessage,
    departmentFromLocation: departmentFromLocation,
    getDepartment: getDepartment,
    partyCounts: partyCounts
  };
});
