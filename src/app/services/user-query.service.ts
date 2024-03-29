import { Injectable } from '@angular/core';
import { collectionSnapshots, docSnapshots, Firestore } from '@angular/fire/firestore';
import { doc, collection } from '@firebase/firestore';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Status, User } from '../types/User';

@Injectable({
  providedIn: 'root'
})
export class UserQueryService {
  private usersCollection;
  private userObservables: { [key: string]: ReplaySubject<User> };

  constructor(private fs: Firestore) {
    this.usersCollection = collection(fs, 'users');
    this.userObservables = {};
  }

  public getUserById(id: string): ReplaySubject<User> {
    if (this.userObservables[id] !== undefined) {
      return this.userObservables[id];
    }

    const docRef = doc(this.usersCollection, id);
    this.userObservables[id] = new ReplaySubject(1);
    docSnapshots(docRef).pipe(
      map(data => {
        const user = data.data();
        user!.id = data.id;
        return user as User;
      })
    ).subscribe((user) => {
      this.userObservables[id].next(user);
    })

    return this.userObservables[id];
  }

  public searchUserByDisplayName(queryString$: Observable<string>): Observable<User[]> {
    return combineLatest([queryString$, collectionSnapshots(this.usersCollection)])
      .pipe(
        map(([query, snapshots]): [string, User[]] => {
          return [
            query,
            snapshots.map(snapshot => {
              return { ...snapshot.data(), id: snapshot.id } as User
            })
          ]
        }),
        map(([query, users]) => {
          return users.filter((user) => user.displayName.toLowerCase().includes(
            query.toLowerCase()
          ))
        })
      );
  }

  public statusToString(status: Status) {
    switch (status) {
      case Status.OFFLINE:
        return "Offline";
      case Status.ONLINE:
        return "Online";
      case Status.DO_NOT_DISTURB:
        return "Do Not Disturb";
      case Status.BUSY:
        return "Busy";
    }
  }
}