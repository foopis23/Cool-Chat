import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SignupComponent } from './signup/signup.component';

/**
 * Setting Routes
 */
import { AccountComponent } from './settings/account/account.component';
import { NotificationComponent } from './settings/notification/notification.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { SecurityComponent } from './settings/security/security.component';

const routes: Routes = [
  { path: "", component: MainComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent, canActivate: [UnauthGuard] },
  { path: "signup", component: SignupComponent, canActivate: [UnauthGuard] },
  { path: "account", component: AccountComponent },
  { path: "notification", component: NotificationComponent },
  { path: "profile", component: ProfileComponent },
  { path: "security", component: SecurityComponent },
  // { path: "**", redirectTo: "login" },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
