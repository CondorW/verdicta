import { Injectable, inject } from '@angular/core';
import { Auth, User, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';

// Define an interface for our custom user profile data
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  rank: string;
  role: 'User' | 'Admin'; // Use a literal type for roles
  photoURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // Observable of the current Firebase user
  private user$: Observable<User | null> = authState(this.auth);

  // Observable of the current user's profile from Firestore
  // This is the key to our role-based system
  public userProfile$: Observable<UserProfile | null> = this.user$.pipe(
    switchMap(user => {
      if (user) {
        // If logged in, get their profile from Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return getDoc(userDocRef).then(docSnap => {
          return docSnap.exists() ? docSnap.data() as UserProfile : null;
        });
      } else {
        // If not logged in, return null
        return of(null);
      }
    }),
    shareReplay(1) // Cache the last emitted value
  );

  // A simple boolean observable to check if the user is an admin
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