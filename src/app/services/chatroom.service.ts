import { Injectable } from '@angular/core';
import { collectionSnapshots, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayRemove, collection, CollectionReference, doc, DocumentData, DocumentReference, updateDoc } from '@firebase/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../types/User';
import { AuthService } from './auth.service';

export interface Chatroom {
  id: string,
  displayName: string,
  participants: User[]
}

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  public userChatroomList$: Observable<Chatroom[]>;
  private roomsCollection: CollectionReference;

  constructor(private firestore: Firestore, private authSvc: AuthService) {
    this.roomsCollection = collection(this.firestore, 'rooms');
    this.userChatroomList$ = combineLatest([this.authSvc.authState$, collectionSnapshots(this.roomsCollection)])
      .pipe(
        map(([authState, snapshots]) => {
          return snapshots.map((snapshot) => {
            return {
              ...snapshot.data(),
              id: snapshot.id,
            } as Chatroom;
          }).filter((chatroom) => {
            return chatroom.participants.find((user) => {
              user.id == authState?.uid;
            }) !== undefined;
          })
        }),
      )
  }

  public createChatroom(displayName: string, participants: User[]): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.roomsCollection, {
      displayName,
      participants
    });
  }

  public leaveChatroom(chatroomId: string): Promise<void> | undefined {
    if (this.authSvc.getUser() == null) return;

    const userCollection = collection(this.firestore, 'users');
    return updateDoc(doc(this.roomsCollection, chatroomId), {
      participants: arrayRemove(doc(userCollection, this.authSvc.getUser()?.uid))
    })
  }

  public getChatroom$(chatroomId: string): Observable<Chatroom> {
    return docSnapshots(doc(this.roomsCollection, chatroomId))
      .pipe(
        map((snapshot) => {
          return {
            ...snapshot.data(),
            id: snapshot.id
          } as Chatroom
        })
      );
  }
}
