import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public user : User | null;

  constructor(private authSvc : AuthService, private _router: Router) { 
    this.user = null;
  }

  ngOnInit(): void {
    this.authSvc.authState$.subscribe((state) => {
      this.user = state;
    })
  }

  onLogout() {
    console.log("logging out")
    this.authSvc.logout().then(() => {
      this._router.navigateByUrl("/login");
    }).catch(err => console.error(err))
  }
}
