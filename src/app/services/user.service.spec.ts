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
import { deleteDoc } from 'firebase/firestore';

describe('UserService', () => {
  let service: UserService;
  const testUser: User = {
    id: '',
    name: 'TestUser',
    status: 0
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
    service = TestBed.inject(UserService);
    service.test();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new user', (done: DoneFn) => {
    service.createUser(testUser.name).then(docRef => {
      const user$ = docSnapshots(docRef).pipe(
        map(data => {
          const user = data.data();
          user!.id = data.id;
          return user as User;
        })
      );
      user$.subscribe(user => {
        testUser.id = user.id;
        expect(user.name).toBe(testUser.name);
        done();
      })
    });
  });

  it('should get user data', (done: DoneFn) => {
    service.getUserById(testUser.id).subscribe(user => {
      expect(user.name).toBe(testUser.name);
      expect(user.status).toBe(testUser.status);
      done();
    });
  });


  it('should change the username of a user', (done: DoneFn) => {
    testUser.name = 'NewTestUsername';
    service.changeUsername(testUser.id, testUser.name).then(_ => {
      service.getUserById(testUser.id).subscribe(user => {
        expect(user.name).toBe(testUser.name);
        done();
      });
    });
  });

  it('should change the status of a user', (done: DoneFn) => {
    testUser.status = Status.ONLINE;
    service.changeStatus(testUser.id, testUser.status).then(_ => {
      service.getUserById(testUser.id).subscribe(user => {
        expect(user.status).toBe(testUser.status);
        done();
      });
    });
  });

  it('should delete a user', (done: DoneFn) => {
    service.deleteUser(testUser.id).then(_ => {
      done();
    });
  });

});
