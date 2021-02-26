import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../service/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = []                              // Creamos un array vacio heroes []

  cargando = false;

  constructor(private HeroesService: HeroesService) { }

  ngOnInit(): void {

    this.cargando=true;
    this.HeroesService.getHeroes()                        // Lo rellenamos con la información de la bd
      .subscribe(resp => {
        this.heroes = resp;
        this.cargando = false;
      })
  }

  borrarHeroe(heroe: HeroeModel, i:number){

    Swal.fire({
      title: '¿ Está seguro ?',
      text: `Está seguro que desea borrar a ${heroe.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if(resp.value){ // Si exite respuesta -> true

        this.heroes.splice(i,1);                                  // Borramos de heroes la posición i, 1 elementoen el array heroes
        this.HeroesService.borrarHeroe(heroe.id).subscribe();     // Borramos de la base de datos el heroe segun id
      }
                                                                  // Sino hay respuesta -> false no hacemos nada
    })

  }
}
