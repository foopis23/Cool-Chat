import { Injectable } from '@angular/core';
import { addDoc, collectionSnapshots, Firestore } from '@angular/fire/firestore';
import { collection, CollectionReference, doc, DocumentReference, Timestamp, updateDoc, serverTimestamp } from '@firebase/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserQueryService } from './user-query.service';
import { User } from '../types/User';

interface RawMessage extends DocumentData {
  id: string
  attachments: any[]
  content: string
  from: DocumentReference
  room: DocumentReference
  timestamp: Timestamp
}

export interface Message extends RawMessage {
  author?: Observable<User>
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages$: Observable<RawMessage[]>;
  private messageCollectionRef: CollectionReference;

  constructor(private firestore: Firestore, private userSvc: UserQueryService) {
    this.messageCollectionRef = collection(this.firestore, "messages");

    this.messages$ = collectionSnapshots(this.messageCollectionRef).pipe(
      map((messages) => {
        const output: Array<RawMessage> = [];
        for (let message of messages) {
          let messageData = {
            ...message.data(),
            id: message.id
          } as RawMessage;

          output.push(messageData)
        }

        return output;
      }));
  }

  public getMessagesFromChatroomId(chatroomId: string): Observable<Message[]> {
    return this.messages$.pipe(
      map((messages) => messages.filter((message) => message.room.id == chatroomId)),
      map((messages) => messages.map((message) => {
        return { ...message, author: this.userSvc.getUserById(message.from.id) }
      })),
      map((messages) => messages
      .filter((message) => message.timestamp !== null)
      .sort((a : Message, b : Message) => {
        return a.timestamp.toMillis() - b.timestamp.toMillis();
      }))
    )
  }

  public async sendMessageToChatroom(roomId: string, fromId: string, content: string): Promise<void> {
    const room = doc(this.firestore, `/rooms/${roomId}`);
    const from = doc(this.firestore, `/users/${fromId}`);

    await addDoc(collection(this.firestore, 'messages'), {
      room,
      from,
      content,
      timestamp: serverTimestamp(),
      attachments: []
    })

    await updateDoc(room, {
      lastMessageTimestamp: Timestamp.now()
    });
  }
}
