import * as express from 'express';
import {alimentoModel} from '../models/alimento';

export const alimentoRouter = express.Router();

// para consultar
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

// para crearlos, post o put
alimentoRouter.post('/ingredients', async (req, res) => {
  const ingrediente = new alimentoModel(req.body);
  try {
    await ingrediente.save();
    res.status(201).send(ingrediente);
  } catch (error) {
    res.status(400).send(error);
  }
});

// para modificarlos, patch o put
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

alimentoRouter.patch('/ingredients/:id', async (req, res) => {
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
    const alimento = await alimentoModel.findByIdAndUpdate(req.params.id, req.body, {
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

alimentoRouter.delete('/ingredients/:id', async (req, res) => {
  try {
    const alimentos = await alimentoModel.findByIdAndDelete(req.params.id);

    if (!alimentos) {
      return res.status(404).send();
    }

    return res.send(alimentos);
  } catch (error) {
    return res.status(400).send();
  }
});