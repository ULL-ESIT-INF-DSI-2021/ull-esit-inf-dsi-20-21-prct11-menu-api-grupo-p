import express = require('express');

const app = express();

app.get('/ingredients', (request, response) => {
  response.send('<h1>Ingredientes</h1>');
});

app.get('/courses', (request, response) => {
  response.send('<h1>Platos</h1>');
});

app.get('/menus', (request,response) => {
  response.send('<h1>Menú</h1>');
});

// Página por defecto que muestra el mensaje 404.
app.get('*', (_, response) => {
  response.send('<h1>404</h1>');
});

// Así se le indica a express en qué puerto escuchar.
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
