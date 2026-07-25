import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs/operators';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoginFailed = false;
  isLoading = false;
  showPass = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private vehiculoService: VehiculoService
  ) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z0-9._-]+$') // 🔥 mejorado
        ]
      ],
      password: ['', Validators.required],
    });
  }

  // 👇 getters
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPass = !this.showPass;
  }

  onSubmit() {
    this.isLoginFailed = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          // 🔐 el token ya se guarda en el service
          if (res?.token) {
            this.router.navigate(['/dashboard']);
            // 👇 luego validas verificación km
            this.verificarKmPendientes();
          } else {
            this.isLoginFailed = true;
          }
        },
        error: () => {
          this.isLoginFailed = true;
        }
      });
  }

  verificarKmPendientes() {
  this.vehiculoService.getVehiculosVerificacionKm().subscribe({
    next: (res: any[]) => {

      if (res.length > 0) {
        // SOLO ALERTA o bandera global
        alert(`⚠ Hay ${res.length} vehículos pendientes de verificación de km`);
      }

    },
    error: (err: any) => {
      console.error(err);
    }
  });
}
}