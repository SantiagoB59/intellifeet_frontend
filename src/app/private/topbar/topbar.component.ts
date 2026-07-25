import { Component, OnInit } from '@angular/core';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { FlotaStats } from 'src/app/shared/models/vehiculo.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { Alerta } from 'src/app/shared/models/alertas.model';

interface Notificacion {

  id: number;

  mensaje: string;

  fecha: Date;

  leida: boolean;

  prioridad?: string;

  tipo?: string;

  vehiculo?: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  // =========================================
  // 🔔 NOTIFICACIONES
  // =========================================

  showNotifications: boolean = false;

  notificaciones: Notificacion[] = [];

  // =========================================
  // 📊 VEHÍCULOS
  // =========================================

  stats: FlotaStats = {

    total: 0,

    operativos: 0,

    en_taller: 0,

    inactivos: 0
  };

  // =========================================
  // 🚜 MAQUINARIA
  // =========================================

  statsMaquinaria = {

    total: 0,

    operativos: 0,

    en_taller: 0,

    inactivos: 0
  };

  // =========================================
  // 🚨 ALERTAS
  // =========================================

  estadisticasAlertas = {

    total: 0,

    activas: 0,

    resueltas: 0,

    criticas: 0
  };

  // =========================================
  // 👤 USUARIO
  // =========================================

  usuarioNombre: string = 'Usuario';

  constructor(

    private vehiculoService: VehiculoService,

    private maquinariaService: MaquinariaService,

    private alertasService: AlertasService,

    private router: Router,

    private authService: AuthService,

    public themeService: ThemeService

  ) { }

  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    this.cargarStats();

    this.cargarMaquinaria();

    this.cargarAlertas();

    this.cargarUsuario();
  }

  // =========================================
  // 👤 USUARIO
  // =========================================

  cargarUsuario(): void {

    const user = this.authService.getUser();

    this.usuarioNombre =
      user?.nombre || 'Usuario';
  }

  // =========================================
  // 🚛 STATS VEHÍCULOS
  // =========================================

  cargarStats(): void {

    this.vehiculoService.getStats().subscribe({

      next: (data) => {

        this.stats = data;
      },

      error: (err) => {

        console.error(
          'Error cargando stats vehículos',
          err
        );
      }
    });
  }

  // =========================================
  // 🚜 STATS MAQUINARIA
  // =========================================

  cargarMaquinaria(): void {

    this.maquinariaService.getStats().subscribe({

      next: (data) => {

        this.statsMaquinaria = data;
      },

      error: (err) => {

        console.error(
          'Error maquinaria',
          err
        );
      }
    });
  }

  // =========================================
  // 🚨 ALERTAS + NOTIFICACIONES
  // =========================================

  cargarAlertas(): void {

    // =========================
    // 📊 STATS ALERTAS
    // =========================

    this.alertasService
      .obtenerEstadisticas()
      .subscribe({

        next: (data) => {

          this.estadisticasAlertas = data;
        },

        error: (err) => {

          console.error(
            'Error estadísticas alertas',
            err
          );
        }
      });

    // =========================
    // 🔔 NOTIFICACIONES
    // =========================

    this.alertasService
      .obtenerActivas()
      .subscribe({

        next: (alertas: Alerta[]) => {

          this.notificaciones = alertas

            .sort((a, b) =>

              new Date(b.created_at).getTime()
              -
              new Date(a.created_at).getTime()
            )

            .slice(0, 10)

            .map((a) => ({

              id: a.id,

              mensaje: a.mensaje,

              fecha: new Date(a.created_at),

              leida: false,

              prioridad: a.prioridad,

              tipo: a.tipo,

              vehiculo:
                a.vehiculo?.placa || 'N/A'
            }));
        },

        error: (err) => {

          console.error(
            'Error cargando alertas',
            err
          );
        }
      });
  }

  // =========================================
  // 🔔 NO LEÍDAS
  // =========================================

  get notificacionesNoLeidas(): number {

    return this.notificaciones
      .filter(n => !n.leida)
      .length;
  }

  // =========================================
  // 🚜 TOTAL MAQUINARIA
  // =========================================

  get maquinariaTotal(): number {

    return this.statsMaquinaria.total || 0;
  }

  // =========================================
  // 🔔 TOGGLE
  // =========================================

  toggleNotifications(): void {

    this.showNotifications =
      !this.showNotifications;
  }

  // =========================================
  // ✅ MARCAR LEÍDA
  // =========================================

  marcarComoLeida(
    n: Notificacion
  ): void {

    n.leida = true;
  }

  // =========================================
  // ✅ MARCAR TODAS
  // =========================================

  marcarTodas(): void {

    this.notificaciones.forEach(n => {

      n.leida = true;
    });
  }

  // =========================================
  // 🎨 CLASE PRIORIDAD
  // =========================================

  getClasePrioridad(
    prioridad?: string
  ): string {

    switch (prioridad) {

      case 'CRITICA':
        return 'bg-red-100 text-red-700';

      case 'ALTA':
        return 'bg-orange-100 text-orange-700';

      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-700';

      case 'BAJA':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  // =========================================
  // 🚪 LOGOUT
  // =========================================

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);
  }

  
}