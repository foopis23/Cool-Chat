import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { docSnapshots, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';
import { collection } from '@firebase/firestore';
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
    service.test();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user data', (done: DoneFn) => {
    const dummyUser: User = {
      id: 'k5UXtHjyaVncib6oNATM',
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

  it('should change the username of a user', (done: DoneFn) => {
    const dummyUser = {
      id: '5BOjTtwZqAv85X220ebH',
      name: 'ToChangedDummyUser',
      status: Status.OFFLINE
    };

    service.changeUsername(dummyUser.id, dummyUser.name);
    service.getUserById(dummyUser.id).subscribe(user => {
      expect(user.name).toBe(dummyUser.name);
      expect(user.status).toBe(dummyUser.status);
      done();
    });
  });

  it('should change the status of a user', (done: DoneFn) => {
    const dummyUser = {
      id: 'JDXybYhH1npHWAZOPdj5',
      name: 'StatusDummyUser',
      status: Status.ONLINE
    };

    service.changeStatus('JDXybYhH1npHWAZOPdj5', dummyUser.status);
    service.changeUsername(dummyUser.id, dummyUser.name);
    service.getUserById(dummyUser.id).subscribe(user => {
      expect(user.name).toBe(dummyUser.name);
      expect(user.status).toBe(dummyUser.status);
      done();
    });
  });
});
