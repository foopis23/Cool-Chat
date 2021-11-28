import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserQueryService } from '../services/user-query.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public isLoggedIn: Promise<boolean> | undefined;
  public userName : string | undefined;

  constructor(private authSvc: AuthService, private usrSvc: UserQueryService, private _router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authSvc.isLoggedIn();
    let lastUserSub : Subscription | undefined;
    this.authSvc.authState$.subscribe((state) => {
      if (state?.uid) {
        if (lastUserSub !== undefined) {
          lastUserSub.unsubscribe()
        }
        
        lastUserSub = this.usrSvc.getUserById(state.uid).subscribe((user) => {
          this.userName = user.displayName;
        })
      }
    })
  }

  onLogout() {
    this.authSvc.logout().then(() => {
      this._router.navigateByUrl("/login");
    }).catch(err => console.error(err))
  }
}
