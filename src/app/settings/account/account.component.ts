import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/types/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserQueryService } from 'src/app/services/user-query.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user: User | undefined;
  private userSubscription: Subscription | undefined;

  constructor(private userQueryService: UserQueryService, private authService: AuthService, private _router: Router) {
    this.userSubscription = userQueryService.getUserById(authService.getUser()!.uid).subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }

  deleteAccount() {
    this.authService.deleteAccount();
  }

  openDeleteAccountModal() {
    const element = document.querySelector('#delete-account-modal');
    element?.classList.add('is-active');
    console.log(element);
  }

  closeDeleteAccountModal() {
    const element = document.querySelector('#delete-account-modal');
    element?.classList.remove('is-active');
  }
}
