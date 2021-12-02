import { Injectable } from '@angular/core';
<<<<<<< .merge_file_a14044
import { Firestore } from '@angular/fire/firestore';
import { collection, CollectionReference, DocumentReference } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserQueryService } from './user-query.service';




interface Chatroom{
  id: string,
  name: string,
  participants: DocumentReference[]
=======
import { collectionSnapshots, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayRemove, collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, updateDoc } from '@firebase/firestore';
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
>>>>>>> .merge_file_a16936
}

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
<<<<<<< .merge_file_a14044
  private room$: Observable<Chatroom[]>;
  private userCollectionRef: CollectionReference;

  constructor(private firestore: Firestore, private userSvc: UserQueryService) { }


  public getParticipantsFromChatroomId(chatroomId: string): Observable<Chatroom[]>{
    return this.chatroomName.pipe(
      map()
    )
  }


  public getRoomName(chatroomId: string): Observable<Chatroom>{
    return this.room$.pipe(
      map((room) => room.filter((room) => room.id == chatroomId)),
      map((room) => room.map((room) =>{
        return { }
      }))
    )
  }
}


// It is a service to retrieve chatroom name and participants from firebase
// in observables.
=======
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
>>>>>>> .merge_file_a16936
