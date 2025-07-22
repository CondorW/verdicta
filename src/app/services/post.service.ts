import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorDisplayName: string;
  createdAt: any;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private firestore: Firestore = inject(Firestore);

  getPosts(): Observable<Post[]> {
    const postsCollection = collection(this.firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  createPost(post: Post) {
    const postsCollection = collection(this.firestore, 'posts');
    return addDoc(postsCollection, { ...post, createdAt: serverTimestamp() });
  }

  // New method to delete a post
  deletePost(postId: string) {
    const postDocRef = doc(this.firestore, `posts/${postId}`);
    return deleteDoc(postDocRef);
  }
}