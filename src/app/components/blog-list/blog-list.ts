import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-list.html',
  styleUrls: ['./blog-list.scss']
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogService);
  private router = inject(Router);

  posts: BlogPost[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.error = '';

    this.blogService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar posts:', error);
        this.error = 'Error al cargar los posts';
        this.loading = false;
      }
    });
  }

  getExcerpt(content: string): string {
    return content.substring(0, 200) + '...';
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goToPost(postId: string | undefined) {
    if (postId) {
      this.router.navigate(['/blog', postId]);
    }
  }
}
