import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, UserCredential, createUserWithEmailAndPassword, deleteUser } from '@angular/fire/auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { collection, deleteDoc, serverTimestamp, setDoc, Timestamp } from '@firebase/firestore';
import { authState } from 'rxfire/auth';
import { Observable, of } from 'rxjs';
import { map, first, switchMap } from 'rxjs/operators';
import { Status } from '../types/User';
import { User as DataUser } from '../types/User';
import { UserQueryService } from './user-query.service';

const notNull = <T>(value: T | null): value is T => value !== null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection = collection(this.fs, 'users');
  private user: User | null = null;


  public currentUser$: Observable<DataUser | null>;
  public authState$: Observable<User | null>;

  constructor(private auth: Auth, private fs: Firestore, private usrSvc: UserQueryService) {
    onAuthStateChanged(auth, user => {
      this.user = user;
    })

    this.authState$ = authState(this.auth);
    this.currentUser$ = this.authState$
      .pipe(
        switchMap((authState) => {
          if (authState == null) return of(null);
          return this.usrSvc.getUserById(authState.uid)
        })
      );
  }

  public login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public logout(): Promise<void> {
    return signOut(this.auth)
  }

  public async register(email: string, password: string, displayName: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = cred.user;
    await setDoc(doc(this.usersCollection, user.uid), {
      displayName: displayName,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/cool-chat-37b63.appspot.com/o/default_profile_image.png?alt=media&token=bb0e869b-a3f9-494a-8857-025b9b8cd619',
      status: Status.ONLINE, // TODO: Include Status here <------------
      lastViewed: {}
    });
    return cred;
    /*const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    await Promise.all([
      updateProfile(credential.user, { displayName: displayName }),
      //TODO: create user settings data w/ user service
    ])

    return credential;*/
  }

  public async deleteAccount() {
    const user = this.auth.currentUser;
    if (user) {
      const userRef = doc(this.usersCollection, user.uid);
      await deleteDoc(userRef);
      await deleteUser(user);
      return;
      //return Promise.all([deleteDoc(userRef), deleteUser(user)]);
    }
    return Promise.resolve();
    //return deleteUser(user)
  }

  public async isLoggedIn(): Promise<boolean> {
    return authState(this.auth).pipe(
      first(),
      map((user) => {
        return !!user
      })).toPromise();
  }

  public changeData(newData: { [x: string]: any }): Promise<void> {
    const userRef = doc(this.usersCollection, this.user!.uid);
    return updateDoc(userRef, newData);
  }

  public getUser() {
    return this.user;
  }

  public updateChatroomLastViewedDate(chatroomId: string) {
    const userRef = doc(this.usersCollection, this.user!.uid);
    
    let data: any = {};
    data[`lastViewed.${chatroomId}`] = serverTimestamp();

    return updateDoc(userRef, data)
  }
}
