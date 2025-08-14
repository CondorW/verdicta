import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, docData, increment, orderBy, query, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorDisplayName: string;
  createdAt: Timestamp;
  upvotedBy?: string[];
  upvoteCount?: number;
}

export interface Reply {
  id?: string;
  content: string;
  authorId: string;
  authorDisplayName: string;
  createdAt: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  getPosts(): Observable<Post[]> {
    const postsCollection = collection(this.firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostById(postId: string): Observable<Post> {
    const postDocRef = doc(this.firestore, `posts/${postId}`);
    return docData(postDocRef, { idField: 'id' }) as Observable<Post>;
  }

  getRepliesForPost(postId: string): Observable<Reply[]> {
    const repliesCollection = collection(this.firestore, `posts/${postId}/replies`);
    const q = query(repliesCollection, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Reply[]>;
  }

  createPost(post: Omit<Post, 'createdAt' | 'upvotedBy' | 'upvoteCount'>) {
    const postsCollection = collection(this.firestore, 'posts');
    return addDoc(postsCollection, {
      ...post,
      createdAt: serverTimestamp(),
      upvotedBy: [],
      upvoteCount: 0
    });
  }

  addReplyToPost(postId: string, content: string) {
    const currentUser = this.authService.auth.currentUser;
    if (!currentUser) throw new Error('User not logged in!');

    const repliesCollection = collection(this.firestore, `posts/${postId}/replies`);
    const newReply = {
      content,
      authorId: currentUser.uid,
      authorDisplayName: currentUser.email!.split('@')[0],
      createdAt: serverTimestamp()
    };
    return addDoc(repliesCollection, newReply);
  }

  toggleUpvote(post: Post) {
    const currentUser = this.authService.auth.currentUser;
    if (!currentUser) throw new Error('User not logged in!');

    const postDocRef = doc(this.firestore, `posts/${post.id!}`);
    const hasUpvoted = post.upvotedBy?.includes(currentUser.uid);

    return updateDoc(postDocRef, {
      upvotedBy: hasUpvoted ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
      upvoteCount: hasUpvoted ? increment(-1) : increment(1)
    });
  }

  deletePost(postId: string) {
    const postDocRef = doc(this.firestore, `posts/${postId}`);
    return deleteDoc(postDocRef);
  }
}