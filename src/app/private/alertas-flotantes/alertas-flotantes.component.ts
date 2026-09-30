import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Router } from '@angular/router';
import { Subscription, interval, of } from 'rxjs';
import {
  catchError,
  startWith,
  switchMap
} from 'rxjs/operators';

import { AlertasService } from 'src/app/services/alertas.service';
import { AuthService } from 'src/app/services/auth.service';
import { Alerta } from 'src/app/shared/models/alertas.model';

interface AlertaFlotante extends Alerta {
  tiempoRestante?: number;
}

@Component({
  selector: 'app-alertas-flotantes',
  templateUrl: './alertas-flotantes.component.html',
  styleUrls: ['./alertas-flotantes.component.scss']
})
export class AlertasFlotantesComponent
  implements OnInit, OnDestroy {

  // =========================================================
  // ALERTAS VISIBLES
  // =========================================================

  alertasVisibles: AlertaFlotante[] = [];

  // =========================================================
  // ALERTAS YA CONOCIDAS
  // =========================================================

  private alertasConocidas = new Set<number>();

  // =========================================================
  // SUBSCRIPCIÓN
  // =========================================================

  private pollingSubscription?: Subscription;

  // =========================================================
  // TEMPORIZADORES
  // =========================================================

  private temporizadores = new Map<number, any>();

  // =========================================================
  // CONFIGURACIÓN
  // =========================================================

  private readonly INTERVALO = 15000;

  private readonly MAX_ALERTAS_VISIBLES = 3;

  private readonly TIEMPO_VISIBLE = 15000;

  private primeraCarga = true;

  // =========================================================
  // AUDIO
  // =========================================================

  private audioContext?: AudioContext;

  // =========================================================
  // ADMINISTRADOR
  // =========================================================

  esAdministrador = false;

  constructor(
    private alertasService: AlertasService,
    private authService: AuthService,
    private router: Router
  ) { }

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    console.log('🚨🚨🚨 ALERTAS FLOTANTES CARGADO 🚨🚨🚨');

    this.verificarUsuario();

    console.log(
      '👑 esAdministrador:',
      this.esAdministrador
    );

    if (!this.esAdministrador) {
      console.log(
        '🔕 NO ES ADMINISTRADOR - NO SE INICIA POLLING'
      );
      return;
    }

    console.log(
      '🔔 ES ADMINISTRADOR - INICIANDO POLLING'
    );

    this.iniciarMonitoreo();
  }

  // =========================================================
  // VERIFICAR USUARIO
  // =========================================================


  private verificarUsuario(): void {

    try {

      const usuario = this.authService.getUser();

      console.log(
        '👤 USUARIO COMPLETO:',
        usuario
      );

      if (!usuario) {

        this.esAdministrador = false;

        console.warn(
          '⚠️ No se encontró usuario autenticado.'
        );

        return;
      }

      console.log(
        '🔑 ID USUARIO:',
        usuario.id
      );

      console.log(
        '🔑 ROL:',
        usuario.rol
      );

      this.esAdministrador =
        String(usuario.rol).toLowerCase() === 'admin';

      console.log(
        '👑 ¿ES ADMINISTRADOR?:',
        this.esAdministrador
      );

    } catch (error) {

      console.error(
        '❌ Error verificando usuario:',
        error
      );

      this.esAdministrador = false;
    }
  }
  // =========================================================
  // MONITOREO
  // =========================================================

  private iniciarMonitoreo(): void {

    this.pollingSubscription = interval(
      this.INTERVALO
    )
      .pipe(

        /*
         * Primera consulta inmediatamente.
         */
        startWith(0),

        switchMap(() => {

          const filtros = {
            prioridad: '',
            tipo: '',
            busqueda: ''
          };

          return this.alertasService
            .listar(filtros)
            .pipe(

              catchError(error => {

                console.error(
                  '❌ Error consultando alertas flotantes:',
                  error
                );

                return of([]);
              })

            );

        })

      )
      .subscribe(alertas => {

        this.procesarAlertas(
          alertas || []
        );

      });
  }

  // =========================================================
  // PROCESAR ALERTAS
  // =========================================================

  private procesarAlertas(alertas: Alerta[]): void {

    const alertasActivas = alertas.filter(
      alerta => alerta.estado === 'ACTIVA'
    );

    console.log(
      '🔎 Alertas activas:',
      alertasActivas
    );

    /*
     * PRIMERA CARGA
     *
     * No mostramos ninguna alerta existente.
     * Solamente las registramos como conocidas.
     */
    if (this.primeraCarga) {

      this.primeraCarga = false;

      alertasActivas.forEach(alerta => {

        if (
          alerta.id !== undefined &&
          alerta.id !== null
        ) {

          this.alertasConocidas.add(alerta.id);
        }

      });

      console.log(
        '🟢 Primera carga completada.',
        'Alertas existentes registradas:',
        this.alertasConocidas
      );

      return;
    }

    /*
     * DESPUÉS DE LA PRIMERA CARGA
     *
     * Solamente mostramos alertas cuyo ID
     * nunca habíamos visto.
     */
    const alertasNuevas = alertasActivas.filter(alerta => {

      if (
        alerta.id === undefined ||
        alerta.id === null
      ) {
        return false;
      }

      return !this.alertasConocidas.has(alerta.id);

    });

    /*
     * Registramos todas las alertas activas actuales
     * como conocidas.
     */
    alertasActivas.forEach(alerta => {

      if (
        alerta.id !== undefined &&
        alerta.id !== null
      ) {

        this.alertasConocidas.add(alerta.id);
      }

    });

    /*
     * Mostramos únicamente las nuevas.
     */
    alertasNuevas.forEach(alerta => {

      console.log(
        '🆕 NUEVA ALERTA DETECTADA:',
        alerta
      );

      this.mostrarAlerta(alerta);

    });

    /*
     * Eliminamos de conocidas las alertas que
     * ya no están activas.
     *
     * Esto permite que una alerta que fue resuelta
     * y posteriormente vuelva a generarse con un
     * nuevo registro pueda aparecer nuevamente.
     */
    const idsActivos = new Set(
      alertasActivas
        .map(alerta => alerta.id)
        .filter(
          (id): id is number =>
            id !== undefined &&
            id !== null
        )
    );

    this.alertasConocidas.forEach(id => {

      if (!idsActivos.has(id)) {

        this.alertasConocidas.delete(id);
      }

    });
  }
  // =========================================================
  // MOSTRAR ALERTA
  // =========================================================

  private mostrarAlerta(
    alerta: Alerta
  ): void {

    if (
      alerta.id === undefined ||
      alerta.id === null
    ) {

      return;
    }

    /*
     * Evitar duplicados.
     */

    const yaVisible =
      this.alertasVisibles.some(
        item =>
          item.id === alerta.id
      );

    if (yaVisible) {
      return;
    }

    const alertaFlotante:
      AlertaFlotante = {

      ...alerta,

      tiempoRestante:
        this.TIEMPO_VISIBLE

    };

    /*
     * Máximo de alertas visibles.
     */

    if (
      this.alertasVisibles.length >=
      this.MAX_ALERTAS_VISIBLES
    ) {

      const primera =
        this.alertasVisibles[0];

      if (
        primera &&
        primera.id !== undefined
      ) {

        this.cerrarAlerta(
          primera.id
        );
      }
    }

    /*
     * Las críticas primero.
     */

    if (
      this.esCritica(alerta)
    ) {

      this.alertasVisibles.unshift(
        alertaFlotante
      );

    } else {

      this.alertasVisibles.push(
        alertaFlotante
      );

    }

    /*
     * Sonido.
     */

    this.reproducirSonido(
      alerta
    );

    /*
     * Temporizador de 15 segundos.
     */

    this.iniciarTemporizador(
      alertaFlotante
    );
  }

  // =========================================================
  // SONIDO
  // =========================================================

  private reproducirSonido(
    alerta: Alerta
  ): void {

    try {

      if (!this.audioContext) {

        const AudioContextClass =
          window.AudioContext ||
          (window as any).webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        this.audioContext =
          new AudioContextClass();
      }

      if (
        this.audioContext.state ===
        'suspended'
      ) {

        this.audioContext.resume();
      }

      /*
       * CRÍTICA
       */

      if (
        this.esCritica(alerta)
      ) {

        this.emitirTono(
          880,
          0.18
        );

        setTimeout(
          () => {

            this.emitirTono(
              660,
              0.18
            );

          },
          220
        );

        return;
      }

      /*
       * ALTA
       */

      if (
        alerta.prioridad === 'ALTA'
      ) {

        this.emitirTono(
          700,
          0.18
        );

        return;
      }

      /*
       * MEDIA / BAJA
       */

      this.emitirTono(
        520,
        0.12
      );

    } catch (error) {

      console.warn(
        '⚠️ No fue posible reproducir sonido:',
        error
      );
    }
  }

  // =========================================================
  // EMITIR TONO
  // =========================================================

  private emitirTono(
    frecuencia: number,
    duracion: number
  ): void {

    if (!this.audioContext) {
      return;
    }

    try {

      const oscillator =
        this.audioContext.createOscillator();

      const gain =
        this.audioContext.createGain();

      oscillator.type = 'sine';

      oscillator.frequency.value =
        frecuencia;

      gain.gain.setValueAtTime(
        0.0001,
        this.audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.18,
        this.audioContext.currentTime + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioContext.currentTime +
        duracion
      );

      oscillator.connect(gain);

      gain.connect(
        this.audioContext.destination
      );

      oscillator.start();

      oscillator.stop(
        this.audioContext.currentTime +
        duracion
      );

    } catch (error) {

      console.warn(
        '⚠️ Error reproduciendo tono:',
        error
      );
    }
  }

  // =========================================================
  // TEMPORIZADOR
  // =========================================================

  private iniciarTemporizador(
    alerta: AlertaFlotante
  ): void {

    if (
      alerta.id === undefined ||
      alerta.id === null
    ) {

      return;
    }

    const id = alerta.id;

    const temporizador =
      setTimeout(
        () => {

          this.cerrarAlerta(id);

        },
        this.TIEMPO_VISIBLE
      );

    this.temporizadores.set(
      id,
      temporizador
    );
  }

  // =========================================================
  // CERRAR ALERTA
  // =========================================================

  cerrarAlerta(
    id: number
  ): void {

    const temporizador =
      this.temporizadores.get(id);

    if (temporizador) {

      clearTimeout(
        temporizador
      );

      this.temporizadores.delete(
        id
      );
    }

    this.alertasVisibles =
      this.alertasVisibles.filter(
        alerta =>
          alerta.id !== id
      );
  }

  // =========================================================
  // ABRIR CENTRO DE ALERTAS
  // =========================================================

  abrirAlerta(alerta: AlertaFlotante): void {

    console.log(
      '🚨 Abriendo alerta:',
      alerta
    );

    if (
      alerta.id !== undefined &&
      alerta.id !== null
    ) {
      this.cerrarAlerta(alerta.id);
    }

    this.router.navigate([
      '/dashboard/alertas'
    ]);
  }
  // =========================================================
  // ICONO
  // =========================================================

  getIconoAlerta(
    alerta: Alerta
  ): string {

    switch (alerta.prioridad) {

      case 'CRITICA':
        return 'fas fa-radiation';

      case 'ALTA':
        return 'fas fa-exclamation-triangle';

      case 'MEDIA':
        return 'fas fa-exclamation-circle';

      case 'BAJA':
        return 'fas fa-info-circle';

      default:
        return 'fas fa-bell';
    }
  }

  // =========================================================
  // CLASE PRIORIDAD
  // =========================================================

  getClasePrioridad(
    alerta: Alerta
  ): string {

    switch (alerta.prioridad) {

      case 'CRITICA':
        return 'prioridad-critica';

      case 'ALTA':
        return 'prioridad-alta';

      case 'MEDIA':
        return 'prioridad-media';

      case 'BAJA':
        return 'prioridad-baja';

      default:
        return 'prioridad-default';
    }
  }

  // =========================================================
  // TEXTO PRIORIDAD
  // =========================================================

  getTextoPrioridad(
    alerta: Alerta
  ): string {

    switch (alerta.prioridad) {

      case 'CRITICA':
        return 'Crítica';

      case 'ALTA':
        return 'Alta';

      case 'MEDIA':
        return 'Media';

      case 'BAJA':
        return 'Baja';

      default:
        return alerta.prioridad ||
          'Alerta';
    }
  }

  // =========================================================
  // CRÍTICA
  // =========================================================

  esCritica(
    alerta: Alerta
  ): boolean {

    return alerta.prioridad ===
      'CRITICA';
  }

  // =========================================================
  // RECURSO
  // =========================================================

  getRecurso(
    alerta: Alerta
  ): string {

    if (alerta.vehiculo) {

      return alerta.vehiculo.placa ||
        'Vehículo';
    }

    if (alerta.maquinaria) {

      return alerta.maquinaria.codigo ||
        'Maquinaria';
    }

    if (alerta.usuario) {

      return alerta.usuario.nombre ||
        alerta.usuario.username ||
        'Operador';
    }

    return 'Recurso';
  }

  // =========================================================
  // DESCRIPCIÓN
  // =========================================================

  getDescripcion(
    alerta: Alerta
  ): string {

    const alertaAny =
      alerta as any;

    if (
      alertaAny.descripcion
    ) {

      return alertaAny.descripcion;
    }

    if (
      alertaAny.mensaje
    ) {

      return alertaAny.mensaje;
    }

    if (
      alertaAny.detalle
    ) {

      return alertaAny.detalle;
    }

    if (
      alerta.tipo === 'DOCUMENTO'
    ) {

      if (
        alerta.categoria
      ) {

        return `Documento ${alerta.categoria} requiere atención.`;
      }

      return 'Documento requiere atención.';
    }

    if (
      alerta.tipo === 'MANTENIMIENTO'
    ) {

      return 'El recurso requiere mantenimiento.';
    }

    return 'Se ha generado una nueva alerta.';
  }

  // =========================================================
  // TRACK BY
  // =========================================================

  trackByAlerta(
    index: number,
    alerta: AlertaFlotante
  ): number {

    return alerta.id ?? index;
  }

  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    if (
      this.pollingSubscription
    ) {

      this.pollingSubscription.unsubscribe();
    }

    this.temporizadores.forEach(
      temporizador =>
        clearTimeout(temporizador)
    );

    this.temporizadores.clear();

    if (this.audioContext) {

      this.audioContext
        .close()
        .catch(() => { });
    }
  }
}