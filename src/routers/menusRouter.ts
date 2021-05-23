import * as express from 'express';
import {menuModel} from '../models/menu';

export const menuRouter = express.Router();

// para consultar
menuRouter.get('/menus', async (req, res) => {
  const filter = req.body.nombreMenu?{nombreMenu: req.body.nombreMenu.toString()}:{};
  try {
    const alimentos10 = await menuModel.find(filter);
    if (alimentos10.length !== 0) {
      return res.send(alimentos10);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

menuRouter.get('/menus/:id', async (req, res) => {
  try {
    const menus = await menuModel.findById(req.params.id);
    if (!menus) {
      return res.status(404).send();
    }
    return res.send(menus);
  } catch (error) {
    return res.status(500).send();
  }
});

// para crearlos, post o put
menuRouter.post('/menus', async (req, res) => {
  const platosAux = req.body.arrayPlatos;
  let precioFinal: number = 0;
  let carbostotales: number = 0;
  let proteinastotales: number = 0;
  let lipidostotales: number = 0;

  for(var i in platosAux){
    const ingrediAux = platosAux[i].alimentos;
    for (var i in ingrediAux){
      precioFinal += ingrediAux[i].precio;
      console.log('Precio nuevo ' + ingrediAux[i].precio);
      console.log('Precio total ' + precioFinal);
      // carbostotales += ingrediAux[i].macros.carbohidratos;
      // proteinastotales += ingrediAux[i].macros.proteinas;
      // lipidostotales += ingrediAux[i].macros.lipidos;
    }
  }

  req.body.precio = +(precioFinal.toFixed(2));

  /*
  req.body.macronutrientes_plato = {
    "carbohidratos": carbostotales, 
    "proteinas": proteinastotales,
    "lipidos": lipidostotales
  }
  */
  
  const menu = new menuModel(req.body);
  try {
    await menu.save();
    res.status(201).send(menu);
  } catch (error) {
    res.status(400).send(error);
  }
});

// para modificarlos, path o put
menuRouter.patch('/menus', async (req, res) => {
  if (!req.body.nombreMenu) {
    return res.status(400).send({
      error: 'An ingredient must be provided',
    });
  }
  const allowedUpdates = ['nombreMenu', 'precio', 'origen', 'calorias', 'macros', 'grupos'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const menu =
    await menuModel.findOneAndUpdate({nombreMenu: req.body.nombreMenu.toString()}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menu) {
      return res.status(404).send();
    }

    return res.send(menu);
  } catch (error) {
    return res.status(400).send(error);
  }
});

menuRouter.patch('/menus/:id', async (req, res) => {
  const allowedUpdates = ['nombreMenu', 'precio', 'origen', 'calorias', 'macros', 'grupos'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = 
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const alimento = await menuModel.findByIdAndUpdate(req.params.id, req.body, {
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

// para eliminarlos, delete
menuRouter.delete('/menus', async (req, res) => {
  console.log(`${req.body.nombreAlimento}`);
  if (!req.body.nombreAlimento) {
    console.log(req.body.nombreAlimento);
    return res.status(400).send({
      error: 'An ingredient must be provided',
    });
  }

  try {
    const ingrediente = 
      await menuModel.findOneAndDelete({nombreAlimento: req.body.nombreAlimento.toString()});
    if (!ingrediente) {
      return res.status(404).send();
    }
    return res.send(ingrediente);
  } catch (error) {
    return res.status(400).send();
  }
});


menuRouter.delete('/menu/:id', async (req, res) => {
    try {
      const menus = await menuModel.findByIdAndDelete(req.params.id);
  
      if (!menus) {
        return res.status(404).send();
      }
  
      return res.send(menus);
    } catch (error) {
      return res.status(400).send();
    }
  });