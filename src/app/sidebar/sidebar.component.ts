import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public isLoggedIn: Promise<boolean> | undefined;

  constructor(private authSvc: AuthService, private _router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authSvc.isLoggedIn();
  }

  onLogout() {
    this.authSvc.logout().then(() => {
      this._router.navigateByUrl("/login");
    }).catch(err => console.error(err))
  }
}
