/**
 * Tipo de datos Macronutrientes. Servirá como composición nutricional de los alimentos.
 * @param carbohidratos Cantidad de hidratos de carbono por cada 100 gr que posee el alimento.
 * @param proteinas Cantidad de proteínas por cada 100 gr que posee el alimento.
 * @param lipidos Cantidad de lípidos por cada 100 gr de carbono que posee el alimento.
 */
export type Macronutrientes = {
  carbohidratos: number,
  proteinas: number,
  lipidos: number
}

/**
 * Tipo de datos Grupo. Es el grupo de alimentos al que pertenece el alimento.
 */
export type Grupo = 'CARNES' | 'PESCADOS' | 'HUEVOS' | 'TOFU' | 'FRUTOS_SECOS' | 'SEMILLAS' | 'LEGUMBRES' |
'VERDURAS' | 'HORTALIZAS' | 'LACTEOS' | 'CEREALES' | 'FRUTAS' | 'PROCESADOS';

/**
 * Esta es la clase Alimento.
 */
export class Alimento {
  
  /**
   * Constructor de la clase Alimento
   * @param nombreAlimento Nombre del alimento en cuestión.
   * @param precio Precio del alimento.
   * @param origen Localización de origen del alimento (país, ciudad, etc.).
   * @param calorias Kilocalorías por 100 gramos de dicho alimento.
   * @param macros Los macronutrientes que posee el alimento por cada 100 gr(carbohidratos, protínas y lípidos).
   * @param grupo Grupo de alimentos al que pertenece el alimento.
   */
  constructor(private nombreAlimento: string, private precio: number, private origen: string,
  private calorias: number, private macros: Macronutrientes, private grupo: Grupo) {}

  /**
   * Obtiene el nombre del alimento.
   * @returns Nombre del alimento.
   */
  getNombreAlimento() {
    return this.nombreAlimento;
  }

  /**
   * Obtiene el precio por Kg (en euros).
   * @returns Precio del alimento por Kg.
   */
  getPrecio() {
    return this.precio;
  }

  /**
   * Obtiene el origen del alimento.
   * @returns Origen del alimento.
   */
  getOrigen() {
    return this.origen;
  }

  /**
   * Obtiene kilocalorías (kcal) por 100 gr de dicho alimento.
   * @returns kcal del alimento.
   */
  getCalorias() {
    return this.calorias;
  }

  /**
   * Obtiene los macronutrientes del alimento por 100 gr.
   * @returns Macronutrientes del alimento.
   */
  getMacronutrientes() {
    return this.macros;
  }

  /**
   * Obtiene el grupo del alimento
   * @returns Grupo del alimento.
   */
  getGrupo() {
    return this.grupo;
  }
}