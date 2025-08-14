import { Injectable, inject } from '@angular/core';
import { Auth, User, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  rank: string;
  role: 'User' | 'Admin';
  photoURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Changed from private to public
  public auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  private user$: Observable<User | null> = authState(this.auth);

  public userProfile$: Observable<UserProfile | null> = this.user$.pipe(
    switchMap(user => {
      if (user) {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return getDoc(userDocRef).then(docSnap => {
          return docSnap.exists() ? docSnap.data() as UserProfile : null;
        });
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  public isAdmin$: Observable<boolean> = this.userProfile$.pipe(
    map(userProfile => userProfile?.role === 'Admin')
  );

  register({ email, password }: any): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  createUserProfile(userCredential: UserCredential) {
    const user = userCredential.user;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.email!.split('@')[0],
      rank: 'Student',
      role: 'User',
      photoURL: ''
    };
    return setDoc(userDocRef, newUserProfile);
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}