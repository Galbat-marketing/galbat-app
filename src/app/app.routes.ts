import { Routes } from '@angular/router';
import { AuthLoginComponent } from './components/auth-login/auth-login';
import { BlogListComponent } from './components/blog-list/blog-list';
import { BlogDetailComponent } from './components/blog-detail/blog-detail';
import { BlogAdminComponent } from './components/blog-admin/blog-admin';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Blog público - Listar
  {
    path: 'blog',
    component: BlogListComponent
  },

  // Blog público - Detalle
  {
    path: 'blog/:id',
    component: BlogDetailComponent
  },

  // Admin - Login
  {
    path: 'admin/login',
    component: AuthLoginComponent
  },

  // Admin - Gestionar posts
  {
    path: 'admin/posts',
    component: BlogAdminComponent,
    canActivate: [AuthGuard]
  },

  // Redirecciones
  {
    path: 'admin',
    redirectTo: '/admin/login',
    pathMatch: 'full'
  }
];
