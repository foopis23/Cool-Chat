import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
      ]
    });
    service = TestBed.inject(AuthService);
  });

  afterAll(async () => {
    let accDelete = service.deleteAccount();
    if (accDelete) {
      await accDelete;
      console.log("Deleting account");
    }
  });

  const email = "randomtestemail@gmail.com";
  const password = "test123";
  const displayName = "testaccount"

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow register', () => {
    return service.register(email, password, displayName).then(cred => {
      expect(cred).toBeTruthy();
      expect(cred.user).toBeTruthy();
      expect(cred.user.email).toBe(email);
    }).catch(e => {
      fail(e);
    });
    /*try {
      service.register(email, password, displayName).then(cred => {
        expect(cred).toBeTruthy();
        expect(cred.user).toBeTruthy();
        expect(cred.user.email).toBe(email);
        expect(cred.user.displayName).toBe(displayName);
      });
    } catch (e) {
      fail(e);
    }*/
  })

  it('should stop duplicate email', () => {
    return service.register(email, password, displayName).then(_ => {
      fail("Allowed Duplicated Email To Register");
    })
    .catch(e => {
      expect(e).toBeTruthy();
    });
    /*try {
      await service.register(email, password, displayName);
      fail("Allowed Duplicated Email To Register");
    } catch (e) {
      expect(true).toBeTrue();
    }*/
  });

  it('should allow logout', async () => {
    try {
      await service.logout();
      const state = await service.isLoggedIn();
      expect(state).toBeFalsy();
    } catch (e) {
      fail(e);
    }
  });

  it('should allow login', () => {
    return service.login(email, password).then(cred => {
      expect(cred).toBeTruthy();
      expect(cred.user).toBeTruthy();
      expect(cred.user.email).toBe(email);
      //expect(cred.user.displayName).toBe(displayName);
    });
    /*try {
      const cred = await service.login(email, password);
      expect(cred).toBeTruthy();
      expect(cred.user).toBeTruthy();
      expect(cred.user.email).toBe(email);
      expect(cred.user.displayName).toBe(displayName);
    } catch (e) {
      fail(e);
    }*/
  })
});
