import express = require('express');

const app = express();

import {MongoClient} from 'mongodb';

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'notes-app';

MongoClient.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (error, client) => {
  if (error) {
    console.log(`Unable to connect to database: ${error.message}`);
  } else {
    const db = client.db(dbName);
    console.log(db.databaseName);
  }
});

// http://localhost:3000/ingredients?cmd=read&nombre=piña&precio=3&origen=hawaii&calorias=100&macros=30&grupo=Fruta

function createSomething(path: string, data) {
  switch (path) {
    case '/ingredients':
      console.log('Añadimos un ingrediente a la BBDD');
      // aquí usamos funciones de MongoDB que interactúan con la BBDD
      break;
    case '/courses':
      console.log('Añadimos el plato a la BBDD');
      break;
    case '/menus':
      console.log('Añadimos el menú a la BBDD');
      break;
    default:
      break;
  }
}

function readSomething(path: string, data) {
  console.log(`Comando: ${data.cmd}, Nombre: ${data.nombre}, Grupo: ${data.grupo}`);
  switch (path) {
    case '/ingredients':
      console.log('Leemos el ingrediente de la BBDD');
      break;
    case '/courses':
      console.log('Leemos el plato de la BBDD');
      break;
    case '/menus':
      console.log('Leemos el menú de la BBDD');
      break;
    default:
      break;
  }
}

function updateSomething(path: string, data) {
  switch (path) {
    case '/ingredients':
      console.log('Modificamos el ingrediente de la BBDD');
      break;
    case '/courses':
      console.log('Modificamos el plato de la BBDD');
      break;
    case '/menus':
      console.log('Modificamos el menú de la BBDD');
      break;
    default:
      break;
  }
}

function deleteSomething(path: string, data) {
  switch (path) {
    case '/ingredients':
      console.log('Eliminamos el ingrediente de la BBDD');
      break;
    case '/courses':
      console.log('Eliminamos el plato de la BBDD');
      break;
    case '/menus':
      console.log('Eliminamos el menú de la BBDD');
      break;
    default:
      break;
  }
}

// Los comandos que debe aceptar son: Create - Read - Update - Delete
app.get('/ingredients', (request, response) => {
  /**
   * Puedes acceder a las variables con:
   * request.query.[variable]
   * request.query.nombre
   */
  if (request.query.cmd.length === 0) {
    response.send('Se muestran todos los Ingredientes');
  } else {
    switch (request.query.cmd) {
      case 'create':
        createSomething('/ingredients', 'datos');
        response.send('Se ha creado y añadido el nuevo ingrediente.');
        // código para crear un nuevo ingrediente en la BBDD (puede fallar)
        break;
      case 'read':
        // código para comprobar si podemos leer el ingrediente solicitado (puede fallar)
        readSomething('/ingredients', request.query);
        response.send('Datos leídos correctamente: ');
        break;
      case 'update':
        // código para modificar el ingrediente. (puede fallar)
        updateSomething('/ingredients', 'datos');
        response.send('Datos modificados correctamente');
        break;
      case 'delete':
        // código para borrar un ingrediente de la BBDD. (puede fallar)
        deleteSomething('/ingredients', 'datos');
        response.send('Datos borrados correctamente.');
        break;
      default:
        break;
    }
  }
  /*
  response.send({
    info: [
      {
        title: 'Ingredientes',
        data: `${request.query}`,
      }
    ]
  });
  */
});

app.get('/courses', (request, response) => {
  if (request.query.cmd.length === 0) {
    response.send('Se muestran todos los Platos');
  } else {
    switch (request.query.cmd) {
      case 'create':
        createSomething('/courses', 'datos');
        response.send('Se ha creado y añadido el nuevo plato.');
        // código para crear un nuevo ingrediente en la BBDD (puede fallar)
        break;
      case 'read':
        // código para comprobar si podemos leer el ingrediente solicitado (puede fallar)
        readSomething('/courses', 'datos');
        response.send('Datos leídos correctamente: ');
        break;
      case 'update':
        // código para modificar el ingrediente. (puede fallar)
        updateSomething('/courses', 'datos');
        response.send('Datos modificados correctamente');
        break;
      case 'delete':
        // código para borrar un ingrediente de la BBDD. (puede fallar)
        deleteSomething('/courses', 'datos');
        response.send('Datos borrados correctamente.');
        break;
      default:
        break;
    }
  }
});

app.get('/menus', (request, response) => {
  if (request.query.cmd.length === 0) {
    response.send('Se muestran todos los Platos');
  } else {
    switch (request.query.cmd) {
      case 'create':
        createSomething('/menus', 'datos');
        response.send('Se ha creado y añadido el nuevo menú.');
        // código para crear un nuevo ingrediente en la BBDD (puede fallar)
        break;
      case 'read':
        // código para comprobar si podemos leer el ingrediente solicitado (puede fallar)
        readSomething('/menus', 'datos');
        response.send('Datos leídos correctamente: ');
        break;
      case 'update':
        // código para modificar el ingrediente. (puede fallar)
        updateSomething('/menus', 'datos');
        response.send('Datos modificados correctamente');
        break;
      case 'delete':
        // código para borrar un ingrediente de la BBDD. (puede fallar)
        deleteSomething('/menus', 'datos');
        response.send('Datos borrados correctamente.');
        break;
      default:
        break;
    }
  }
});

// Página por defecto que muestra el mensaje 404.
app.get('*', (_, response) => {
  response.send('<h1>404</h1>');
});

// Así se le indica a express en qué puerto escuchar.
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
