import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SidebarComponent } from './sidebar/sidebar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
