import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService, BlogPost } from '../../services/blog.service';
import { ContactService, Contact } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-admin.html',
  styleUrls: ['./blog-admin.scss']
})
export class BlogAdminComponent implements OnInit {
  private blogService = inject(BlogService);
  private contactService = inject(ContactService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Tabs
  activeTab: 'posts' | 'contacts' = 'posts';

  // Posts
  posts: BlogPost[] = [];
  loading = true;
  error = '';
  success = '';

  // Form
  showForm = false;
  editingId: string | null = null;
  form = {
    title: '',
    author: '',
    content: '',
    excerpt: '',
    featured_image: ''
  };

  // Contacts
  contacts: Contact[] = [];
  contactsLoading = false;
  selectedContact: Contact | null = null;

  ngOnInit() {
    this.loadPosts();
  }

  // ===== POSTS =====

  loadPosts() {
    this.loading = true;
    this.blogService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los posts';
        this.loading = false;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.form = {
      title: '',
      author: '',
      content: '',
      excerpt: '',
      featured_image: ''
    };
    this.editingId = null;
  }

  editPost(post: BlogPost) {
    this.form = {
      title: post.title,
      author: post.author,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || ''
    };
    this.editingId = post.id || null;
    this.showForm = true;
    window.scrollTo(0, 0);
  }

  savePost() {
    if (!this.form.title || !this.form.content || !this.form.author) {
      this.error = 'Completa los campos obligatorios';
      return;
    }

    const post: BlogPost = {
      title: this.form.title,
      author: this.form.author,
      content: this.form.content,
      excerpt: this.form.excerpt,
      featured_image: this.form.featured_image
    };

    if (this.editingId) {
      this.blogService.updatePost(this.editingId, post).subscribe({
        next: () => {
          this.success = 'Post actualizado exitosamente';
          this.loadPosts();
          this.resetForm();
          this.showForm = false;
        },
        error: () => {
          this.error = 'Error al actualizar el post';
        }
      });
    } else {
      this.blogService.createPost(post).subscribe({
        next: () => {
          this.success = 'Post creado exitosamente';
          this.loadPosts();
          this.resetForm();
          this.showForm = false;
        },
        error: () => {
          this.error = 'Error al crear el post';
        }
      });
    }

    setTimeout(() => {
      this.success = '';
      this.error = '';
    }, 3000);
  }

  deletePost(id: string | undefined) {
    if (!id || !confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    this.blogService.deletePost(id).subscribe({
      next: () => {
        this.success = 'Post eliminado exitosamente';
        this.loadPosts();
      },
      error: () => {
        this.error = 'Error al eliminar el post';
      }
    });

    setTimeout(() => {
      this.success = '';
      this.error = '';
    }, 3000);
  }

  // ===== CONTACTS =====

  switchTab(tab: 'posts' | 'contacts') {
    this.activeTab = tab;
    if (tab === 'contacts') {
      this.loadContacts();
    }
  }

  loadContacts() {
    this.contactsLoading = true;
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.contactsLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los contactos';
        this.contactsLoading = false;
      }
    });
  }

  viewContact(contact: Contact) {
    this.selectedContact = contact;
    if (contact.status === 'new' && contact.id) {
      this.contactService.markAsRead(contact.id).subscribe();
      contact.status = 'read';
    }
  }

  closeContactDetail() {
    this.selectedContact = null;
  }

  deleteContact(id: number | undefined) {
    if (!id || !confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.success = 'Mensaje eliminado exitosamente';
        this.loadContacts();
        this.closeContactDetail();
      },
      error: () => {
        this.error = 'Error al eliminar el mensaje';
      }
    });

    setTimeout(() => {
      this.success = '';
      this.error = '';
    }, 3000);
  }

  getUnreadCount(): number {
    return this.contacts.filter(c => c.status === 'new').length;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
