# Práctica 11 - API Node/Express de gestión de información nutricional

<br/><br/>

### Hecho por:  
  * Óscar Cigala Álvarez - alu0101038230@ull.edu.es
  * Óscar Ignacio Pozo Fernandez - alu0101036526@ull.edu.es
  * Eduardo Da Silva Yanes - alu0101104911@ull.edu.es
  * Joel Francisco Escobar Socas - alu0101130408@ull.edu.es

<br/><br/>

### Índice:

1. [Introducción y objetivos.](#id1)
  
2. [Conocimientos Previos](#id2)
      
      2.1. [Clase Alimentos.](#id21)
      2.2. [Clase Plato.](#id22)
      2.3. [Clase Menú](#id23)

3. [Desarrollo](#id3)

4. [Dificultades](#id4)

5. [Conclusión.](#id5)

6. [Referencias.](#id6)



- [Mongo DB for Node.js]()

<br/><br/>


## 1. Introducción y objetivos <a name="id1"></a>

El objetivo de esta práctica es implementar de forma grupal una API haciendo uso de **Node/Express**, **Mongoose** y el módulo de **ThunderClient** para crear, eliminar, modificar y leer con las operaciones **CRUD** una serie de ingredientes, menus y platos utilizando para ello los conocimientos adquiridos con la anterior práctica en grupo.

<br/><br/>

## 2. Ejercicio. <a name="id2"></a>


<br/><br/>

## 3. Dificultades. <a name="id3"></a>

A lo largo de la práctica, nos han surgido diferentes dudas o errores que hemos ido solucionando de mutuo acuerdo. 

Comenzando por el principio, lo primero que hicimos fue plantear la jerarquía de clases y qué atributos tendría cada una (de manera estimada).

Sin embargo, las partes más complejas comenzaron en la clase `Plato`. Las funciones de `calculo` son un poquito más complejas que un simple *getter*, con la excepción de `calculoGrupoPredominante()`, que no es difícil en sí, pero supone un bloque grande de código que hemos tenido que trabajar para obtener un solo dato, pero de manera precisa y más o menos óptima. 

La siguiente parte que nos dio problemas fue el **deshacer los guardianes de tipos** de para algunas funciones. Primeramente con fallos de compilador y luego con fallos durante la ejecución, los métodos `search` no funcionaban bien en un principio porque el compilador no era capaz de separar correctamente los objetos `Menu` y `Plato`. Probamos varias opciones que encontramos por internet, pero al final lo mejor resultó ser la que aparece en los apuntes: usar `instanceof`. 

Durante la creación de la clase `Comanda`, se nos planteó la duda de si un cliente solicitaba un producto de la carta, y daba la casualidad que habían varios de ellos con un nombre similar (por ejemplo, diferentes carnes o verduras *a la **barbacoa***), lo cual implicaba que se le sumaban todas esas coincidencias a su comanda. Nuestra forma de aplacar este problema es la de mostrar todas las opciones y preguntar al cliente cuáles quiere. Para ello hemos hecho uso del módulo/interfaz `readline` que nos permite trabajar con la terminal y permitir al cliente realizar su orden correctamente. 

El fichero `bbdd.ts` es la parte que más problemas nos ha dado. Para todos no es nuevo trabajar con `inquirer` y `lowdb`, lo cual ha supuesto bastante prueba y error (de compilación) con los ejemplos que hemos seguido. 

Al final hemos conseguido crear una estructura de menús con `inquirer`, con lo que nos quedamos satisfechos. Sin embargo, no hemos conseguido hacer funcionar el módulo **lowdb**. Hemos consultado la referencia del libro y ejemplos en internet. Entendemos su cometido, pero a nivel de código no lo hemos podido llevar a cabo. 

<br/><br/>

## 4. Conclusión. <a name="id4"></a>

Los objetivos que hemos cumplido satisfactoriamente sobre esta práctica han sido: crear una estructura de Menú usando los módulos Inquirer.js y Lowdb sobre un grupo de objetos en Typescript.

Es decir, hemos aplicado un buen diseño de las clases solicitadas en el guión y respetando los principios SOLID. Con ello, conseguimos que la información que contiene cada clase esté bien ordenada y tenga sentido, en un entorno práctico.

Hemos realizado las pruebas según la metodología TDD: primero creando las funciones para que fallen, y después completarlas hasta que supongamos que funcionen. Con este prueba y error en el que comparamos los resultados con los objetos instanciados dentro del fichero de pruebas, nos ha hecho adoptar un modelo y metodología que creemos correcta para TDD.

Por último, ha sido nuestro primer contacto con **Inquirer.js** y **Lowdb**. Nos ha costado hacer que los ejemplos no den errores de compilación y que nuestras implementaciones funcionen correctamente.

**Inquirer.js** nos ha enseñado a crear Menús intuitivos para el usuario, ofreciendo unas opciones fijas y muy claras para el usuario.

**Lowdb** nos permite almacenar los datos de objetos en un fichero JSON para poder leer esos datos más adelante, incluso en otra ejecución desde cero del mismo programa.

<br/><br/>

## 5. Referencias. <a name="id5"></a>
1. [Github.](http://github.com)
2. [Repositorio practica 7](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct07-menu-datamodel-grupo-p)
   [Repositorio practica 11](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct11-menu-api-grupo-p)
3. [Enunciado Práctica 11.](https://ull-esit-inf-dsi-2021.github.io/prct11-menu-api/)
4. [Documentación GitHub Actions](https://docs.github.com/en/actions)
5. [Documentación Istanbul](https://istanbul.js.org/)
6. [Documentación Coveralls](https://coveralls.io/)
7. [Documentación de TypeDoc.](https://typedoc.org/)
8. [Documentación de Mocha.](https://mochajs.org/)
9. [Documentación de Chai.](https://www.chaijs.com/)