import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);

  // Get a real-time stream of all user profiles
  getAllUsers(): Observable<UserProfile[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<UserProfile[]>;
  }

  // Update a user's role
  updateUserRole(uid: string, role: 'User' | 'Admin') {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDocRef, { role: role });
  }
}