import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, JsonPipe],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {


  fb = inject(FormBuilder);
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6) ]],
    fullName: ['', [Validators.required, Validators.minLength(6), ]],
  })

  authService = inject(AuthService)



  onSubmit() {
    if(this.loginForm.invalid) {
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const {email = '', password = '', fullName = ''} = this.loginForm.value
    console.log({email, password, fullName})

    this.authService.register(email!, password!, fullName!).subscribe((isAuthenticated) =>{
      console.log('logro register? en el register')
      if(isAuthenticated)
      {
        this.router.navigateByUrl('/');
      }

      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);

    })
  }




}
