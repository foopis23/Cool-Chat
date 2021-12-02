import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public isLoggedIn: Promise<boolean> | undefined;
  
  @Input() selectedChatroom : string | undefined;
  @Output() changedChatroom = new EventEmitter<string>();

  constructor(private authSvc: AuthService, private _router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authSvc.isLoggedIn();
  }

  onLogout() {
    this.authSvc.logout().then(() => {
      this._router.navigateByUrl("/login");
    }).catch(err => console.error(err))
  }

  emitChangedChatroom(id: string | undefined) {
    this.changedChatroom.emit(id);
  }
}
