import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post, PostService } from '../../services/post.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forum.html',
})
export class ForumComponent implements OnInit {
  postForm: FormGroup;
  posts$: Observable<Post[]>;
  isLoading = false;
  errorMessage: string | null = null;

  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private auth = inject(Auth);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
    // Initialize the posts stream
    this.posts$ = this.postService.getPosts();
  }

  ngOnInit(): void { }

  async createPost() {
    if (this.postForm.invalid) return;

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to create a post.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const newPost: Post = {
      title: this.postForm.value.title,
      content: this.postForm.value.content,
      authorId: currentUser.uid,
      authorDisplayName: currentUser.email?.split('@')[0] || 'Anonymous',
      createdAt: null // Will be set by the server
    };

    try {
      await this.postService.createPost(newPost);
      this.postForm.reset(); // Clear the form on success
    } catch (e: any) {
      this.errorMessage = e.message;
    } finally {
      this.isLoading = false;
    }
  }
}