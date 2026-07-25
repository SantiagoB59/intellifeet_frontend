import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  showHeader = true; // por defecto sí se muestran
  title = 'intelli_feet';

  constructor(private authService: AuthService, private themeService: ThemeService) {}

  ngOnInit(): void {
     this.themeService.loadTheme();
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.showHeader = !loggedIn; // ✅ mostrar solo si NO está logueado
    });
  }
}
