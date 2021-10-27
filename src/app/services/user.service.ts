import { Injectable } from '@angular/core';
import { doc, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, updateDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string,
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
    return addDoc(this.usersCollection, { name: name, status: Status.OFFLINE });
  }

  getUserById(id: string): Observable<User> {
    const docRef = doc(this.usersCollection, id);
    return docSnapshots(docRef).pipe(
      map(data => {
        const user = data.data();
        user!.id = data.id;
        return user as User;
      })
    );
  }

  async changeUsername(id: string, newName: string) {
    const docRef = doc(this.usersCollection, id);
    await updateDoc(docRef, {
      name: newName
    });
  }

  async changeStatus(id: string, newStatus: Status) {
    const docRef = doc(this.usersCollection, id);
    await updateDoc(docRef, {
      status: newStatus
    });
  }
}