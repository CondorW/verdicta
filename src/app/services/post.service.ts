import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, orderBy, query, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// We can define an interface for our Post object
export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorDisplayName: string;
  createdAt: any;
  // Add other fields from the plan as needed
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private firestore: Firestore = inject(Firestore);

  // Get a real-time stream of all posts, ordered by creation date
  getPosts(): Observable<Post[]> {
    const postsCollection = collection(this.firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  // Create a new post
  createPost(post: Post) {
    const postsCollection = collection(this.firestore, 'posts');
    // Use serverTimestamp() to let Firebase set the time
    return addDoc(postsCollection, { ...post, createdAt: serverTimestamp() });
  }
}