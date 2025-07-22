import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // The register method now returns the UserCredential
  register({ email, password }: any): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // New method to create a user profile document in Firestore
  createUserProfile(userCredential: UserCredential) {
    const user = userCredential.user;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.email?.split('@')[0] || 'New User', // Default display name
      rank: 'Student', // Default rank
      role: 'User', // Default role
      photoURL: '' // Default photo URL
    });
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}