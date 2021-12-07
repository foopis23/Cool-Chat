import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/types/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserQueryService } from 'src/app/services/user-query.service';
import { deleteObject, getDownloadURL, getMetadata, getStorage, ref, uploadBytes } from '@firebase/storage';
import { updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User | undefined;
  private userSubscription: Subscription | undefined;

  constructor(private userQueryService: UserQueryService, private authService: AuthService, private _router: Router) {
  }

  ngOnInit(): void {
    this.userSubscription = this.userQueryService.getUserById(this.authService.getUser()!.uid).subscribe(user => {
      this.user = user;
    });
  }

  updateDisplayName() {
    this.authService.changeData({
      displayName: this.user!.displayName,
    });
  }

  updateProfilePic(event: Event) {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files![0];
    if (!imageTypes.includes(file.type)) return;

    const storage = getStorage();
    const newProfilePic = ref(storage, file.name);
    const oldProfilePic = ref(storage, this.user?.photoURL);

    uploadBytes(newProfilePic, file).then(result => {
      getDownloadURL(result.ref).then(url => {
        this.authService.changeData({
          photoURL: url
        });
        deleteObject(oldProfilePic);
      });
    });
  }
}
