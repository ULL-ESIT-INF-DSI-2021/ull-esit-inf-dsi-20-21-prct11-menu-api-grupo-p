import { Alimento } from "./alimento";
import { Macronutrientes } from "./alimento"
import { Grupo } from "./alimento";

/**
 * Tipo de datos Categoria. Existen 4 categorías posibles: Entrante, 
 * primer plato, segundo plato o postre
 */
export type Categoria = 'ENTRANTE' | 'PRIMERO' | 'SEGUNDO' | 'POSTRE';

/*
 * Esta es la clase Plato.
 */
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

  /**
   * Obtiene el nombre del alimento.
   * @returns Nombre del alimento.
   */
  getNombrePlato() {
    return this.nombrePlato;
  }

  /**
   * Obtiene la lista de alimentos y/o ingredientes que lo componen.
   * @returns Lista de alimentos.
   */
  getAlimentos() {
    return this.alimentos;
  }

  /**
   * Obtiene el nombre de la categoría del plato.
   * @returns Nombre de la categoría del plato.
   */
  getCategoria() {
    return this.categoria;
  }

  /**
   * Obtiene los macronutrientes en conjunto del plato.
   * @returns Cantidad de macronutrientes del plato.
   */
  getMacronutrientesPlato() {
    return this.macronutrientes_plato;
  }

  /**
   * Obtiene el precio del plato en función a los ingredientes utilizados y su cantidad.
   * @returns Precio del plato.
   */
  getPrecio() {
    return this.precio;
  }

  /**
   * Realiza el cálculo de los macronutrientes del plato en base a la cantidad de cada alimento.
   * @returns Macronutrientes del plato.
   */
  calculoMacronutrientes() {
    let resultado: Macronutrientes = {carbohidratos: 0, proteinas: 0, lipidos: 0};
    this.alimentos.forEach((elemento) => {
      // Calculamos en función a la cantidad utilizada
      resultado.carbohidratos += (elemento[0].getMacronutrientes().carbohidratos * elemento[1]) / 100;
      resultado.lipidos += (elemento[0].getMacronutrientes().lipidos * elemento[1]) / 100;
      resultado.proteinas += (elemento[0].getMacronutrientes().proteinas * elemento[1]) / 100;
    });
    return resultado;
  }

  /**
   * Realiza el cálculo del precio en función a la cantidad utilizada de cada alimento.
   * @return Precio (Euros).
   */ 
  calculoPrecio(): number {
    let sumatorio: number = 0;
    this.alimentos.forEach((elemento) => {
      const precio = elemento[0].getPrecio();
      const precioGramo = (precio / 1000) * elemento[1];
      sumatorio += precioGramo;
    })
    return sumatorio;
  }

  /**
   * Calcula el grupo de alimentos predominante, es decir, el grupo de alimentos que 
   * más aparece entre los ingredientes del plato.
   * @return El grupo más repetido.
   */
  calculoGrupoPredominante() {
    this.alimentos.forEach((elemento) => {
      const grupo = elemento[0].getGrupo();
      let contadorAlimentos: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      switch (grupo) {
        case 'CARNES':
          contadorAlimentos[0]++;
          if (contadorAlimentos[0] >= this.alimentos.length / 2)
            return 'CARNES';
          break;
        case 'PESCADOS':
          contadorAlimentos[1]++;
          if (contadorAlimentos[1] >= this.alimentos.length / 2)
            return 'PESCADOS';
          break;
        case 'HUEVOS':
          contadorAlimentos[2]++;
          if (contadorAlimentos[2] >= this.alimentos.length / 2)
            return 'HUEVOS';
          break;
        case 'TOFU':
          contadorAlimentos[3]++;
          if (contadorAlimentos[3] >= this.alimentos.length / 2)
            return 'TOFU';
          break;
        case 'FRUTOS_SECOS':
          contadorAlimentos[4]++;
          if (contadorAlimentos[4] >= this.alimentos.length / 2)
            return 'FRUTOS_SECOS';
          break;
        case 'SEMILLAS':
          contadorAlimentos[5]++;
          if (contadorAlimentos[5] >= this.alimentos.length / 2)
            return 'SEMILLAS';
          break;
        case 'LEGUMBRES':
          contadorAlimentos[6]++;
          if (contadorAlimentos[6] >= this.alimentos.length / 2)
            return 'LEGUMBRES';
          break;
        case 'VERDURAS':
          contadorAlimentos[7]++;
          if (contadorAlimentos[7] >= this.alimentos.length / 2)
            return 'VERDURAS';
          break;
        case 'HORTALIZAS':
          contadorAlimentos[8]++;
          if (contadorAlimentos[8] >= this.alimentos.length / 2)
            return 'HORTALIZAS';
          break;
        case 'LACTEOS':
          contadorAlimentos[9]++;
          if (contadorAlimentos[9] >= this.alimentos.length / 2)
            return 'LACTEOS';
          break;
        case 'CEREALES':
          contadorAlimentos[10]++;
          if (contadorAlimentos[10] >= this.alimentos.length / 2)
            return 'CEREALES';
          break;
        case 'FRUTAS':
          contadorAlimentos[11]++;
          if (contadorAlimentos[11] >= this.alimentos.length / 2)
            return 'FRUTAS';
          break;
        case 'PROCESADOS':
          contadorAlimentos[12]++;
          if (contadorAlimentos[12] >= this.alimentos.length / 2)
            return 'PROCESADOS';
          break;
        default:
          throw new Error("Error al calcular el grupo predominante.");
          break;
      }
      let mayorCoincidencias = contadorAlimentos[0];
      let posicion = 0;
      for (let i = 1; i < contadorAlimentos.length; i++) {
        if (contadorAlimentos[i] > mayorCoincidencias) {
          mayorCoincidencias = contadorAlimentos[i];
          posicion = i;
        }
      }
      let arrayGrupos: string[] = ['CARNES', 'PESCADOS', 'HUEVOS', 'TOFU', 'FRUTOS_SECOS', 'SEMILLAS', 'LEGUMBRES', 'VERDURAS', 'HORTALIZAS', 'LACTEOS', 'CEREALES', 'FRUTAS', 'PROCESADOS'];
      return arrayGrupos[posicion];
    });
  }
}