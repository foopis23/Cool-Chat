import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { UserQueryService } from 'src/app/services/user-query.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  public users: {
    status: string;
    id: string;
    displayName: string;
    photoURL: string;
  }[] | undefined;
  public loading: boolean = false;

  searchControl: FormControl = new FormControl('');

  constructor(private usrSvc: UserQueryService) { }

  ngOnInit(): void {
    const searchValueChanged = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.loading = true;
        this.users = undefined;
      }));

    this.usrSvc.searchUserByDisplayName(searchValueChanged)
      .pipe(
        map(users => users.map(user => {
          return { ...user, status: this.usrSvc.statusToString(user.status) }
        })))
      .subscribe((users) => {
        this.loading = false;
        this.users = users;
      });
  }
}
