import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, CollectionReference, DocumentReference } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserQueryService } from './user-query.service';




interface Chatroom{
  id: string,
  name: string,
  participants: DocumentReference[]
}

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
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
