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
  
2. [Ejercicio](#id2)
      
      2.1. [Clase Alimentos.](#id21)
      
      2.2. [Clase Plato.](#id22)
      
      2.3. [Clase Menú](#id23)
      
      2.4  [Routers](#id24)

      2.4.1 [Router Default](#id241)
      
      2.4.2 [Routers Ingredients, Courses and Menus](#id242)
      
      2.5. [MongoDB](#id25)

      2.5.1 [Mongoose](#id251)
      2.5.2 [ThunderClient](#id252)
      2.5.3 [MongoDB Atlas](#id253)
      2.5.4 [Heroku](#id254)


      2.6. [Ejemplos para probar con Thunder Client](#id26)

3. [Dificultades](#id3)

4. [Conclusión.](#id4)

5. [Referencias.](#id5)



- [Mongo DB for Node.js]()

<br/><br/>


## 1. Introducción y objetivos <a name="id1"></a>

El objetivo de esta práctica es implementar de forma grupal una API REST haciendo uso de **Node/Express**, **Mongoose** y el módulo de **ThunderClient** para crear, eliminar, modificar y leer con operaciones **CRUD** una serie de ingredientes, menus y platos. Para llevar a cabo esta implementación partimos de los conocimientos y código desarrollado en la anterior práctica grupal. 

Para obtener una explicación más extensa y detallada recomendamos revisar el [guión de la práctica 11](https://ull-esit-inf-dsi-2021.github.io/prct11-menu-api/)

<br/><br/>

## 2. Ejercicio. <a name="id2"></a>

Para este ejercicio hemos utilizado las diferentes clases que hemos implementado en la primera práctica grupal, modificando las mismas para que acepten los métodos http que permitirán añadir, eliminar, modificar y leer objetos pertenecientes a cada clase, por lo que hemos dedicido reutilizar `alimento.ts`, `plato.ts` y `menu.ts`, desechando el resto de clases como `carta.ts` y `comanda.ts`puesto que no se hara uso de las mismas.

Además, se hace uso de Moongose para implementar la base de datos que contendrá los objetos de cada clase, con **ThunderClient** podremos administrar las operaciones que se realizarán, luego **MongoDB Atlas** nos permitirá utilizar la Base de datos alojada en la nube y finalmente **Heroku** publica este servicio.

Por lo que será necesario dividir la carpeta `src` en varias subcarpetas. Una de ellas es `models` donde se encontrarán los ficheros correspondiente a los schemas que realizaremos, la otra carpeta será `routers` donde especificamos las operaciones que realizara la base de datos y por último la carpeta `db` que contendra el archivo encargado de establecer la conexión al servidor de MongoDB. Además de estas carpetas src cuenta con un fichero denominado como `index.ts` que será el fichero que defina el esquema y modelo de datos con Mongoose. 

### 2.1.Clase Alimentos. <a name="id21"></a>

Recordemos que Alimentos es una clase más básica para implementar ya que esta va a contener los datos más importantes como el precio, origen, calorias, macronutrientes, grupo, etc... de los alimentos que conformará cada plato.

Todos estos datos se almacenan en la clase `Alimento`, la cual permanece igual a la práctica anterior. Es por este motivo que no vamos a repasar su estructura ni sus detalles, más allá de los necesarios.

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

```

Donde definimos el esquema de la clase, esto es el mecanismo por el cual podemos modelar un objeto en Mongoose. Basicamente con este codigo especificamos que el objeto `alimentoSchema` defina las cualidades del nombre del ingrediente, el precio , las calorias, el grupo y los macronutrientes que a su vez esta definido por `macronutrientesSchema` que define carbohidratos, proteinas y lipidos.

En la última linea, aplicamos el metodo `model` que va a especificar el esquema que debe seguir los objetos antes de ser insertados en una coleccion de la base de datos.


```Typescript
export const alimentoModel = mongoose.model<Alimento>('ingredients', alimentoSchema);

```

Un detalle importante para los atributos de `nombreAlimento` y `origen` es que tienen una función `validate`, la cual recibe el contenido a almacenar y realiza una comprobación. En ambos casos, esta comprobación se realiza a través de una **expresión regular**, que comprueba si la primera letra del *string* es una letra mayúscula contemplada en el alfabeto español.

Otra variable con una especie de validado o comprobación es `grupo`, a la cual especificamos un *enum* con los diferentes grupos/categorías de alimentos que están aceptados. 

### 2.2.Clase Platos. <a name="id22"></a>




### 2.3.Clase Menu. <a name="id23"></a>

### 2.4.Routers. <a name="id24"></a>

En la ruta `src/routers` especificamos las funciones get, post, patch, delete encargadas de leer, añadir, modifciar y eliminar para cada uno de los objetos contemplados en la aplicación: ingredientes, platos y menús. Para ello, tenemos separados en 3 ficheros diferentes (una para cada tipo) esas funciones.

#### 2.4.1.Router Default.  <a name="id241"></a>

Este pequeño fichero contiene únicamente un router con una sentencia y una ruta genérica simbolizada con `*`. El propósito de esto es el de crear un receptor por defecto para todas esas peticiones erróneas, ya sea porque se realizan a una ruta no soportada o usando un tipo de mensaje incorrecto.

Todas esas peticiones que no encajan en las demás, son respondidas con un *status 501*.

##### 2.4.2.Routers Ingredients, Courses and Menus. <a name="id242"></a>

A pesar de que son estructuras de datos diferentes, las 3 son tratadas de la misma manera y usando las mismas funciones. Los datos son diferentes pero son tratados igual. Es por este motivo por el que solo voy a comentar uno de estos ficheros y el desarrollo de las funciones, ya que el código es prácticamente igual en todos.

Comentar que la estructura completa de estos ficheros está basada en la de los apuntes de clase, pues encontramos que no solamente es un ejemplo funcional, si no que también está bien organizado.

Una vez declaramos un nuevo *Router* de *Express*, esta variable pasa a ser un objeto que tiene varias opciones respecto al tipo de peticiones que puede recibir. En este primer caso, se nos presenta un `get`.

Este receptor de `get` se activa cuando se recibe una petición `get` sobre la ruta `/ingredients`. Lo primero que se hace es crear una variable `filter`, la cual recibe el `nombreAlimento` de la petición (variable `req`). De ella extrae este valor transformándolo a *string*.

Realiza un `try catch` para poder realizar una comprobación de manera asíncrona. La comprobación la realiza buscando si existe este nombre `filter` dentro de todos los elementos de tipo `alimentoModel` que hemos almacenado en la base de datos. En caso de que no lo encuentre, se rompe la promesa y se ejecuta la sentencia `return res.status(500).send();`. En caso contrario, se devuelve al cliente todos los datos que coincidieron.

Esta sentencia de búsqueda está condicionada con la sentencia `wait`, la cual "paraliza" la ejecución del programa para darle prioridad al `find()` y que pueda completarse. Una vez finalizada esa operación, el flujo del programa vuelve a la normalidad.

```Typescript
import * as express from 'express';
import {alimentoModel} from '../models/alimento';

export const alimentoRouter = express.Router();

alimentoRouter.get('/ingredients', async (req, res) => {
  const filter = req.body.nombreAlimento?{nombreAlimento: req.body.nombreAlimento.toString()}:{};
  try {
    const alimentos10 = await alimentoModel.find(filter);
    if (alimentos10.length !== 0) {
      return res.send(alimentos10);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});
```

Esta segunda función `get` realiza la misma función que la anterior, solo que en vez de recibir el `nombreAlimento`, lo que hace es buscar por `id` de los diferentes elementos de la base de datos. Es por eso que esta función es más corta y más óptima, pues el propio *model* tiene un método `findById()` al cual entregamos el `id` y comprueba si existe; devolviendo el resultado después.

```Typescript
alimentoRouter.get('/ingredients/:id', async (req, res) => {
  try {
    const alimentos = await alimentoModel.findById(req.params.id);
    if (!alimentos) {
      return res.status(404).send();
    }
    return res.send(alimentos);
  } catch (error) {
    return res.status(500).send();
  }
});
```

Las peticiones de tipo `post` son muy sencillas. Simplemente, reciben a través de la **promesa** `req` todos los datos necesarios para crear un nuevo objeto. En este caso, los datos los obtiene de `req.body` para crear un objeto `ingrediente`, en este caso.

No realizamos ninguna comprobación sobre los objetos creamos pues es en un paso previo (la creación de la petición usando los modelos) donde nos aseguramos que todos los datos están en un formato correcto y que todos los obligatorios están recogidos.

Posteriormente, almacena este nuevo objeto en la base de datos con `ingrediente.save()`, dándole potestad con `await` para completarse antes de continuar.

```Typescript
alimentoRouter.post('/ingredients', async (req, res) => {
  const ingrediente = new alimentoModel(req.body);
  try {
    await ingrediente.save();
    res.status(201).send(ingrediente);
  } catch (error) {
    res.status(400).send(error);
  }
});
```

Para la funcionalidad de modificación hemos usado la etiqueta `patch`. Esta operación es un poco más complicada, pues concretamos una serie de variables actualizables y comprobamos si todos los elementos recibidos en la promesa están permitidos en la actualización. 

Es decir, si en la promesa recibimos algún dato no autorizado a editar, rechazamos la petición. En caso de que esto falle, lo comunicamos con un error específico.

Una vez se comprueba que todo es válido, entramos en el `try catch`. Para este caso, la función `findOneAndUpdate()` hace lo que describe: recibe un elemento con el que hacer *match* (`nombreAlimento`, en este ejemplo) entre todos los de la base de datos, y el `body` con todos los datos nuevos a actualizar.

```Typescript
alimentoRouter.patch('/ingredients', async (req, res) => {
  console.log(req.body.nombreAlimento);
  if (!req.body.nombreAlimento) {
    return res.status(400).send({
      error: 'An ingredient must be provided',
    });
  }
  const allowedUpdates = ['nombreAlimento', 'precio', 'origen', 'calorias', 'macros', 'grupos'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const alimento =
    await alimentoModel.findOneAndUpdate({nombreAlimento: req.body.nombreAlimento.toString()}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!alimento) {
      return res.status(404).send();
    }

    return res.send(alimento);
  } catch (error) {
    return res.status(400).send(error);
  }
});
```

Para esta funcionalidad también hemos contemplado el actualizar usando como *match* la `id` del elemento en la base de datos. La función es exactamente igual, excepto por la declaración de la "ruta", la cual ahora debe recibir el id completo y la función del modelo, la cual ahora es `findByIdAndUpdate()`, la cual recibe la id.

```Typescript
alimentoRouter.patch('/ingredients/:id', async (req, res) => {
  
  ...
  
  try {
      const alimento = await alimentoModel.findByIdAndUpdate(req.params.id, req.body, {
      ...
```

La última las operaciones CRUD es `delete`. Se parece mucho al `get`, pues la dos hace los mismo excepto en el punto final. Las dos comprueban que la variable a buscar `nombreAlimento` no está vacío y existe dentro de la base de datos.

La diferencia es que en vez de `find()`, usa `findOneAndDelete()`, que como indica el nombre, elimina de la base de datos todas las coincidencias que encuentre.

Para informar al usuario que la operación fue exitosa, le devuelve el objeto eliminado para confirmar que era lo que quería eliminar.

```Typescript
alimentoRouter.delete('/ingredients', async (req, res) => {
  if (!req.body.nombreAlimento) {
    console.log(req.body.nombreAlimento);
    return res.status(400).send({
      error: 'An ingredient must be provided',
    });
  }

  try {
    const ingrediente = 
      await alimentoModel.findOneAndDelete({nombreAlimento: req.body.nombreAlimento.toString()});
    if (!ingrediente) {
      return res.status(404).send();
    }
    return res.send(ingrediente);
  } catch (error) {
    return res.status(400).send();
  }
});
```

Esta funcionalidad también contempla el recibir una `id` como método de *match*. La única diferencia real es el uso de `.findByIdAndDelete()`, el cual recibe la id desde la variable de la promesa `req.params.id`.

```Typescript
alimentoRouter.delete('/ingredients/:id', async (req, res) => {
  ...
  try {
    const alimentos = await alimentoModel.findByIdAndDelete(req.params.id);
    ...
```

Por último, comentar la importacia y funcionalidad de la sentencia del principio:

```Typescript
export const alimentoRouter = express.Router();
```

Al crear un router y declarar los métodos sobre este, lo que hacemos es crear una estructura de datos exportable con `export`. Es de esta manera por la que podemos separar estas funciones por clases y en diferentes ficheros, pues luego la aplicación principal de *express* es capaz de adoptar todos estos métodos.

### 2.5.MongoDB. <a name="id25"></a>

#### 2.5.1.Mongoose. <a name="id251"></a>
El módulo de Mongoose nos permite modelar objetos. Con estos conseguimos que nuestros datos puedan ser almacenados en la base de datos de Mongo DB. Se ha definido un squema para los distintos objetos. Se ha creado un macronutrientesSchema, alimentoSchemal, platoSchema y menuSchema. A continuación se muestra como ejemplo el esquema de alimento.

```Typescript
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
```

#### 2.5.2.ThunderClient <a name="id252"></a> 

#### 2.5.3.MongoDB Atlas. <a name="id253"></a> 

#### 2.5.4.Heroku. <a name="id254"></a> 

Una vez se ha creado el **cluster** que usaremos para almacenar los datos, vamos a utilizar Heroku para desplegar nuestra API REST.

Antes de comenzar propiamente con Heroku es necesario hacer algunos cambios en los ficheros `src/db/mongoose.ts`.

<br/><br/>

### 2.6.Ejemplos para probar con Thunder Client <a name="id26"></a>

El siguiente objeto JSON está creado de tal manera que simplemente necesita copiar y pegar para comprobar el correcto funcionamiento de la práctica.

```
{
    "nombreAlimento": "Arroz blanco",
    "precio": 1.5,
    "origen": "España",
    "calorias": 381,
    "macros": {
        "carbohidratos": 86,
        "proteinas": 7,
        "lipidos": 0.9
    },
    "grupo": "CEREALES"
}
```
## 3. Dificultades. <a name="id3"></a>

Durante el desarrollo de esta práctica hemos sufrido diversos incovenientes, tanto con la implementación como con las herramientas.

**EL issue al profesor
la nomenclatura en el body de la base de datos a la hora de crear datos** 

A la hora de desplagar la aplicación con Heroku hemos tenido diversos problemas. Tras diversos problemas con la instalación de heroku en la máquina local Windows, hemos podido solventarlo. A la hora de desplegar la aplicación, al heroku realizar el **build**, este nos fallaba. Finalmente, para solventar el problema, decidimos hacer una instalación limpia en una máquina aparte. Realizamos toda la instalación en una VM con Ubuntu, revisamos el fichero package.json y, además, eliminamos el directorio node_module (para que el propio Heroku se encargara de generarla. Siguiendo estos pasos hemos logrado que la aplicacion se desplegara correctamente.

<br/><br/>

## 4. Conclusión. <a name="id4"></a>

En cuanto a los objetivos especificados en el enunciado de la práctica, se ha cumplido la creación de una API y el manejo de sus datos con los mdulos especificados en el enunciado de la misma.

De forma mas especifica,  se ha hecho uso de MongoDB, Mongoose para la creación de la Base de datos, además se ha implementado las operaciones CRUD para el manejo de los datos introducidos, se ha utilizado también ThunderClient (completar esto consultar dudas con Oscar). Y finalmente se ha usado Heroku para postear este servicio en la red. Todo ello respetando los principios SOLID(Preguntar) y usando Node.js como entorno para ejecutar el servidor.

(Tengo una duda ya que en la práctica anterior, usamos Mocha y Chai para las pruebas y el testeo, pero en esta no, ¿haria falta introducirla? en caso de que si sería en este párrafo.)

Finalmente, comentar que lo que más nos ha costado a la hora de la implementación es la utilizacióon de **MongoDB**, de **Moongose** y sobretodo de **Heroku**, en gran parte por el desconocimiento de esta tecnología. Sin embargo, hemos aprendido gracias a estas herramientas que:

**MongoDB** nos ha enseñado a crear Menús intuitivos para el usuario, ofreciendo unas opciones fijas y muy claras para el usuario.

**Mongoose** nos permite almacenar los datos de objetos en un fichero JSON para poder leer esos datos más adelante, incluso en otra ejecución desde cero del mismo programa.

<br/><br/>

## 5. Referencias. <a name="id5"></a> (HAY QUE AÑADIR AMS REFERENCIAS PUSE LAS BASICAS)
1. [Github.](http://github.com)
2. [Repositorio practica 11](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct11-menu-api-grupo-p)
3. [Apuntes de clases](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/)
4. [Enunciado Práctica 11.](https://ull-esit-inf-dsi-2021.github.io/prct11-menu-api/)
5. [Documentación MongoDB](https://www.mongodb.com/es)
6. [Documentación Mongoose](https://mongoosejs.com/)
