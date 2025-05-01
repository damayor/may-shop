import { AuthService } from './../../services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {


  fb = inject(FormBuilder);
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6) ]],
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

    const {email = '', password = ''} = this.loginForm.value

    console.log({email, password})

    this.authService.login(email!, password!).subscribe((isAuthenticated) =>{

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


  //checkAuth

  //logout

  //Postman

}
