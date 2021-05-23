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
  
2. [Ejercicio.](#id2)
      
      2.1. [Clase Alimentos.](#id21)
      
      2.2. [Clase Plato.](#id22)
      
      2.3. [Clase Menú.](#id23)
      
      2.4. [Routers.](#id24)

      2.4.1. [Router Default.](#id241)
      
      2.4.2. [Routers Ingredients, Courses and Menus.](#id242)
      
      2.5. [MongoDB.](#id25)

      2.5.1. [Mongoose.](#id251)

      2.5.2. [ThunderClient.](#id252)

      2.5.3. [MongoDB Atlas.](#id253)

      2.5.4. [Heroku.](#id254)

      2.6. [Ejemplos para probar con Thunder Client.](#id26)

3. [Dificultades.](#id3)

4. [Conclusión.](#id4)

5. [Referencias.](#id5)

***

## 1. Introducción y objetivos. <a name="id1"></a>

El objetivo de esta práctica es implementar de forma grupal una API REST haciendo uso de **Node/Express**, **Mongoose** y el módulo de **ThunderClient** para crear, eliminar, modificar y leer con operaciones **CRUD** una serie de ingredientes, menús y platos. Para llevar a cabo esta implementación partimos de los conocimientos y código desarrollado en la anterior práctica grupal. 

Para obtener una explicación más extensa y detallada recomendamos revisar el [guión de la práctica 11](https://ull-esit-inf-dsi-2021.github.io/prct11-menu-api/)

En el apartado [Ejemplos para probar con Thunder Client](#id26) hemos puesto algunos ejemplos de alimentos, platos, etc. para que, si quiere testear o corregir esta práctica, pueda utilizarlos como ejemplos o guía.

<br/><br/>

## 2. Ejercicio. <a name="id2"></a>

Para este ejercicio hemos utilizado las diferentes clases que hemos implementado en la primera práctica grupal, modificando las mismas para que acepten los métodos http que permitirán añadir, eliminar, modificar y leer objetos pertenecientes a cada clase, por lo que hemos decidido reutilizar `alimento.ts`, `plato.ts` y `menu.ts`, desechando el resto de clases como `carta.ts` y `comanda.ts`puesto que no se hará uso de las mismas.

Además, se hace uso de Mongoose para implementar la base de datos que contendrá los objetos de cada clase, con **ThunderClient** podremos administrar las operaciones que se realizarán, luego **MongoDB Atlas** nos permitirá utilizar la Base de datos alojada en la nube y finalmente **Heroku** pública este servicio.

Por lo que será necesario dividir la carpeta `src` en varias subcarpetas. Una de ellas es `models` donde se encontrarán los ficheros correspondiente a los schemas que realizaremos, la otra carpeta será `routers` donde especificamos las operaciones que realizara la base de datos y por último la carpeta `db` que contendrá el archivo encargado de establecer la conexión al servidor de MongoDB. Además de estas carpetas src cuenta con un fichero denominado como `index.ts` que será el fichero que defina el esquema y modelo de datos con Mongoose. 

<br/><br/>

### 2.1. Clase Alimentos. <a name="id21"></a>

Recordemos que Alimentos es una clase más básica para implementar ya que esta va a contener los datos más importantes como el precio, origen, calorías, macronutrientes, grupo, etc... de los alimentos que conformarán cada plato.

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

Donde definimos el esquema de la clase, este es el mecanismo por el cual podemos modelar un objeto en Mongoose. Básicamente, con este código especificamos que el objeto `alimentoSchema` defina las cualidades del nombre del ingrediente, el precio , las calorías, el grupo y los macronutrientes que a su vez está definido por `macronutrientesSchema` que define carbohidratos, proteínas y lípidos.

En la última línea, aplicamos el método `model` que va a especificar el esquema que debe seguir los objetos antes de ser insertados en una colección de la base de datos.

```Typescript
export const alimentoModel = mongoose.model<Alimento>('ingredients', alimentoSchema);
```

Un detalle importante para los atributos de `nombreAlimento` y `origen` es que tienen una función `validate`, la cual recibe el contenido a almacenar y realiza una comprobación. En ambos casos, esta comprobación se realiza a través de una **expresión regular**, que comprueba si la primera letra del *string* es una letra mayúscula contemplada en el alfabeto español.

Otra variable con una especie de validado o comprobación es `grupo`, a la cual especificamos un *enum* con los diferentes grupos/categorías de alimentos que están aceptados. 

<br/><br/>

### 2.2. Clase Platos. <a name="id22"></a>

Recordemos que la clase `plato` está basada en la clase alimento/ingrediente definida previamente, esta es la encargada de definir el plato en base a los alimentos que lo componen, por ejemplo, si creamos el plato ensalada este estará formado por lechuga, tomate, cebolla, etc.. que son objetos de tipo alimentos.

Si accedemos al fichero en cuestión, se puede observar que esta clase estará compuesta de el nombre del plato `nombrePlato`, un array que contendrá todos los alimentos, el precio y la cantidad de estos ingredientes que componen el plato `alimentos` y un type que define la categoría del plato, es decir, si el plato es un entrante, primero, segundo o postre `Categoria`.

```Typescript
export type Categoria = 'ENTRANTE' | 'PRIMERO' | 'SEGUNDO' | 'POSTRE';

export class Plato {
  /**
   * @param nombrePlato Nombre del plato.
   * @param alimentos Array de pares [alimento, cantidad (en gramos)].
   * @param categoria Categoría a la que pertenece el plato.
   */
  private precio: number = 0;
  private macronutrientes_plato: Macronutrientes;
  constructor(private nombrePlato: string, private alimentos: [Alimento, number][],
    private categoria: Categoria) {
      this.macronutrientes_plato = this.calculoMacronutrientes();
      this.precio = this.calculoPrecio();
  }
```

De esta parte no explicaremos más debido a que es prácticamente lo mismo que se realizó en la práctica anterior, por lo que ahora explicaremos el *Schema* utilizado en la clase `Plato`. Este es el encargado de definir el modelo que van a seguir las peticiones de creación de nuevos objetos en la base de datos:

```Typescript
export const platoSchema = new mongoose.Schema({
  nombrePlato: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-ZñÑ][a-zA-ZñÑ ]*$/)) {
        throw new Error('El nombre del plato tiene que empezar con una mayúscula y solo pueden estar formados por letras.');
      }
    },
  },
  alimentos: {
    type: [alimentoSchema],
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: ['ENTRANTE', 'PRIMERO', 'SEGUNDO', 'POSTRE'],
  },
  macronutrientes_plato: {
    type: macronutrientesSchema,
  },
});
```

Como podemos observar, el modelo denominado **platoSchema** define el nombre del `Plato` que tendrá una serie de argumentos:
- **required**: Especifica que este campo es obligatorio a la hora de crear el modelo.
- **trim**: Elimina los espacios sobrantes que pueda tener el *string* al principio y/o al final.
- **validate**: Especifica una expresión regular que obliga a que el nombre del `Plato` empiece por mayúscula obligatoriamente.

Además este modelo especifica también que va a contener de forma obligatoria con el atributo **required** un array de diferentes alimentos. luego, solicita de forma requerida una categoría que deberá de ser entrante, primero, segundo o postre y finalmente,  **macronutrientesSchema** que a su vez es un modelo que define los carbohidratos, lípidos y proteínas.

Finalmente, guardamos el modelo con la sentencia final: 

```Typescript
export const platoModel = mongoose.model<Plato>('courses', platoSchema);
```

De esta manera, tenemos en una constante el modelo de `Plato` almacenado.

<br/><br/>

### 2.3. Clase Menu. <a name="id23"></a>

Tal y como hicimos en la práctica grupal anterior, un menú debe estar formado mínimo por 3 platos de diferentes categorías, esto lo realizamos con una comprobación al principio. En el constructor de la clase `menu.ts` se define el nombre del menú a través de un tipo *string*, `primerPlato` es el primer plato del menú y `demasPlatos` es un parámetro de tipo `rest` que almacena el resto de platos.

No entraremos en tantos detalles debido a que está explicado en el informe de la [práctica anterior](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct07-menu-datamodel-grupo-p/blob/master/docs/index.md#id23). 

Como se hizo con los casos anteriores definiremos un modelo de datos para el menú, como este va a estar compuesto por diferentes platos, por ejemplo, para un menú canario podríamos definir como entrante un potaje, ropa vieja como primero, chuleta con papas como segundo y quesillo como postre.  

Por lo que este modelo va a contener un *string* que defina el nombre, denominado `nombreMenu`. Luego, especificamos un array `arrayPlatos` que contendrá todos los platos que componen al menú. 

Por último, tiene un atributo `precio` el cual no recibe un valor de manera inmediata, puesto que no lo recibe directamente de los datos que aporta el cliente. Este campo recibirá su valor cuando se busque crear un nuevo modelo, código localizado en los **routers**. Es decir, el precio se calcula pero en otro fichero.

```Typescript
 const menuSchema = new mongoose.Schema({
  nombreMenu: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-ZñÑ][a-zA-ZñÑ ]*$/)) {
        throw new Error('El nombre de los menús tiene que empezar con una mayúscula y solo pueden estar formados por letras.');
      }
    },
  },
  arrayPlatos: {
    type: [platoSchema],
    required: true,
    trim: true,
  },
  precio: {
    type: Number,
    trim: true,
  }
});
```

Finalmente, guardamos el modelo de menú a través del método `model`: 

```Typescript
export const menuModel = mongoose.model<Menu>('menus', menuSchema);
```

Como esto es almacenado en una variable denominada `menuModel`, al final lo que va a suceder es que tenemos todo el modelo que define a `Menu` en una variable de tipo `const` que podemos importar en cualquier fichero.

<br/><br/>

### 2.4. Routers. <a name="id24"></a>

En la ruta `src/routers` especificamos las funciones get, post, patch, delete encargadas de leer, añadir, modificar y eliminar para cada uno de los objetos contemplados en la aplicación: ingredientes, platos y menús. Para ello, tenemos separados en 3 ficheros diferentes (una para cada tipo) esas funciones.

<br/><br/>

#### 2.4.1. Router Default. <a name="id241"></a>

Este pequeño fichero contiene únicamente un router con una sentencia y una ruta genérica simbolizada con `*`. El propósito de esto es el de crear un receptor por defecto para todas esas peticiones erróneas, ya sea porque se realizan a una ruta no soportada o usando un tipo de mensaje incorrecto.

Todas esas peticiones que no encajan en las demás, son respondidas con un *status 501*.

<br/><br/>

##### 2.4.2. Routers Ingredients, Courses y Menus. <a name="id242"></a>

A pesar de que son estructuras de datos diferentes, las 3 son tratadas de la misma manera y usando las mismas funciones. Los datos son diferentes pero son tratados igual. Es por este motivo por el que solo voy a comentar uno de estos ficheros y el desarrollo de las funciones, ya que el código es prácticamente igual en todos.

Comentar que la estructura completa de estos ficheros está basada en la de los apuntes de clase, pues encontramos que no solamente es un ejemplo funcional, si no que también está bien organizado.

Una vez declaramos un nuevo *Router* de *Express*, esta variable pasa a ser un objeto que tiene varias opciones respecto al tipo de peticiones que puede recibir. En este primer caso, se nos presenta un `get`.

Este receptor de `get` se activa cuando se recibe una petición `get` sobre la ruta `/ingredients`. Lo primero que se hace es crear una variable `filter`, la cual recibe el `nombreAlimento` de la petición (variable `req`). De ella extrae este valor transformándolo a *string*.

Realiza un `try catch` para poder realizar una comprobación de manera asíncrona. La comprobación la realiza buscando si existe este nombre `filter` dentro de todos los elementos de tipo `alimentoModel` que hemos almacenado en la base de datos. En caso de que no lo encuentre, se rompe la promesa y se ejecuta la sentencia `return res.status(500).send();`. En caso contrario, se devuelve al cliente todos los datos que coincidieron.

Esta sentencia de búsqueda está condicionada con la sentencia `wait`, la cual "paraliza" la ejecución del programa para darle prioridad al `find()` y que pueda completarse. Una vez finalizada esta operación, el flujo del programa vuelve a la normalidad.

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

No realizamos ninguna comprobación sobre los objetos creados pues es en un paso previo (la creación de la petición usando los modelos) donde nos aseguramos que todos los datos están en un formato correcto y que todos los obligatorios están recogidos.

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

En las peticiones `post` de **plato** y **menu**, además de lo explicado anteriormente, calculamos el precio y macronutrientes en base a los alimentos y platos que estos contienen respectivamente.

En el caso de **plato**, por ejemplo, obtenemos el array de alimentos y lo recorremos acumulando el precio. Lo mismo hacemos con los carbohidratos, proteínas y lípidos.

Finalmente, estos valores finales son **asignados** al **body** de la **request**.

```typescript
platoRouter.post('/courses', async (req, res) => {
const ingredi = req.body.alimentos;
  let precioFinal: number = 0;
  let carbostotales: number = 0;
  let proteinastotales: number = 0;
  let lipidostotales: number = 0;
  for (var i in ingredi){
    precioFinal += ingredi[i].precio;
    carbostotales += ingredi[i].macros.carbohidratos;
    proteinastotales += ingredi[i].macros.proteinas;
    lipidostotales += ingredi[i].macros.lipidos;
  }
  
  req.body.precio = precioFinal;

  req.body.macronutrientes_plato = {
    "carbohidratos": carbostotales, 
    "proteinas": proteinastotales,
    "lipidos": lipidostotales
  }
  
  const Plato = new platoModel(req.body);
  ...
  ...
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

La última de las operaciones CRUD es `delete`, se parece mucho al `get`, pues las dos hacen lo mismo excepto en el punto final. Ambas comprueban que la variable a buscar `nombreAlimento` no está vacía y existe dentro de la base de datos.

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

<br/><br/>

### 2.5. MongoDB. <a name="id25"></a>

**MondoDB** es una tecnología que nos permite la creación y administración de bases de datos. Su módulo para el código incluye las funciones de conexión y gestión de peticiones relativas a la base de datos.

Tiene una extensión para **Visual Studio Code**, y es la que hemos usado para poder interactuar con una base de datos a nivel local, pues es mucho más sencillo que desplegar una en la nube.

La tecnología tiene estas dos partes, que juntas suponen una herramienta potente para trabajar con bases de datos.

<br/><br/>

#### 2.5.1. Mongoose. <a name="id251"></a>
El módulo de Mongoose nos permite modelar objetos. Con estos conseguimos que nuestros datos puedan ser almacenados en la base de datos de MongoDB. Se ha definido un *Schema* para los distintos objetos. Se ha creado: `macronutrientesSchema`, `alimentoSchemal`, `platoSchema` y `menuSchema`. A continuación se muestra como ejemplo el esquema de `Alimento`.

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

<br/><br/>

#### 2.5.2. ThunderClient. <a name="id252"></a> 

**Thunder Client** es una extensión de Visual Studio Code que nos permite interactuar con una API, realizando diferente peticiones a la misma y así poder comprobar su funcionalidad.  

La extensión es simple, clara y directa, y tiene funcionalidades muy interesantes, como crear entornos que almacenan variables o colecciones de comandos donde almacenar plantillas. 

Usando una mezcla de estas funcionalidades es como podemos interactuar con la base de datos, realizando las operaciones CRUD a través de peticiones como la siguiente:

```
|POST| {{url}}ingredients
```

Este código intenta plasmar cómo luce una petición de tipo `Post`, la cual la base de datos interpreta como un intento de insertar un objeto. La variable `url` es una variable del entorno que contiene la dirección de la base de datos. Posteriormente recibe la ruta más concreta con el valor `ingredients`.

```Typescript
Body:
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

El *body* de la petición contiene los datos necesarios para que la operación se pueda completar. Para este ejemplo, la petición debe contener todos los datos un objeto de clase `Alimento`, para poder almacenarse en la base de datos. Otras peticiones, por ejemplo, solo necesitan recibir en el *body* una variable con un valor a buscar en la base de datos.

<br/><br/>

#### 2.5.3. MongoDB Atlas. <a name="id253"></a> 

Esta tecnología es el paso lógico de **MongoDB Atlas**. Si la tecnología original era una serie de herramientas en forma de funciones para interactuar con una base de datos, y que hacía una gran pareja con la extensión de VSC que nos permite tener una base de datos local, el siguiente paso es ofrecer este almacenamiento de manera online/en la nube.

**MongoDB Compass es una aplicación externa a Visual Studio Code**, que nos permite crear un *Cluster* a través de la página web de MongoDB Atlas, donde podremos almacenar nuestras bases de datos en la nube. Posteriormente, podremos acceder a este *Cluster* usando la aplicación e indicando la dirección de Atlas. 

De esta manera, tenemos una aplicación que nos permite acceder a la base de datos alojada en la nube y observar los contenidos allí almacenados.

<br/><br/>

#### 2.5.4. Heroku. <a name="id254"></a> 

Una vez se ha creado el **Cluster** que usaremos para almacenar los datos, vamos a utilizar Heroku para desplegar nuestra API REST.

Antes de comenzar propiamente con Heroku es necesario hacer algunos cambios en los ficheros `src/db/mongoose.ts` y `package.json`. 

```Typescript
import {connect} from 'mongoose';

const mongodb_url = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/notes-app';

connect(mongodb_url, {
  ...
  ...
  ...
```

Con esto estamos indicando que la url puede ser una variable de entorno o, en caso de que esta no sea especificada, usará la especificada en el string.

En el fichero package.json también debemos hacer los siguientes cambios:

```
...
...
  "scripts": {
    "heroku-postbuild": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc-watch --onSuccess \"node dist/index.js\""
  },
  "engines": {
    "node": "16.x"
  },
...
...
```

Se ha de añadir un bloque indicando qué versión de node usará para ejecutar nuestra API. En nuestro caso es la 16. En la sección de scripts debemos crear dos nuevas líneas.

La primera de ella debe llamarse **heroku-postbuild**. En esta indicamos que se debe ejecutar el comando **tsc**. Esta línea es necesaria porque debemos compilar nuestro código antes de que Heroku elimine las dependencias de desarrollo.

La siguiente línea **start** indica el fichero principal de ejecución.

Para la propia instalación de Heroku seguimos los siguientes comandos:

´´´
...$sudo snap install --classic heroku
...$heroku login

// Copiamos la clave SSH de ~/.ssh/id_rsa.pub y la añadimos en la pestaña Settings de nuestro perfil.

...$heroku apps:create --region eu dsi-grupop-11
´´´

El nombre de la aplicación debe ser distinto al de todos los usuarios de Heroku. Una vez ejecutemos este comando se muestra una URL que será la que necesitaremos para acceder a la API. En nuestro caso la URL ha sido: https://dsi-grupop-11.herokuapp.com/

Antes de desplegar la API debemos indicar la URL de conexión al cluster de MongoDB Atlas. Para ello hacemos uso del comando siguiente:

```
...$heroku config:set MONGODB_URL=mongodb+srv://notes-app:notesappDSI@cluster0.hcjkr.mongodb.net/LunaRosa-bbdd
```

Ahora, desplegamos la aplicación:

```
...$git push heroku master
...$heroku logs
// Si todo ha salido bien debemos obtener un resultado similar al siguiente
2021-05-22T12:40:05.756237+00:00 heroku[web.1]: Starting process with command `npm start`
2021-05-22T12:40:06.000000+00:00 app[api]: Build succeeded
2021-05-22T12:40:09.109884+00:00 app[web.1]: 
2021-05-22T12:40:09.109915+00:00 app[web.1]: > notes-app@1.0.0 start
2021-05-22T12:40:09.109916+00:00 app[web.1]: > node dist/index.js
2021-05-22T12:40:09.109916+00:00 app[web.1]: 
2021-05-22T12:40:10.100533+00:00 app[web.1]: Server is up on port 14227
2021-05-22T12:40:10.289254+00:00 heroku[web.1]: State changed from starting to up
2021-05-22T12:40:10.458330+00:00 app[web.1]: Connection to MongoDB server established
```

Hecho esto, ya tenemos nuestra API desplegada. Vemos como nuestra API ha sido desplegada en el puerto 14227 (este puerto es dinámico). Ahora solo falta comprobar que todo funciona correctamente haciendo uso de ThunderClient. 
En esta extensión debemos poner la url de conexión, que en nuestro caso era https://dsi-grupop-11.herokuapp.com/ y enviar un ingrediente, por ejemplo.

![Imagen ThunderClient](img/DSI_ThunderClient_Heroku.PNG)

![Imagen MongoAtlasDB](img/DSI_MongoDBAtlas_Heroku.PNG)

<br/><br/>

### 2.6. Ejemplos para probar con Thunder Client. <a name="id26"></a>

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

<br/><br/>

## 3. Dificultades. <a name="id3"></a>

Durante el desarrollo de esta práctica hemos sufrido diversos inconvenientes, tanto con la implementación como con las herramientas.

En un principio no teníamos claro el funcionamiento de **MongoDB** y cómo gestiona los diferentes tipos de peticiones (get, post, patch, etc). Al final no es más que un concepto para diferenciar y manejar las diferentes peticiones, lo cual es sencillo e intuitivo.

En un momento nos surgió la duda sobre la complejidad de la base de datos. No estábamos seguros si era necesario que almacenara datos planos, otorgados por el cliente, y que con eso sería suficiente. Al final, como sospechamos, la base de datos almacena objetos **JSON** que ofrecen estructuras de datos más complejas. Así que algunos valores los actualizamos para cumplir este requisito.

Relacionado a esto, dejamos para el final la parte de calcular el `precio` y los `macronutrientes` de los `Platos` y `Menus`. No estábamos seguros de cómo plantear/implementar esto. Se nos ocurrieron varias maneras de solucionar esto: comprobar que los objetos `Ingrediente` y `Plato` existiesen en la Base de datos y extraer de ahí los datos, usar los datos recibidos del JSON de la propia petición o dejarlos como un campo plano donde el cliente puede añadir el valor que quiera.

Al final nos quedamos con la segunda opción: leemos del `body` todos los `Ingredientes`/`Platos` y de ahí calculamos el `precio` y los `macronutrientes` sumando todas las cantidades.

A la hora de desplegar la aplicación con **Heroku** hemos tenido diversos problemas. Tras muchos intentos de instalación y configuración de heroku en la máquina local Windows y también en Ubuntu, hemos podido solventarlo. 

A la hora de desplegar la aplicación, al Heroku realizar el **build**, este nos fallaba. Finalmente, para solventar el problema, decidimos hacer una instalación limpia en una máquina aparte. Realizamos toda la instalación en una VM con Ubuntu, revisamos el fichero `package.json` y, además, eliminamos el directorio `node_modules` (para que el propio Heroku se encargara de generarlo). Siguiendo estos pasos logramos que la aplicación se desplegara correctamente.

<br/><br/>

## 4. Conclusión. <a name="id4"></a>

En cuanto a los objetivos especificados en el enunciado de la práctica, se ha cumplido la creación de una API y el manejo de sus datos con los módulos especificados en el enunciado de la misma.

De forma más específica,  se ha hecho uso de **MongoDB**, **Mongoose** para la creación de la Base de datos, además se han implementado las operaciones **CRUD** para el manejo de los datos introducidos, se ha utilizado también **ThunderClient** para crear las peticiones correspondientes a estas operaciones **CRUD**. Luego, con **MongoDB Atlas** establecemos una base de datos en la nube y finalmente se usa **Heroku** para postear este servicio en la red. Todo ello con **Node.js** como entorno para ejecutar el servicio.

Finalmente, comentar que lo que más nos ha costado a la hora de la implementación es la utilización de **MongoDB**, de **Mongoose** y sobretodo de **Heroku**, en gran parte por el desconocimiento de esta última tecnología y su configuración. Sin embargo, hemos aprendido gracias a estas herramientas que:

- **MongoDB** nos ha enseñado a crear Menús intuitivos para el usuario, ofreciendo unas opciones fijas y muy claras para el usuario.
- **Mongoose** nos permite comprobar la correcta estructura de los datos de objetos en un fichero JSON para poder leer esos datos más adelante, incluso en otra ejecución desde cero del mismo programa.

<br/><br/>

## 5. Referencias. <a name="id5"></a> 
1. [Github.](http://github.com)
2. [Repositorio practica 11.](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct11-menu-api-grupo-p)
3. [Enunciado Práctica 11.](https://ull-esit-inf-dsi-2021.github.io/prct11-menu-api/)
4. [Apuntes de clases.](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/)
5. [Documentación MongoDB.](https://www.mongodb.com/es)
6. [Documentación Mongoose.](https://mongoosejs.com/)
7. [StackOverFlow.](https://es.stackoverflow.com/)
