import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required)
  })

  loginError: string | undefined = undefined

  constructor(private authSvc: AuthService, private _router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    this.authSvc.login(username, password).then(() => {
      this._router.navigateByUrl("/");
    }).catch(err => {
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/user-not-found":
          this.loginError = "Username or password is incorrect.";
          break;
        default:
          this.loginError = "An error occurred."
      }
    })
  }
}
