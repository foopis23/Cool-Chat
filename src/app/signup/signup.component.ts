import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {

  }

  onSubmit() {
    console.log(this.signupForm.errors);
    if (this.signupForm.invalid) {
      this.displayErrors = true;
      return;
    }

    this.displayErrors = false
    const { username, password, displayName } = this.signupForm.value;
    console.log(username, password, displayName);
  }
}
