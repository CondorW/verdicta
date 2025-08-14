import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);

  getAllUsers(): Observable<UserProfile[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<UserProfile[]>;
  }

  updateUserRole(uid: string, role: 'User' | 'Admin') {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDocRef, { role: role });
  }

  // New method to update user profile data
  updateUserProfile(uid: string, data: Partial<UserProfile>) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDocRef, data);
  }
}