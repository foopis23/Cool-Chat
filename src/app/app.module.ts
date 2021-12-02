import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatroomComponent } from './home/chatroom/chatroom.component';
import { MessageComponent } from './home/message/message.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserSearchComponent } from './home/user-search/user-search.component';
import { ChatlistComponent } from './home/chatlist/chatlist.component';
import { ChatroomCreationComponent } from './home/chatroom-creation/chatroom-creation.component';
import { UserStatusPipe } from './pipes/user-status.pipe';
import { CurrentUserComponent } from './home/current-user/current-user.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
    MainComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
    MessageComponent,
    UserSearchComponent,
    ChatlistComponent,
    ChatroomCreationComponent,
    UserStatusPipe,
    CurrentUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
