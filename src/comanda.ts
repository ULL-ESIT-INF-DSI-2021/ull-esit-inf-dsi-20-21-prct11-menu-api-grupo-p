// ------------------------ FICHERO NO NECESARIO -----------------------
import { Carta } from "./carta";
import { Plato } from "./plato";
import { Menu } from "./menu";
import * as readline from 'readline';

/**
 * Esta es la clase Comanda. 
 */
export class Comanda {
  /**
   * Constructor de la clase Comanda.    arrzo 
   * @param comanda Es un array dond
   */
  private comanda: (Menu|Plato)[] = [];
  constructor(public readonly carta: Carta) {
  }

  /**
   * Obtiene la comanda.
   * @returns Array comanda entero.
   */
  mostrarComanda() {
    return this.comanda;
  }
  
  /**
   * Método que permite al cliente añadir un menú a la comanda.
   * Busca la cadena dentro de los nombres de todos los menús de la Carta.
   * Encuentra todas las coincidencias, y si son 2 o más (diferentes), pregunta al cliente
   * si quiere de ese tipo.
   * 
   * @param nombreMenu El nombre del menú que quiere añadir a la comanda.
   * @param cantidadMenu La cantidad de menús que quiere añadir a la comanda.
   */
  sumarMenu(nombreMenu: string, cantidadMenu: number) {
    const matchedMenus = this.carta.searchMenu(nombreMenu);

    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    if (matchedMenus.length <= 0) {
      console.log('No se encontró en la Carta.');
    } else {
      if (matchedMenus.length > 1) {
        matchedMenus.forEach((elemento) => {
          rl.question(('¿Añadir ' + elemento.getNombreMenu() + ' a la comanda?'), (answer) => {
            switch(answer.toLowerCase()) {
              case 'si':
                console.log('Menú añadido');
                break;
              case 'no':
                let index = matchedMenus.indexOf(elemento);
                if (index > -1)
                  matchedMenus.splice(index, 1);
                break;
              default:
                console.log('Respuesta no soportada.')
            }
          });
        });
      }
      matchedMenus.forEach((element) => {
        for (let index = 0; index < cantidadMenu; index++) {
          this.comanda.push(element);
        }
      });
    }
  } 

  /**
   * Método que permite al cliente añadir un plato a la comanda.
   * Busca la cadena dentro de los nombres de todos los platos de la Carta.
   * Encuentra todas las coincidencias, y si son 2 o más (diferentes), pregunta al cliente
   * si quiere de ese tipo.
   * 
   * @param nombrePlato El nombre del plato que quiere añadir a la comanda.
   * @param cantidadPlato La cantidad de este tipo de platos que quiere añadir a la comanda.
   */
  sumarPlato(nombrePlato: string, cantidadPlato: number) {
    const matchedPlatos = this.carta.searchPlato(nombrePlato);

    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    if (matchedPlatos.length <= 0) {
      console.log('No se encontró en la Carta.');
    } else {
      if (matchedPlatos.length > 1) {
        matchedPlatos.forEach((elemento) => {
          console.log('¿Añadir ' + elemento.getNombrePlato() + ' a la comanda?');
          rl.question(('¿Añadir ' + elemento.getNombrePlato() + ' a la comanda?'), (answer) => {
            switch(answer.toLowerCase()) {
              case 'si':
                console.log('Plato añadido');
                break;
              case 'no':
                let index = matchedPlatos.indexOf(elemento);
                if (index > -1)
                  matchedPlatos.splice(index, 1);
                break;
              default:
                console.log('Respuesta no soportada.')
            }
          });
        });
      }
      matchedPlatos.forEach((element) => {
        for (let index = 0; index < cantidadPlato; index++) {
          this.comanda.push(element);
        }
      });
    }
  }

  /**
   * Método que permite encontrar un elemento de la comanda.
   * Deshace el guardián de tipos entre Menu y Plato para consultar correctamente
   * el nombre del elemento. Si el nombre coincide, entonces añade el objeto en el array.
   * 
   * @param nombre Nombre de la comanda a buscar.
   * @return Array de los objetos que coinciden en nombre.
   */
  encontrarEnComanda(nombre: string) {
    const matchedResults: (Menu|Plato)[] = [];
    this.comanda.forEach((elemento) => {
      if (elemento instanceof Menu) {
        if (elemento.getNombreMenu().search(nombre) > -1) {
          matchedResults.push(elemento);
        }
      } else if (elemento instanceof Plato) {
        if (elemento.getNombrePlato().search(nombre) > -1) {
          matchedResults.push(elemento);
        }
      }
    });
    return matchedResults;
  }

  /**
   * Método que permite eliminar elementos de la comanda.
   * Busca la subcadena que le otorgamos entre los nombres de todos los elementos
   * de la Comanda y almacena esos objetos para poder eliminarlos de la lista.
   * 
   * @param nombre Nombre del elemento a eliminar.
   */
  quitarElemento(nombreElemento: string, cantidadMenu: number) {
    const matchedMenus: (Menu|Plato)[] = this.encontrarEnComanda(nombreElemento);
    let index;
    matchedMenus.forEach((elemento) => {
      index = this.comanda.indexOf(elemento);
      if (index > -1) {
        this.comanda.splice(index, 1);
      }
    });
  }
}
