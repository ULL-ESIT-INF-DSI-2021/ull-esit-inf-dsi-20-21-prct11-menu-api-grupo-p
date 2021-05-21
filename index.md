# Práctica 11 - API Node/Express de gestión de información nutricional

<br/><br/>

### Hecho por:  
  * Óscar Cigala Álvarez - alu0101038230@ull.edu.es
  * Óscar Ignacio Pozo Fernandez - alu0101036526@ull.edu.es
  * Eduardo Da Silva Yanes - alu0101104911@ull.edu.es
  * Joel Francisco Escobar Socas - alu0101130408@ull.edu.es

<br/><br/>

### Índice:

1. [Introducción y objetivos.](#id1)
  
2. [Conocimientos Previos](#id2)
      
      2.1. [Clase Alimentos.](#id21)
      2.2. [Clase Plato.](#id22)
      2.3. [Clase Menú](#id23)
      2.4. [Mongoose](#id24)
      2.5. [MongoDB](#id25)

3. [Desarrollo](#id3)

4. [Dificultades](#id4)

5. [Conclusión.](#id5)

6. [Referencias.](#id6)



- [Mongo DB for Node.js]()

<br/><br/>


## 1. Introducción y objetivos <a name="id1"></a>

El objetivo de esta práctica es implementar de forma grupal una API haciendo uso de **Node/Express**, **Mongoose** y el módulo de **ThunderClient** para crear, eliminar, modificar y leer con las operaciones **CRUD** una serie de ingredientes, menus y platos utilizando para ello los conocimientos adquiridos con la anterior práctica en grupo.

<br/><br/>

## 2. Ejercicio. <a name="id2"></a>

Para este ejercicio hemos utilizado las diferentes clases que hemos implementado en la primera práctica grupal, modificando las mismas para que acepten los métodos http que permitirán añadir, eliminar, modificar y leer objetos pertenecientes a cada clase, por lo que hemos dedicido reutilizar `alimento.ts`, `plato.ts` y `menu.ts`, desechando el resto de clases como `carta.ts` y `comanda.ts`puesto que no se hara uso de las mismas.

Además, se hace uso de Moongose para implementar la base de datos que contendrá los objetos de cada clase, con **ThunderClient** podremos administrar las operaciones que se realizarán, luego **MongoDB Atlas** nos permitirá utilizar la Base de datos alojada en la nube y finalmente **Heroku** publica este servicio.

Por lo que será necesario dividir la carpeta `src` en varias subcarpetas. Una de ellas es `models` donde se encontrarán los ficheros correspondiente a los schemas que realizaremos, la otra carpeta será `routers` donde especificamos las operaciones que realizara la base de datos y por último la carpeta `db` que contendra el archivo encargado de establecer la conexión al servidor de MongoDB. Además de estas carpetas src cuenta con un fichero denominado como `index.ts` que será el fichero que defina el esquema y modelo de datos con Mongoose. 

### 2.1.Clase Alimentos. <a name="id21"></a>

Recordemos que Alimentos es una clase más básica para implementar ya que esta va a contener los datos más importantes como el precio, origen, calorias, macronutrientes, grupo, etc... de los alimentos que conformará cada plato.

En la ruta `src/models/alimento.ts` especificamos el esquema que tendrán los diversos alimentos, siendo este:

```Typescript 
export const macronutrientesSchema = new mongoose.Schema({ carbohidratos: Number, proteinas: Number, lipidos: Number});

export const alimentoSchema = new mongoose.Schema({
  nombreAlimento: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-ZñÑ][a-zA-ZñÑ ]*$/)) {
        throw new Error('El nombre de los alimentos tiene que empezar con una mayúscula y solo pueden estar formados por letras.');
      }
    },
  },
  precio: {
    type: Number,
    required: true,
    trim: true,
  },
  origen: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-ZñÑ][a-zA-ZñÑ ]*$/)) {
        throw new Error('El origen de los alimentos tiene que empezar con una mayúscula y solo pueden estar formados por letras.');
      }
    },
  },
  calorias: {
    type: Number,
    required: true,
    trim: true,
  },
  macros: {
    type: macronutrientesSchema,
    trim: true,   // permite eliminar espacios al final y al principio de un string
  },
  grupo: {
    type: String,
    required: true,
    trim: true,
    enum: ['CARNES', 'PESCADOS', 'HUEVOS', 'TOFU', 'FRUTOS_SECOS', 'SEMILLAS', 'LEGUMBRES',
    'VERDURAS', 'HORTALIZAS', 'LACTEOS', 'CEREALES', 'FRUTAS', 'PROCESADOS'],
  },
});

export const alimentoModel = mongoose.model<Alimento>('ingredients', alimentoSchema);

```

Donde definimos el esquema de la clase, esto es el mecanismo por el cual podemos modelar un objeto en Mongoose. Basicamente con este codigo especificamos que el objeto alimentoSchema defina las cualidades del nombre del ingrediente, el precio , las calorias los macronutrientes que a su vez esta definido por macronutrientesSchema que es 

### 2.2.Clase Platos. <a name="id22"></a>



### 2.3.Clase Menu. <a name="id23"></a>

### 2.4.MongoDB. <a name="id24"></a>

#### 2.4.1.Mongoose. <a name="id241"></a>


#### 2.4.2.ThunderClient <a name="id242"></a> (luego veo que hacer con esto)

#### 2.4.3.MongoDB Atlas. <a name="id243"></a> (luego veo que hacer con esto)

#### 2.4.4.Heroku. <a name="id244"></a> (luego veo que hacer con esto)

<br/><br/>

## 3. Dificultades. <a name="id3"></a>

A lo largo de la práctica, nos han surgido diferentes dudas o errores que hemos ido solucionando de mutuo acuerdo. 

Comenzando por el principio, lo primero que hicimos fue plantear la jerarquía de clases y qué atributos tendría cada una (de manera estimada).

Sin embargo, las partes más complejas comenzaron en la clase `Plato`. Las funciones de `calculo` son un poquito más complejas que un simple *getter*, con la excepción de `calculoGrupoPredominante()`, que no es difícil en sí, pero supone un bloque grande de código que hemos tenido que trabajar para obtener un solo dato, pero de manera precisa y más o menos óptima. 

La siguiente parte que nos dio problemas fue el **deshacer los guardianes de tipos** de para algunas funciones. Primeramente con fallos de compilador y luego con fallos durante la ejecución, los métodos `search` no funcionaban bien en un principio porque el compilador no era capaz de separar correctamente los objetos `Menu` y `Plato`. Probamos varias opciones que encontramos por internet, pero al final lo mejor resultó ser la que aparece en los apuntes: usar `instanceof`. 

Durante la creación de la clase `Comanda`, se nos planteó la duda de si un cliente solicitaba un producto de la carta, y daba la casualidad que habían varios de ellos con un nombre similar (por ejemplo, diferentes carnes o verduras *a la **barbacoa***), lo cual implicaba que se le sumaban todas esas coincidencias a su comanda. Nuestra forma de aplacar este problema es la de mostrar todas las opciones y preguntar al cliente cuáles quiere. Para ello hemos hecho uso del módulo/interfaz `readline` que nos permite trabajar con la terminal y permitir al cliente realizar su orden correctamente. 

El fichero `bbdd.ts` es la parte que más problemas nos ha dado. Para todos no es nuevo trabajar con `inquirer` y `lowdb`, lo cual ha supuesto bastante prueba y error (de compilación) con los ejemplos que hemos seguido. 

Al final hemos conseguido crear una estructura de menús con `inquirer`, con lo que nos quedamos satisfechos. Sin embargo, no hemos conseguido hacer funcionar el módulo **lowdb**. Hemos consultado la referencia del libro y ejemplos en internet. Entendemos su cometido, pero a nivel de código no lo hemos podido llevar a cabo. 

<br/><br/>

## 4. Conclusión. <a name="id4"></a>

Los objetivos que hemos cumplido satisfactoriamente sobre esta práctica han sido: crear una estructura de Menú usando los módulos Inquirer.js y Lowdb sobre un grupo de objetos en Typescript.

Es decir, hemos aplicado un buen diseño de las clases solicitadas en el guión y respetando los principios SOLID. Con ello, conseguimos que la información que contiene cada clase esté bien ordenada y tenga sentido, en un entorno práctico.

Hemos realizado las pruebas según la metodología TDD: primero creando las funciones para que fallen, y después completarlas hasta que supongamos que funcionen. Con este prueba y error en el que comparamos los resultados con los objetos instanciados dentro del fichero de pruebas, nos ha hecho adoptar un modelo y metodología que creemos correcta para TDD.

Por último, ha sido nuestro primer contacto con **Inquirer.js** y **Lowdb**. Nos ha costado hacer que los ejemplos no den errores de compilación y que nuestras implementaciones funcionen correctamente.

**Inquirer.js** nos ha enseñado a crear Menús intuitivos para el usuario, ofreciendo unas opciones fijas y muy claras para el usuario.

**Lowdb** nos permite almacenar los datos de objetos en un fichero JSON para poder leer esos datos más adelante, incluso en otra ejecución desde cero del mismo programa.

<br/><br/>

## 5. Referencias. <a name="id5"></a> (HAY QUE AÑADIR AMS REFERENCIAS PUSE LAS BASICAS)
1. [Github.](http://github.com)
2. [Repositorio practica 11](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct11-menu-api-grupo-p)
3. [Apuntes de clases](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/)
4. [Enunciado Práctica 11.](https://ull-esit-inf-dsi-2021.github.io/prct11-menu-api/)
5. [Documentación MongoDB](https://www.mongodb.com/es)
6. [Documentación Mongoose](https://mongoosejs.com/)
