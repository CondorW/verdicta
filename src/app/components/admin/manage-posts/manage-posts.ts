import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Post, PostService } from '../../../services/post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-posts',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './manage-posts.html',
})
export class ManagePostsComponent {
  private postService = inject(PostService);
  public posts$: Observable<Post[]> = this.postService.getPosts();

  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId)
        .then(() => console.log('Post deleted'))
        .catch(err => console.error(err));
    }
  }
}