/* ===================== Ecos de Prisma: datos =====================
   Juego de hordas original (personajes, mundo y dibujos propios). Todo está en datos:
   para añadir un personaje basta con una entrada en HS_CHARS. */
const HS_EL={
  f:{n:'Fuego',c:'#FF6B3D',ic:'🔥'},a:{n:'Agua',c:'#3FA8FF',ic:'💧'},r:{n:'Rayo',c:'#B57BFF',ic:'⚡'},h:{n:'Hielo',c:'#8BE6FF',ic:'❄️'},
  v:{n:'Viento',c:'#5FE3B2',ic:'🌀'},t:{n:'Tierra',c:'#E3B45F',ic:'⛰️'},x:{n:'Vacío',c:'#F06BC8',ic:'✦'}};
// Reacciones: dos elementos distintos sobre el mismo enemigo (aura de 2,5 s)
const HS_REACT={
  'af':{n:'¡Vapor!',m:1.9},'fh':{n:'¡Deshielo!',m:1.9},'fr':{n:'¡Sobrecarga!',m:1.3,boom:1},'ar':{n:'¡Cadena!',m:1.2,chain:3},
  'ah':{n:'¡Congelar!',m:1.2,freeze:2},'hr':{n:'¡Quiebre!',m:1.3,shred:8}};
const HS_ROLE={dps:'Daño',sub:'Daño secundario',sup:'Apoyo',heal:'Sanación',tank:'Escudo',farsa:'Senda de la Farsa'};
const HS_WEAP={espada:'Espada',mandoble:'Mandoble',lanza:'Lanza',arco:'Arco',cata:'Catalizador',guante:'Guanteletes',naipes:'Naipes'};
/* Personajes. hs=peinado (0 corto, 1 largo, 2 coletas, 3 de punta, 4 moño, 5 capucha, 6 sombrero de bufón, 7 media melena)
   b=básico, s=habilidad (automática), u=definitiva (manual con energía). p=patrón. */
const HS_CHARS=[
  // --- Estrella: la lancera del trueno ---
  {id:'velka',n:'Velka',t:'La Lanza Tronante',el:'r',r:5,role:'dps',w:'lanza',skin:'#F3D7C0',hair:'#E8E4F5',hs:1,eye:'#FFC93C',out:'#2C3550',acc:'#FFC93C',hp:118,atk:1.55,crit:.1,
    b:{p:'thrust',cd:.42,d:14,r:120,combo:5},s:{p:'eye',cd:14,d:18,dur:25},u:{cost:90,p:'judgment',d:260,dur:7},
    pas:'Cada 10 % de recarga de energía de más le da +4 % de daño de rayo.',
    d:'Guardiana de una fortaleza en las nubes. Su orbe de tormenta vigila a quien esté luchando y castiga cada golpe; su tajo final parte la pantalla en dos y la deja en el Modo Tronante.'},
  // --- Senda de la Farsa (escalan con críticos, llenan las Risas) ---
  {id:'pip',n:'Pip Cascabel',t:'Chispa de feria',el:'f',r:4,role:'farsa',w:'naipes',skin:'#FFE0C8',hair:'#FF8A3D',hs:2,eye:'#3A2A1A',out:'#7A2E5C',acc:'#FFD84D',hp:92,atk:1.05,crit:.2,
    b:{p:'shot',cd:.55,d:9,n:2,spd:520,bounce:2},s:{p:'nova',cd:9,d:20,r:110},u:{cost:60,p:'stars',d:40,n:12},perf:'Estrellas de fuego que rebotan por toda la pantalla.',
    pas:'Sus críticos dan el doble de Risas.',d:'Malabarista de un circo ambulante. Lanza naipes encendidos que rebotan de enemigo en enemigo.'},
  {id:'mimo',n:'Mimo Gris',t:'El que no habla',el:'x',r:5,role:'farsa',w:'guante',skin:'#F4F0F0',hair:'#2B2B33',hs:5,eye:'#F06BC8',out:'#3B3550',acc:'#F06BC8',hp:100,atk:1.35,crit:.25,
    b:{p:'arc',cd:.5,d:15,r:80,ang:1.6},s:{p:'mark',cd:11,d:10,n:6},u:{cost:70,p:'erase',d:120},perf:'Borra las balas enemigas y deja a todos débiles al Vacío.',
    pas:'Los enemigos marcados reciben un 15 % más de daño crítico.',d:'Artista callejero que nunca dice nada. Con un gesto, hace desaparecer lo que le estorba.'},
  {id:'dado',n:'Tilo Dados',t:'Apuesta segura',el:'t',r:5,role:'farsa',w:'naipes',skin:'#E8C2A0',hair:'#F2E3A0',hs:7,eye:'#2E7A5A',out:'#2E4A3E',acc:'#E3B45F',hp:120,atk:1.3,crit:.15,
    b:{p:'shot',cd:.6,d:13,n:1,spd:480,pierce:1},s:{p:'shield',cd:12,d:30},u:{cost:70,p:'dice',d:60},perf:'Tira un dado gigante: el daño se multiplica de ×1 a ×6.',
    pas:'Con escudo, +12 % de probabilidad de crítico.',d:'Jugador de un casino flotante. Nunca pierde… o eso dice.'},
  {id:'zuri',n:'Zuri Arlequina',t:'Tajo de colores',el:'v',r:5,role:'farsa',w:'espada',skin:'#F6D2BE',hair:'#5FE3B2',hs:2,eye:'#6A2E8A',out:'#2A2140',acc:'#F06BC8',hp:98,atk:1.45,crit:.22,
    b:{p:'arc',cd:.38,d:11,r:90,ang:2.2},s:{p:'dash',cd:7,d:26},u:{cost:70,p:'slash',d:180},perf:'Un tajo en diagonal que cruza toda la pantalla.',
    pas:'Cada crítico le da +2 % de velocidad (hasta +20 %).',d:'Acróbata de dos espadas. Baila entre los enemigos dejando estelas de viento.'},
  {id:'kel',n:'Kel Bufón',t:'Risa eléctrica',el:'r',r:4,role:'farsa',w:'cata',skin:'#FFDCC2',hair:'#B57BFF',hs:6,eye:'#2B2B33',out:'#3B2A5C',acc:'#FFD84D',hp:90,atk:1.0,crit:.18,
    b:{p:'chain',cd:.7,d:8,n:3},s:{p:'turret',cd:13,d:7,dur:10},u:{cost:60,p:'chainbig',d:30,n:10},perf:'Un rayo que salta diez veces entre enemigos.',
    pas:'Sus cadenas saltan una vez más con críticos.',d:'Bufón de una corte olvidada. Sus chistes chispean, literalmente.'},
  {id:'rison',n:'Maestro Risón',t:'Director de la Gran Función',el:'x',r:5,role:'farsa',w:'cata',skin:'#F2D6C9',hair:'#F7F2E8',hs:4,eye:'#F06BC8',out:'#1F1A2E',acc:'#FFC93C',hp:110,atk:1.2,crit:.2,
    b:{p:'homing',cd:.65,d:10,n:2},s:{p:'buff',cd:15,d:0,dur:8},u:{cost:50,p:'confetti',d:50},perf:'Confeti del Vacío: dobla todas las demás actuaciones.',lead:1,
    pas:'Con él en el equipo: las Risas suben un 30 % más rápido, el personaje activo hace +20 % de daño y la Gran Función dura 3 s más.',d:'Nadie sabe de dónde salió su teatro. Cuando él dirige, todo el equipo actúa.'},
  // --- Fuego ---
  {id:'brasa',n:'Brasa',t:'Espada de la forja',el:'f',r:4,role:'dps',w:'espada',skin:'#E9BC98',hair:'#C23B22',hs:3,eye:'#2B1A10',out:'#5A3A2A',acc:'#FF6B3D',hp:110,atk:1.1,crit:.08,
    b:{p:'arc',cd:.45,d:12,r:85,ang:1.8},s:{p:'nova',cd:8,d:24,r:120},u:{cost:60,p:'spin',d:22,dur:5},pas:'+15 % de daño a enemigos quemados.',d:'Aprendiz de herrera. Su espada sale de la forja todavía al rojo.'},
  {id:'ignis',n:'Ignis',t:'Erudito de la llama',el:'f',r:5,role:'dps',w:'cata',skin:'#F1CDB5',hair:'#3A1F1A',hs:0,eye:'#FF6B3D',out:'#7A1F2A',acc:'#FFC93C',hp:96,atk:1.5,crit:.12,
    b:{p:'homing',cd:.5,d:11,n:2},s:{p:'meteor',cd:9,d:60,r:90},u:{cost:80,p:'rain',d:45,n:14},pas:'Sus meteoros dejan el suelo ardiendo 3 s.',d:'Bibliotecario que leyó demasiados libros de fuego. Hace llover meteoros con un chasquido.'},
  {id:'cendra',n:'Cendra',t:'Ceniza que gira',el:'f',r:4,role:'sub',w:'mandoble',skin:'#D9A684',hair:'#2A2A2A',hs:4,eye:'#FF6B3D',out:'#4A4A55',acc:'#FF6B3D',hp:130,atk:1.0,crit:.06,
    b:{p:'spin',cd:1.1,d:14,r:95},s:{p:'trail',cd:10,d:8,dur:6},u:{cost:70,p:'nova',d:90,r:220},pas:'−15 % de daño recibido mientras gira.',d:'Leñadora de un bosque quemado. Gira su mandoble como una peonza de ascuas.'},
  // --- Agua ---
  {id:'nerea',n:'Nerea',t:'Canción de la marea',el:'a',r:4,role:'heal',w:'cata',skin:'#F7DCCB',hair:'#5BC0EB',hs:1,eye:'#1E5A8A',out:'#F2F6FF',acc:'#3FA8FF',hp:105,atk:.85,crit:.05,
    b:{p:'homing',cd:.7,d:8,n:1},s:{p:'heal',cd:10,d:0,heal:.18},u:{cost:60,p:'healzone',d:6,dur:8,heal:.04},pas:'Cura un 1 % de vida por segundo a todo el equipo.',d:'Cantante de un puerto lejano. Su voz moja… y cura.'},
  {id:'marea',n:'Marea',t:'Arquera de la bahía',el:'a',r:4,role:'sub',w:'arco',skin:'#E2B49A',hair:'#1E3A5F',hs:2,eye:'#3FA8FF',out:'#2E6B8A',acc:'#BFE8FF',hp:98,atk:1.05,crit:.1,
    b:{p:'shot',cd:.5,d:10,n:1,spd:620,pierce:2,charge:4},s:{p:'rain',cd:11,d:14,n:8},u:{cost:70,p:'beam',d:12,dur:3},pas:'Cada 4.º disparo es cargado y atraviesa.',d:'Vigía de faro. No falla un tiro ni con tormenta.'},
  {id:'coral',n:'Coral',t:'Burbujas de mar',el:'a',r:5,role:'dps',w:'cata',skin:'#FBE3D3',hair:'#FF8FB1',hs:4,eye:'#2E6B8A',out:'#3FA8FF',acc:'#FFFFFF',hp:100,atk:1.45,crit:.12,
    b:{p:'orbit',cd:6,d:9,n:3,dur:5},s:{p:'vortex',cd:10,d:6,r:130},u:{cost:80,p:'wave',d:110},pas:'Sus burbujas mojan a los enemigos más tiempo.',d:'Inventora submarina. Sus burbujas giran a su alrededor como satélites.'},
  // --- Rayo ---
  {id:'chispa',n:'Chispa',t:'Arquera eléctrica',el:'r',r:4,role:'sub',w:'arco',skin:'#F0C9A8',hair:'#FFD84D',hs:0,eye:'#5B2A8A',out:'#3B2A5C',acc:'#B57BFF',hp:95,atk:1.05,crit:.1,
    b:{p:'shot',cd:.48,d:9,n:1,spd:640,charge:4},s:{p:'turret',cd:12,d:8,dur:12},u:{cost:60,p:'chainbig',d:26,n:8},pas:'Su torreta aplica rayo dos veces más rápido.',d:'Mensajera que corre con las tormentas. Deja un cuervo eléctrico que dispara por ella.'},
  // --- Hielo ---
  {id:'escarcha',n:'Escarcha',t:'Lanza del norte',el:'h',r:5,role:'dps',w:'lanza',skin:'#F6E6E0',hair:'#DDEBFF',hs:7,eye:'#3FA8FF',out:'#2A3E6B',acc:'#8BE6FF',hp:112,atk:1.45,crit:.12,
    b:{p:'thrust',cd:.45,d:13,r:115,combo:4},s:{p:'nova',cd:9,d:28,r:130,slow:.5},u:{cost:80,p:'slash',d:200},pas:'+20 % de daño a enemigos congelados.',d:'Cazadora de las montañas heladas. Su lanza deja escarcha en el aire.'},
  {id:'nivea',n:'Nívea',t:'Copo silencioso',el:'h',r:4,role:'sup',w:'cata',skin:'#FFF0E8',hair:'#F2F7FF',hs:5,eye:'#5BA8D9',out:'#BFE0FF',acc:'#FFFFFF',hp:100,atk:.95,crit:.06,
    b:{p:'homing',cd:.65,d:8,n:2},s:{p:'buff',cd:14,d:0,dur:8},u:{cost:60,p:'nova',d:60,r:260,slow:.6},pas:'Su ayuda da +20 % de daño de hielo al equipo.',d:'Niña de un pueblo nevado que siempre lleva capucha. Donde pisa, cae nieve.'},
  {id:'glacio',n:'Glacio',t:'Muro de hielo',el:'h',r:4,role:'tank',w:'mandoble',skin:'#D8B399',hair:'#6B8FB5',hs:3,eye:'#1E3A5F',out:'#5A6B80',acc:'#8BE6FF',hp:150,atk:.9,crit:.05,
    b:{p:'arc',cd:.7,d:15,r:90,ang:2},s:{p:'shield',cd:11,d:45},u:{cost:60,p:'taunt',d:40,dur:6},pas:'Con escudo, sus golpes hacen +20 %.',d:'Guardián de un paso de montaña. Nadie ha conseguido pasar.'},
  // --- Viento ---
  {id:'brisa',n:'Brisa',t:'Flecha del valle',el:'v',r:4,role:'sub',w:'arco',skin:'#F4D3B8',hair:'#7BC67E',hs:2,eye:'#2E5A2E',out:'#3E6B3E',acc:'#5FE3B2',hp:94,atk:1.0,crit:.1,
    b:{p:'shot',cd:.45,d:8,n:2,spd:600},s:{p:'vortex',cd:9,d:8,r:120},u:{cost:60,p:'vortexbig',d:14,r:180,dur:5},pas:'Sus remolinos absorben el elemento que tocan.',d:'Pastora con arco. Sus flechas llevan el viento del valle.'},
  {id:'rafaga',n:'Ráfaga',t:'Paso del vendaval',el:'v',r:5,role:'dps',w:'guante',skin:'#E5BC9C',hair:'#1F2A33',hs:3,eye:'#5FE3B2',out:'#1F4A40',acc:'#5FE3B2',hp:108,atk:1.45,crit:.12,
    b:{p:'arc',cd:.32,d:9,r:75,ang:1.8},s:{p:'dash',cd:6,d:30},u:{cost:80,p:'tornado',d:20,dur:6},pas:'Moverse le carga la energía un 30 % más rápido.',d:'Mensajero que nunca camina: corre. Pelea a puñetazos de viento.'},
  // --- Tierra ---
  {id:'roca',n:'Roca',t:'Columna antigua',el:'t',r:5,role:'tank',w:'lanza',skin:'#D2A27E',hair:'#4A3A2A',hs:1,eye:'#E3B45F',out:'#4A3A2A',acc:'#E3B45F',hp:160,atk:1.15,crit:.06,
    b:{p:'thrust',cd:.55,d:13,r:110,combo:4},s:{p:'shield',cd:12,d:60},u:{cost:80,p:'meteor',d:220,r:150,petrify:3},pas:'Su escudo dura el doble y protege a todo el equipo.',d:'Custodio de unas ruinas de piedra. Su escudo de roca es más viejo que el mundo.'},
  {id:'arena',n:'Arena',t:'Constructora del desierto',el:'t',r:4,role:'sup',w:'cata',skin:'#C88E66',hair:'#F2D3A0',hs:4,eye:'#7A4A2A',out:'#B5844A',acc:'#E3B45F',hp:105,atk:.95,crit:.06,
    b:{p:'homing',cd:.65,d:9,n:1},s:{p:'turret',cd:12,d:9,dur:12},u:{cost:60,p:'crystal',d:40},pas:'Sus torretas dejan cristales que dan escudo.',d:'Ingeniera de caravanas. Levanta torres de arena en segundos.'},
  // --- Vacío ---
  {id:'umbra',n:'Umbra',t:'Sombra que estalla',el:'x',r:5,role:'dps',w:'cata',skin:'#E8D2D8',hair:'#5A2A6B',hs:1,eye:'#F06BC8',out:'#2A1A33',acc:'#F06BC8',hp:100,atk:1.45,crit:.1,
    b:{p:'homing',cd:.55,d:8,n:2,dot:1},s:{p:'trail',cd:9,d:10,dur:6},u:{cost:80,p:'detonate',d:30},pas:'Su definitiva hace estallar a la vez todo el daño en el tiempo.',d:'Titiritera de sombras. Lo que toca se va deshaciendo… hasta que chasquea los dedos.'},
  {id:'nox',n:'Nox',t:'Domador de ecos',el:'x',r:4,role:'sub',w:'cata',skin:'#DCC0B0',hair:'#1A1A22',hs:0,eye:'#B57BFF',out:'#33264A',acc:'#B57BFF',hp:100,atk:1.0,crit:.08,
    b:{p:'homing',cd:.6,d:9,n:1},s:{p:'summon',cd:16,d:12,dur:12},u:{cost:70,p:'summonbig',d:20,dur:10},pas:'Su eco ataca un 25 % más rápido.',d:'Chico que encontró un eco perdido y se lo quedó. Ahora lo acompaña a todas partes.'},
];
const HS_BY=Object.fromEntries(HS_CHARS.map(c=>[c.id,c]));
const HS_START=['brasa','nerea','chispa','pip'];
const HS_FEATURED=['velka','rison'];
/* Técnicas: ranuras extra. Solo dispara la activa (Tab para cambiar), salvo con una Resonancia. */
const HS_TECH=[
  {id:'tf1',n:'Lluvia de ascuas',el:'f',p:'rain',cd:3.2,d:14,n2:5,stat:'fuerza',evo:'Diluvio de ascuas'},
  {id:'tf2',n:'Anillo ígneo',el:'f',p:'orbit',cd:5,d:8,n2:3,dur:4,stat:'vigor',evo:'Corona solar'},
  {id:'ta1',n:'Burbuja saltarina',el:'a',p:'shot',cd:1.1,d:10,n2:1,bounce:3,stat:'reflejos',evo:'Géiser rebotón'},
  {id:'ta2',n:'Ola rompiente',el:'a',p:'wave',cd:6,d:30,stat:'armadura',evo:'Maremoto'},
  {id:'tr1',n:'Arco voltaico',el:'r',p:'chain',cd:1.4,d:10,n2:4,stat:'reflejos',evo:'Tormenta en cadena'},
  {id:'tr2',n:'Torre de chispas',el:'r',p:'turret',cd:9,d:8,dur:8,stat:'sintesis',evo:'Faro de tormenta'},
  {id:'th1',n:'Esquirlas',el:'h',p:'shot',cd:.9,d:8,n2:3,spread:1,stat:'fuerza',evo:'Ventisca de esquirlas'},
  {id:'th2',n:'Círculo helado',el:'h',p:'nova',cd:4,d:18,r:120,slow:.5,stat:'vigor',evo:'Invierno eterno'},
  {id:'tv1',n:'Bumerán de aire',el:'v',p:'boomerang',cd:1.6,d:12,stat:'esprint',evo:'Ciclón de ida y vuelta'},
  {id:'tv2',n:'Torbellino',el:'v',p:'vortex',cd:6,d:8,r:120,stat:'iman',evo:'Ojo del huracán'},
  {id:'tt1',n:'Pedrisco',el:'t',p:'meteor',cd:3,d:40,r:80,stat:'fuerza',evo:'Lluvia de montañas'},
  {id:'tt2',n:'Minas de cuarzo',el:'t',p:'mine',cd:2.5,d:35,stat:'armadura',evo:'Campo de geodas'},
  {id:'tx1',n:'Ojo errante',el:'x',p:'homing',cd:1.2,d:10,n2:2,stat:'aprendizaje',evo:'Mirada del vacío'},
  {id:'tx2',n:'Grieta',el:'x',p:'trail',cd:5,d:7,dur:4,stat:'sintesis',evo:'Abismo andante'},
];
const HS_TECHBY=Object.fromEntries(HS_TECH.map(t=>[t.id,t]));
/* Cartas de estadística (se pierden al acabar la partida) */
const HS_STATS={
  fuerza:{n:'Fuerza',d:'+12 % de daño',ic:'💪',f:M=>M.dmg+=.12},vigor:{n:'Vigor',d:'+15 % de vida máxima',ic:'❤️',f:M=>M.hp+=.15},
  reflejos:{n:'Reflejos',d:'−8 % de enfriamientos',ic:'⏱️',f:M=>M.cd*=.92},esprint:{n:'Esprint',d:'+8 % de velocidad',ic:'👟',f:M=>M.spd+=.08},
  armadura:{n:'Armadura',d:'−8 % de daño recibido',ic:'🛡️',f:M=>M.armor*=.92},sintesis:{n:'Síntesis',d:'+0,6 % de vida por segundo',ic:'🌿',f:M=>M.regen+=.006},
  iman:{n:'Imán',d:'+35 % de radio para recoger',ic:'🧲',f:M=>M.magnet+=.35},aprendizaje:{n:'Aprendizaje',d:'+12 % de experiencia',ic:'📘',f:M=>M.xp+=.12},
  critico:{n:'Ojo crítico',d:'+5 % de probabilidad de crítico y +12 % de daño crítico',ic:'🎯',f:M=>{M.crit+=.05;M.cdmg+=.12;}},
  recarga:{n:'Recarga',d:'+15 % de energía',ic:'🔋',f:M=>M.er+=.15},maestria:{n:'Maestría',d:'+20 % de daño de reacciones',ic:'🧪',f:M=>M.em+=.2}};
/* Reliquias (1 por partida; la sueltan jefes y cofres) */
const HS_RELIC=[
  {id:'emblema',n:'Emblema del Hilo Cortado',d:'+25 % de daño de definitiva',f:M=>M.ult+=.25},
  {id:'brasero',n:'Brasero de la bruja',d:'+20 % de daño de fuego y de reacciones',f:M=>{M.elb.f+=.2;M.em+=.2;}},
  {id:'gladius',n:'Gladius del coliseo',d:'+18 % de daño y +30 % cuerpo a cuerpo',f:M=>{M.dmg+=.18;M.melee+=.3;}},
  {id:'luna',n:'Luna del cazador',d:'+30 % de daño crítico',f:M=>M.cdmg+=.3},
  {id:'mapa',n:'Mapa del viajero',d:'+30 % de experiencia',f:M=>M.xp+=.3},
  {id:'panecillo',n:'Panecillo del camino',d:'+1,2 % de vida por segundo',f:M=>M.regen+=.012},
  {id:'pluma',n:'Pluma de ave fénix',d:'Sobrevives a un golpe mortal (cada 60 s)',f:M=>M.phoenix=1},
  {id:'corona',n:'Corona del sabio',d:'+40 % de daño, pero −20 % de vida',f:M=>{M.dmg+=.4;M.hpCut=1;}},
  {id:'cuerno',n:'Cuerno de cazadora',d:'−20 % de enfriamientos',f:M=>M.cd*=.8},
  {id:'moneda',n:'Moneda del gremio',d:'+50 % de lumen al terminar',f:M=>M.gold+=.5},
  {id:'coraza',n:'Coraza del tren',d:'−20 % de daño recibido',f:M=>M.armor*=.8},
  {id:'dadosr',n:'Dados de la Farsa',d:'Cada 10 s, un efecto al azar (curación, energía, Risas o daño)',f:M=>M.dice=1},
];
const HS_RELBY=Object.fromEntries(HS_RELIC.map(r=>[r.id,r]));
/* Biomas: cambian cada 4 minutos */
const HS_BIOME=[
  {n:'Pradera de los Molinos',g:'#4E7A3E',g2:'#5C8A48',d:['#3E6B2E','#8FBF5A','#F2E3A0'],deco:'tree'},
  {n:'Puerto de Jade',g:'#6B6B55',g2:'#7A7A62',d:['#4FA88A','#B5B59A','#2E5A4A'],deco:'rock'},
  {n:'Isla de las Tormentas',g:'#3E3A55',g2:'#48446A',d:['#B57BFF','#6B5A8A','#E8E4F5'],deco:'crystal',el:'r'},
  {n:'Selva de las Setas',g:'#2E5A3A',g2:'#356A44',d:['#FF8FB1','#7BC67E','#F2F2C0'],deco:'shroom'},
  {n:'Canales de Ópalo',g:'#3E5F7A',g2:'#4A6B88',d:['#8BD3FF','#2E4A6B','#F2F6FF'],deco:'water',el:'a'},
  {n:'Volcán de Ceniza',g:'#4A2E2A',g2:'#5A3530',d:['#FF6B3D','#2A1A1A','#FFC93C'],deco:'lava',el:'f'},
  {n:'Tundra de Cristal',g:'#B9CCE0',g2:'#C8D8EA',d:['#FFFFFF','#8BB5D9','#5A7A9A'],deco:'ice',el:'h'},
  {n:'Teatro del Vacío',g:'#2A1F3A',g2:'#33264A',d:['#F06BC8','#FFC93C','#5A4A7A'],deco:'cards',el:'x'},
];
/* Clima: desde el minuto 2, 18 % por minuto, dura 60 s */
const HS_WEATHER={
  sol:{n:'Sol abrasador',m:{f:1.5,a:.6}},lluvia:{n:'Lluvia',m:{a:1.5,r:1.2,f:.6},wet:1},tormenta:{n:'Tormenta',m:{r:1.3},bolts:1},
  arena:{n:'Tormenta de arena',m:{t:1.3},sand:1},nieve:{n:'Nevada',m:{h:1.5},slow:.1},niebla:{n:'Niebla del sueño',m:{x:1.3},fog:1}};
/* Enemigos normales (por fase) y roles */
const HS_FOES=[
  {id:'slime',n:'Gota',hp:12,spd:62,dmg:7,r:13,shape:'slime'},
  {id:'imp',n:'Diablillo',hp:16,spd:80,dmg:8,r:12,shape:'imp'},
  {id:'bat',n:'Murciélago de humo',hp:9,spd:118,dmg:6,r:10,shape:'bat',role:'runner'},
  {id:'golem',n:'Golem de cantos',hp:44,spd:44,dmg:14,r:18,shape:'golem'},
  {id:'drone',n:'Dron oxidado',hp:20,spd:70,dmg:8,r:12,shape:'drone',role:'shooter'},
  {id:'mage',n:'Brujo encapuchado',hp:26,spd:52,dmg:9,r:13,shape:'mage',role:'healer'},
  {id:'warden',n:'Escudero rúnico',hp:34,spd:50,dmg:10,r:14,shape:'warden',role:'shielder'},
  {id:'bomb',n:'Bomba con patas',hp:14,spd:90,dmg:24,r:12,shape:'bomb',role:'bomber'},
  {id:'caller',n:'Chamán de máscaras',hp:30,spd:46,dmg:9,r:14,shape:'mage',role:'summoner'},
];
/* Jefes: [minuto, vida, ...] con barra de dureza y debilidades */
const HS_BOSS=[
  {at:180,id:'musgo',n:'Coloso de Musgo',el:'t',hp:1400,tough:80,weak:['f','v'],r:46,col:'#5C8A48',col2:'#3E6B2E',shape:'golem',atk:['slam','charge']},
  {at:360,id:'centinela',n:'Autómata Centinela',el:'r',hp:3200,tough:110,weak:['a','t'],r:44,col:'#6B6B80',col2:'#B57BFF',shape:'drone',atk:['laser','ring']},
  {at:540,id:'heraldo',n:'Heraldo de Escarcha',el:'h',hp:5600,tough:130,weak:['f','x'],r:42,col:'#BFE0FF',col2:'#3FA8FF',shape:'mage',atk:['shards','slam','ring']},
  {at:720,id:'sierpe',n:'Sierpe de las Mareas',el:'a',hp:9000,tough:150,weak:['r','h'],r:50,col:'#2E6B8A',col2:'#8BD3FF',shape:'serpent',atk:['wave','charge','ring']},
  {at:900,id:'fenix',n:'Fénix Ceniciento',el:'f',hp:16000,tough:180,weak:['a','h','x'],r:52,col:'#FF6B3D',col2:'#FFC93C',shape:'bird',atk:['ring','charge','rainf','laser'],final:1},
];
/* Guardianes de los portales: arena de 2 minutos, uno por elemento */
const HS_GUARD={
  f:{n:'Guardiana de la Fragua',hp:5200,col:'#FF6B3D',col2:'#FFC93C',hz:'lava',shape:'bird'},
  a:{n:'Dama del Lago',hp:5200,col:'#3FA8FF',col2:'#BFE8FF',hz:'water',shape:'serpent'},
  r:{n:'Juez del Relámpago',hp:5200,col:'#B57BFF',col2:'#FFC93C',hz:'shock',shape:'drone'},
  h:{n:'Reina del Glaciar',hp:5200,col:'#8BE6FF',col2:'#FFFFFF',hz:'ice',shape:'mage'},
  v:{n:'Ala del Vendaval',hp:5200,col:'#5FE3B2',col2:'#FFFFFF',hz:'wind',shape:'bird'},
  t:{n:'Coloso del Jade',hp:5200,col:'#E3B45F',col2:'#4FA88A',hz:'quake',shape:'golem'},
  x:{n:'El Director Vacío',hp:5200,col:'#F06BC8',col2:'#FFC93C',hz:'void',shape:'mask'}};
/* Mejoras permanentes por personaje: [nombre, texto, rangos, coste base] */
const HS_UPG={
  vit:['Vitalidad','+8 de vida',10,60],fue:['Fuerza','+4 % de daño',10,80],zan:['Zancada','+3 % de velocidad',8,70],ref:['Reflejos','−3 % de enfriamientos',8,90],
  arm:['Armadura','−2 % de daño recibido',8,80],sin:['Síntesis','+0,2 % de vida por segundo',5,120],ima:['Imán','+12 % de radio',6,50],sab:['Sabiduría','+5 % de experiencia',8,100],
  for:['Fortuna','+8 % de lumen',8,120],cri:['Precisión','+3 % de crítico',10,90],rec:['Recarga','+4 % de energía',8,90]};
const HS_GUPG={form:['Apoyos veloces','Los ataques extra de tus apoyos llegan un 20 % antes',1,1500],reroll:['Volver a tirar','+1 cambio de cartas por partida',5,150],veto:['Vetar','+1 veto de cartas por partida',3,300],tech:['Técnica inicial','Empiezas con una técnica al azar',1,400]};
const HS_TIPS=['Llevas a 1 personaje principal. Tus 2 apoyos no se manejan: te dan un pasivo y de vez en cuando aparecen y atacan.','Espacio lanza la definitiva del personaje activo cuando su energía está llena.',
  'Mezcla elementos: fuego + agua = Vapor, agua + hielo = Congelar, rayo + fuego = Sobrecarga.','Golpea a jefes y élites con su debilidad para romper su barra de dureza.',
  'Con alguien de la Farsa en el equipo, los críticos llenan las Risas. A 100, pulsa R.','Tab cambia la técnica activa. Solo dispara una… salvo que tengas una Resonancia.',
  'Quédate al lado de un cofre para abrirlo.','Entra en los portales morados: si vences al guardián, consigues una Resonancia.'];

/* Pasivo de cada personaje cuando va de apoyo (según su papel) */
const HS_SUPP={
  dps:{d:'+12 % de daño',f:(M)=>{M.dmg+=.12;}},
  sub:{d:'−10 % de enfriamientos',f:(M)=>{M.cd*=.9;}},
  sup:{d:'+20 % de daño de su elemento y +8 % de daño',f:(M,c)=>{M.elb[c.el]+=.2;M.dmg+=.08;}},
  heal:{d:'Cura un 1,2 % de vida por segundo',f:(M)=>{M.regen+=.012;}},
  tank:{d:'−15 % de daño recibido',f:(M)=>{M.armor*=.85;}},
  farsa:{d:'+6 % de crítico y activa las Risas (Gran Función)',f:(M)=>{M.crit+=.06;}}};
const HS_SUPPX={velka:'Su ataque extra deja el orbe de tormenta sobre ti',rison:'Además dirige la Gran Función: Risas +30 % y +20 % de daño',nerea:'Su ataque extra cura a tu personaje',roca:'Su ataque extra te pone un escudo enorme',glacio:'Su ataque extra te pone un escudo',dado:'Su ataque extra te pone un escudo'};
