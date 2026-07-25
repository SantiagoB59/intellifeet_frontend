import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-verificacion-km-modal',
  templateUrl: './verificacion-km-modal.component.html',
  styleUrls: ['./verificacion-km-modal.component.scss']
})

export class VerificacionKmModalComponent implements OnInit {

  @Input() total: number = 0;
  @Output() cerrar = new EventEmitter<void>();
  vehiculos: any[] = [];

  constructor(private vehiculoService: VehiculoService,
    private router: Router) { }

  ngOnInit(): void {

    this.vehiculoService.getVerificacionKmCount()
      .subscribe(resp => {
        this.total = resp.total;
      });

    this.vehiculoService.getVehiculosVerificacionKm()
      .subscribe(resp => {
        this.vehiculos = resp;
      });

  }

  cerrarModal() {
    this.cerrar.emit();
  }

  irAVerificaciones() {
    this.cerrarModal();
    this.router.navigate(['/dashboard/verificacion-km']);
  }

}
