import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VehiculoService } from './vehiculo.service';

@Injectable({ providedIn: 'root' })
export class VerificacionKmAlertService {

  private _count = new BehaviorSubject<number>(0);
  count$ = this._count.asObservable();

  constructor(private vehiculoService: VehiculoService) {}

  iniciarMonitoreo() {

    // 🔥 consulta inicial
    this.check();

    // 🔁 cada 5 minutos
    interval(300000)
      .pipe(
        switchMap(() => this.vehiculoService.getVerificacionKmCount())
      )
      .subscribe(res => {
        this._count.next(res.total);
      });
  }

  check() {
    this.vehiculoService.getVerificacionKmCount()
      .subscribe(res => {
        this._count.next(res.total);
      });
  }
}