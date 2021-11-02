import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, UserCredential, createUserWithEmailAndPassword, updateProfile, deleteUser } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  public async login(email: string, password: string): Promise<UserCredential> {
    let credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential;
  }

  public logout(): Promise<void> {
    return signOut(this.auth)
  }

  public async register(email: string, password: string, displayName: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    await Promise.all([
      updateProfile(credential.user, { displayName: displayName }),
      //TODO: create user settings data w/ user service
    ])

    return credential;
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
