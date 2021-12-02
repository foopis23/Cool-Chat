import { Injectable } from '@angular/core';
import { collectionSnapshots, deleteDoc, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayRemove, collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, QueryDocumentSnapshot, updateDoc } from '@firebase/firestore';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../types/User';
import { AuthService } from './auth.service';
import { User as AuthUser } from '@angular/fire/auth';
import { UserQueryService } from './user-query.service';

interface RawChatroom {
  id: string,
  displayName: string,
  participants: DocumentReference[]
}
export interface Chatroom {
  id: string,
  displayName: string,
  participants: Observable<User>[]
}

const snapshotToRawChatroom = (snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): RawChatroom => {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as RawChatroom;
}

const createRawChatroomFilterByUser = (authState: AuthUser | null) => {
  return (chatroom: RawChatroom) => {
    return chatroom.participants.find((userRef) => {
      return userRef.id == authState?.uid;
    }) !== undefined;
  }
}

const createRawChatroomToChatroom = (usrSvc : UserQueryService) => {
  return (rawChatroomData: RawChatroom) => {
    const users = rawChatroomData.participants
      .map((userRef) => usrSvc.getUserById(userRef.id));
    return {
      ...rawChatroomData,
      participants: users
    } as Chatroom
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  public userChatroomList$: Observable<Chatroom[]>;
  private currentChatroom: string = "";
  private roomsCollection: CollectionReference;

  constructor(private firestore: Firestore, private authSvc: AuthService, private usrSvc: UserQueryService) {
    this.roomsCollection = collection(this.firestore, 'rooms');
    this.userChatroomList$ = combineLatest([this.authSvc.authState$, collectionSnapshots(this.roomsCollection)])
      .pipe(
        map(([authState, snapshots]) => {
          return snapshots
            .map(snapshotToRawChatroom)
            .filter(createRawChatroomFilterByUser(authState))
            .map(createRawChatroomToChatroom(this.usrSvc))
        }),
      )
  }

  public createChatroom(displayName: string, participants: User[]): Promise<DocumentReference<DocumentData>> {

    return addDoc(this.roomsCollection, {
      displayName,
      participants: participants.map((user) => doc(collection(this.firestore, 'users'), user.id))
    });
  }

  public deleteChatroom(id: string): Promise<void> {
    const chatroom = doc(this.roomsCollection, id);
    return deleteDoc(chatroom);
  }

  public leaveChatroom(chatroomId: string): Promise<void> | undefined {
    if (this.authSvc.getUser() == null) return;

    const userCollection = collection(this.firestore, 'users');
    const chatroomRef = doc(this.roomsCollection, chatroomId);

    return getDoc(chatroomRef).then(document => {
      const chatroom = document.data() as Chatroom;
      if (chatroom.participants.length === 2) {
        return deleteDoc(chatroomRef);
      } else {
        return updateDoc(chatroomRef, {
          participants: arrayRemove(doc(userCollection, this.authSvc.getUser()?.uid))
        })
      }
    });
  }

  public getChatroom$(chatroomId: string): Observable<Chatroom> {
    return docSnapshots(doc(this.roomsCollection, chatroomId))
      .pipe(
        map((snapshot) => {
          const rawChatroomData = snapshotToRawChatroom(snapshot);

          const users = rawChatroomData.participants
            .map((userRef) => this.usrSvc.getUserById(userRef.id));
          return {
            ...rawChatroomData,
            participants: users,
            id: snapshot.id
          } as Chatroom;
        })
      );
  }

  public setCurrentChatroom(current: string) {
    this.currentChatroom = current;
  }

  public getCurrentChatroom(): string {
    return this.currentChatroom;
  }
}
