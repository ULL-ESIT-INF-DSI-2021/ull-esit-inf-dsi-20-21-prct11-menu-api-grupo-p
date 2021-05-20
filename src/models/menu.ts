import * as mongoose from 'mongoose';
import { Alimento } from "./alimento";
import { Macronutrientes } from "./alimento"
import { Grupo } from "./alimento";
import { macronutrientesSchema } from "./alimento";
import { Plato } from "./plato";
import { Categoria } from "./plato";
import { platoSchema } from "./plato";

/*
 * Esta es la clase Menu.
 */
export class Menu {
  /**
   * Constructor de la clase Menu. Comprueba que existan al menos 3 platos de 3 categorías 
   * distintas (Entrante, Primero, Segundo y Postre) en cada Menú. Si no los hay, devuelve un error.
   * @param nombreMenu Nombre del menú en cuestión.
   * @param primerPlato Primer plato del menú.
   * @param demasPlatos Array donde se almacenan el resto de los platos del menú.
   */
  private precio: number = 0;
  private arrayPlatos: Plato[] = [];
  constructor(private nombreMenu: string, private primerPlato: Plato, ...demasPlatos: Plato[]) {
    this.arrayPlatos.push(primerPlato);
    demasPlatos.forEach((element) => {
      this.arrayPlatos.push(element);
    });

    let existeElemento: number[] = [0, 0, 0, 0];
    let grupoElemento: Categoria;
    this.arrayPlatos.forEach((elemento) => {
      grupoElemento = elemento.getCategoria();
      if (grupoElemento === 'ENTRANTE') {
        existeElemento[0] = 1;
      } else if (grupoElemento === 'PRIMERO') {
        existeElemento[1] = 1;
      } else if (grupoElemento === 'SEGUNDO') {
        existeElemento[2] = 1;
      } else if (grupoElemento === 'POSTRE') {
        existeElemento[3] = 1;
      }
    });
    const counts = existeElemento[0] + existeElemento[1] + existeElemento[2] + existeElemento[3];
    if (counts < 3) {
      throw new Error("Los menús deben tener 3 categorías de platos como mínimo.");
    }
  }

  /**
   * Obtiene el nombre del menú.
   * @returns Nombre del menú.
   */
  getNombreMenu() {
    return this.nombreMenu;
  }

  /**
   * Obtiene los platos que componen el menú.
   * @returns Listado de los platos del menú.
   */
  getPlatos(){
    return this.arrayPlatos;
  }

  /**
   * Obtiene la composición nutricional del menú, obteníendola plato por plato.
   * @returns Cantidad total de carbohidratos, proteínas y lípidos del menú.
   */
  getComposicionNutricional() {
    let composicionNutricional: Macronutrientes = {carbohidratos: 0, proteinas: 0, lipidos: 0};
    this.arrayPlatos.forEach((elemento) => {
      composicionNutricional.carbohidratos += elemento.calculoMacronutrientes().carbohidratos;
      composicionNutricional.proteinas += elemento.calculoMacronutrientes().proteinas;
      composicionNutricional.lipidos += elemento.calculoMacronutrientes().lipidos;
    });
    return composicionNutricional;
  }
  
  /**
   * Obtiene los grupos de alimentos que componen el menú. Almacena todos los grupos de 
   * todos los alimentos de todos los platos y al final filtrar para tener una copia de
   * cada. Este listado final de grupos únicos es lo que devuelve.
   * @returns Listado de grupos de alimentos (únicos) de todo el menú.
   */
  getGruposAlimentos(): Grupo[] {
    let arrayGruposAlimentos: Grupo[] = [];
    let platosGrupo: [Alimento, number][] = [];
    this.arrayPlatos.forEach((cadaPlato) => {
      cadaPlato.getAlimentos().forEach((cadaAlimento) => {
        arrayGruposAlimentos.push(cadaAlimento[0].getGrupo());
      });;
    });
    const arrayFinal: Grupo[] = arrayGruposAlimentos.filter((n, i) => arrayGruposAlimentos.indexOf(n) === i);
    return arrayFinal;
  }
  
  /**
   * Obtiene el precio del menú sumando los precios de sus platos.
   * @returns Precio (en euros) del menú.
   */
  getPrecioMenu(): number {
    let precioTotal: number = 0;
    this.arrayPlatos.forEach((element) => {
      precioTotal += element.getPrecio();
    });
    return precioTotal;
  }
}

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

export const menuModel = mongoose.model<Menu>('menus', menuSchema);
