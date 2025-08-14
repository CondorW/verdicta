import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Post, PostService, Reply } from '../../services/post.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './post-detail.html',
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  post$!: Observable<Post>;
  replies$!: Observable<Reply[]>;
  replyForm: FormGroup;
  postId!: string;

  constructor() {
    this.replyForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.post$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.postId = params.get('id')!;
        this.replies$ = this.postService.getRepliesForPost(this.postId);
        return this.postService.getPostById(this.postId);
      })
    );
  }

  submitReply() {
    if (this.replyForm.invalid) return;
    const content = this.replyForm.value.content;
    this.postService.addReplyToPost(this.postId, content)
      .then(() => this.replyForm.reset())
      .catch(err => console.error(err));
  }

  toggleUpvote(post: Post) {
    this.postService.toggleUpvote(post).catch(err => console.error(err));
  }

  hasUserUpvoted(post: Post): boolean {
    const userId = this.authService.auth.currentUser?.uid;
    return !!userId && !!post.upvotedBy?.includes(userId);
  }
}