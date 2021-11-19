import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    displayName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  },
    // password and confirmPassword must match
    (group: AbstractControl) => {
      let pass = group.get('password')?.value;
      let confirmPass = group.get('confirmPassword')?.value
      return pass === confirmPass ? null : { notSame: true }
    }
  )

  displayErrors: boolean = false
  registerError: string | undefined;

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.displayErrors = true;
      return;
    }

    this.displayErrors = false
    const { email, password, displayName } = this.signupForm.value;
    this.authSvc.register(email, password, displayName).then(() => {
      this.router.navigateByUrl('/')
    }).catch(err => {
      switch (err.code) {
        case "auth/email-already-in-use":
          this.registerError = "Email is already in use.";
          break;
        default:
          this.registerError = "An error occurred."
      }
    })
  }
}
