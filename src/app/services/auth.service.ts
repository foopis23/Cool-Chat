import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, UserCredential, createUserWithEmailAndPassword, updateProfile, deleteUser } from '@angular/fire/auth';
import { doc, Firestore } from '@angular/fire/firestore';
import { collection, setDoc } from '@firebase/firestore';
import { fstatSync } from 'fs';
import { authState } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usersCollection = collection(this.fs, 'users');
  constructor(private auth: Auth, private fs: Firestore) {}

  public async login(email: string, password: string): Promise<UserCredential> {
    let credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential;
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

  public deleteAccount(): Promise<void> | void {
    // TODO: delete user settings /w user service

    let user = this.auth.currentUser;

    if (user == null) {
      return;
    }

    return deleteUser(user)
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
}
