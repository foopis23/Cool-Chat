import { Component } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'messaging-app';
  items: Observable<any[]>;

  constructor(private firestore: Firestore) {
    const itemCollections = collection(firestore, 'items')
    this.items = collectionData(itemCollections)
  }
}
