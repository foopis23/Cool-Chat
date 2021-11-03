import { Component, OnInit } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { message } from '../message/message.component';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  //Purely a temporary test until object until the chatroom service is ready
  testMessage: message = {
    userId: "Matt",
    body: "Testing123",
    time: "9:30",
    prevUserId: ""
  }
  test2Message: message = {
    userId: "Matt",
    body: "Testing1234 to see if this is going to work at all because im really not sure o everall",
    time: "10:30",
    prevUserId: "Matt"
  }

  //Variable holder to store new user messages
  newMessage: String = "";

  //Hold the message history and be capable of holding new messsages added to the history as well
  messageHist: message[] = [this.testMessage, this.test2Message];

  //Going to get this from the chatroom data service
  chatroomUser: String = "Matt";

  //Temporary boolean used only to easily instigate certain logic in the html
  isValid = true;

  constructor() { }

  ngOnInit(): void {

  }

  addMessage() {
    //Disregard empty messages if entered
    if (this.newMessage === "") {
      return;
    }

    //Need to create a new message out of the userId who wrote it, the message itself, and timestamp
    const addedMessage = {
      userId: "test",
      body: this.newMessage,
      time: "testTime",
      //Track the last user as an easy way to decide on how the next message should be displayed
      prevUserId: this.messageHist[this.messageHist.length-1].userId
    }

    //Add to messageHistory array
    this.messageHist.push(addedMessage);

    //Need to also presumably use message service to add the new message to the database
  }
}

