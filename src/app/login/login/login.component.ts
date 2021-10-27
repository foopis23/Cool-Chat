import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
    this.authSvc.authState$.subscribe((state) => {
      console.log(state);
    })
  }

  public async onClickLogin() {
    await this.authSvc.login("foopis23@gmail.com", "test123");
  }

  public async onClickLogout() {
    await this.authSvc.logout();
  }
}
