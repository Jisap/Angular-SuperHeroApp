import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators'; // Sirve para transformar lo que un observable puede retornar

@Injectable({
  providedIn: 'root'
})
export class HeroesService {  // Servicio de inserción de datos en nuestra bd

  private url = 'https://crud-angular-firebase-a770f-default-rtdb.europe-west1.firebasedatabase.app'; // Definimos donde esta nuestra bd

  constructor(private http: HttpClient) { }                   // Injectamos el protocolo http para comunicarnos con la bd

  crearHeroe(heroe: HeroeModel){                              // Definimos el método que insertara un modelo heroe

    return this.http.post(`${this.url}/heroes.json`, heroe)   // Enviamos a la bd el heroe del formulario. la resp de firebase sera su id 
              .pipe(
                map((resp:any) => {
                  heroe.id = resp.name;                       // Asignamos el valor de la id en el model heroe
                  return heroe
                })
              );
  }  

  actualizarHeroe( heroe: HeroeModel){                                      // Definimos el método que actualizará el registro

    const heroeTemp = {
      ...heroe                                                              // Duplicamos el objeto
    };

    delete heroeTemp.id;                                                    // Le borramos el id que generá la actualización

    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp); // Enviamos la actualización de los datos del formulario sin el id duplicado

  }

  borrarHeroe(id: string){

    return this.http.delete(`${this.url}/heroes/${id}.json`);            // Petición para borrar un registro según id
  }


  getHeroe(id: string){

    return this.http.get(`${this.url}/heroes/${id}.json`)                // Petición para obtener un registro según id


  }

  getHeroes(){
    return this.http.get(`${this.url}/heroes.json`)                        // Petición get para obtener todos los registros de Firebase
      .pipe(
        map(resp => this.crearArreglo(resp)),
        delay(1500)
       
      );
  }

  private crearArreglo(heroesObj:object){  //Esta función recibe el objeto que contiene la rspuesta de firebase
  
    const heroes: HeroeModel[]=[];         // Creamos un arreglo de heroes vacio

    if(heroesObj === null) { return []}    // Si la bd está vacia la respuesta será un arreglo vacio

    Object.keys(heroesObj).forEach(key =>{  // Obtenemos todas los nombre de las props (ids de FB) del objeto y la recorremos

      const heroe: HeroeModel = heroesObj[key];  // Crearemos un heroe para cada posición de esas props
      heroe.id = key;                            // y dentro de el definimos su id con la (prop)
      heroes.push(heroe);                        // Metemos este heroe dentro del array vacio de heroes
    });

    return heroes;
  }

}
