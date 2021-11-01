import { Injectable } from '@angular/core';
import { authInstanceFactory } from '@angular/fire/auth/auth.module';
import { docSnapshots, Firestore } from '@angular/fire/firestore';
import { deleteUser, getAuth, updatePassword, updateProfile } from '@firebase/auth';
import { doc, deleteDoc, addDoc, collection, updateDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
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
  auth = getAuth();
  user = this.auth.currentUser;

  constructor(private fs: Firestore) { 
    this.usersCollection = collection(fs, 'users');
  }

  /*getUserById(id: string): Observable<User> {
    const docRef = doc(this.usersCollection, id);
    return docSnapshots(docRef).pipe(
      map(data => {
        const user = data.data();
        user!.id = data.id;
        return user as User;
      })
    );
  }*/

  getUsername() {
    return this.user?.displayName;
  }

  changeUsername(newName: string) {
    return updateProfile(this.user!, {
      displayName: newName
    });
  }

  changeStatus(newStatus: Status) {
    const userRef = doc(this.usersCollection, this.user!.uid);
    return updateDoc(userRef, {
      status: newStatus
    });
  }

  changePassword(newPassword: string) {
    return updatePassword(this.user!, newPassword);
  }

  deleteUser() {
    return deleteUser(this.user!);
  }

  /*changeUsername(newName: string) {
    const docRef = doc(this.usersCollection, id);
    return updateDoc(docRef, {
      name: newName
    });
  }

  changeStatus(id: string, newStatus: Status) {
    const docRef = doc(this.usersCollection, id);
    return updateDoc(docRef, {
      status: newStatus
    });
  }

  deleteUser(id: string) {
    const userRef = doc(this.usersCollection, id);
    return deleteDoc(userRef);
  }*/

  getProfilePicture() {
    return this.user?.photoURL;
  }

  changeProfilePicture(picture: File) {
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (!allowedFileTypes.includes(picture.type)) return;

    const storageRef = getStorage();
    const picRef = ref(storageRef, `profiles/${picture.name}`)

    uploadBytes(picRef, picture).then(_ => {
      return updateProfile(this.user!, {
        photoURL: picRef.fullPath
      });
    })
  }

  test() {
    this.usersCollection = collection(this.fs, 'dummy-users');
  }
}