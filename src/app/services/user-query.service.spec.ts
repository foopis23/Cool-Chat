import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';
import { environment } from 'src/environments/environment';
import { Status, UserQueryService } from './user-query.service';

describe('UserService', () => {
  let service: UserQueryService;
  const testUser = {
    id: 'AWVmMgrvKObg6R8CHsyJP2UklHC2',
    displayName: 'John Smith',
    photoURL: 'https://via.placeholder.com/150',
    status: Status.OFFLINE
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
      ]
    });
    service = TestBed.inject(UserQueryService);
    service.test();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user data', (done: DoneFn) => {
    service.getUserById(testUser.id).subscribe(user => {
      expect(user).toBe(testUser);
    });
  });
});
