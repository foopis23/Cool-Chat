import { Injectable } from '@angular/core';
import { docSnapshots, Firestore, onSnapshot } from '@angular/fire/firestore';
import { doc, deleteDoc, collection, updateDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string,
  displayName: string,
  photoURL: string
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
export class UserQueryService {
  usersCollection;

  constructor(private fs: Firestore) { 
    this.usersCollection = collection(fs, 'users');
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

  /*changeUsername(id: string, newName: string) {
    const docRef = doc(this.usersCollection, id);
    return updateDoc(docRef, {
      name: newName
    });
  }*/

  /*changeStatus(id: string, newStatus: Status) {
    const docRef = doc(this.usersCollection, id);
    return updateDoc(docRef, {
      status: newStatus
    });
  }*/

  /*deleteUser(id: string) {
    const userRef = doc(this.usersCollection, id);
    return deleteDoc(userRef);
  }*/

  /*changeProfilePicture(picture: File) {
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (!allowedFileTypes.includes(picture.type)) return;

    const storageRef = getStorage();
    const picRef = ref(storageRef, `profiles/${picture.name}`)

    uploadBytes(picRef, picture).then(_ => {
      return updateProfile(this.user!, {
        photoURL: picRef.fullPath
      });
    })
  }*/
}