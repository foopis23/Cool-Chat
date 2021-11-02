import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, DocumentReference, Timestamp } from '@firebase/firestore';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';

//TODO: Replace with copy in user service
enum Status {
  OFFLINE,
  BUSY,
  DO_NOT_DISTURB,
  ONLINE
}

//TODO: Replace with copy in user service
interface User {
  id: string,
  name: string,
  status: Status
}

interface RawMessage {
  attachments: any[]
  content: string,
  fromRef: DocumentReference,
  roomRef: DocumentReference,
  timestamp: Timestamp
}

export interface Message extends RawMessage {
  author?: User
}


const UserLookup: { [key: string]: User } = {
  "k5UXtHjyaVncib6oNATM": {
    id: "k5UXtHjyaVncib6oNATM",
    name: "DummyUser1",
    status: 0
  },
  "JDXybYhH1npHWAZOPdj5": {
    id: "JDXybYhH1npHWAZOPdj5",
    name: "DummyUser2",
    status: 0
  }
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: RawMessage[];
  private messages$: Observable<RawMessage[]>;
  private messageSubscriber: Subscriber<RawMessage[]> | undefined;

  constructor(private firestore: Firestore) {
    this.messages = new Array<RawMessage>();

    this.messages$ = new Observable<RawMessage[]>((subscriber) => {
      this.messageSubscriber = subscriber;

      this.messages = [
        {
          content: "Hello world",
          fromRef: doc(this.firestore, "users/JDXybYhH1npHWAZOPdj5"),
          roomRef: doc(this.firestore, "rooms/YuvHfec5B4skmfnHOcM9"),
          timestamp: Timestamp.now(),
          attachments: []
        },
        {
          content: "Hello Other User",
          fromRef: doc(this.firestore, "users/k5UXtHjyaVncib6oNATM"),
          roomRef: doc(this.firestore, "rooms/YuvHfec5B4skmfnHOcM9"),
          timestamp: Timestamp.now(),
          attachments: []
        }
      ]


      this.messageSubscriber?.next(this.messages);
    })
  }

  public getMessagesFromChatroomId(chatroomId: string): Observable<Message[]> {
    return this.messages$.pipe(
      map((messages) => {
        let filter: RawMessage[] = [];
        for (let message of messages) {
          if (message.roomRef.id == chatroomId) {
            filter.push(message);
          }
        }
        return filter;
      }),
      map((messages) => {
        let output: Message[] = [];

        for (let message of messages) {
          output.push({
            ...message,
            author: UserLookup[message.fromRef.id]
          })
        }

        return output;
      })
    )
  }

  public async sendMessageToChatroom(roomId: string, fromId: string, content: string): Promise<void> {
    this.messages.push({
      roomRef: doc(this.firestore, `rooms/${roomId}`),
      fromRef: doc(this.firestore, `users/${fromId}`),
      content,
      timestamp: Timestamp.now(),
      attachments: []
    })

    if (this.messageSubscriber) {
      this.messageSubscriber.next(this.messages);
    } else {
      throw new Error("message subscriber isn't set...");
    }
  }
}
