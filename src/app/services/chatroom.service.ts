import { Injectable } from '@angular/core';
import { collectionSnapshots, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayRemove, collection, CollectionReference, doc, DocumentData, DocumentReference, QueryDocumentSnapshot, updateDoc } from '@firebase/firestore';
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
  participants: Observable<User[]>
}

const snapshotToRawChatroom = (snapshot: QueryDocumentSnapshot<DocumentData>): RawChatroom => {
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
      participants: forkJoin(users)
    } as Chatroom
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  public userChatroomList$: Observable<Chatroom[]>;
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
          const rawChatroomData = snapshot.data() as RawChatroom;

          const users = rawChatroomData.participants
            .map((userRef) => this.usrSvc.getUserById(userRef.id));
          return {
            ...rawChatroomData,
            participants: forkJoin(users),
            id: snapshot.id
          } as Chatroom;
        })
      );
  }
}
