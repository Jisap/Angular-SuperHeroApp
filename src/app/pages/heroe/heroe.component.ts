import { Component, OnInit } from '@angular/core';
import { HeroeModel } from '../../models/heroe.model';
import { NgForm } from '@angular/forms';
import { HeroesService } from '../../service/heroes.service';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  heroe = new HeroeModel();                                   // Instancia del modelo heroe --> NgModel (html)

  constructor(private HeroesService: HeroesService,           // Injectamos el servicio HeroesService para guardar datos en la bd
              private route: ActivatedRoute) { }              // Injectamos el servicio ActivatedRoute para leer la id de la url

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');        // Detectamos el id de la url cuando se carga la página
    
    if( id !== 'nuevo'){                                      // Si el id es distinto de 'nuevo significa que queremos actualizar/ ver un registro
      this.HeroesService.getHeroe(id)                         // Usamos getHeroe(id) para mostrar ese registro
        .subscribe((resp: HeroeModel) =>{                     // La resp la igualamos a la instancia de heroe 
          this.heroe = resp;                                  // Definimos en esta instancia la id como la recibida por argumentos
          this.heroe.id = id;
        })
    }
  }

  guardar(form:NgForm){                                       // Definimos el método que se aplicará en el submit al enviar el formulario

    if(form.invalid){
      console.log('Formulario no válido');
      return;
    }
    
    swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    
    swal.showLoading();
      
    let peticion:Observable<any>;  //Creamos una variable Observable -> Estará pendiente de que hace el usuario: o actualiza o crea Heroe

    if(this.heroe.id){
      peticion = this.HeroesService.actualizarHeroe(this.heroe)           // Si el id ya existe usaremos el método actualizar en la bd el formulario (heroe)     
    }else{
      peticion = this.HeroesService.crearHeroe(this.heroe)                // Si el id no existe usamos el método crearHeroes para guardar en la bd el formulario (heroe)
    }

    peticion.subscribe(resp => {  // Despues de hacer la actualización o la creación del heroe cancelamos el cartel swal

      swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizo correctamente',
        icon: 'success'
      });

    })


  }

}
