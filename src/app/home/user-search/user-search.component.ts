import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { UserQueryService } from 'src/app/services/user-query.service';

interface UserMappedStatus {
  status: string;
  id: string;
  displayName: string;
  photoURL: string;
}

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  @Output() change: EventEmitter<UserMappedStatus[]>;

  selected: { [key: string]: UserMappedStatus };
  public users: UserMappedStatus[] | undefined;
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
      .pipe(
        map(users => users.map(user => {
          return { ...user, status: this.usrSvc.statusToString(user.status) }
        })))
      .subscribe((users) => {
        this.loading = false;
        this.users = users;
      });
  }

  toggleUser(user: UserMappedStatus) {
    if (this.selected[user.id]) {
      delete this.selected[user.id];
    } else {
      this.selected[user.id] = user;
    }
    this.change.emit(Object.values(this.selected))
  }
}
