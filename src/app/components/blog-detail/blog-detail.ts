import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.html',
  styleUrls: ['./blog-detail.scss']
})
export class BlogDetailComponent implements OnInit {
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  post: BlogPost | null = null;
  loading = true;
  error = '';
  relatedPosts: BlogPost[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPost(id);
      }
    });
  }

  loadPost(id: string) {
    this.loading = true;
    this.error = '';

    this.blogService.getPost(id).subscribe({
      next: (data) => {
        this.post = data;
        this.loading = false;
        this.loadRelatedPosts();
      },
      error: (error) => {
        console.error('Error al cargar post:', error);
        this.error = 'No se encontró el post';
        this.loading = false;
      }
    });
  }

  loadRelatedPosts() {
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        // Obtener 3 posts relacionados (excluir el actual)
        this.relatedPosts = posts
          .filter(p => p.id !== this.post?.id)
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error al cargar posts relacionados:', error);
      }
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack() {
    this.router.navigate(['/blog']);
  }

  goToPost(postId: string | undefined) {
    if (postId) {
      this.router.navigate(['/blog', postId]);
    }
  }
}
