import { Injectable } from '@angular/core';
import { doc, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  name: string,
  status: Status
}

export enum Status {
  OFFLINE,
  BUSY,
  DO_NOT_DISTURB,
  ONLINE
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersCollection;

  constructor(private fs: Firestore) { 
    this.usersCollection = collection(fs, 'users');
  }

  createUser(name: string) {
    return addDoc(this.usersCollection, {
      name
    });
  }

  getUserById(id: string): Observable<User> {
    const docRef = doc(this.usersCollection, id);
    return docSnapshots(docRef).pipe(
      map(user => {
        return user.data() as User;
      })
    );
  }
}

