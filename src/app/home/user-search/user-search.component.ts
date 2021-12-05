import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { defaultIfEmpty, distinctUntilChanged, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
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
  users: User[] | undefined;
  loading: boolean = false;
  currentUser: User | undefined = undefined;
  searchControl: FormControl = new FormControl('');

  private userSearchSubscription: Subscription | undefined;
  private currentUserSubscription: Subscription | undefined;

  constructor(private usrSvc: UserQueryService, private authSvc: AuthService) {
    this.selected = {};
    this.change = new EventEmitter();
  }

  ngOnInit(): void {
    const searchValueChanged = this.searchControl.valueChanges.pipe(
      defaultIfEmpty(''),
      tap(() => {
        this.loading = true;
        this.users = undefined;
      }));

    this.userSearchSubscription = this.usrSvc.searchUserByDisplayName(searchValueChanged)
      .subscribe((users) => {
        this.loading = false;
        this.users = users;
      });

    this.currentUserSubscription = this.authSvc.currentUser$.subscribe((user) => {
      if (this.currentUser != undefined)
        delete this.selected[this.currentUser.id];

      this.currentUser = user ?? undefined;

      if (this.currentUser)
        this.selected[this.currentUser.id] = this.currentUser;
    })

  }

  ngOnDestroy(): void {
    if (this.userSearchSubscription)
      this.userSearchSubscription.unsubscribe();

    if (this.currentUserSubscription)
      this.currentUserSubscription.unsubscribe();
  }

  toggleUser(user: User) {
    if (user.id == this.currentUser?.id) {
      return
    }

    if (this.selected[user.id]) {
      delete this.selected[user.id];
    } else {
      this.selected[user.id] = user;
    }
    this.change.emit(Object.values(this.selected))
  }

  onEnter() {
    if (this.users && this.users[0] != undefined) {
      this.toggleUser(this.users[0]);
      setTimeout(() => this.searchControl.setValue(''), 150);
    }
  }

  public reset() {
    this.selected = {};
    this.searchControl.setValue('');
  }
}
