import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { docSnapshots, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Status, User, UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user data', (done: DoneFn) => {
    const dummyUser: User = {
      id: 'eXhtvFSmcWh4yPQ6xDcm',
      name: 'DummyUser',
      status: Status.OFFLINE
    };

    service.getUserById(dummyUser.id).subscribe(user => {
      expect(user.name).toBe(dummyUser.name);
      expect(user.status).toBe(dummyUser.status);
      done();
    });
  });

  it('should create a new user', (done: DoneFn) => {
    const dummyData = {
      name: 'DummyCreatedUser',
      status: Status.OFFLINE
    };

    service.createUser(dummyData.name).then(docRef => {
      const userRef = docSnapshots(docRef).pipe(
        map(data => {
          const user = data.data();
          user!.id = data.id;
          return user as User;
        })
      );

      userRef.subscribe(user => {
        expect(user.name).toBe(dummyData.name);
        expect(user.status).toBe(dummyData.status);
        done();
      });
    });
  });
});
