import express = require('express');
import * as mongoose from 'mongoose';
// import {Grupo} from './models/alimento';
import {MongoClient} from 'mongodb';
import {alimentoModel} from './models/alimento';
import {Plato} from './models/plato';
import {Categoria} from './models/plato';
import {menuModel} from './models/menu';


// http://localhost:3000/ingredients?cmd=read&nombre=piña&precio=3&origen=hawaii&calorias=100&macros=30&grupo=Fruta
// http://localhost:3000/courses?cmd=create&nombre="arroz con leche"&alimentos="arroz, leche"&categoria="Postre"

/**
 *  const app = express();
    app.use(express.json());
    app.use(postRouter);
    app.use(getRouter);
    app.use(patchRouter);
    app.use(deleteRouter);
    app.use(defaultRouter);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server is up on port ${port}`);
    });
 */

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'LunaRosa-bbdd';

mongoose.connect(`${dbURL}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to the database.');
}).catch(() => {
  console.log('Something went wrong when conecting to the database.');
});

function createSomething(path: string, data, db) {
  MongoClient.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (error, client) => {
    if (error) {
      console.log(`Unable to connect to database: ${error.message}`);
    } else {
      const db = client.db(dbName);
      console.log(db.databaseName);
      switch (path) {
        case 'ingredients':
          console.log('Añadimos un ingrediente a la BBDD.');
          db.collection(`${path}`).insertOne({
            nombreAlimento: data.nombre,
            precio: data.precio,
            origen: data.origen,
            calorias: data.calorias,
            grupo: data.grupo,
          }).then((result) => {
            // console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        case 'courses':
          console.log('Añadimos un plato nuevo a la BBDD.');
          db.collection(`${path}`).insertOne({
            nombrePlato: data.nombre,
            alimentos: data.alimentos,
            categoria: data.categoria,
          }).then((result) => {
            // console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        case 'menus':
          console.log('Añadimos el menú a la BBDD');
          db.collection(`${path}`).insertOne({
            nombreMenu: data.nombreMenu,
            platos: data.platos,    // ajustar qué cosa exactamente está
          }).then((result) => {
            // console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        default:
          break;
      }
    }
  });  
}

function readSomething(path: string, data, db) {
  // console.log(`Comando: ${data.cmd}, Nombre: ${data.nombre}, Grupo: ${data.grupo}`);
  
  MongoClient.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (error, client) => {
    if (error) {
      console.log(`Unable to connect to database: ${error.message}`);
    } else {
      const db = client.db(dbName);
      console.log(db.databaseName);
      switch (path) {
        case 'ingredients':
          console.log('Leemos un ingrediente de la BBDD.');
          db.collection(`${path}`).findOne({
            nombreAlimento: new String(data.nombre), //??
          }).then((result) => {
            console.log('Obtenido ingrediente: ' + result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        case 'courses':
          console.log('Leemos un plato de la BBDD.');
          db.collection(`${path}`).findOne({
            nombrePlato: new String(data.nombre),
            categoria: new String(data.categoria),
          }).then((result) => {
            // console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        case 'menus':
          console.log('Leemos un menú de la BBDD');
          db.collection(`${path}`).findOne({
            nombreMenu: new String(data.nombreMenu),
            //platos: data.platos,    // ajustar qué cosa exactamente está
          }).then((result) => {
            // console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        default:
          break;
      }
    }
  });

}

function updateSomething(path: string, data, db) {
  switch (path) {
    case 'ingredients':
      console.log('Modificamos el ingrediente de la BBDD');
      break;
    case 'courses':
      console.log('Modificamos el plato de la BBDD');
      break;
    case 'menus':
      console.log('Modificamos el menú de la BBDD');
      break;
    default:
      break;
  }
}

function deleteSomething(path: string, data, db) {
   
  MongoClient.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (error, client) => {
    if (error) {
      console.log(`Unable to connect to database: ${error.message}`);
    } else {
      const db = client.db(dbName);
      console.log(db.databaseName);
      switch (path) {
        case 'ingredients':
          console.log('Borrado un ingrediente de la BBDD.');
          db.collection(`${path}`).findOne({
            nombreAlimento: new String(data.nombre), //??
          }).then((result) => {
            console.log('Borrado ingrediente: ');
          }).catch((error) => {
            console.log(error);
          });
          break;
        case 'courses':
          console.log('Borrado un plato de la BBDD.');
          db.collection(`${path}`).findOne({
            nombrePlato: new String(data.nombre),
            categoria: new String(data.categoria),
          }).then((result) => {
            // console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        case 'menus':
          console.log('Borrado un menú de la BBDD');
          db.collection(`${path}`).findOne({
            nombreMenu: new String(data.nombreMenu),
            //platos: data.platos,    // ajustar qué cosa exactamente está
          }).then((result) => {
            // console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          break;
        default:
          break;
      }
    }
  });

}

function appInitialization() {
  const db = '';
  const app = express();
  app.get('/ingredients', (request, response) => {
    if (request.query.cmd.length === 0) {
      response.send('Se muestran todos los Ingredientes');
    } else {
      switch (request.query.cmd) {
        case 'create':
          createSomething('ingredients', request.query, db);
          response.send('Se ha creado y añadido el nuevo ingrediente.');
          // código para crear un nuevo ingrediente en la BBDD (puede fallar)
          break;
        case 'read':
          // código para comprobar si podemos leer el ingrediente solicitado (puede fallar)
          readSomething('ingredients', request.query, db);
          response.send('Datos leídos correctamente: ');
          break;
        case 'update':
          // código para modificar el ingrediente. (puede fallar)
          updateSomething('ingredients', request.query, db);
          response.send('Datos modificados correctamente');
          break;
        case 'delete':
          // código para borrar un ingrediente de la BBDD. (puede fallar)
          deleteSomething('ingredients', request.query, db);
          response.send('Datos borrados correctamente.');
          break;
        default:
          break;
      }
    }
  });

  app.get('/courses', (request, response) => {
    console.log(`${request.query.cmd}`);
    if (request.query.cmd.length === 0) {
      response.send('Se muestran todos los Platos');
    } else {
      switch (request.query.cmd) {
        case 'create':
          createSomething('courses', request.query, db);
          response.send('Se ha creado y añadido el nuevo plato.');
          // código para crear un nuevo ingrediente en la BBDD (puede fallar)
          break;
        case 'read':
          // código para comprobar si podemos leer el ingrediente solicitado (puede fallar)
          readSomething('courses', request.query, db);
          response.send('Datos leídos correctamente: ');
          break;
        case 'update':
          // código para modificar el ingrediente. (puede fallar)
          updateSomething('courses', request.query, db);
          response.send('Datos modificados correctamente');
          break;
        case 'delete':
          // código para borrar un ingrediente de la BBDD. (puede fallar)
          deleteSomething('courses', request.query, db);
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
      const menu = 'menu';
      switch (request.query.cmd) {
        case 'create':
          createSomething(menu, request.query, db);
          response.send('Se ha creado y añadido el nuevo menú.');
          // código para crear un nuevo ingrediente en la BBDD (puede fallar)
          break;
        case 'read':
          // código para comprobar si podemos leer el ingrediente solicitado (puede fallar)
          readSomething(menu, request.query, db);
          response.send('Datos leídos correctamente: ');
          break;
        case 'update':
          // código para modificar el ingrediente. (puede fallar)
          updateSomething(menu, request.query, db);
          response.send('Datos modificados correctamente');
          break;
        case 'delete':
          // código para borrar un ingrediente de la BBDD. (puede fallar)
          deleteSomething(menu, request.query, db);
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
}

appInitialization();

/*
const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'LunaRosa-bbdd';

MongoClient.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (error, client) => {
  if (error) {
    console.log(`Unable to connect to database: ${error.message}`);
  } else {
    const db = client.db(dbName);
    console.log(db.databaseName);
    
    db.collection(`${path}`).insertOne({
      nombreAlimento: data.nombre,
      precio: data.precio,
      origen: data.origen,
      calorias: data.calorias,
      grupo: data.grupo,
    }).then((result) => {
      // console.log(result);
    }).catch((error) => {
      console.log(error);
    });
    
  }
});
*/
