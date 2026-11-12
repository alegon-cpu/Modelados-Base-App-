/* Banco de preguntas del quiz de cultura. Formato: pregunta|correcta|incorrecta1|incorrecta2|incorrecta3 */
const QZ=[];
QZ.push(['Programación',`
¿Qué palabra reservada de Java se usa para crear un objeto?|new|create|make|object
¿Qué tipo primitivo de Java guarda verdadero o falso?|boolean|bit|bool|logic
¿Cuántos bits ocupa un int en Java?|32|16|64|8
¿Cuántos bits ocupa un long en Java?|64|32|128|16
¿Cuántos bits ocupa un byte en Java?|8|16|4|32
¿Qué método es el punto de entrada de un programa Java?|main|start|run|init
¿Qué operador de Java compara si dos valores primitivos son iguales?|==|=|===|equals
¿Qué método se usa para comparar el contenido de dos String en Java?|equals|==|compare|same
¿Qué palabra clave de Java indica que una clase hereda de otra?|extends|implements|inherits|super
¿Qué palabra clave de Java indica que una clase cumple una interfaz?|implements|extends|uses|interface
¿Qué palabra clave hace que una variable de Java no se pueda cambiar después de asignarla?|final|static|const|private
¿Qué palabra clave de Java hace que un atributo sea de la clase y no de cada objeto?|static|final|global|shared
¿Qué modificador de acceso hace que algo solo se vea dentro de su propia clase?|private|protected|public|internal
¿Cuál es el índice del primer elemento de un array en Java?|0|1|-1|Depende del tamaño
¿Qué excepción salta en Java al acceder a una posición que no existe de un array?|ArrayIndexOutOfBoundsException|NullPointerException|ArithmeticException|ClassCastException
¿Qué excepción salta en Java al usar un objeto que vale null?|NullPointerException|IllegalStateException|NoSuchElementException|NumberFormatException
¿Qué excepción salta en Java al dividir un entero entre cero?|ArithmeticException|ZeroDivisionError|NumberFormatException|IOException
¿Qué excepción lanza Integer.parseInt("hola")?|NumberFormatException|ParseException|ClassCastException|InputMismatchException
¿Qué bloque de Java se ejecuta siempre, haya excepción o no?|finally|catch|always|end
¿Qué palabra clave se usa para lanzar una excepción en Java?|throw|throws|raise|catch
¿Qué palabra clave declara en un método que puede lanzar una excepción?|throws|throw|raises|catches
¿Qué devuelve 7 / 2 en Java si los dos son int?|3|3.5|4|Da error
¿Qué devuelve 7 % 3 en Java?|1|2|0|2.33
¿Qué clase de Java se usa normalmente para leer del teclado?|Scanner|Reader|Keyboard|Input
¿Qué método de String devuelve su número de caracteres?|length()|size()|count()|getLength()
¿Qué método de un ArrayList devuelve cuántos elementos tiene?|size()|length()|count()|length
¿Qué método de String pasa todas las letras a mayúsculas?|toUpperCase()|upper()|toCapital()|capitalize()
¿Qué estructura de control repite un bloque mientras se cumple una condición?|while|if|switch|break
¿Qué bucle se ejecuta al menos una vez aunque la condición sea falsa?|do-while|while|for|for-each
¿Qué instrucción sale inmediatamente de un bucle?|break|continue|return|exit
¿Qué instrucción salta a la siguiente vuelta del bucle?|continue|break|next|skip
¿Qué es la sobrecarga de métodos?|Varios métodos con el mismo nombre y distintos parámetros|Un método que se llama a sí mismo|Cambiar un método heredado|Un método demasiado largo
¿Qué es la sobrescritura (override)?|Redefinir en la subclase un método heredado|Tener dos métodos con el mismo nombre en la misma clase|Borrar un método|Llamar a un método estático
¿Qué anotación de Java indica que un método sobrescribe a otro?|@Override|@Overload|@Super|@Inherit
¿Qué es un constructor?|Un método especial que inicializa el objeto al crearlo|Un método que destruye objetos|Una variable de clase|Un tipo de bucle
¿Qué nombre debe tener el constructor de una clase Java?|El mismo que la clase|init|constructor|new
¿Qué palabra clave se refiere al propio objeto dentro de un método?|this|self|me|super
¿Qué palabra clave llama al constructor de la clase padre?|super|parent|base|this
¿Qué es una clase abstracta?|Una clase que no se puede instanciar directamente|Una clase sin atributos|Una clase con solo métodos estáticos|Una clase privada
¿De cuántas clases puede heredar directamente una clase en Java?|De una|De dos|De las que quieras|De ninguna
¿Cuántas interfaces puede implementar una clase en Java?|Las que quiera|Solo una|Como mucho dos|Ninguna
¿Cómo se llama el principio de ocultar los atributos y acceder con getters y setters?|Encapsulación|Herencia|Polimorfismo|Recursividad
¿Cómo se llama la capacidad de un objeto de comportarse como su clase padre?|Polimorfismo|Encapsulación|Abstracción|Compilación
¿Qué es la recursividad?|Una función que se llama a sí misma|Un bucle infinito|Una variable global|Un tipo de dato
¿De qué clase heredan todas las clases de Java?|Object|Class|Main|Base
¿Qué hace el recolector de basura (garbage collector) de Java?|Libera la memoria de objetos que ya no se usan|Borra archivos temporales|Elimina variables final|Comprime el código
¿Qué genera el compilador javac a partir del código .java?|Bytecode (.class)|Un .exe|Código máquina directo|Un .jar siempre
¿Qué programa ejecuta el bytecode de Java?|La máquina virtual de Java (JVM)|El compilador javac|El sistema BIOS|El navegador
¿Qué significa JDK?|Java Development Kit|Java Data Key|Java Design Kernel|Just Develop Kit
¿Qué NO se puede hacer solo con el JRE, sin el JDK?|Compilar programas|Ejecutar programas|Usar la JVM|Cargar clases
¿Qué colección de Java no permite elementos repetidos?|Set|List|ArrayList|Array
¿Qué colección de Java guarda pares clave-valor?|Map|List|Set|Queue
¿Qué método de un HashMap obtiene el valor de una clave?|get()|find()|value()|search()
¿Qué tipo de Java guarda texto?|String|char|Text|Word
¿Qué tipo de Java guarda un único carácter?|char|String|byte|letter
¿Con qué comillas se escribe un char en Java?|Simples ('a')|Dobles ("a")|Corchetes ([a])|Sin comillas
¿Qué hace el operador ++ sobre una variable?|Le suma 1|La multiplica por 2|Le suma 2|La pone a 0
¿Qué operador lógico significa «Y» en Java?|&&|and|+|=>
¿Qué operador lógico significa «NO» en Java?|!|~|not|<>
¿Qué devuelve "Hola".charAt(0)?|'H'|'o'|"Hola"|0
¿Qué devuelve "programa".substring(0, 3)?|"pro"|"prog"|"ram"|"gra"
¿Qué método de Math devuelve el mayor de dos números?|Math.max()|Math.big()|Math.top()|Math.upper()
¿Qué devuelve Math.round(2.5) en Java?|3|2|2.5|Da error
¿Qué devuelve Math.sqrt(16)?|4.0|8.0|256.0|2.0
¿Qué hace System.out.println?|Escribe en la consola y salta de línea|Lee del teclado|Imprime en papel|Guarda un archivo
¿Qué es un IDE?|Un entorno de desarrollo integrado|Un lenguaje de programación|Un sistema operativo|Un tipo de base de datos
¿Cuál de estos es un IDE?|IntelliJ IDEA|MySQL|Apache|Linux
¿Cuál de estos lenguajes es compilado a código máquina normalmente?|C|JavaScript|Python|PHP
¿Qué lenguaje se ejecuta en el navegador de forma nativa?|JavaScript|Java|C++|Python
¿Java y JavaScript son el mismo lenguaje?|No, son lenguajes distintos|Sí, son el mismo|JavaScript es la versión nueva de Java|Java es una librería de JavaScript
¿En qué año apareció la primera versión pública de Java?|1995|1985|2000|1991
¿Qué empresa creó Java originalmente?|Sun Microsystems|Microsoft|IBM|Google
¿Qué empresa es la dueña de Java desde 2010?|Oracle|Sun Microsystems|Microsoft|Google
¿Qué es un algoritmo?|Una secuencia de pasos para resolver un problema|Un tipo de ordenador|Un lenguaje de programación|Un error del programa
¿Cómo se llama un error que impide compilar el programa?|Error de sintaxis|Error lógico|Excepción en ejecución|Warning
¿Qué es un bug?|Un fallo en un programa|Un virus|Un tipo de variable|Un comentario
¿Qué símbolo inicia un comentario de una línea en Java?|//|#|--|/*
¿Cómo se escribe un comentario de varias líneas en Java?|/* ... */|<!-- ... -->|# ... #|// ... //
¿Qué convención se usa para nombrar variables en Java?|camelCase|snake_case|MAYÚSCULAS|kebab-case
¿Cómo se suelen escribir las constantes en Java?|EN_MAYÚSCULAS|enMinusculas|camelCase|Con un guion delante
¿Qué es un casting?|Convertir un valor de un tipo a otro|Copiar un objeto|Borrar una variable|Un tipo de bucle
¿Qué ocurre al hacer (int) 3.9 en Java?|Da 3|Da 4|Da 3.9|Da error
¿Qué es un array?|Una colección de elementos del mismo tipo con tamaño fijo|Una lista que crece sola|Un tipo de clase abstracta|Una base de datos
¿Cómo se obtiene el tamaño de un array en Java?|array.length|array.size()|array.length()|array.count
¿Qué algoritmo de ordenación compara elementos vecinos y los intercambia?|Burbuja|Búsqueda binaria|Quicksort|Dijkstra
¿Qué necesita una lista para poder usar búsqueda binaria?|Estar ordenada|Tener números pares|Ser un Set|No tener nulos
¿Qué significa POO?|Programación orientada a objetos|Programación de objetos ocultos|Proceso de orden óptimo|Protocolo orientado a objetos
¿Qué es un objeto en POO?|Una instancia de una clase|Un archivo .java|Un método estático|Un tipo primitivo
¿Qué es una interfaz en Java?|Un contrato con métodos que una clase debe implementar|Una ventana gráfica|Una clase con atributos públicos|Un paquete de clases
¿Qué palabra se usa en Java para agrupar clases en carpetas lógicas?|package|module|folder|namespace
¿Qué palabra se usa para usar una clase de otro paquete?|import|include|using|require
¿Qué es un getter?|Un método que devuelve el valor de un atributo|Un método que cambia un atributo|Un constructor|Un tipo de excepción
¿Qué valor por defecto tiene un atributo int no inicializado en un objeto Java?|0|null|-1|No compila
¿Qué valor por defecto tiene un atributo String no inicializado en un objeto Java?|null|""|"null"|0
¿Qué es un enum en Java?|Un tipo con un conjunto fijo de constantes|Una lista dinámica|Un número aleatorio|Un bucle
¿Qué estructura elige un caso según el valor de una variable?|switch|while|for|try
¿Qué hace la sentencia return?|Devuelve un valor y termina el método|Repite el método|Imprime un valor|Crea una variable
¿Qué tipo de retorno tiene un método que no devuelve nada?|void|null|empty|none
¿Qué es la complejidad O(n)?|El tiempo crece en proporción al número de elementos|El tiempo es siempre el mismo|El tiempo crece al cuadrado|El programa no termina
¿Qué es depurar (debug) un programa?|Buscar y corregir errores|Borrar el código|Compilarlo|Publicarlo
`]);
QZ.push(['Lenguajes de marcas y web',`
¿Qué significa HTML?|HyperText Markup Language|High Tech Modern Language|Hyper Transfer Main Link|Home Tool Markup Language
¿Qué significa CSS?|Cascading Style Sheets|Computer Style System|Creative Style Sheets|Colorful Sheet Styles
¿Qué etiqueta HTML crea un enlace?|<a>|<link>|<href>|<url>
¿Qué atributo de <a> indica a dónde lleva el enlace?|href|src|link|url
¿Qué etiqueta HTML inserta una imagen?|<img>|<image>|<pic>|<src>
¿Qué atributo de <img> es el texto alternativo para quien no ve la imagen?|alt|title|desc|text
¿Qué etiqueta es el título más importante de una página?|<h1>|<h6>|<head>|<title>
¿Dónde va la etiqueta <title> en un documento HTML?|Dentro de <head>|Dentro de <body>|Antes de <html>|Dentro de <footer>
¿Qué etiqueta crea una lista no ordenada (con viñetas)?|<ul>|<ol>|<li>|<list>
¿Qué etiqueta crea una lista numerada?|<ol>|<ul>|<dl>|<nl>
¿Qué etiqueta es cada elemento de una lista?|<li>|<it>|<le>|<item>
¿Qué etiqueta crea una fila en una tabla HTML?|<tr>|<td>|<th>|<row>
¿Qué etiqueta es una celda de encabezado en una tabla?|<th>|<td>|<thead>|<head>
¿Qué etiqueta HTML hace un salto de línea?|<br>|<lb>|<break>|<hr>
¿Qué etiqueta dibuja una línea horizontal?|<hr>|<line>|<br>|<hl>
¿Qué declaración va al principio de un documento HTML5?|<!DOCTYPE html>|<html5>|<?xml?>|<head>
¿Qué etiqueta HTML5 se usa para el pie de la página?|<footer>|<bottom>|<end>|<foot>
¿Qué etiqueta HTML5 agrupa la navegación principal?|<nav>|<menu>|<links>|<navigation>
¿Qué etiqueta se usa para crear un formulario?|<form>|<input>|<fieldset>|<submit>
¿Qué atributo de <form> indica a dónde se envían los datos?|action|method|target|href
¿Qué tipo de <input> oculta lo que se escribe?|password|hidden|secret|text
¿Qué etiqueta se usa para un desplegable de opciones?|<select>|<dropdown>|<list>|<option>
¿Qué etiqueta crea un área de texto de varias líneas?|<textarea>|<input type="lines">|<text>|<multiline>
¿Qué método HTTP envía los datos de un formulario dentro de la URL?|GET|POST|PUT|DELETE
¿Qué atributo da un identificador único a un elemento HTML?|id|class|name|key
¿Qué selector CSS selecciona por clase?|.nombre|#nombre|*nombre|&nombre
¿Qué selector CSS selecciona por id?|#nombre|.nombre|@nombre|$nombre
¿Qué propiedad CSS cambia el color del texto?|color|font-color|text-color|foreground
¿Qué propiedad CSS cambia el color de fondo?|background-color|bgcolor|color-back|fill
¿Qué propiedad CSS cambia el tamaño de la letra?|font-size|text-size|size|font-weight
¿Qué propiedad CSS pone la letra en negrita?|font-weight|font-bold|text-style|bold
¿Qué propiedad CSS es el espacio interior entre el borde y el contenido?|padding|margin|border|spacing
¿Qué propiedad CSS es el espacio exterior alrededor del borde?|margin|padding|outline|gap
¿Qué valor de display coloca los hijos en fila o columna flexible?|flex|block|inline|table
¿Qué valor de display crea una cuadrícula?|grid|flex|table|matrix
¿Qué propiedad de flexbox centra los elementos en el eje principal?|justify-content|align-items|text-align|place-self
¿Qué valor de position fija un elemento a la ventana aunque hagas scroll?|fixed|absolute|relative|static
¿Qué hace la regla @media en CSS?|Aplica estilos según el tamaño o tipo de pantalla|Importa imágenes|Reproduce vídeo|Carga fuentes
¿Qué unidad de CSS es relativa al tamaño de letra del elemento raíz?|rem|px|cm|pt
¿Qué unidad CSS equivale al 1 % del ancho de la ventana?|vw|vh|%|em
¿Qué propiedad CSS redondea las esquinas?|border-radius|corner|round|border-curve
¿Qué significa la «C» de CSS (Cascading)?|Que los estilos se aplican en cascada según prioridad|Que solo hay un estilo|Que se ejecuta en un servidor|Que va comprimido
¿Qué tiene más prioridad en CSS?|Un selector de id|Un selector de clase|Un selector de etiqueta|Todos igual
¿Qué palabra hace que una regla CSS gane casi siempre?|!important|!force|@priority|#top
¿Qué etiqueta enlaza una hoja de estilos externa en HTML?|<link>|<style>|<css>|<script>
¿Qué etiqueta incluye código JavaScript en HTML?|<script>|<js>|<code>|<java>
¿Qué significa XML?|eXtensible Markup Language|eXtra Modern Language|eXecutable Machine Language|eXternal Markup Link
¿Cuántos elementos raíz puede tener un documento XML bien formado?|Uno|Dos|Los que quieras|Ninguno
¿Es XML sensible a mayúsculas y minúsculas?|Sí|No|Solo en atributos|Solo en el prólogo
¿Qué sirve para validar la estructura de un XML?|Un DTD o un XSD|Un CSS|Un JSON|Un HTML
¿Qué lenguaje se usa para seleccionar nodos dentro de un XML?|XPath|SQL|CSS|Regex
¿Qué lenguaje transforma XML en otro formato, como HTML?|XSLT|XPath|DTD|JSON
¿Qué significa JSON?|JavaScript Object Notation|Java Standard Object Network|JavaScript Online Node|Joint Syntax Object Name
¿Con qué símbolos se escribe un objeto en JSON?|Llaves { }|Corchetes [ ]|Paréntesis ( )|Ángulos < >
¿Con qué símbolos se escribe un array en JSON?|Corchetes [ ]|Llaves { }|Paréntesis ( )|Comillas " "
¿Qué comillas son obligatorias en las claves de JSON?|Dobles|Simples|Ninguna|Invertidas
¿Cómo se llama un elemento XML como <br/>, que no tiene contenido?|Elemento vacío|Comentario|Atributo|Entidad
¿Cómo se escribe un comentario en HTML?|<!-- comentario -->|// comentario|/* comentario */|# comentario
¿Qué entidad HTML representa el símbolo <?|&lt;|&gt;|&amp;|&less;
¿Qué entidad HTML representa el símbolo &?|&amp;|&and;|&et;|&a;
¿Qué significa URL?|Uniform Resource Locator|Universal Remote Link|Unique Resource List|User Request Line
¿Qué significa HTTP?|HyperText Transfer Protocol|High Transfer Text Process|Hyper Tool Transport Program|Home Text Transfer Protocol
¿Qué añade HTTPS respecto a HTTP?|Cifrado de la conexión|Más velocidad siempre|Imágenes|Correo electrónico
¿Qué código de estado HTTP significa «no encontrado»?|404|200|500|301
¿Qué código HTTP significa que todo ha ido bien?|200|404|302|503
¿Qué código HTTP indica un error interno del servidor?|500|404|200|201
¿Qué código HTTP indica una redirección permanente?|301|200|403|500
¿Qué código HTTP significa «prohibido»?|403|401|404|418
¿Qué palabra de JavaScript declara una variable que no se puede reasignar?|const|let|var|static
¿Qué método de JavaScript muestra un mensaje en la consola?|console.log()|print()|echo()|System.out.println()
¿Qué devuelve typeof [] en JavaScript?|"object"|"array"|"list"|"undefined"
¿Qué operador de JavaScript compara valor y tipo a la vez?|===|==|=|!=
¿Qué es el DOM?|La representación en árbol de la página que JavaScript puede modificar|Un servidor web|Un lenguaje de estilos|Un tipo de base de datos
¿Qué método obtiene un elemento por su id en JavaScript?|document.getElementById()|document.id()|getId()|document.find()
¿Qué es un navegador web?|Un programa para ver páginas web|Un servidor|Un lenguaje|Un protocolo
¿Qué hace un servidor web como Apache?|Sirve páginas web a los navegadores|Diseña páginas|Compila Java|Gestiona el correo
¿Qué es el frontend?|La parte de una web que ve y usa el usuario|La base de datos|El servidor|El sistema operativo
¿Qué es el backend?|La parte del servidor que procesa datos y lógica|Los colores de la web|El navegador|El HTML
¿Qué lenguaje de servidor se usa mucho junto a MySQL en webs clásicas?|PHP|CSS|HTML|XML
¿Qué es un framework?|Un conjunto de herramientas y reglas para programar más rápido|Un virus|Un tipo de ordenador|Un protocolo de red
¿Cuál de estos es un framework o librería de JavaScript para interfaces?|React|Django|Laravel|Spring
¿Qué significa responsive en diseño web?|Que se adapta a distintos tamaños de pantalla|Que carga rápido|Que tiene animaciones|Que usa JavaScript
¿Qué es la accesibilidad web?|Que la web la puedan usar también personas con discapacidad|Que la web sea gratis|Que tenga contraseña|Que funcione sin internet
¿Qué es un dominio, como ejemplo.com?|El nombre fácil de recordar de una web|La dirección IP del usuario|Un lenguaje de programación|Un tipo de cable
¿Qué es una cookie?|Un pequeño dato que la web guarda en el navegador|Un virus|Una imagen|Un tipo de servidor
¿Qué etiqueta HTML5 se usa para insertar un vídeo?|<video>|<movie>|<media>|<embed-video>
¿Qué etiqueta agrupa elementos en bloque sin significado especial?|<div>|<span>|<section>|<p>
¿Qué etiqueta agrupa texto en línea sin significado especial?|<span>|<div>|<p>|<block>
¿Qué etiqueta crea un párrafo?|<p>|<par>|<text>|<br>
¿Qué atributo de HTML abre un enlace en una pestaña nueva?|target="_blank"|new="tab"|open="new"|href="_new"
¿Qué propiedad CSS oculta un elemento sin dejar hueco?|display: none|visibility: hidden|opacity: 0|hidden: true
¿Qué propiedad CSS hace un elemento transparente?|opacity|transparent|alpha|visible
¿Qué propiedad CSS controla qué elemento queda encima de otro?|z-index|layer|stack|top
¿Qué es un validador del W3C?|Una herramienta que revisa si tu HTML o CSS cumple el estándar|Un antivirus|Un navegador|Un editor
¿Qué organización crea los estándares de la web como HTML y CSS?|W3C|ISO|IEEE|ONU
¿Quién inventó la World Wide Web?|Tim Berners-Lee|Bill Gates|Steve Jobs|Linus Torvalds
¿En qué centro de investigación nació la web?|CERN|NASA|MIT|Bell Labs
`]);
QZ.push(['Bases de datos',`
¿Qué significa SQL?|Structured Query Language|Simple Question Language|System Quality Logic|Standard Queue List
¿Qué sentencia SQL lee datos de una tabla?|SELECT|GET|READ|FETCH
¿Qué sentencia SQL añade filas a una tabla?|INSERT|ADD|PUT|APPEND
¿Qué sentencia SQL modifica filas existentes?|UPDATE|MODIFY|CHANGE|ALTER
¿Qué sentencia SQL borra filas de una tabla?|DELETE|DROP|REMOVE|ERASE
¿Qué sentencia SQL borra una tabla entera, con su estructura?|DROP TABLE|DELETE TABLE|REMOVE TABLE|CLEAR TABLE
¿Qué sentencia cambia la estructura de una tabla, por ejemplo añadir una columna?|ALTER TABLE|UPDATE TABLE|MODIFY TABLE|CHANGE TABLE
¿Qué cláusula filtra filas en un SELECT?|WHERE|HAVING|FILTER|WHEN
¿Qué cláusula ordena el resultado de un SELECT?|ORDER BY|SORT BY|GROUP BY|ARRANGE
¿Qué palabra ordena de mayor a menor en ORDER BY?|DESC|ASC|DOWN|REVERSE
¿Qué cláusula agrupa filas para usar funciones como COUNT?|GROUP BY|ORDER BY|JOIN|UNION
¿Qué cláusula filtra grupos después de un GROUP BY?|HAVING|WHERE|FILTER|LIMIT
¿Qué función cuenta filas?|COUNT|SUM|TOTAL|NUM
¿Qué función calcula la media?|AVG|MEAN|MEDIAN|SUM
¿Qué función devuelve el valor más alto?|MAX|TOP|HIGH|BIG
¿Qué palabra quita los valores repetidos en un SELECT?|DISTINCT|UNIQUE|DIFFERENT|SINGLE
¿Qué operador busca texto con comodines?|LIKE|MATCH|SIMILAR|EQUALS
¿Qué comodín de LIKE representa cualquier número de caracteres?|%|_|*|?
¿Qué comodín de LIKE representa exactamente un carácter?|_|%|*|#
¿Cómo se comprueba en SQL si un valor está vacío (NULL)?|IS NULL|= NULL|== NULL|EQUALS NULL
¿Qué operador comprueba si un valor está dentro de una lista?|IN|BETWEEN|LIKE|ANY OF
¿Qué operador comprueba si un valor está en un rango?|BETWEEN|IN|RANGE|FROM TO
¿Qué tipo de JOIN devuelve solo las filas que coinciden en las dos tablas?|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN
¿Qué JOIN devuelve todas las filas de la tabla izquierda aunque no tengan pareja?|LEFT JOIN|INNER JOIN|RIGHT JOIN|CROSS JOIN
¿Qué JOIN combina cada fila de una tabla con todas las de la otra?|CROSS JOIN|INNER JOIN|LEFT JOIN|SELF JOIN
¿Qué une los resultados de dos SELECT quitando repetidos?|UNION|JOIN|MERGE|PLUS
¿Qué es una clave primaria (PK)?|Una o varias columnas que identifican cada fila sin repetirse|Una columna que apunta a otra tabla|Una columna con contraseña|La primera columna siempre
¿Puede una clave primaria tener valores NULL?|No|Sí|Solo uno|Solo si es numérica
¿Qué es una clave ajena (FK)?|Una columna que hace referencia a la clave primaria de otra tabla|Una clave que no se usa|Una contraseña de la base de datos|Una columna repetida
¿Qué restricción impide que se repitan valores en una columna?|UNIQUE|NOT NULL|CHECK|DEFAULT
¿Qué restricción obliga a que una columna siempre tenga valor?|NOT NULL|UNIQUE|DEFAULT|PRIMARY
¿Qué restricción comprueba una condición, como que el precio sea mayor que 0?|CHECK|VERIFY|TEST|ASSERT
¿Qué hace ON DELETE CASCADE?|Al borrar la fila padre, borra también las hijas que apuntan a ella|Impide borrar cualquier fila|Pone las FK a NULL|Borra la tabla entera
¿Qué hace AUTO_INCREMENT en MySQL?|Da automáticamente un número que va subiendo|Hace copias de seguridad|Ordena la tabla|Cifra la columna
¿Qué tipo de dato de SQL guarda texto de longitud variable?|VARCHAR|CHAR|INT|DATE
¿Qué tipo de dato guarda una fecha sin hora?|DATE|TIME|DATETIME|YEAR
¿Qué tipo es mejor para guardar dinero con exactitud?|DECIMAL|FLOAT|VARCHAR|INT siempre
¿Qué significa SGBD?|Sistema Gestor de Bases de Datos|Sistema General de Bloques de Datos|Servidor Global de Base de Datos|Software de Gestión de Backups Diarios
¿Cuál de estos es un SGBD?|MySQL|Apache|Excel|Windows
¿Cuál de estos SGBD es de Oracle además de la base de datos Oracle?|MySQL|PostgreSQL|SQLite|MongoDB
¿Qué base de datos es NoSQL y guarda documentos tipo JSON?|MongoDB|MySQL|PostgreSQL|SQL Server
¿Qué base de datos guarda todo en un único archivo y no necesita servidor?|SQLite|MySQL|Oracle|SQL Server
¿Qué herramienta web se usa mucho para administrar MySQL?|phpMyAdmin|Photoshop|Wireshark|Postman
¿Qué herramienta oficial de MySQL permite diseñar modelos y diagramas?|MySQL Workbench|Excel|Visual Studio Code|Notepad
¿Qué significa E-R?|Entidad-Relación|Esquema-Registro|Entrada-Resultado|Elemento-Referencia
¿Con qué figura se dibuja una entidad en el modelo E-R de Chen?|Rectángulo|Rombo|Elipse|Círculo
¿Con qué figura se dibuja una relación en el modelo E-R?|Rombo|Rectángulo|Elipse|Triángulo
¿Con qué figura se dibuja un atributo en el modelo E-R de Chen?|Elipse|Rombo|Rectángulo|Cuadrado
¿Cómo se marca el atributo clave en un E-R?|Subrayado|En negrita|Con un asterisco al final|En rojo
¿Cómo se dibuja una entidad débil?|Con doble rectángulo|Con un círculo|Con línea discontinua|Con un rombo
¿Qué es una entidad débil?|Una que depende de otra para identificarse|Una entidad sin atributos|Una entidad que se puede borrar|Una tabla temporal
¿Qué cardinalidad tiene una relación de «muchos a muchos»?|N:M|1:1|1:N|0:1
Al pasar al relacional una relación N:M, ¿qué se crea?|Una tabla nueva con las claves de las dos entidades|Nada|Una columna en cada tabla|Una vista
Al pasar una relación 1:N al relacional, ¿dónde va la clave ajena?|En la tabla del lado N|En la tabla del lado 1|En una tabla nueva siempre|En las dos tablas
¿Qué es un atributo multivaluado?|Un atributo que puede tener varios valores para la misma entidad|Un atributo numérico|Un atributo clave|Un atributo calculado
¿Qué es un atributo derivado?|Uno que se calcula a partir de otros, como la edad desde la fecha de nacimiento|Uno heredado de otra tabla|Uno que es clave|Uno opcional
¿Qué es la normalización?|Organizar las tablas para evitar redundancias y anomalías|Hacer copias de seguridad|Cifrar los datos|Ordenar las filas
¿Qué exige la primera forma normal (1FN)?|Que cada celda tenga un único valor atómico|Que no haya claves ajenas|Que todas las columnas sean números|Que haya una sola tabla
¿Qué es una dependencia funcional A → B?|Que conociendo A se conoce un único valor de B|Que A y B son iguales|Que B es clave de A|Que A depende de una tabla
¿Qué es una vista (VIEW) en SQL?|Una consulta guardada que se usa como una tabla|Una copia de la base de datos|Una imagen de la tabla|Un índice
¿Para qué sirve un índice en una tabla?|Para acelerar las búsquedas|Para ordenar los datos visualmente|Para cifrar|Para borrar duplicados
¿Qué es una transacción?|Un conjunto de operaciones que se hacen todas o ninguna|Una venta online|Una consulta SELECT|Un tipo de tabla
¿Qué sentencia confirma una transacción?|COMMIT|SAVE|CONFIRM|END
¿Qué sentencia deshace una transacción?|ROLLBACK|UNDO|CANCEL|RETURN
¿Qué significa la «A» de las propiedades ACID?|Atomicidad|Acceso|Actualización|Autenticación
¿Qué sentencia da permisos a un usuario en SQL?|GRANT|ALLOW|PERMIT|GIVE
¿Qué sentencia quita permisos?|REVOKE|DENY|REMOVE|DROP
¿Qué parte de SQL incluye CREATE, ALTER y DROP?|DDL (definición de datos)|DML (manipulación de datos)|DCL (control)|TCL (transacciones)
¿Qué parte de SQL incluye SELECT, INSERT, UPDATE y DELETE?|DML|DDL|DCL|XML
¿Qué hace SELECT * FROM alumnos?|Muestra todas las columnas de todos los alumnos|Borra los alumnos|Cuenta los alumnos|Crea la tabla alumnos
¿Qué devuelve COUNT(*) en una tabla vacía?|0|NULL|1|Da error
¿Qué ocurre si haces DELETE FROM clientes sin WHERE?|Se borran todas las filas|No pasa nada|Se borra la primera fila|Da error siempre
¿Qué palabra limita el número de filas en MySQL?|LIMIT|TOP|MAX ROWS|FIRST
¿Qué es una subconsulta?|Un SELECT dentro de otra consulta|Una tabla pequeña|Un índice|Un comentario
¿Qué alias se pone con AS?|Un nombre alternativo para una columna o tabla|Una contraseña|Un tipo de dato|Una clave
¿Qué función de MySQL junta textos?|CONCAT|JOIN|MERGE|PLUS
¿Qué función de MySQL devuelve la fecha y hora actuales?|NOW()|TODAY()|DATE()|CURRENT()
¿Qué es un trigger (disparador)?|Código que se ejecuta solo al insertar, actualizar o borrar|Un tipo de clave|Una copia de seguridad|Un usuario
¿Qué es un procedimiento almacenado?|Un bloque de código SQL guardado en la base de datos para ejecutarlo cuando quieras|Una tabla oculta|Un archivo .sql|Un índice
¿Qué es la integridad referencial?|Que las claves ajenas siempre apunten a filas que existen|Que no haya contraseñas débiles|Que las tablas estén ordenadas|Que haya copias de seguridad
¿Qué es el DED?|Diagrama de Estructura de Datos, con tablas, columnas y relaciones|Un lenguaje de consultas|Un SGBD|Un tipo de clave
¿Qué es una jerarquía (ISA) en el modelo E-R?|Una entidad general con subtipos más concretos|Una relación ternaria|Un tipo de clave|Una tabla sin claves
¿Qué es una relación reflexiva?|Una relación de una entidad consigo misma|Una relación sin atributos|Una relación entre tres entidades|Una relación opcional
¿Qué es una relación ternaria?|Una relación entre tres entidades|Una relación con tres atributos|Tres relaciones seguidas|Una relación 1:3
¿Qué significa la cardinalidad (0,N)?|Mínimo cero y máximo muchos|Exactamente cero|Exactamente N|Mínimo N y máximo cero
¿Qué es un esquema de base de datos?|La estructura: tablas, columnas, tipos y relaciones|Los datos guardados|Un dibujo bonito|Un usuario
¿Qué es una tupla en el modelo relacional?|Una fila de una tabla|Una columna|Una tabla|Una clave
¿Qué es un dominio en el modelo relacional?|El conjunto de valores permitidos para un atributo|El nombre de la base de datos|Una página web|La clave primaria
¿Qué es una clave candidata?|Un atributo o conjunto que podría ser clave primaria|Una clave ajena|Una clave borrada|Una contraseña
¿Qué es una clave compuesta?|Una clave formada por varias columnas|Una clave cifrada|Una clave ajena doble|Una clave numérica
¿Quién propuso el modelo relacional de bases de datos?|Edgar F. Codd|Peter Chen|Bill Gates|Alan Turing
¿Quién propuso el modelo Entidad-Relación?|Peter Chen|Edgar F. Codd|Tim Berners-Lee|Larry Ellison
¿Qué fichero suele tener la extensión de un script de SQL?|.sql|.db|.txt siempre|.sq
¿Qué hace un backup de una base de datos?|Guarda una copia para poder recuperarla|Acelera las consultas|Borra datos viejos|Crea usuarios
¿Qué comando de MySQL muestra las tablas de la base de datos actual?|SHOW TABLES|LIST TABLES|SELECT TABLES|DESCRIBE ALL
¿Qué comando de MySQL muestra las columnas de una tabla?|DESCRIBE tabla|SHOW tabla|LIST tabla|COLUMNS tabla
¿Qué comando de MySQL elige la base de datos con la que trabajar?|USE nombre|OPEN nombre|SELECT DATABASE nombre|GO nombre
`]);
QZ.push(['Sistemas y redes',`
¿Qué significa CPU?|Unidad central de procesamiento|Computadora personal universal|Control de potencia unificado|Centro de programas útiles
¿Qué memoria se borra al apagar el ordenador?|RAM|ROM|Disco duro|SSD
¿Qué significa RAM?|Random Access Memory|Read And Modify|Rapid Action Memory|Remote Access Module
¿Cuántos bits tiene un byte?|8|4|16|10
¿Cuántos bytes son 1 KiB?|1024|1000|512|2048
¿Qué es más grande?|1 TB|1 GB|1 MB|1 KB
¿Qué es un SSD?|Un almacenamiento sin partes móviles, con memoria flash|Un disco con platos que giran|Un tipo de RAM|Una tarjeta gráfica
¿Qué componente procesa sobre todo los gráficos?|GPU|CPU|PSU|BIOS
¿Qué es la placa base?|La placa donde se conectan todos los componentes|La fuente de alimentación|El disco duro|La pantalla
¿Qué componente transforma la corriente del enchufe para el ordenador?|Fuente de alimentación|Placa base|Procesador|Disipador
¿Qué es la BIOS o UEFI?|El firmware que arranca el ordenador antes del sistema operativo|Un antivirus|Un navegador|Un tipo de disco
¿Qué mide la frecuencia de un procesador, en GHz?|Ciclos por segundo|Memoria disponible|Temperatura|Número de núcleos
¿Qué es un núcleo (core) de un procesador?|Una unidad que puede ejecutar instrucciones por su cuenta|Un ventilador|Una parte de la RAM|Un puerto USB
¿Qué sistema de numeración usa solo 0 y 1?|Binario|Decimal|Hexadecimal|Octal
¿Cuánto es 1010 en binario pasado a decimal?|10|2|5|1010
¿Cuánto es 255 en hexadecimal?|FF|EE|100|F0
¿Cuántos símbolos usa el sistema hexadecimal?|16|8|10|12
¿Cuánto es 8 en binario?|1000|100|111|1001
¿Qué es un sistema operativo?|El software que gestiona el hardware y permite usar los programas|Un antivirus|Un navegador|Un lenguaje de programación
¿Cuál de estos es un sistema operativo?|Linux|Java|MySQL|Chrome
¿Quién creó el núcleo Linux?|Linus Torvalds|Richard Stallman|Bill Gates|Steve Wozniak
¿Cuál de estas es una distribución de Linux?|Ubuntu|Windows 11|macOS|Android Studio
¿Qué comando de Linux lista los archivos de una carpeta?|ls|dir|list|show
¿Qué comando de Linux cambia de carpeta?|cd|mv|chdir -l|go
¿Qué comando de Linux muestra la carpeta en la que estás?|pwd|whereami|cwd|path
¿Qué comando de Linux copia archivos?|cp|copy|mv|cpy
¿Qué comando de Linux mueve o renombra archivos?|mv|cp|rn|move
¿Qué comando de Linux borra archivos?|rm|del|erase|delete
¿Qué comando de Linux crea una carpeta?|mkdir|md -l|newdir|touch
¿Qué comando de Linux crea un archivo vacío o cambia su fecha?|touch|mkfile|new|create
¿Qué comando de Linux muestra el contenido de un archivo?|cat|show|print|type
¿Qué comando de Linux cambia los permisos de un archivo?|chmod|chown|perm|attrib
¿Qué comando de Linux cambia el dueño de un archivo?|chown|chmod|owner|usermod
¿Qué permisos da chmod 755?|Todo al dueño, leer y ejecutar a los demás|Todo a todos|Solo lectura para todos|Nada a nadie
¿Qué significa el permiso «x» en Linux?|Ejecutar|Borrar|Exportar|Esconder
¿Qué comando de Linux ejecuta algo como administrador?|sudo|admin|root|su -run
¿Cómo se llama el usuario administrador en Linux?|root|admin|superuser|system
¿Qué comando de Linux busca texto dentro de archivos?|grep|find|search|look
¿Qué comando de Linux muestra los procesos en tiempo real?|top|ps -live|proc|tasks
¿Qué comando de Linux termina un proceso por su número?|kill|stop|end|close
¿Qué carpeta de Linux guarda la configuración del sistema?|/etc|/bin|/home|/tmp
¿Qué carpeta de Linux contiene las carpetas personales de los usuarios?|/home|/users|/root|/etc
¿Qué hace la tubería (la barra vertical) en la terminal?|Pasa la salida de un comando como entrada de otro|Comenta la línea|Ejecuta como administrador|Borra la pantalla
¿Qué hace > en la terminal, como en ls > lista.txt?|Guarda la salida en un archivo, sobrescribiéndolo|Compara archivos|Ejecuta dos comandos|Muestra ayuda
¿Qué comando de Windows lista los archivos de una carpeta en CMD?|dir|ls|list|show
¿Qué comando de Windows muestra la configuración de red?|ipconfig|ifconfig /all|netconfig|showip
¿Qué comando comprueba si un equipo responde en la red?|ping|trace|call|echo
¿Qué comando muestra los saltos hasta un destino en Windows?|tracert|ping -t|route|netstat
¿Qué sistema de archivos usa normalmente Windows en el disco principal?|NTFS|ext4|APFS|FAT12
¿Qué sistema de archivos se usa mucho en Linux?|ext4|NTFS|FAT32|HFS
¿Qué es una máquina virtual?|Un ordenador simulado dentro de otro|Un ordenador muy rápido|Un servidor en internet|Un robot
¿Cuál de estos programas crea máquinas virtuales?|VirtualBox|Photoshop|Excel|Chrome
¿Qué es una dirección IP?|Un número que identifica a un equipo en una red|El nombre de una web|Una contraseña|Un tipo de cable
¿Cuántos bits tiene una dirección IPv4?|32|64|128|16
¿Cuántos bits tiene una dirección IPv6?|128|64|32|256
¿Qué dirección IP se refiere al propio equipo (localhost)?|127.0.0.1|192.168.0.1|0.0.0.0|255.255.255.255
¿Cuál de estas direcciones es privada?|192.168.1.10|8.8.8.8|80.58.61.250|1.1.1.1
¿Qué es una máscara de red como 255.255.255.0?|Indica qué parte de la IP es la red y cuál el equipo|Una contraseña del router|Un cortafuegos|Una dirección pública
¿Qué significa /24 en 192.168.1.0/24?|Que los primeros 24 bits son de la red|Que hay 24 equipos|Que es la red número 24|Que el router está en la 24
¿Cuántos equipos se pueden usar en una red /24?|254|256|255|24
¿Qué hace el DNS?|Traduce nombres como google.com a direcciones IP|Da direcciones IP automáticamente|Cifra la conexión|Bloquea virus
¿Qué hace el DHCP?|Da direcciones IP automáticamente a los equipos|Traduce nombres a IP|Envía correos|Comparte archivos
¿Qué es una dirección MAC?|El identificador físico de una tarjeta de red|La IP del router|Una contraseña de Apple|El nombre del equipo
¿Cuántos bits tiene una dirección MAC?|48|32|64|128
¿Qué dispositivo conecta redes distintas, como tu casa con internet?|Router|Switch|Hub|Repetidor
¿Qué dispositivo conecta equipos dentro de la misma red local?|Switch|Router|Módem|Firewall
¿Qué significa LAN?|Red de área local|Red de área amplia|Red sin cables|Red de alta velocidad
¿Qué es una WAN?|Una red de área amplia, como internet|Una red doméstica|Una red Wi-Fi|Un cable de red
¿Cuántas capas tiene el modelo OSI?|7|4|5|9
¿En qué capa OSI trabaja un router?|Red (3)|Física (1)|Enlace (2)|Aplicación (7)
¿En qué capa OSI trabaja un switch normal?|Enlace (2)|Red (3)|Transporte (4)|Sesión (5)
¿Qué protocolo garantiza que los datos lleguen completos y en orden?|TCP|UDP|IP|ICMP
¿Qué protocolo es más rápido pero no garantiza la entrega?|UDP|TCP|FTP|HTTP
¿Qué puerto usa por defecto HTTP?|80|443|21|22
¿Qué puerto usa por defecto HTTPS?|443|80|8080|25
¿Qué puerto usa por defecto SSH?|22|21|23|3389
¿Qué puerto usa por defecto MySQL?|3306|5432|1433|8080
¿Qué protocolo se usa para transferir archivos clásicamente?|FTP|SMTP|DNS|ARP
¿Qué protocolo se usa para enviar correo?|SMTP|POP3|IMAP|FTP
¿Qué protocolo permite conectarse de forma segura a la terminal de otro equipo?|SSH|Telnet|FTP|HTTP
¿Qué cable de red se usa normalmente en casa y oficinas?|Par trenzado con RJ45|Coaxial|HDMI|VGA
¿Qué tipo de cable usa luz para transmitir datos?|Fibra óptica|Par trenzado|Coaxial|USB
¿Qué es el Wi-Fi?|Una tecnología de red local sin cables|Un tipo de cable|Un antivirus|Un proveedor de internet
¿Qué es un firewall?|Un sistema que filtra el tráfico de red permitido o bloqueado|Un antivirus de correo|Un tipo de router viejo|Un disco de copia
¿Qué es una VPN?|Una conexión cifrada que simula estar en otra red|Un virus|Un tipo de Wi-Fi|Un navegador
¿Qué es la nube (cloud)?|Usar servidores de internet para guardar datos o ejecutar programas|Un tipo de Wi-Fi|Un disco externo|Un virus
¿Qué es un servidor?|Un equipo o programa que ofrece servicios a otros|Un usuario|Un teclado|Un cable
¿Qué es el ancho de banda?|La cantidad de datos que se pueden transmitir por segundo|El tamaño de la pantalla|La longitud de un cable|El número de usuarios
¿Qué es la latencia o ping?|El tiempo que tarda un dato en ir y volver|La velocidad de descarga|La memoria del router|El número de saltos
¿Qué es un sistema RAID 1?|Dos discos con la misma información (espejo)|Un disco dividido en dos|Una red local|Un tipo de RAM
¿Qué es un proceso?|Un programa en ejecución|Un archivo|Un usuario|Un cable
¿Qué es la memoria virtual?|Usar parte del disco como si fuera RAM|RAM en la nube|Memoria de la tarjeta gráfica|Una memoria USB
¿Qué es un driver o controlador?|Software que permite al sistema usar un dispositivo|Un conductor de coche|Un tipo de cable|Un antivirus
¿Qué tecla abre el Administrador de tareas en Windows junto a Ctrl y Shift?|Esc|Supr|Tab|Alt
¿Qué es un archivo comprimido como .zip?|Un archivo que guarda otros ocupando menos espacio|Un virus|Un programa|Una imagen
¿Qué sistema operativo usan la mayoría de servidores web?|Linux|Windows XP|MS-DOS|iOS
¿En qué se basa Android?|En el núcleo Linux|En Windows|En macOS|En Java puro sin sistema
¿Qué es el código ASCII?|Una tabla que asigna un número a cada carácter|Un lenguaje de programación|Un tipo de cifrado|Una red
¿Qué número tiene la letra A mayúscula en ASCII?|65|97|1|64
¿Qué es Unicode?|Un estándar que incluye caracteres de casi todos los idiomas y emojis|Un sistema operativo|Un único código para todos los programas|Un lenguaje
`]);
QZ.push(['Entornos, Git y seguridad',`
¿Qué es Git?|Un sistema de control de versiones|Una red social|Un lenguaje de programación|Un editor de texto
¿Quién creó Git?|Linus Torvalds|Mark Zuckerberg|Guido van Rossum|James Gosling
¿Qué comando de Git guarda los cambios preparados en el historial?|git commit|git save|git push|git add
¿Qué comando de Git prepara archivos para el siguiente commit?|git add|git commit|git stage-all|git put
¿Qué comando de Git sube los commits al repositorio remoto?|git push|git pull|git upload|git send
¿Qué comando de Git trae y mezcla los cambios del remoto?|git pull|git push|git fetch-merge-all|git get
¿Qué comando de Git copia un repositorio remoto a tu equipo?|git clone|git copy|git download|git init
¿Qué comando de Git crea un repositorio nuevo en la carpeta actual?|git init|git new|git create|git start
¿Qué comando de Git muestra qué archivos han cambiado?|git status|git diff-all|git show|git check
¿Qué comando de Git muestra el historial de commits?|git log|git history|git list|git past
¿Qué es una rama (branch) en Git?|Una línea de desarrollo independiente|Un archivo borrado|Un servidor|Un error
¿Qué comando une una rama con la actual?|git merge|git join|git union|git combine
¿Qué es un conflicto de merge?|Cuando dos cambios tocan las mismas líneas y Git no sabe cuál quedarse|Un virus en el repositorio|Un commit vacío|Una rama borrada
¿Qué archivo indica a Git qué archivos no debe seguir?|.gitignore|.gitkeep|.gitconfig|ignore.txt
¿Qué es GitHub?|Una web para alojar repositorios Git y colaborar|Un lenguaje|Un antivirus|Un sistema operativo
¿Qué es un pull request?|Una petición para que revisen y unan tus cambios|Descargar un repositorio|Borrar una rama|Un tipo de commit
¿Qué es un fork en GitHub?|Una copia de un repositorio en tu cuenta|Un error|Una rama local|Un tenedor
¿Qué son las pruebas unitarias?|Pruebas de partes pequeñas del código, como un método|Pruebas con usuarios reales|Pruebas de la red|Pruebas de hardware
¿Qué librería se usa mucho para pruebas unitarias en Java?|JUnit|JQuery|JSON|JPanel
¿Qué es la caja negra en pruebas?|Probar sin mirar el código, solo entradas y salidas|Probar el código línea a línea|Probar el hardware|Probar en un ordenador apagado
¿Qué es la caja blanca en pruebas?|Probar conociendo el código por dentro|Probar sin ver el código|Probar solo la interfaz|Probar en papel
¿Qué mide la complejidad ciclomática?|El número de caminos independientes del código|La velocidad del programa|Las líneas de código|La memoria usada
¿Qué es refactorizar?|Mejorar el código sin cambiar lo que hace|Borrar el programa|Añadir funciones nuevas|Traducir el código
¿Qué es UML?|Un lenguaje de diagramas para modelar software|Un lenguaje de programación|Una base de datos|Un sistema operativo
¿Qué diagrama UML muestra clases, atributos y métodos?|Diagrama de clases|Diagrama de casos de uso|Diagrama de Gantt|Diagrama de flujo
¿Qué diagrama UML muestra qué puede hacer cada actor con el sistema?|Diagrama de casos de uso|Diagrama de clases|Diagrama de secuencia|Diagrama E-R
¿Qué representa un «actor» en un diagrama de casos de uso?|Un usuario o sistema externo que interactúa|Una clase|Una base de datos|Un método
¿Qué es la metodología ágil Scrum?|Una forma de trabajar en ciclos cortos llamados sprints|Un lenguaje|Un tipo de prueba|Un editor
¿Qué es un sprint en Scrum?|Un periodo corto de trabajo con objetivos concretos|Una carrera|Un error grave|Una reunión anual
¿Qué es el modelo en cascada?|Un ciclo de vida donde cada fase va después de la anterior|Un tipo de bucle|Una base de datos|Una red
¿Qué es la documentación de un programa?|Textos que explican cómo funciona y cómo usarlo|El código compilado|Los errores|Los usuarios
¿Qué herramienta genera documentación a partir de comentarios en Java?|Javadoc|JUnit|Maven|Git
¿Qué es Maven?|Una herramienta que gestiona dependencias y construye proyectos Java|Un IDE|Una base de datos|Un servidor web
¿Qué es un phishing?|Un engaño para robar datos haciéndose pasar por alguien de confianza|Un tipo de pesca|Un antivirus|Una red Wi-Fi
¿Qué es un ransomware?|Un malware que cifra tus archivos y pide un rescate|Un antivirus|Un tipo de cable|Un navegador seguro
¿Qué es un troyano?|Un malware que se hace pasar por un programa legítimo|Un antivirus griego|Un tipo de red|Un servidor
¿Qué es un ataque de fuerza bruta?|Probar muchas contraseñas hasta acertar|Romper el ordenador a golpes|Apagar el servidor|Cortar el cable
¿Qué es la autenticación en dos pasos (2FA)?|Pedir además de la contraseña un segundo factor, como un código|Tener dos contraseñas iguales|Entrar dos veces|Usar dos ordenadores
¿Qué es una inyección SQL?|Meter código SQL malicioso en un formulario para manipular la base de datos|Una vacuna digital|Una copia de seguridad|Un tipo de JOIN
¿Cómo se evitan las inyecciones SQL?|Con consultas preparadas (parámetros)|Usando mayúsculas|Quitando el WHERE|Con más RAM
¿Qué es el cifrado?|Transformar datos para que solo los pueda leer quien tenga la clave|Comprimir archivos|Borrar datos|Ordenar datos
¿Qué es un hash como SHA-256?|Una huella de longitud fija calculada a partir de los datos|Un cifrado que se puede deshacer|Una contraseña|Un tipo de red
¿Por qué se guardan las contraseñas con hash y no en claro?|Para que si roban la base de datos no vean las contraseñas|Para que ocupen menos|Para ir más rápido|Porque es obligatorio en HTML
¿Cuál de estas contraseñas es más segura?|Una frase larga con letras, números y símbolos|123456|Tu fecha de nacimiento|password
¿Qué es un antivirus?|Un programa que detecta y elimina software malicioso|Un firewall de hardware|Una vacuna|Un sistema operativo
¿Qué es una copia de seguridad 3-2-1?|3 copias, en 2 soportes distintos, 1 fuera de casa|3 discos, 2 USB y 1 nube obligatorios|3 días, 2 semanas, 1 mes|Una contraseña de 321
¿Qué es el RGPD?|El reglamento europeo de protección de datos personales|Un antivirus|Un tipo de red|Un lenguaje
¿Qué es el software libre?|Software que se puede usar, estudiar, modificar y compartir|Software que siempre es gratis y sin licencia|Software sin errores|Software pirata
¿Qué licencia obliga a que las versiones modificadas sigan siendo libres?|GPL|MIT|Freeware|Shareware
¿Quién fundó el movimiento del software libre y el proyecto GNU?|Richard Stallman|Linus Torvalds|Steve Jobs|Bill Gates
¿Quién es considerada la primera programadora de la historia?|Ada Lovelace|Grace Hopper|Marie Curie|Hedy Lamarr
¿Quién popularizó el término «bug» tras encontrar una polilla en un ordenador?|Grace Hopper|Ada Lovelace|Alan Turing|John von Neumann
¿Qué científico descifró la máquina Enigma y es padre de la informática?|Alan Turing|Albert Einstein|Charles Babbage|Konrad Zuse
¿Qué es el test de Turing?|Una prueba para ver si una máquina puede pasar por humana conversando|Una prueba de velocidad|Un examen de matemáticas|Un antivirus
¿Quién diseñó la máquina analítica en el siglo XIX?|Charles Babbage|Blaise Pascal|Alan Turing|Thomas Edison
¿Cómo se llamaba uno de los primeros ordenadores electrónicos, de 1945?|ENIAC|Commodore 64|ZX Spectrum|Macintosh
¿Quiénes fundaron Apple?|Steve Jobs, Steve Wozniak y Ronald Wayne|Bill Gates y Paul Allen|Larry Page y Sergey Brin|Jeff Bezos
¿Quiénes fundaron Microsoft?|Bill Gates y Paul Allen|Steve Jobs y Steve Wozniak|Larry Page y Sergey Brin|Mark Zuckerberg
¿Quiénes fundaron Google?|Larry Page y Sergey Brin|Bill Gates y Paul Allen|Elon Musk|Jack Dorsey
¿Qué significa la ley de Moore?|Que el número de transistores en un chip se duplica cada dos años aproximadamente|Que los ordenadores bajan de precio cada año|Que la RAM se duplica cada mes|Que los programas siempre tienen errores
¿Qué es un transistor?|Un componente que actúa como interruptor o amplificador|Un cable|Un tipo de memoria|Una pantalla
¿En qué año salió el primer iPhone?|2007|2001|2010|1999
¿Qué lenguaje creó Guido van Rossum?|Python|Java|C|Ruby
¿Qué lenguaje creó James Gosling?|Java|C++|Python|PHP
¿Qué lenguaje creó Dennis Ritchie?|C|Java|Pascal|BASIC
¿Qué lenguaje creó Bjarne Stroustrup?|C++|C#|Java|Go
¿Qué lenguaje creó Brendan Eich en solo 10 días?|JavaScript|Java|PHP|Python
¿Qué empresa creó el lenguaje C#?|Microsoft|Apple|Google|Oracle
¿Qué empresa creó el lenguaje Kotlin?|JetBrains|Google|Microsoft|Oracle
¿Qué lenguaje se usa sobre todo para apps de iPhone hoy?|Swift|Kotlin|C#|PHP
¿De qué animal es el logo de Linux?|Un pingüino|Un elefante|Un delfín|Un zorro
¿Cómo se llama la mascota de Linux?|Tux|Duke|Octocat|Gopher
¿Qué animal es la mascota de PHP, el elePHPant?|Un elefante|Un pingüino|Un delfín|Un camello
¿Qué animal es el logo de MySQL?|Un delfín|Un elefante|Un pingüino|Un tiburón
¿Qué animal es el logo de PostgreSQL?|Un elefante|Un delfín|Un oso|Un búho
¿Qué animal es la mascota de GitHub, el Octocat?|Un gato con tentáculos de pulpo|Un perro|Un búho|Un pez
¿Qué significa «open source»?|Código abierto, que cualquiera puede ver|Programa de pago|Programa sin licencia|Programa en la nube
¿Qué es una API?|Una forma definida de que dos programas se comuniquen|Un lenguaje|Un virus|Una base de datos
¿Qué es una aplicación de escritorio?|Un programa que se instala y ejecuta en el ordenador|Una web|Una app de móvil|Un servidor
¿Qué es Electron?|Un framework para hacer apps de escritorio con tecnologías web|Un lenguaje|Una base de datos|Un antivirus
¿Qué es la inteligencia artificial?|Sistemas que realizan tareas que normalmente requieren inteligencia humana|Robots con forma humana solamente|Un lenguaje de programación|Un tipo de procesador
¿Qué es el machine learning?|Que un sistema aprenda patrones a partir de datos|Programar máquinas de coser|Arreglar ordenadores|Un tipo de cable
¿Qué es un emoji?|Un pictograma que se usa en mensajes|Un virus|Un comando|Un lenguaje
¿Qué significa «pixel»?|El punto más pequeño de una imagen digital|Un tipo de cámara|Un programa|Un archivo de sonido
¿Qué formato de imagen admite transparencia y no pierde calidad?|PNG|JPG|BMP clásico|GIF siempre
¿Qué formato de imagen es vectorial?|SVG|PNG|JPG|BMP
¿Qué significa el «modo oscuro» en una app?|Colores oscuros de fondo para descansar la vista|Un modo sin internet|Un modo secreto|Un modo de ahorro de RAM
¿Qué atajo copia en casi todos los programas de Windows?|Ctrl + C|Ctrl + V|Ctrl + X|Ctrl + Z
¿Qué atajo deshace la última acción?|Ctrl + Z|Ctrl + Y|Ctrl + D|Ctrl + U
¿Qué atajo busca dentro de un documento o página?|Ctrl + F|Ctrl + B|Ctrl + S|Ctrl + G
¿Qué atajo guarda en casi todos los programas?|Ctrl + S|Ctrl + G|Ctrl + P|Ctrl + A
¿Qué atajo selecciona todo?|Ctrl + A|Ctrl + T|Ctrl + E|Ctrl + S
¿Qué tecla con el logo de Windows y L hace?|Bloquea el equipo|Abre el navegador|Apaga el equipo|Abre la lupa
¿Qué combinación cambia entre ventanas abiertas en Windows?|Alt + Tab|Ctrl + Tab|Shift + Tab|Ctrl + Alt + Supr
`]);
QZ.push(['Ciencia',`
¿Cuál es el símbolo químico del oro?|Au|Ag|Go|Or
¿Cuál es el símbolo químico de la plata?|Ag|Pl|Au|Si
¿Cuál es el símbolo químico del hierro?|Fe|Hi|Ir|F
¿Cuál es el símbolo químico del sodio?|Na|So|Sd|S
¿Cuál es el símbolo químico del potasio?|K|P|Po|Pt
¿Qué gas respiramos para vivir?|Oxígeno|Nitrógeno|Dióxido de carbono|Helio
¿Qué gas es el más abundante en el aire?|Nitrógeno|Oxígeno|Dióxido de carbono|Argón
¿Cuál es la fórmula del agua?|H2O|CO2|O2|HO2
¿A qué temperatura hierve el agua al nivel del mar?|100 °C|90 °C|120 °C|80 °C
¿A qué temperatura se congela el agua?|0 °C|-10 °C|4 °C|32 °C
¿Cuál es el elemento más abundante del universo?|Hidrógeno|Helio|Oxígeno|Carbono
¿Cuál es el planeta más grande del sistema solar?|Júpiter|Saturno|Neptuno|La Tierra
¿Cuál es el planeta más cercano al Sol?|Mercurio|Venus|Marte|La Tierra
¿Qué planeta es conocido como el planeta rojo?|Marte|Venus|Júpiter|Mercurio
¿Qué planeta tiene los anillos más famosos?|Saturno|Júpiter|Urano|Neptuno
¿Cuántos planetas hay en el sistema solar?|8|9|7|10
¿Desde qué año dejó Plutón de considerarse planeta?|2006|1999|2012|1986
¿Cuánto tarda la luz del Sol en llegar a la Tierra, aproximadamente?|8 minutos|8 segundos|1 hora|1 día
¿A qué velocidad viaja la luz en el vacío, aproximadamente?|300.000 km/s|30.000 km/s|3.000 km/s|1.000.000 km/s
¿Qué es un año luz?|La distancia que recorre la luz en un año|Un año en otro planeta|El tiempo que tarda la luz en salir del Sol|Una unidad de energía
¿Cuál es la estrella más cercana a la Tierra?|El Sol|Próxima Centauri|Sirio|Betelgeuse
¿Cuál es el satélite natural de la Tierra?|La Luna|Fobos|Europa|Titán
¿En qué año llegó el ser humano a la Luna por primera vez?|1969|1959|1975|1981
¿Quién fue la primera persona en pisar la Luna?|Neil Armstrong|Yuri Gagarin|Buzz Aldrin|Michael Collins
¿Quién fue el primer ser humano en viajar al espacio?|Yuri Gagarin|Neil Armstrong|John Glenn|Valentina Tereshkova
¿Cuántos huesos tiene un adulto humano?|206|300|150|412
¿Cuál es el órgano más grande del cuerpo humano?|La piel|El hígado|El corazón|El cerebro
¿Cuántas cámaras tiene el corazón humano?|4|2|3|6
¿Qué células de la sangre transportan el oxígeno?|Glóbulos rojos|Glóbulos blancos|Plaquetas|Neuronas
¿Qué molécula guarda la información genética?|ADN|ATP|ARN mensajero|Proteína
¿Cuántos cromosomas tiene una célula humana normal?|46|23|48|44
¿Qué científico propuso la teoría de la evolución por selección natural?|Charles Darwin|Gregor Mendel|Isaac Newton|Louis Pasteur
¿Quién es considerado el padre de la genética?|Gregor Mendel|Charles Darwin|Watson|Pasteur
¿Quién descubrió la penicilina?|Alexander Fleming|Louis Pasteur|Marie Curie|Robert Koch
¿Quién formuló la ley de la gravitación universal?|Isaac Newton|Galileo Galilei|Albert Einstein|Johannes Kepler
¿Quién formuló la teoría de la relatividad?|Albert Einstein|Isaac Newton|Niels Bohr|Stephen Hawking
¿Qué científica ganó dos premios Nobel en ciencias distintas?|Marie Curie|Rosalind Franklin|Ada Lovelace|Lise Meitner
¿Qué mide la escala de Richter?|La magnitud de los terremotos|La fuerza del viento|La temperatura|La acidez
¿Qué mide el pH?|La acidez o basicidad|La presión|La temperatura|La velocidad
¿Qué pH tiene el agua pura?|7|0|14|5
¿Qué parte de la planta hace la fotosíntesis principalmente?|Las hojas|Las raíces|Las flores|Las semillas
¿Qué gas absorben las plantas en la fotosíntesis?|Dióxido de carbono|Oxígeno|Nitrógeno|Hidrógeno
¿Qué pigmento da el color verde a las plantas?|Clorofila|Melanina|Caroteno|Hemoglobina
¿Cuál es la unidad de la fuerza en el Sistema Internacional?|Newton|Julio|Vatio|Pascal
¿Cuál es la unidad de la energía en el Sistema Internacional?|Julio|Newton|Vatio|Amperio
¿Cuál es la unidad de la potencia eléctrica?|Vatio|Voltio|Amperio|Ohmio
¿En qué unidad se mide la resistencia eléctrica?|Ohmio|Voltio|Amperio|Faradio
¿Qué dice la ley de Ohm?|V = I × R|E = m × c²|F = m × a|P = V / I²
¿Cuál es la famosa ecuación de Einstein?|E = mc²|F = ma|a² + b² = c²|PV = nRT
¿Qué dice el teorema de Pitágoras?|a² + b² = c² en un triángulo rectángulo|La suma de ángulos es 360°|El área es base por altura|E = mc²
¿Cuánto suman los ángulos interiores de un triángulo?|180°|360°|90°|270°
¿Cuál es el valor aproximado de pi?|3,1416|3,1614|2,7182|1,6180
¿Qué número es aproximadamente e, la base de los logaritmos naturales?|2,718|3,141|1,618|1,414
¿Cuál es el único número primo par?|2|4|0|1
¿Es el 1 un número primo?|No|Sí|Solo en binario|Depende
¿Cuánto es 2 elevado a 10?|1024|1000|2048|512
¿Cuál es la raíz cuadrada de 144?|12|14|11|16
¿Cuánto es 0,1 + 0,2 en coma flotante en casi todos los lenguajes?|0,30000000000000004|0,3 exactamente|0,2|Da error
¿Cuántos lados tiene un hexágono?|6|5|7|8
¿Cuántos grados tiene un ángulo recto?|90°|180°|45°|60°
¿Qué es un número primo?|Un número que solo es divisible entre 1 y él mismo|Un número par|Un número negativo|Un número con decimales
¿Qué es el número áureo, aproximadamente?|1,618|3,14|2,71|1,41
¿Qué estado de la materia tiene forma y volumen propios?|Sólido|Líquido|Gas|Plasma
¿Cómo se llama el paso de sólido a gas sin pasar por líquido?|Sublimación|Evaporación|Fusión|Condensación
¿Qué partícula del átomo tiene carga negativa?|Electrón|Protón|Neutrón|Núcleo
¿Qué partícula del átomo no tiene carga?|Neutrón|Protón|Electrón|Positrón
¿Quién creó la tabla periódica de los elementos?|Dmitri Mendeléyev|Antoine Lavoisier|John Dalton|Niels Bohr
¿Cuál es el metal que es líquido a temperatura ambiente?|Mercurio|Plomo|Aluminio|Estaño
¿Cuál es el material natural más duro?|Diamante|Hierro|Granito|Cuarzo
¿Qué capa de la atmósfera nos protege de los rayos ultravioleta?|La capa de ozono|La troposfera entera|La ionosfera|La exosfera
¿Qué tipo de energía viene del Sol y se aprovecha con placas?|Solar|Eólica|Geotérmica|Nuclear
¿Qué energía aprovecha la fuerza del viento?|Eólica|Hidráulica|Solar|Mareomotriz
¿Qué fuerza nos mantiene pegados al suelo?|La gravedad|El magnetismo|La fricción|La electricidad
¿Cuál es la aceleración de la gravedad en la Tierra, aproximadamente?|9,8 m/s²|1 m/s²|98 m/s²|3,7 m/s²
¿Dónde no se puede propagar el sonido?|En el vacío|En el agua|En el aire|En el metal
¿Qué viaja más rápido?|La luz|El sonido|Un avión supersónico|Un cohete
¿Qué color se obtiene al mezclar luz roja, verde y azul?|Blanco|Negro|Marrón|Gris oscuro
¿En qué sistema de color se basan las pantallas?|RGB|CMYK|Pantone|RYB
¿Qué colores usan las impresoras normalmente?|CMYK|RGB|HSL|HEX
¿Qué órgano produce la insulina?|El páncreas|El hígado|El riñón|El estómago
¿Qué vitamina produce la piel con la luz del sol?|Vitamina D|Vitamina C|Vitamina A|Vitamina B12
¿Qué órgano filtra la sangre y produce la orina?|Los riñones|El hígado|Los pulmones|El bazo
¿Cuántos dientes tiene normalmente un adulto?|32|28|36|20
¿Cuál es el hueso más largo del cuerpo humano?|El fémur|La tibia|El húmero|La columna
¿Qué parte del ojo controla cuánta luz entra?|La pupila (con el iris)|La retina|La córnea|El nervio óptico
¿Cuántos sentidos clásicos tiene el ser humano?|5|4|6|7
¿Qué científico estudió la radiactividad junto a su marido Pierre?|Marie Curie|Rosalind Franklin|Lise Meitner|Hedy Lamarr
¿Qué inventó Thomas Edison que más se le atribuye?|La bombilla incandescente práctica|El teléfono|La radio|El ordenador
¿Quién inventó el teléfono según la patente de 1876?|Alexander Graham Bell|Thomas Edison|Nikola Tesla|Guglielmo Marconi
¿Por qué es famoso Nikola Tesla?|Por sus trabajos en corriente alterna|Por inventar internet|Por descubrir la penicilina|Por la teoría de la evolución
¿Qué es un agujero negro?|Una región del espacio de la que ni la luz puede escapar|Un planeta oscuro|Un cráter|Una estrella apagada siempre visible
¿Cómo se llama nuestra galaxia?|Vía Láctea|Andrómeda|Orión|Sombrero
¿Qué es una supernova?|La explosión de una estrella|Un planeta nuevo|Un cometa|Un satélite artificial
¿Cuál es el punto más alto de la Tierra?|El monte Everest|El K2|El Kilimanjaro|El Aconcagua
¿Qué es la fotosíntesis?|El proceso con el que las plantas fabrican alimento usando luz|La respiración de los animales|La digestión|La reproducción de hongos
¿Por qué los virus informáticos se llaman así?|Porque se copian a sí mismos y se propagan|Porque están hechos de ADN|Porque los curan los antibióticos|Porque los inventó un médico
¿Sirven los antibióticos contra los virus?|No, solo contra bacterias|Sí, siempre|Solo contra la gripe|Solo en niños
`]);
QZ.push(['Geografía',`
¿Cuál es la capital de Francia?|París|Lyon|Marsella|Burdeos
¿Cuál es la capital de Italia?|Roma|Milán|Venecia|Nápoles
¿Cuál es la capital de Alemania?|Berlín|Múnich|Fráncfort|Hamburgo
¿Cuál es la capital de Portugal?|Lisboa|Oporto|Coímbra|Braga
¿Cuál es la capital del Reino Unido?|Londres|Mánchester|Edimburgo|Liverpool
¿Cuál es la capital de Japón?|Tokio|Kioto|Osaka|Hiroshima
¿Cuál es la capital de Australia?|Canberra|Sídney|Melbourne|Perth
¿Cuál es la capital de Canadá?|Ottawa|Toronto|Montreal|Vancouver
¿Cuál es la capital de Estados Unidos?|Washington D. C.|Nueva York|Los Ángeles|Chicago
¿Cuál es la capital de Brasil?|Brasilia|Río de Janeiro|São Paulo|Salvador
¿Cuál es la capital de Argentina?|Buenos Aires|Córdoba|Rosario|Mendoza
¿Cuál es la capital de México?|Ciudad de México|Guadalajara|Monterrey|Cancún
¿Cuál es la capital de Colombia?|Bogotá|Medellín|Cali|Cartagena
¿Cuál es la capital de Perú?|Lima|Cuzco|Arequipa|Trujillo
¿Cuál es la capital de Chile?|Santiago|Valparaíso|Concepción|Antofagasta
¿Cuál es la capital de Marruecos?|Rabat|Casablanca|Marrakech|Fez
¿Cuál es la capital de Egipto?|El Cairo|Alejandría|Luxor|Giza
¿Cuál es la capital de Turquía?|Ankara|Estambul|Esmirna|Antalya
¿Cuál es la capital de Rusia?|Moscú|San Petersburgo|Kiev|Minsk
¿Cuál es la capital de China?|Pekín|Shanghái|Hong Kong|Cantón
¿Cuál es la capital de la India?|Nueva Delhi|Bombay|Calcuta|Bangalore
¿Cuál es la capital de Corea del Sur?|Seúl|Busan|Pyongyang|Incheon
¿Cuál es la capital de Países Bajos?|Ámsterdam|Róterdam|La Haya|Utrecht
¿Cuál es la capital de Suiza?|Berna|Zúrich|Ginebra|Basilea
¿Cuál es la capital de Bélgica?|Bruselas|Amberes|Brujas|Gante
¿Cuál es la capital de Suecia?|Estocolmo|Oslo|Copenhague|Helsinki
¿Cuál es la capital de Noruega?|Oslo|Estocolmo|Bergen|Helsinki
¿Cuál es la capital de Finlandia?|Helsinki|Oslo|Tallin|Estocolmo
¿Cuál es la capital de Dinamarca?|Copenhague|Oslo|Aarhus|Estocolmo
¿Cuál es la capital de Grecia?|Atenas|Salónica|Esparta|Creta
¿Cuál es la capital de Polonia?|Varsovia|Cracovia|Gdansk|Praga
¿Cuál es la capital de la República Checa?|Praga|Brno|Viena|Bratislava
¿Cuál es la capital de Austria?|Viena|Salzburgo|Graz|Innsbruck
¿Cuál es la capital de Irlanda?|Dublín|Belfast|Cork|Galway
¿Cuál es la capital de Islandia?|Reikiavik|Oslo|Akureyri|Nuuk
¿Cuál es la capital de Nueva Zelanda?|Wellington|Auckland|Christchurch|Sídney
¿Cuál es la capital de Cuba?|La Habana|Santiago de Cuba|Varadero|Camagüey
¿Cuál es la capital de Venezuela?|Caracas|Maracaibo|Valencia|Mérida
¿Cuál es la capital de Uruguay?|Montevideo|Punta del Este|Salto|Colonia
¿Cuál es la capital de Ecuador?|Quito|Guayaquil|Cuenca|Manta
¿Cuál es la capital de Bolivia, sede del gobierno?|La Paz|Santa Cruz|Cochabamba|Potosí
¿Cuál es la capital de Paraguay?|Asunción|Ciudad del Este|Encarnación|Luque
¿Cuál es la capital de Kenia?|Nairobi|Mombasa|Kisumu|Nakuru
¿Cuál es la capital de Nigeria?|Abuya|Lagos|Kano|Ibadán
¿Cuál es la capital de Sudáfrica donde está el gobierno?|Pretoria|Johannesburgo|Durban|Port Elizabeth
¿Cuál es la capital de Tailandia?|Bangkok|Phuket|Chiang Mai|Pattaya
¿Cuál es la capital de Vietnam?|Hanói|Ho Chi Minh|Da Nang|Hue
¿Cuál es la capital de Indonesia?|Yakarta|Bali|Surabaya|Bandung
¿Cuál es la capital de Filipinas?|Manila|Cebú|Dávao|Quezón
¿Cuál es la capital de Arabia Saudí?|Riad|La Meca|Yeda|Medina
¿Cuál es el río más largo de España?|Tajo|Ebro|Duero|Guadalquivir
¿Cuál es el río más caudaloso de España?|Ebro|Tajo|Guadiana|Miño
¿Qué río pasa por Sevilla?|Guadalquivir|Guadiana|Tajo|Segura
¿Qué río pasa por Zaragoza?|Ebro|Duero|Tajo|Júcar
¿Qué río pasa por Madrid?|Manzanares|Tajo|Henares|Jarama
¿Cuál es la montaña más alta de España?|El Teide|El Mulhacén|El Aneto|El Veleta
¿Cuál es la montaña más alta de la península ibérica?|El Mulhacén|El Teide|El Aneto|El Almanzor
¿En qué isla está el Teide?|Tenerife|Gran Canaria|La Palma|Lanzarote
¿Cuántas comunidades autónomas tiene España?|17|15|19|20
¿Cuántas provincias tiene España?|50|52|47|17
¿Cuáles son las dos ciudades autónomas de España?|Ceuta y Melilla|Ceuta y Gibraltar|Melilla y Andorra|Ibiza y Menorca
¿Qué comunidad autónoma es la más grande de España?|Castilla y León|Andalucía|Castilla-La Mancha|Aragón
¿Cuál es la ciudad más poblada de España?|Madrid|Barcelona|Valencia|Sevilla
¿En qué comunidad está Toledo?|Castilla-La Mancha|Madrid|Castilla y León|Extremadura
¿Cuál es la capital de Galicia?|Santiago de Compostela|A Coruña|Vigo|Lugo
¿Cuál es la capital de Extremadura?|Mérida|Badajoz|Cáceres|Plasencia
¿Qué mar baña la costa de Barcelona?|El Mediterráneo|El Cantábrico|El Atlántico|El de Alborán solo
¿Qué mar baña Santander y Bilbao?|El Cantábrico|El Mediterráneo|El del Norte|El Báltico
¿Cuál es el río más largo del mundo, según la mayoría de mediciones?|El Nilo|El Amazonas|El Yangtsé|El Misisipi
¿Cuál es el río con más caudal del mundo?|El Amazonas|El Nilo|El Congo|El Danubio
¿Cuál es el océano más grande?|El Pacífico|El Atlántico|El Índico|El Ártico
¿Cuál es el continente más grande?|Asia|África|América|Europa
¿Cuál es el país más grande del mundo por superficie?|Rusia|Canadá|China|Estados Unidos
¿Cuál es el país más pequeño del mundo?|Ciudad del Vaticano|Mónaco|San Marino|Andorra
¿Cuál es el desierto cálido más grande del mundo?|El Sahara|El Gobi|El Atacama|El de Arabia
¿Cuál es el desierto más seco del mundo, sin contar los polares?|Atacama|Sahara|Gobi|Kalahari
¿En qué país está el monte Everest, en la frontera con China?|Nepal|India|Bután|Pakistán
¿Cuál es el lago más grande del mundo por superficie?|El mar Caspio|El lago Superior|El Titicaca|El Victoria
¿En qué continente está Egipto?|África|Asia|Europa|Oceanía
¿Cuántos continentes se suelen contar?|6 o 7, según el criterio|3|10|12
¿Qué país tiene forma de bota?|Italia|Grecia|Chile|Portugal
¿Qué país es famoso por los fiordos?|Noruega|Holanda|Italia|Grecia
¿En qué país están las pirámides de Giza?|Egipto|México|Perú|Sudán
¿En qué país está Machu Picchu?|Perú|Bolivia|México|Chile
¿En qué ciudad está la Torre Eiffel?|París|Londres|Bruselas|Roma
¿En qué ciudad está el Coliseo?|Roma|Atenas|Florencia|Nápoles
¿En qué ciudad está la Sagrada Familia?|Barcelona|Madrid|Valencia|Bilbao
¿En qué ciudad está la Alhambra?|Granada|Córdoba|Sevilla|Málaga
¿En qué ciudad está el museo Guggenheim de la ría?|Bilbao|San Sebastián|Santander|Vitoria
¿En qué país está la Gran Muralla?|China|Japón|Mongolia|Corea
¿En qué país está el Taj Mahal?|India|Pakistán|Irán|Bangladés
¿En qué ciudad está la Estatua de la Libertad?|Nueva York|Washington|Boston|Filadelfia
¿En qué país está el Cristo Redentor del Corcovado?|Brasil|Argentina|Portugal|México
¿Qué idioma se habla oficialmente en Brasil?|Portugués|Español|Brasileño|Inglés
¿Qué idioma tiene más hablantes nativos del mundo?|Chino mandarín|Inglés|Español|Hindi
¿Cuál es la moneda de Japón?|Yen|Yuan|Won|Rupia
¿Cuál es la moneda del Reino Unido?|Libra esterlina|Euro|Dólar|Corona
¿Cuál es la moneda de Suiza?|Franco suizo|Euro|Corona|Marco
¿Qué estrecho separa España de África?|Estrecho de Gibraltar|Estrecho de Bering|Estrecho de Magallanes|Bósforo
¿Qué cordillera separa España de Francia?|Los Pirineos|Los Alpes|Los Apeninos|Sierra Nevada
¿Qué cordillera es la más larga del mundo?|Los Andes|El Himalaya|Las Rocosas|Los Alpes
¿Qué línea imaginaria divide la Tierra en norte y sur?|El ecuador|El meridiano de Greenwich|El trópico de Cáncer|El círculo polar
¿Por qué ciudad pasa el meridiano 0 que da nombre a la hora GMT?|Greenwich (Londres)|París|Madrid|Roma
¿Cuántos husos horarios tiene la Tierra aproximadamente?|24|12|36|7
¿Qué país tiene más habitantes del mundo según la ONU desde 2023?|India|China|Estados Unidos|Indonesia
¿Qué volcán sepultó la ciudad de Pompeya?|El Vesubio|El Etna|El Teide|El Estrómboli
¿En qué isla de Canarias hubo una gran erupción volcánica en 2021?|La Palma|Tenerife|Lanzarote|El Hierro
¿Cuál es el país más poblado de África?|Nigeria|Egipto|Etiopía|Sudáfrica
¿Qué océano está entre América y Europa?|El Atlántico|El Pacífico|El Índico|El Ártico
¿Dónde está la Antártida?|En el polo sur|En el polo norte|En Groenlandia|En Siberia
¿A qué país pertenece Groenlandia?|Dinamarca|Noruega|Canadá|Islandia
¿Qué país tiene la bandera con una hoja de arce?|Canadá|Suiza|Japón|Austria
¿Qué país tiene un sol en el centro de su bandera roja y blanca?|Japón|China|Corea del Sur|Bangladés
¿Cuántas estrellas tiene la bandera de la Unión Europea?|12|15|27|10
`]);
QZ.push(['Historia',`
¿En qué año llegó Colón a América?|1492|1512|1478|1500
¿En qué año empezó la Segunda Guerra Mundial?|1939|1914|1945|1936
¿En qué año terminó la Segunda Guerra Mundial?|1945|1944|1950|1939
¿En qué año empezó la Primera Guerra Mundial?|1914|1918|1905|1939
¿En qué año cayó el muro de Berlín?|1989|1991|1975|2001
¿En qué año empezó la Revolución francesa?|1789|1812|1689|1848
¿En qué año se aprobó la Constitución española actual?|1978|1975|1982|1931
¿En qué año murió Franco?|1975|1978|1969|1982
¿En qué año entró España en la Comunidad Económica Europea?|1986|1978|1992|2002
¿En qué año empezó a circular el euro en billetes y monedas?|2002|1999|1995|2008
¿En qué año se celebraron los Juegos Olímpicos de Barcelona?|1992|1988|1996|1982
¿En qué año fue la Exposición Universal de Sevilla?|1992|1982|2000|1975
¿Qué reyes son conocidos como los Reyes Católicos?|Isabel I de Castilla y Fernando II de Aragón|Felipe II y María Tudor|Carlos I e Isabel de Portugal|Alfonso X y Violante
¿En qué año terminó la Reconquista con la toma de Granada?|1492|1212|1453|1516
¿Qué civilización construyó Machu Picchu?|Los incas|Los mayas|Los aztecas|Los olmecas
¿Qué ciudad era la capital de los aztecas?|Tenochtitlan|Cuzco|Chichén Itzá|Teotihuacán
¿Quién conquistó el imperio azteca?|Hernán Cortés|Francisco Pizarro|Cristóbal Colón|Vasco Núñez de Balboa
¿Quién conquistó el imperio inca?|Francisco Pizarro|Hernán Cortés|Pedro de Valdivia|Diego de Almagro
¿Quién completó la primera vuelta al mundo tras la muerte de Magallanes?|Juan Sebastián Elcano|Cristóbal Colón|Américo Vespucio|Vasco da Gama
¿Qué emperador romano fue el primero?|Augusto|Julio César|Nerón|Trajano
¿Qué emperador romano nació en Hispania, en Itálica?|Trajano|Augusto|Calígula|Constantino
¿Qué pueblo construyó las pirámides de Giza?|Los antiguos egipcios|Los romanos|Los griegos|Los mayas
¿En qué año cayó el Imperio romano de Occidente según la fecha tradicional?|476|1453|212|800
¿En qué año cayó Constantinopla en manos otomanas?|1453|1492|1204|1517
¿Quién fue coronado emperador en el año 800?|Carlomagno|Napoleón|Julio César|Otón I
¿Qué general francés se coronó emperador en 1804?|Napoleón Bonaparte|Luis XIV|Carlomagno|Charles de Gaulle
¿En qué batalla fue derrotado definitivamente Napoleón?|Waterloo|Trafalgar|Austerlitz|Bailén
¿Qué batalla naval de 1805 perdieron España y Francia frente a Gran Bretaña?|Trafalgar|Lepanto|Waterloo|La Armada Invencible
¿Qué batalla naval de 1571 ganó la Liga Santa contra los otomanos?|Lepanto|Trafalgar|Actium|Salamina
¿Qué escritor español participó en la batalla de Lepanto?|Miguel de Cervantes|Lope de Vega|Quevedo|Calderón de la Barca
¿Qué rey español decía que en su imperio no se ponía el sol?|Felipe II|Carlos III|Fernando VII|Alfonso XIII
¿En qué año empezó la Guerra Civil española?|1936|1931|1939|1923
¿En qué año terminó la Guerra Civil española?|1939|1936|1945|1940
¿Qué periodo histórico empezó con la invención de la escritura?|La Historia (Edad Antigua)|El Paleolítico|El Neolítico|La Edad Media
¿Dónde se inventó la escritura cuneiforme?|Mesopotamia|Egipto|China|Grecia
¿Qué revolución transformó la economía con las máquinas de vapor?|La Revolución Industrial|La Revolución francesa|La Revolución rusa|El Renacimiento
¿Quién inventó la imprenta de tipos móviles en Europa?|Johannes Gutenberg|Leonardo da Vinci|Galileo|Martín Lutero
¿Quién pintó la Mona Lisa?|Leonardo da Vinci|Miguel Ángel|Rafael|Botticelli
¿Quién pintó la Capilla Sixtina?|Miguel Ángel|Leonardo da Vinci|Rafael|Tiziano
¿Qué periodo cultural europeo «hizo renacer» el arte clásico en los siglos XV y XVI?|El Renacimiento|El Barroco|El Gótico|El Romanticismo
¿Qué faraón egipcio es famoso por su tumba casi intacta descubierta en 1922?|Tutankamón|Ramsés II|Keops|Cleopatra
¿Qué reina de Egipto tuvo relación con Julio César y Marco Antonio?|Cleopatra|Nefertiti|Hatshepsut|Isis
¿Qué filósofo griego fue maestro de Alejandro Magno?|Aristóteles|Platón|Sócrates|Pitágoras
¿Quién escribió «La República»?|Platón|Aristóteles|Homero|Sócrates
¿A quién se atribuyen la Ilíada y la Odisea?|Homero|Virgilio|Sófocles|Esopo
¿Qué ciudad griega era famosa por su educación militar?|Esparta|Atenas|Corinto|Tebas
¿En qué ciudad nació la democracia?|Atenas|Roma|Esparta|Alejandría
¿Qué muro separó Berlín entre 1961 y 1989?|El muro de Berlín|El telón de acero literal|El muro de Adriano|La línea Maginot
¿Cómo se llamó el enfrentamiento entre EE. UU. y la URSS sin guerra directa?|La Guerra Fría|La Guerra de los Cien Años|La Gran Guerra|La Guerra de Secesión
¿En qué año se disolvió la URSS?|1991|1989|1985|1999
¿Quién fue el primer presidente de Estados Unidos?|George Washington|Abraham Lincoln|Thomas Jefferson|John Adams
¿Qué presidente de EE. UU. abolió la esclavitud?|Abraham Lincoln|George Washington|Franklin Roosevelt|John F. Kennedy
¿En qué año se declaró la independencia de Estados Unidos?|1776|1789|1812|1492
¿Quién lideró la independencia de la India con la no violencia?|Mahatma Gandhi|Nelson Mandela|Martin Luther King|Nehru
¿Quién fue presidente de Sudáfrica tras 27 años en prisión?|Nelson Mandela|Desmond Tutu|Gandhi|Kofi Annan
¿Quién pronunció el discurso «I have a dream»?|Martin Luther King|Malcolm X|Barack Obama|John F. Kennedy
¿En qué año atentaron contra las Torres Gemelas?|2001|1999|2003|2011
¿Qué organización se creó en 1945 para mantener la paz mundial?|La ONU|La OTAN|La UE|La OMS
¿En qué ciudad tiene su sede principal la ONU?|Nueva York|Ginebra|París|Bruselas
¿En qué año se firmó el Tratado de Maastricht que creó la Unión Europea?|1992|1957|2002|1986
¿Qué imperio construyó la mezquita de Córdoba en su origen?|El emirato y califato omeya de al-Ándalus|El Imperio romano|Los visigodos|Los almohades solo
¿Qué pueblo germánico gobernó Hispania antes de la llegada musulmana?|Los visigodos|Los vándalos|Los francos|Los ostrogodos
¿En qué año llegaron los musulmanes a la península ibérica?|711|476|1085|1212
¿Qué rey de Castilla fue llamado «el Sabio»?|Alfonso X|Fernando III|Pedro I|Sancho IV
¿Qué obra escribió Miguel de Cervantes?|Don Quijote de la Mancha|La Celestina|El Lazarillo|La vida es sueño
¿En qué año se publicó la primera parte del Quijote?|1605|1492|1700|1550
¿Quién pintó «Las Meninas»?|Velázquez|Goya|El Greco|Murillo
¿Quién pintó el «Guernica»?|Pablo Picasso|Salvador Dalí|Joan Miró|Goya
¿Qué pintor español es famoso por los relojes blandos?|Salvador Dalí|Picasso|Miró|Sorolla
¿Qué pintor retrató los fusilamientos del 3 de mayo de 1808?|Francisco de Goya|Velázquez|Sorolla|Zurbarán
¿Qué arquitecto diseñó la Sagrada Familia?|Antoni Gaudí|Santiago Calatrava|Rafael Moneo|Le Corbusier
¿Qué científico español ganó el Nobel por sus estudios de las neuronas?|Santiago Ramón y Cajal|Severo Ochoa|Isaac Peral|Juan de la Cierva
¿Qué inventor español creó el autogiro?|Juan de la Cierva|Isaac Peral|Leonardo Torres Quevedo|Narciso Monturiol
¿Qué inventor español creó uno de los primeros submarinos eléctricos?|Isaac Peral|Juan de la Cierva|Monturiol solo|Torres Quevedo
¿Qué español construyó «El Ajedrecista», una de las primeras máquinas automáticas que jugaba al ajedrez?|Leonardo Torres Quevedo|Isaac Peral|Ramón y Cajal|Juan de la Cierva
¿Qué edad histórica va de la caída de Roma al descubrimiento de América, aproximadamente?|La Edad Media|La Edad Moderna|La Edad Antigua|La Edad Contemporánea
¿Con qué hecho se suele marcar el inicio de la Edad Contemporánea?|La Revolución francesa|El descubrimiento de América|La caída de Roma|La Segunda Guerra Mundial
¿Qué material dio nombre a la edad posterior a la Edad del Cobre?|El bronce|El hierro|La piedra|El oro
¿Dónde están las famosas pinturas rupestres de bisontes en España?|Cueva de Altamira|Cueva de Nerja|Atapuerca|Cueva de las Manos
¿Qué yacimiento de Burgos es clave para estudiar la evolución humana?|Atapuerca|Altamira|Numancia|Itálica
¿Qué ciudad celtíbera resistió a Roma hasta el año 133 a. C.?|Numancia|Sagunto|Cartago|Tarraco
¿Qué general cartaginés cruzó los Alpes con elefantes?|Aníbal|Asdrúbal|Escipión|Amílcar
¿Qué barco se hundió en 1912 tras chocar con un iceberg?|El Titanic|El Lusitania|El Britannic|El Queen Mary
¿Qué hermanos hicieron volar el primer avión a motor en 1903?|Los hermanos Wright|Los hermanos Lumière|Los hermanos Montgolfier|Los hermanos Grimm
¿Qué hermanos son pioneros del cine?|Los hermanos Lumière|Los hermanos Wright|Los hermanos Marx|Los hermanos Grimm
¿En qué año se lanzó el Sputnik, el primer satélite artificial?|1957|1969|1945|1961
¿Qué país lanzó el Sputnik?|La Unión Soviética|Estados Unidos|China|Francia
¿Qué red militar de EE. UU. es antecesora de internet?|ARPANET|Ethernet|NSFNET solo|Minitel
¿En qué año se envió el primer correo electrónico entre ordenadores en red, aproximadamente?|1971|1990|1985|1960
¿En qué año se hizo pública la World Wide Web?|1991|1983|2000|1975
¿Qué empresa lanzó Windows 95?|Microsoft|Apple|IBM|Intel
¿En qué año se fundó Google?|1998|2004|1994|2001
¿En qué año se fundó Facebook?|2004|1998|2008|2010
¿En qué año se creó YouTube?|2005|2000|2009|2012
¿Qué guerra enfrentó al norte y al sur de Estados Unidos entre 1861 y 1865?|La Guerra de Secesión|La Guerra de Independencia|La Guerra de 1812|La Guerra de Corea
¿Qué ciudad japonesa recibió la primera bomba atómica en 1945?|Hiroshima|Nagasaki|Tokio|Osaka
¿Qué científico dirigió el Proyecto Manhattan?|J. Robert Oppenheimer|Albert Einstein|Enrico Fermi|Niels Bohr
`]);
QZ.push(['Naturaleza y animales',`
¿Cuál es el animal terrestre más rápido?|El guepardo|El león|El caballo|La gacela
¿Cuál es el animal más grande que ha existido?|La ballena azul|El tiranosaurio|El elefante africano|El megalodón
¿Cuál es el animal terrestre más grande en la actualidad?|El elefante africano|La jirafa|El rinoceronte|El hipopótamo
¿Cuál es el animal más alto?|La jirafa|El elefante|El avestruz|El camello
¿Qué animal es el único mamífero capaz de volar de verdad?|El murciélago|La ardilla voladora|El colugo|El pingüino
¿Cuántas patas tiene una araña?|8|6|10|12
¿Cuántas patas tiene un insecto?|6|8|4|10
¿Cuántos corazones tiene un pulpo?|3|1|2|8
¿De qué color es la sangre de un pulpo?|Azul|Roja|Verde|Transparente
¿Qué animal pone los huevos más grandes?|El avestruz|El águila|La gallina|El pingüino emperador
¿Qué ave no puede volar y vive en la Antártida?|El pingüino emperador|El albatros|El kiwi|El frailecillo
¿Qué animal es el símbolo de Australia junto al emú?|El canguro|El koala solo|El ornitorrinco|El dingo
¿Qué mamífero pone huevos?|El ornitorrinco|El canguro|El murciélago|El delfín
¿Qué come principalmente el koala?|Hojas de eucalipto|Bambú|Insectos|Fruta
¿Qué come principalmente el panda gigante?|Bambú|Eucalipto|Pescado|Carne
¿Es la ballena un pez?|No, es un mamífero|Sí|Es un anfibio|Es un reptil
¿Es el delfín un mamífero?|Sí|No, es un pez|Es un anfibio|Es un reptil
¿Cómo respiran los peces?|Con branquias|Con pulmones|Por la piel solo|No respiran
¿Qué animal cambia de color para camuflarse, famoso por ello?|El camaleón|La iguana|El cocodrilo|La tortuga
¿Qué animal tiene la memoria más famosa en los dichos?|El elefante|El pez|El perro|El loro
¿Cuánto vive aproximadamente una mosca común adulta?|Unas semanas|Un día|Diez años|Un año
¿Qué animal puede regenerar su cola tras perderla?|La lagartija|El perro|La serpiente|El gato
¿Qué animal es una cría de rana?|El renacuajo|La oruga|El alevín|La larva de mosca
¿En qué se convierte una oruga?|En mariposa|En abeja|En araña|En escarabajo
¿Qué produce una abeja?|Miel y cera|Seda|Leche|Perlas
¿Qué insecto produce la seda?|El gusano de seda|La araña|La abeja|La hormiga
¿Qué animal fabrica perlas?|La ostra|El cangrejo|La estrella de mar|El calamar
¿Cuántos brazos tiene una estrella de mar común?|5|4|8|6
¿Qué tipo de animal es la serpiente?|Reptil|Anfibio|Mamífero|Pez
¿Qué tipo de animal es la rana?|Anfibio|Reptil|Pez|Mamífero
¿Qué tipo de animal es el tiburón?|Pez|Mamífero|Reptil|Anfibio
¿Qué animal se llama «el rey de la selva» aunque vive en la sabana?|El león|El tigre|El gorila|El elefante
¿Cuál es el felino más grande?|El tigre|El león|El jaguar|El leopardo
¿Qué animal tiene rayas blancas y negras y es un équido?|La cebra|El tapir|El okapi|El burro
¿Qué ave es símbolo de la paz?|La paloma|El águila|El cisne|El gorrión
¿Qué ave puede volar hacia atrás?|El colibrí|El halcón|La golondrina|El búho
¿Cuál es el ave más rápida en picado?|El halcón peregrino|El águila real|El colibrí|El vencejo
¿Qué ave es conocida por girar mucho la cabeza y cazar de noche?|El búho|La gaviota|El loro|La cigüeña
¿Qué animal es el mejor amigo del hombre según el dicho?|El perro|El gato|El caballo|El loro
¿Cuántas horas al día duerme aproximadamente un gato?|Entre 12 y 16|2|24|6
¿Cómo se llama la cría del caballo?|Potro|Ternero|Cordero|Lechón
¿Cómo se llama la cría de la vaca?|Ternero|Potro|Cabrito|Cachorro
¿Qué es un herbívoro?|Un animal que solo come plantas|Un animal que come carne|Un animal que come de todo|Una planta carnívora
¿Qué es un omnívoro?|Un animal que come plantas y animales|Un animal que solo come carne|Un animal que solo come plantas|Un animal que no come
¿Qué planta es famosa por cazar insectos?|La dionea o atrapamoscas|El cactus|El girasol|El helecho
¿Qué árbol da bellotas?|La encina y el roble|El pino|El olivo|El naranjo
¿Qué árbol da aceitunas?|El olivo|El almendro|El nogal|La encina
¿Qué flor gira siguiendo al sol cuando es joven?|El girasol|La rosa|El tulipán|La margarita
¿Qué planta del desierto guarda agua en su tallo?|El cactus|El helecho|El musgo|La hiedra
¿Cuál es el árbol más alto del mundo?|La secuoya roja|El baobab|El eucalipto|El pino
¿Qué parte de la planta absorbe el agua del suelo?|La raíz|La hoja|La flor|El fruto
¿Qué gas desprenden las plantas al hacer la fotosíntesis?|Oxígeno|Dióxido de carbono|Metano|Nitrógeno
¿Qué es un ecosistema?|Un conjunto de seres vivos y el lugar donde viven|Un tipo de planta|Un animal en peligro|Un parque
¿Qué selva es la más grande del mundo?|La Amazonía|La selva del Congo|La de Borneo|La de Daintree
¿Qué es una especie en peligro de extinción?|Una especie que podría desaparecer|Una especie peligrosa|Una especie muy común|Una especie inventada
¿Qué felino ibérico ha estado en grave peligro de extinción?|El lince ibérico|El gato montés|El tigre|El guepardo
¿Qué oso vive en la cordillera Cantábrica?|El oso pardo|El oso polar|El oso panda|El oso negro americano
¿Qué ave grande y negra se ve en los Pirineos y come huesos?|El quebrantahuesos|El cuervo|El águila calva|El cóndor
¿Cuál es el parque nacional más famoso de humedales en Andalucía?|Doñana|Ordesa|Picos de Europa|Cabañeros
¿Qué parque nacional de Huesca tiene el monte Perdido?|Ordesa y Monte Perdido|Aigüestortes|Sierra Nevada|Monfragüe
¿Qué animal hiberna en invierno?|El oso|El caballo|La vaca|El perro
¿Qué hacen las aves migratorias?|Viajan largas distancias según la estación|Cambian de plumas cada día|Viven bajo tierra|Hibernan bajo el agua
¿Qué ave hace nidos en campanarios en España?|La cigüeña blanca|El flamenco|El águila|El pato
¿Por qué los flamencos son rosas?|Por los pigmentos de lo que comen|Porque nacen así siempre|Por el sol|Por el frío
¿Cuántos ojos tienen la mayoría de las arañas?|8|2|4|6
¿Qué animal tiene la lengua más larga respecto a su cuerpo, famoso por ello?|El camaleón|La jirafa|El perro|La vaca
¿Qué animal duerme de pie normalmente?|El caballo|El perro|El gato|El cerdo
¿Cuántos estómagos o compartimentos tiene el estómago de una vaca?|4|1|2|7
¿Qué animal produce la leche de la mozzarella tradicional italiana?|La búfala|La cabra|La oveja|La vaca solo
¿Qué animal es el más venenoso del mundo según muchas listas?|La medusa avispa de mar|La cobra|El escorpión|La tarántula
¿Cuántos años puede vivir una tortuga gigante?|Más de 100|10|30|5
¿Qué tiburón es el pez más grande del mundo?|El tiburón ballena|El tiburón blanco|El tiburón martillo|El tiburón tigre
¿Qué animal tiene trompa?|El elefante|El rinoceronte|El hipopótamo|La jirafa
¿Qué son los cuernos del ciervo que se le caen cada año?|Astas|Colmillos|Pezuñas|Escamas
¿Qué mamífero marino tiene colmillos largos y vive en el Ártico?|La morsa|La foca leopardo|El delfín|La orca
¿Cómo se llama un grupo de lobos?|Manada|Bandada|Banco|Enjambre
¿Cómo se llama un grupo de peces?|Banco|Manada|Rebaño|Jauría
¿Cómo se llama un grupo de abejas?|Enjambre|Banco|Bandada|Piara
¿Es el tomate una fruta o una verdura en botánica?|Una fruta|Una verdura|Una raíz|Un tubérculo
¿Qué fruto seco viene del almendro?|La almendra|La nuez|La avellana|El cacahuete
¿Es el cacahuete un fruto seco de árbol?|No, es una legumbre|Sí|Es una semilla de pino|Es un cereal
¿De qué planta se obtiene el chocolate?|Del cacao|Del café|De la vainilla|Del maíz
¿De qué país es originario el café, según la tradición?|Etiopía|Brasil|Colombia|Italia
¿De qué continente es originaria la patata?|América del Sur|Europa|Asia|África
¿Qué planta se usa para hacer el tequila?|El agave|El maíz|La caña de azúcar|El cactus de pera
¿Qué cereal es la base del sushi?|El arroz|El trigo|La avena|El maíz
¿Qué animal puede dormir con medio cerebro despierto?|El delfín|La vaca|El perro|El caballo
¿Qué animal tiene la mordida más fuerte de los vivos?|El cocodrilo de agua salada|El león|El tiburón blanco|El oso
¿Qué tipo de animal es la ballena orca?|Un delfín grande|Una ballena barbada|Un tiburón|Una foca
¿Qué animal es famoso por construir presas en los ríos?|El castor|La nutria|El mapache|El topo
¿Qué animal vive en colonias y tiene una reina?|La hormiga|El lobo|La paloma|El ratón
¿Qué animal no tiene huesos?|La medusa|El pez|La rana|El murciélago
¿Cuál es el mamífero que más tiempo puede vivir?|La ballena de Groenlandia|El elefante|El ser humano|La tortuga
`]);
QZ.push(['Curiosidades',`
¿Cuántos jugadores tiene un equipo de fútbol en el campo?|11|10|9|12
¿Cuántos jugadores tiene un equipo de baloncesto en la pista?|5|6|7|4
¿Cuántos jugadores tiene un equipo de voleibol en la pista?|6|5|7|8
¿Cada cuántos años se celebran los Juegos Olímpicos de verano?|4|2|3|5
¿Cuántos aros tiene el símbolo olímpico?|5|4|6|7
¿En qué año ganó España su primer Mundial de fútbol masculino?|2010|2008|2014|1982
¿En qué país se celebró el Mundial de fútbol de 2010?|Sudáfrica|Brasil|Alemania|Japón
¿En qué año ganó España el Mundial de fútbol femenino?|2023|2019|2015|2021
¿En qué deporte destacó Rafa Nadal?|Tenis|Fútbol|Golf|Baloncesto
¿Cuántos Roland Garros ganó Rafa Nadal?|14|10|12|9
¿En qué deporte compite Fernando Alonso?|Fórmula 1|MotoGP|Rally|Ciclismo
¿Cuántas casillas tiene un tablero de ajedrez?|64|36|81|100
¿Qué pieza de ajedrez se mueve en forma de L?|El caballo|El alfil|La torre|La reina
¿Qué pieza del ajedrez solo se mueve en diagonal?|El alfil|La torre|El caballo|El rey
¿Cuántas cartas tiene la baraja francesa sin comodines?|52|40|48|54
¿Cuántas cartas tiene la baraja española de 40?|40|48|52|36
¿Cuántos puntos suman las caras opuestas de un dado normal?|7|6|8|5
¿Cuántas notas musicales hay en la escala básica do-re-mi?|7|5|8|12
¿Cuántas cuerdas tiene una guitarra clásica?|6|4|5|12
¿Cuántas teclas tiene un piano estándar?|88|76|100|64
¿Qué compositor siguió componiendo aunque se quedó sordo?|Beethoven|Mozart|Bach|Vivaldi
¿Quién compuso «Las cuatro estaciones»?|Vivaldi|Mozart|Beethoven|Chopin
¿Qué banda británica tenía a John Lennon y Paul McCartney?|The Beatles|The Rolling Stones|Queen|Pink Floyd
¿Quién era el cantante de Queen?|Freddie Mercury|Mick Jagger|David Bowie|Elton John
¿Qué videojuego de construir con bloques es el más vendido de la historia?|Minecraft|Tetris|Fortnite|GTA V
¿Qué fontanero es la mascota de Nintendo?|Mario|Luigi|Link|Sonic
¿Qué empresa creó la PlayStation?|Sony|Nintendo|Microsoft|Sega
¿Qué empresa creó la Xbox?|Microsoft|Sony|Nintendo|Apple
¿Qué juego de piezas que caen inventó Alekséi Pázhitnov?|Tetris|Pac-Man|Snake|Arkanoid
¿Qué personaje amarillo come puntos y huye de fantasmas?|Pac-Man|Mario|Kirby|Pikachu
¿En qué teléfono se popularizó el juego de la serpiente (Snake)?|Nokia|iPhone|Samsung Galaxy|BlackBerry
¿De qué color es el caballo blanco de Santiago?|Blanco|Negro|Marrón|Gris
¿Qué día se celebra el Día Internacional del Libro?|23 de abril|14 de febrero|12 de octubre|1 de mayo
¿Qué día se celebra San Valentín?|14 de febrero|23 de abril|1 de noviembre|8 de marzo
¿Qué día se celebra el Día Internacional de la Mujer?|8 de marzo|14 de febrero|25 de noviembre|1 de mayo
¿Cuántos días tiene un año bisiesto?|366|365|364|360
¿Cada cuántos años hay un año bisiesto normalmente?|4|2|5|10
¿Cuántas horas tiene una semana?|168|144|120|180
¿Cuántos minutos tiene un día?|1440|1200|3600|720
¿Cuántos segundos tiene una hora?|3600|360|6000|60
¿Cuántas letras tiene el abecedario español actual?|27|26|28|30
¿Qué letra tiene el español que no tiene el inglés?|La ñ|La w|La k|La y
¿Qué institución cuida la lengua española?|La Real Academia Española|El Instituto Cervantes solo|La Biblioteca Nacional|El Ministerio de Educación
¿Qué palabra es un palíndromo?|Reconocer|Ordenador|Base|Tabla
¿Cuál es el plural de «el menú»?|Los menús|Los menúes|Los menú|Los menuses
¿Qué significa «byte» en el habla informática?|Unidad de 8 bits|Un mordisco de datos sin tamaño|Un virus|Un cable
¿Cómo se llama el símbolo @?|Arroba|Almohadilla|Ampersand|Asterisco
¿Cómo se llama el símbolo #?|Almohadilla|Arroba|Barra|Ampersand
¿Cómo se llama el símbolo &?|Et (ampersand)|Arroba|Almohadilla|Virgulilla
¿Cómo se llama el símbolo ~?|Virgulilla|Tilde invertida|Guion|Acento grave
¿Cómo se llama el símbolo * en informática?|Asterisco|Estrella fugaz|Almohadilla|Arroba
¿Quién escribió «Cien años de soledad»?|Gabriel García Márquez|Mario Vargas Llosa|Julio Cortázar|Pablo Neruda
¿Quién escribió «Romeo y Julieta»?|William Shakespeare|Charles Dickens|Lope de Vega|Molière
¿Quién escribió «Harry Potter»?|J. K. Rowling|J. R. R. Tolkien|Stephen King|Roald Dahl
¿Quién escribió «El Señor de los Anillos»?|J. R. R. Tolkien|C. S. Lewis|George R. R. Martin|J. K. Rowling
¿Quién escribió «1984»?|George Orwell|Aldous Huxley|Ray Bradbury|Isaac Asimov
¿Qué escritor formuló las tres leyes de la robótica?|Isaac Asimov|Julio Verne|H. G. Wells|Philip K. Dick
¿Quién escribió «Veinte mil leguas de viaje submarino»?|Julio Verne|H. G. Wells|Mark Twain|Daniel Defoe
¿Qué poeta escribió «Platero y yo»?|Juan Ramón Jiménez|Antonio Machado|Federico García Lorca|Miguel Hernández
¿Qué autor escribió «La casa de Bernarda Alba»?|Federico García Lorca|Valle-Inclán|Buero Vallejo|Antonio Machado
¿Qué película de 1997 trata del hundimiento de un famoso barco?|Titanic|Avatar|Gladiator|Pearl Harbor
¿Qué saga de películas tiene a Darth Vader?|Star Wars|Star Trek|Matrix|Dune
¿Qué película de 1999 trata de un mundo simulado por máquinas?|Matrix|Tron|Inception|Terminator
¿Cómo se llama la inteligencia artificial de la nave en «2001: Una odisea del espacio»?|HAL 9000|Skynet|Jarvis|Ultron
¿Qué superhéroe es Bruce Wayne?|Batman|Superman|Iron Man|Spider-Man
¿Qué superhéroe es Tony Stark?|Iron Man|Batman|Thor|Hulk
¿Qué premio de cine se representa con una estatuilla dorada llamada Óscar?|Los Premios de la Academia|Los Goya|Los Globos de Oro|Los Emmy
¿Cómo se llaman los premios del cine español?|Goya|Óscar|César|Ondas
¿Qué fiesta española consiste en lanzarse tomates?|La Tomatina de Buñol|Las Fallas|San Fermín|La Feria de Abril
¿En qué ciudad se celebran las Fallas?|Valencia|Pamplona|Sevilla|Alicante
¿En qué ciudad se celebran los Sanfermines?|Pamplona|Bilbao|Burgos|Logroño
¿Qué plato típico se hace con arroz en Valencia?|Paella|Fabada|Cocido|Gazpacho
¿Qué sopa fría típica de Andalucía lleva tomate?|Gazpacho|Fabada|Pisto|Caldo gallego
¿Con qué se hace tradicionalmente la tortilla española?|Huevo y patata (con o sin cebolla)|Huevo y jamón|Harina y agua|Arroz y huevo
¿Qué plato asturiano lleva fabes?|Fabada|Cocido madrileño|Pote|Pisto
¿De qué país es la pizza margarita?|Italia|España|Grecia|Estados Unidos
¿De qué país es originario el sushi?|Japón|China|Corea|Tailandia
¿Qué bebida se hace con hojas de Camellia sinensis?|El té|El café|El cacao|La cerveza
¿Cuál es el metal del que están hechas casi todas las latas de refresco?|Aluminio|Hierro|Cobre|Plomo
¿Cuántos colores tiene el arcoíris tradicionalmente?|7|5|6|8
¿Qué colores son primarios en pintura tradicional?|Rojo, amarillo y azul|Rojo, verde y azul|Negro y blanco|Naranja, verde y morado
¿Qué color se obtiene al mezclar azul y amarillo en pintura?|Verde|Morado|Naranja|Marrón
¿Qué color se obtiene al mezclar rojo y azul en pintura?|Morado|Verde|Naranja|Rosa
¿Cuántos lados tiene un dodecágono?|12|10|20|8
¿Cuántas caras tiene un cubo?|6|8|4|12
¿Cuántas aristas tiene un cubo?|12|8|6|24
¿Qué figura tiene todos sus puntos a la misma distancia del centro?|La circunferencia|El cuadrado|La elipse|El triángulo
¿Qué número romano es la X?|10|5|50|100
¿Qué número romano es la L?|50|100|500|5
¿Qué número romano es la M?|1000|500|100|50
¿Cómo se escribe 2024 en números romanos?|MMXXIV|MMXXIIII|MCMXXIV|MMXIV
¿Cuántos ceros tiene un millón?|6|5|7|9
¿Cuántos ceros tiene un billón en España?|12|9|6|15
¿Qué es un googol?|Un 1 seguido de 100 ceros|Un buscador|Un número primo|Un millón de millones
¿De dónde viene el nombre de Google?|De googol, un número enorme|Del apellido de su fundador|De un perro|De una ciudad
¿Qué significa el nombre del bit?|Binary digit (dígito binario)|Big integer|Basic item|Bite
¿Qué significa «wifi» según su origen comercial?|Es una marca, no una sigla con significado oficial|Wireless Fidelity oficialmente|Wide Field|Web Internet File
¿Por qué los teclados tienen las letras en el orden QWERTY?|Por las máquinas de escribir antiguas|Por orden alfabético|Por la frecuencia del inglés moderno|Por azar total
¿Qué tecla tiene relieve para orientar los dedos además de la F?|La J|La K|La A|La espacio
¿Qué animal sale en el logo del navegador Firefox?|Un zorro (panda rojo en origen)|Un lobo|Un gato|Un perro
¿Qué fruta es el logo de Apple?|Una manzana|Una pera|Una cereza|Una naranja
¿Qué color tiene el pájaro del logo antiguo de Twitter?|Azul|Rojo|Verde|Amarillo
¿Qué es un meme en internet?|Una imagen, vídeo o idea que se copia y se comparte con humor|Un virus|Un tipo de archivo|Una red social
`]);
QZ.push(['Programación',`
¿Qué estructura de datos funciona como una pila de platos (el último en entrar es el primero en salir)?|Pila (LIFO)|Cola (FIFO)|Árbol|Grafo
¿Qué estructura de datos funciona como la cola del supermercado?|Cola (FIFO)|Pila (LIFO)|Árbol binario|Tabla hash
¿Qué valor tiene la expresión true && false?|false|true|null|Da error
¿Qué valor tiene la expresión !true?|false|true|0|null
¿Qué imprime System.out.println(1 + 2 + "3")?|33|123|6|Da error
¿Qué imprime System.out.println("1" + 2 + 3)?|123|6|15|Da error
¿Qué es una variable?|Un espacio con nombre para guardar un valor|Un tipo de bucle|Un archivo|Una clase abstracta
¿Qué es un bucle infinito?|Un bucle cuya condición nunca deja de cumplirse|Un bucle muy rápido|Un bucle sin cuerpo|Un bucle for-each
¿Cómo se llama crear un objeto a partir de una clase?|Instanciar|Heredar|Compilar|Importar
¿Qué es un StackOverflowError en Java?|Se llena la pila, por ejemplo por una recursividad sin fin|La web Stack Overflow está caída|Un error de sintaxis|Falta memoria en disco
`]);
