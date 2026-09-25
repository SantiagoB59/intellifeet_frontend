import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  activeSection: string = '';
  isCollapsed: boolean = false;
menuVisible: any[] = [];
  // 🔥 controla qué menú está abierto
  openMenu: string | null = null;

  constructor(
  private authService: AuthService,
  private router: Router
) {

  this.cargarMenu();

  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.setActiveByUrl(event.urlAfterRedirects);
    }
  });

  this.setActiveByUrl(this.router.url);
}

  tieneRol(...roles: string[]): boolean {

    const usuario = this.authService.getUser();

    if (!usuario?.rol) {
      return false;
    }

    return roles.includes(usuario.rol.toLowerCase());

  }
  cargarMenu() {

  this.menuVisible = this.menu

    .filter(item => {

      if (!item.roles) {
        return true;
      }

      return this.tieneRol(...item.roles);

    })

    .map(item => {

      if (!item.children) {
        return item;
      }

      return {
        ...item,
        children: item.children.filter(child => {

          if (!child.roles) {
            return true;
          }

          return this.tieneRol(...child.roles);

        })
      };

    })

    .filter(item => {

      if (!item.children) {
        return true;
      }

      return item.children.length > 0;

    });

}
  // =========================
  // TOGGLE SIDEBAR
  // =========================
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;

    // 🔥 cerrar submenús al colapsar
    if (this.isCollapsed) {
      this.openMenu = null;
    }
  }

  // =========================
  // TOGGLE SUBMENÚ
  // =========================
  toggleMenu(key: string) {
    this.openMenu = this.openMenu === key ? null : key;

    // 🔥 IMPORTANTE: marcar visualmente el padre al hacer click
    this.activeSection = key;
  }

  // =========================
  // NAVEGACIÓN
  // =========================
  setSection(item: any) {
  if (!item?.route) return;

  this.activeSection = item.key;

  // Si es un hijo, activar también su padre
  this.menu.forEach(parent => {

    if (parent.children?.some(child => child.key === item.key)) {
      this.openMenu = parent.key;
    }

  });

  this.router.navigate([item.route]);
}

  // =========================
  // ACTIVO POR URL
  // =========================
setActiveByUrl(url: string) {

  const flat = this.menu.flatMap(m =>
    m.children ? m.children : [m]
  );

  const validItems = flat.filter(item => item.route);

  const sorted = [...validItems].sort((a, b) =>
    b.route!.length - a.route!.length
  );

  const match = sorted.find(item =>
    url.startsWith(item.route!)
  );


  // ✅ Solo cambia si encontró una ruta válida
  if (match) {

    this.activeSection = match.key;

    // Abrir padre automáticamente
    this.menu.forEach(m => {

      if (m.children?.some(c => c.key === this.activeSection)) {
        this.openMenu = m.key;
      }

    });

  }


  // Mobile
  if (window.innerWidth <= 768) {
    this.openMenu = null;
  }

}
  menu = [
    {
      key: 'dashboard',
      label: 'Mapa en Vivo',
      icon: 'fas fa-map-marked-alt',
      route: '/dashboard',
      roles: ['admin', 'supervisor']
    },
    {
          key: 'analitica',
          label: 'Analítica',
          icon: 'fas fa-chart-line',
          route: '/dashboard/analitica',
          roles: ['admin']
    },
    {
      key: 'operaciones',
      label: 'Operaciones',
      icon: 'fas fa-cogs',
      roles: ['admin', 'supervisor'],
      children: [
        {
          key: 'alertas',
          label: 'Alertas',
          icon: 'fas fa-exclamation-triangle',
          route: '/dashboard/alertas',
          roles: ['admin', 'supervisor']
        },
        {
          key: 'viajes',
          label: 'Viajes Activos',
          icon: 'fas fa-route',
          route: '/dashboard/viajes',
          roles: ['admin', 'supervisor']
        }
      ]
    },
    {
      key: 'gestion',
      label: 'Gestión',
      icon: 'fas fa-tools',
      roles: ['admin', 'supervisor', 'mecanico','operador'],
      children: [
        {
          key: 'plan',
          label: 'Gestión de Mantenimientos',
          icon: 'fas fa-calendar-check',
          route: '/dashboard/flota',
          roles: ['admin', 'supervisor']
        },
        {
          key: 'mantenimientos',
          label: 'Mantenimientos realizados vehiculos',
          icon: 'fas fa-solid fa-truck',
          route: '/dashboard/mantenimientos',
          roles: ['admin', 'supervisor', 'mecanico','operador']
        },
        {
          key: 'mantenimiento-maquinaria',
          label: 'Mantenimientos realizados maquinaria',
          icon: 'fas fa-tools',
          route: '/dashboard/mantenimiento-maquinaria',
          roles: ['admin', 'supervisor', 'mecanico','operador']
        }
      ]
    },
    {
      key: 'creacion',
      label: 'Creación',
      icon: 'fas fa-plus-circle',
      roles: ['admin'],
      children: [
        {
          key: 'vehiculos',
          label: 'Crear Vehículos',
          icon: 'fas fa-bus',
          route: '/dashboard/vehiculos',
          roles: ['admin']
        },
        {
          key: 'maquinaria',
          label: 'Crear Maquinaria',
          icon: 'fas fa-cogs',
          route: '/dashboard/maquinaria',
          roles: ['admin']
        },
        {
          key: 'plan-items',
          label: 'Crear Mantenimientos',
          icon: 'fas fa-list',
          route: '/dashboard/plan-items',
          roles: ['admin']
        }
      ]
    },
    {
      key: 'activo-operador',
      label: 'Preoperacional',
      icon: 'fas fa-user-cog',
      roles: ['admin'],
      children: [
        {
          key: 'panel_preoperacional',
          label: 'Panel Preoperacional',
          icon: 'fas fa-user-cog',
          route: '/dashboard/preoperacional-admin',
          roles: ['admin']
        },
        {
          key: 'operadores',
          label: 'Asignar operadores',
          icon: 'fas fa-user-cog',
          route: '/dashboard/activo-operador',
          roles: ['admin']
        },
        {
          key: 'usuarios',
          label: 'Crear Operador',
          icon: 'fas fa-users',
          route: '/dashboard/usuarios',
          roles: ['admin']
        },
        {
          key: 'reportes-preoperacionales',
          label: 'Reportes Preoperacionales',
          icon: 'fas fa-file-alt',
          route: '/dashboard/reportes-preoperacionales',
          roles: ['admin']
        }
        
        
        
      ]
    },
    {
      key: 'reportes',
      label: 'Reportes',
      icon: 'fas fa-file-excel',
      route: '/dashboard/reportes',
      roles: ['admin', 'supervisor']
    },
    {
      key: 'preoperacional',
      label: 'Preoperacional',
      icon: 'fas fa-clipboard-check',
      route: '/dashboard/preoperacional',
      roles: ['operador']
    },
    
  ];
  // =========================
  // ESTILOS ACTIVO
  // =========================
  getClass(section: string) {
    const isActive = this.activeSection === section;

    return isActive
      ? this.getActiveClass(section)
      : 'hover:bg-slate-50 text-slate-700 group-hover:text-slate-900';
  }

  isParentActive(parent: any): boolean {
    return (
      this.activeSection === parent.key ||
      parent.children?.some((c: any) => c.key === this.activeSection)
    );
  }

  getActiveClass(section: string) {

    const base = 'shadow-sm ring-2 ring-opacity-50';

    switch (section) {
      case 'dashboard':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'analitica':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'alertas':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'viajes':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'mantenimientos':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'vehiculos':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'reportes':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'plan':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'maquinaria':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'plan-items':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'mantenimiento-maquinaria':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'panel_preoperacional':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'operadores':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'usuarios':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'reportes-preoperacionales':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'preoperacional':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'activo-operador':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;

      default:
        return '';
    }
  }

  // =========================
  // LOGOUT
  // =========================
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


