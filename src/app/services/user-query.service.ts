import { Injectable } from '@angular/core';
import { collectionSnapshots, docSnapshots, Firestore, onSnapshot } from '@angular/fire/firestore';
import { doc, collection } from '@firebase/firestore';
import { user } from 'rxfire/auth';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root'
})
export class UserQueryService {
  private usersCollection;

  constructor(private fs: Firestore) {
    this.usersCollection = collection(fs, 'users');
  }

  public getUserById(id: string): Observable<User> {
    const docRef = doc(this.usersCollection, id);
    return docSnapshots(docRef).pipe(
      map(data => {
        const user = data.data();
        user!.id = data.id;
        return user as User;
      })
    );
  }

  public searchUserByDisplayName(queryString$: Observable<string>): Observable<User[]> {
    return combineLatest([queryString$, collectionSnapshots(this.usersCollection)])
      .pipe(
        map(([query, snapshots]): [string, User[]] => {
          return [
            query,
            snapshots.map(snapshot => snapshot.data() as User)
          ]
        }),
        map(([query, users]) => {
          return users.filter((user) => user.displayName.toLowerCase().includes(
            query.toLowerCase()
          ))
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