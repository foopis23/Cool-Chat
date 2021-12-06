import { Injectable } from '@angular/core';
import { collectionSnapshots, docSnapshots, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayRemove, collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, Timestamp, updateDoc } from '@firebase/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../types/User';
import { AuthService } from './auth.service';
import { User as AuthUser } from '@angular/fire/auth';
import { UserQueryService } from './user-query.service';
import { MessageService } from './message.service';

interface RawChatroom {
  id: string,
  displayName: string,
  participants: DocumentReference[],
  lastMessageTimestamp: Timestamp
}
export interface Chatroom {
  id: string,
  displayName: string,
  participants: Observable<User>[],
  lastMessageTimestamp: Timestamp
}

export interface UserChatroom extends Chatroom {
  notificationCount: number
}

const snapshotToRawChatroom = (snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): RawChatroom => {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as RawChatroom;
}

const createRawChatroomFilterByUser = (user: User | null) => {
  return (chatroom: RawChatroom) => {
    return chatroom.participants.find((userRef) => {
      return userRef.id == user?.id;
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
  public userChatroomList$: Observable<UserChatroom[]>;
  private currentChatroom: string = "";
  private roomsCollection: CollectionReference;

  constructor(private firestore: Firestore, private authSvc: AuthService, private usrSvc: UserQueryService, private msgSvc : MessageService) {
    this.roomsCollection = collection(this.firestore, 'rooms');
    this.userChatroomList$ = combineLatest([this.authSvc.currentUser$, collectionSnapshots(this.roomsCollection)])
      .pipe(
        map(([user, snapshots]) => {
          return snapshots
            .map(snapshotToRawChatroom)
            .filter(createRawChatroomFilterByUser(user))
            .map(createRawChatroomToChatroom(this.usrSvc))
            .map((chatroom: Chatroom) => {
              // if chatroom doesn't have message, user is null, or the users as view the chatroom after the last message was sent, 0 notifications.
              if (chatroom.lastMessageTimestamp === undefined || user === null || chatroom.lastMessageTimestamp < user.lastViewed[chatroom.id]) {
                return {
                  ...chatroom,
                  notificationCount: 0
                }
              }
              
              // Todo: figure out way to get actual number of notifications
              return {
                ...chatroom,
                notificationCount: 1
              }
            })
            .sort((a : UserChatroom, b : UserChatroom) => {
              if (a.lastMessageTimestamp === undefined && b.lastMessageTimestamp !== undefined)
                return 1;

              if (a.lastMessageTimestamp !== undefined && b.lastMessageTimestamp === undefined)
                return -1;

              if (a.lastMessageTimestamp === undefined && b.lastMessageTimestamp === undefined)
                return 0;

              return (a.lastMessageTimestamp.seconds < b.lastMessageTimestamp.seconds)? 1 : -1;
            })
        })
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
