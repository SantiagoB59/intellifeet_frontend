import { Component, OnInit } from '@angular/core';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-verificacion-km',
  templateUrl: './verificacion-km.component.html',
  styleUrls: ['./verificacion-km.component.scss']
})
export class VerificacionKmComponent implements OnInit {

  vehiculos: any[] = [];
  loading = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | 'warning' = 'success';


  constructor(
    private vehiculoService: VehiculoService, private location: Location
  ) { }

  ngOnInit(): void {
    this.cargarVehiculos();
  }



  mostrarMensaje(
    texto: string,
    tipo: 'success' | 'error' | 'warning'
  ) {

    this.mensaje = texto;
    this.tipoMensaje = tipo;

    setTimeout(() => {
      this.mensaje = '';
    }, 4000);

  }

  cargarVehiculos() {

    this.loading = true;

    this.vehiculoService.getVehiculosVerificacionKm()
      .subscribe({
        next: (resp) => {
          this.vehiculos = resp.map(v => ({
            ...v,
            nuevoKm: v.km_actual
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });

  }


  guardar(v: any) {

    if (!v.nuevoKm) {

      this.mostrarMensaje(
        'Debe ingresar el kilometraje del vehículo.',
        'warning'
      );

      return;
    }

    this.vehiculoService
      .actualizarKm(v.placa, Number(v.nuevoKm))
      .subscribe({

        next: () => {

          this.mostrarMensaje(
            'Kilometraje actualizado correctamente.',
            'success'
          );

          this.cargarVehiculos();

        },

        error: () => {

          this.mostrarMensaje(
            'No fue posible actualizar el kilometraje.',
            'error'
          );

        }

      });

  }

  volver(): void {
    this.location.back();
  }

}