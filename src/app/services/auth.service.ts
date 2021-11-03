import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, UserCredential, createUserWithEmailAndPassword, updateProfile, deleteUser } from '@angular/fire/auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { collection, deleteDoc, setDoc } from '@firebase/firestore';
import { fstatSync } from 'fs';
import { authState } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usersCollection = collection(this.fs, 'users');
  user: User | null = null;
  constructor(private auth: Auth, private fs: Firestore) {
    onAuthStateChanged(auth, user => {
      this.user = user;
    })
  }

  public login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public logout(): Promise<void> {
    return signOut(this.auth)
  }

  public async register(email: string, password: string, displayName: string) {
    createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
      const user = cred.user;
      return setDoc(doc(this.usersCollection, user.uid), {
        displayName: user.displayName,
        photoURL: '',
        status: 3, // TODO: Include Status here <------------
      });
    });

    /*const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    await Promise.all([
      updateProfile(credential.user, { displayName: displayName }),
      //TODO: create user settings data w/ user service
    ])

    return credential;*/
  }

  public deleteAccount() {
    let user = this.auth.currentUser;
    if (user) {
      const userRef = doc(this.usersCollection, user.uid);
      return Promise.all([deleteUser(user), deleteDoc(userRef)]);
    }
    return;
    //return deleteUser(user)
  }

  public async isLoggedIn(): Promise<boolean> {
    return authState(this.auth).pipe(
      first(),
      map((user) => {
        return !!user
      })).toPromise();
  }

  public get authState$(): Observable<User | null> {
    return authState(this.auth);
  }

  changeData(newData: { [x: string]: any }) {
    const userRef = doc(this.usersCollection, this.user!.uid);
    return updateDoc(userRef, newData);
  }

  public getUser() {
    return this.user;
  }
}
