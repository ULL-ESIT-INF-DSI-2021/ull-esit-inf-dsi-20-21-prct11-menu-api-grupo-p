import * as express from 'express';
import {platoModel} from '../models/plato';

export const platoRouter = express.Router();

// para consultar
platoRouter.get('/courses', async (req, res) => {
  const filter = req.body.nombrePlato?{nombrePlato: req.body.nombrePlato.toString()}:{};
  try {
    const platos = await platoModel.find(filter);
    if (platos.length !== 0) {
      return res.send(platos);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

platoRouter.get('/courses/:id', async (req, res) => {
  try {
    const platos = await platoModel.findById(req.params.id);
    if (!platos) {
      return res.status(404).send();
    }
    return res.send(platos);
  } catch (error) {
    return res.status(500).send();
  }
});

// Patch por ID
platoRouter.patch('/courses/:id', async (req, res) => {
  const allowedUpdates = ['nombrePlato', 'precio', 'origen', 'calorias', 'macros', 'grupos'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = 
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const platos = await platoModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!platos) {
      return res.status(404).send();
    }
    return res.send(platos);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// para crearlos, post o put
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
  try {
    await Plato.save();
    //
    res.status(201).send(Plato);
  } catch (error) {
    res.status(400).send(error);
  }
});

// para modificarlos, path o put nombrePlato
platoRouter.patch('/courses', async (req, res) => {
  if (!req.body.nombrePlato) {
    return res.status(400).send({
      error: 'An ingredient must be provided',
    });
  }
  const allowedUpdates = ['nombrePlato', 'precio', 'origen', 'calorias', 'macros', 'grupos'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const platos =
    await platoModel.findOneAndUpdate({nombrePlato: req.body.nombrePlato.toString()}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!platos) {
      return res.status(404).send();
    }
    return res.send(platos);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// para eliminarlos, delete
platoRouter.delete('/courses', async (req, res) => {
  if (!req.body.nombrePlato) {
    console.log(req.body.nombrePlato);
    return res.status(400).send({
      error: 'An ingredient must be provided',
    });
  }

  try {
    const ingrediente = 
      await platoModel.findOneAndDelete({nombrePlato: req.body.nombrePlato.toString()});
    if (!ingrediente) {
      return res.status(404).send();
    }
    return res.send(ingrediente);
  } catch (error) {
    return res.status(400).send();
  }
});

platoRouter.delete('/courses/:id', async (req, res) => {
  try {
    const plato = await platoModel.findByIdAndDelete(req.params.id);

    if (!plato) {
      return res.status(404).send();
    }

    return res.send(plato);
  } catch (error) {
    return res.status(400).send();
  }
});