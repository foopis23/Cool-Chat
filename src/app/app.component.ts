import { Component } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'messaging-app';
  items: Observable<any[]>;
  messages$: Observable<any[]>;
  messageInput : string;

  constructor(private firestore: Firestore, private messageSvc : MessageService) {
    const itemCollections = collection(firestore, 'items')
    this.items = collectionData(itemCollections);
    this.messages$ = messageSvc.getMessagesFromChatroomId('YuvHfec5B4skmfnHOcM9');

    this.messageInput = '';
  }

  onSubmit() {
    if (this.messageInput && this.messageInput !== "") {
      this.messageSvc.sendMessageToChatroom('YuvHfec5B4skmfnHOcM9', 'JDXybYhH1npHWAZOPdj5', this.messageInput);
      this.messageInput = '';
    }

    return false;
  }
}
