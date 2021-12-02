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
<<<<<<< HEAD
<<<<<<< .merge_file_a19172
<<<<<<< Updated upstream
import { ContentComponent } from './content/content.component';
import { MessageComponent } from './message/message.component';
=======
import { UserSearchComponent } from './home/user-search/user-search.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { AccountComponent } from './settings/account/account.component';
import { SecurityComponent } from './settings/security/security.component';
import { NotificationComponent } from './settings/notification/notification.component';
>>>>>>> Stashed changes
=======
=======
>>>>>>> 8ef04fbff89b5c24d915bbea4416586a1bfb5486
import { UserSearchComponent } from './home/user-search/user-search.component';
import { ChatlistComponent } from './home/chatlist/chatlist.component';
import { ChatroomCreationComponent } from './home/chatroom-creation/chatroom-creation.component';
import { UserStatusPipe } from './pipes/user-status.pipe';
<<<<<<< HEAD
>>>>>>> .merge_file_a12908
=======
import { CurrentUserComponent } from './home/current-user/current-user.component';
>>>>>>> 8ef04fbff89b5c24d915bbea4416586a1bfb5486

@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
    MainComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
<<<<<<< HEAD
<<<<<<< .merge_file_a19172
<<<<<<< Updated upstream
    ContentComponent,
    MessageComponent
=======
    MessageComponent,
    UserSearchComponent,
    SettingsComponent,
    ProfileComponent,
    AccountComponent,
    SecurityComponent,
    NotificationComponent
>>>>>>> Stashed changes
=======
=======
>>>>>>> 8ef04fbff89b5c24d915bbea4416586a1bfb5486
    MessageComponent,
    UserSearchComponent,
    ChatlistComponent,
    ChatroomCreationComponent,
<<<<<<< HEAD
    UserStatusPipe
>>>>>>> .merge_file_a12908
=======
    UserStatusPipe,
    CurrentUserComponent
>>>>>>> 8ef04fbff89b5c24d915bbea4416586a1bfb5486
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
