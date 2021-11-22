import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: "", component: MainComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent, canActivate: [UnauthGuard] },
  { path: "signup", component: SignupComponent, canActivate: [UnauthGuard] },
  { path: "**", redirectTo: "login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
