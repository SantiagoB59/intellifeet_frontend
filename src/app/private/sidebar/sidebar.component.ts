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

  // 🔥 controla qué menú está abierto
  openMenu: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveByUrl(event.urlAfterRedirects);
      }
    });

    this.setActiveByUrl(this.router.url);
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

    this.activeSection = item.key; // hijo activo
    this.router.navigate([item.route]);
  }

  // =========================
  // ACTIVO POR URL
  // =========================

  setActiveByUrl(url: string) {

  const flat = this.menu.flatMap(m => m.children ? m.children : m);

  const validItems = flat.filter(item => item.route);

  const sorted = [...validItems].sort((a, b) =>
    b.route!.length - a.route!.length
  );

  const match = sorted.find(item => url.startsWith(item.route!));

  this.activeSection = match ? match.key : 'dashboard';

  // SOLO desktop abre automáticamente
  if (window.innerWidth > 768) {

    this.menu.forEach(m => {

      if (m.children?.some(c => c.key === this.activeSection)) {
        this.openMenu = m.key;
      }

    });

  } else {

    // MOBILE → cerrar siempre
    this.openMenu = null;

  }
}

  // =========================
  // MENÚ
  // =========================
  menu = [
    {
      key: 'dashboard',
      label: 'Mapa en Vivo',
      icon: 'fas fa-map-marked-alt',
      route: '/dashboard'
    },
    {
      key: 'operaciones',
      label: 'Operaciones',
      icon: 'fas fa-cogs',
      children: [
        {
          key: 'alertas',
          label: 'Alertas',
          icon: 'fas fa-exclamation-triangle',
          route: '/dashboard/alertas'
        },
        {
          key: 'viajes',
          label: 'Viajes Activos',
          icon: 'fas fa-route',
          route: '/dashboard/viajes'
        }
      ]
    },
    {
      key: 'gestion',
      label: 'Gestión',
      icon: 'fas fa-tools',
      children: [
        {
          key: 'plan',
          label: 'Gestión de Mantenimientos',
          icon: 'fas fa-calendar-check',
          route: '/dashboard/flota'
        },
        {
          key: 'mantenimientos',
          label: 'Mantenimientos realizados',
          icon: 'fas fa-tools',
          route: '/dashboard/mantenimientos'
        },
        {
          key: 'mantenimiento-maquinaria',
          label: 'Mantenimientos de Maquinaria',
          icon: 'fas fa-tools',
          route: '/dashboard/mantenimiento-maquinaria'
        }
      ]
    },
    {
      key: 'creacion',
      label: 'Creación',
      icon: 'fas fa-plus-circle',
      children: [
        {
          key: 'vehiculos',
          label: 'Crear Vehículos',
          icon: 'fas fa-bus',
          route: '/dashboard/vehiculos'
        },
        {
          key: 'maquinaria',
          label: 'Crear Maquinaria',
          icon: 'fas fa-cogs',
          route: '/dashboard/maquinaria'
        },
        {
          key: 'plan-items',
          label: 'Crear Mantenimientos',
          icon: 'fas fa-list',
          route: '/dashboard/plan-items'
        }
      ]
    },
    {
      key: 'reportes',
      label: 'Reportes',
      icon: 'fas fa-file-excel',
      route: '/dashboard/reportes'
    }
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
        return `${base} bg-red-50 text-red-700 ring-red-200`;
      case 'alertas':
        return `${base} bg-orange-50 text-orange-700 ring-orange-200`;
      case 'viajes':
        return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
      case 'mantenimientos':
        return `${base} bg-green-50 text-green-700 ring-green-200`;
      case 'vehiculos':
        return `${base} bg-green-50 text-green-700 ring-green-200`;
      case 'reportes':
        return `${base} bg-purple-50 text-purple-700 ring-purple-200`;
      case 'plan':
        return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
      case 'maquinaria':
        return `${base} bg-cyan-50 text-cyan-700 ring-cyan-200`;
      case 'plan-items':
        return `${base} bg-yellow-50 text-yellow-700 ring-yellow-200`;
      case 'mantenimiento-maquinaria':
        return `${base} bg-cyan-50 text-cyan-700 ring-cyan-200`;
      
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


