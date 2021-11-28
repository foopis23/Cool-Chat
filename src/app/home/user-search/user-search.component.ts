import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { UserQueryService } from 'src/app/services/user-query.service';
import { User } from 'src/app/types/User';
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  @Output() change: EventEmitter<User[]>;

  selected: { [key: string]: User };
  public users: User[] | undefined;
  public loading: boolean = false;

  searchControl: FormControl = new FormControl('');

  constructor(private usrSvc: UserQueryService) {
    this.selected = {};
    this.change = new EventEmitter();
  }

  ngOnInit(): void {
    const searchValueChanged = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.loading = true;
        this.users = undefined;
      }));

    this.usrSvc.searchUserByDisplayName(searchValueChanged)
      .subscribe((users) => {
        this.loading = false;
        this.users = users;
      });
  }

  toggleUser(user: User) {
    if (this.selected[user.id]) {
      delete this.selected[user.id];
    } else {
      this.selected[user.id] = user;
    }
    this.change.emit(Object.values(this.selected))
  }
}
