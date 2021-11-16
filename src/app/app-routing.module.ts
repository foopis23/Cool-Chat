import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthGuard } from './guards/unauth.guard';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "login", component: LoginComponent},
  { path: "signup", component: SignupComponent},
  { path: "**", redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
