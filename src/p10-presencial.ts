// Ejercicio Presencial Práctica 10. Óscar Pozo
// import * as express from 'express'; // da error el import de esta manera ???
import {spawn} from 'child_process';
import express = require('express');

// http://localhost:3000
// http://localhost:3000/execmd
// http://localhost:3000/execmd?cmd=ls&args=-l
// http://localhost:3000/ingredients?cmd=añadir&nombre=piña&precio=3&origen=hawaii&calorias=100&macros=30&grupo=Fruta


const app = express();

app.get('/execmd', (request, response) => {
  console.log(request.query);
  const comandoLinux = spawn(`${request.query.cmd}`, [`${request.query.args}`, `.`]);
  comandoLinux.stdout.on('data', (chunk) => {
    response.send({
      info: [
        {
          title: 'Salida exitosa del comando',
          data: `${chunk}`,
        },
      ],
    });
  });

  comandoLinux.on('error', (information) => {
    console.log('Comunicamos el error');
    response.send({
      info: [
        {
          title: 'Error en el comando',
          name: `${information.name}`,
          message: `${information.message}`,
        },
      ],
    });
  });
});

app.get('*', (_, res) => {
  res.send('<h1>404</h1>');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});