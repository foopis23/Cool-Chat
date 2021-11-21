import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { UserQueryService } from 'src/app/services/user-query.service';
import { User } from '../../types/User';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  public users: User[] | undefined;
  public loading: boolean = false;

  searchControl: FormControl = new FormControl('');

  constructor(private usrSvc: UserQueryService) { }

  ngOnInit(): void {
    this.usrSvc.searchUserByDisplayName(
      this.searchControl.valueChanges.pipe(distinctUntilChanged()))
      .pipe(tap(() => {
        this.loading = true;
        this.users = undefined;
      }))
      .subscribe((users) => {
        this.loading = false;
        this.users = users;
      });
  }
}
