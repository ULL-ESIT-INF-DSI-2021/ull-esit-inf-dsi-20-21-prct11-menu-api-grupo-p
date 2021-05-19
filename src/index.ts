import express = require('express');
import './db/mongoose';

import {alimentoRouter} from './routers/ingredientsRouter';
import {platoRouter} from './routers/platosRouter';
import {menuRouter} from './routers/menusRouter';

// http://localhost:3000/ingredients?cmd=read&nombre=piña&precio=3&origen=hawaii&calorias=100&macros=30&grupo=Fruta
// http://localhost:3000/courses?cmd=create&nombre="arroz con leche"&alimentos="arroz, leche"&categoria="Postre"

const app = express();
app.use(express.json());
app.use(alimentoRouter);
app.use(platoRouter);
app.use(menuRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

