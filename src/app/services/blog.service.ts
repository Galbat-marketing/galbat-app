import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  excerpt?: string;
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = this.supabaseService.getClient();
  }

  // Obtener todos los posts
  getPosts(): Observable<BlogPost[]> {
    return from(
      this.supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as BlogPost[];
      })
    );
  }

  // Obtener un post por ID
  getPost(id: string): Observable<BlogPost> {
    return from(
      this.supabase
        .from('posts')
        .select('*')
        .eq('id', parseInt(id))
        .single()
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as BlogPost;
      })
    );
  }

  // Crear un nuevo post
  createPost(post: BlogPost): Observable<BlogPost> {
    return from(
      this.supabase
        .from('posts')
        .insert([
          {
            title: post.title,
            content: post.content,
            author: post.author,
            excerpt: post.excerpt || post.content.substring(0, 200),
            featured_image: post.featured_image || null,
            created_at: new Date(),
            updated_at: new Date()
          }
        ])
        .select()
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data?.[0] as BlogPost;
      })
    );
  }

  // Actualizar un post
  updatePost(id: string, post: BlogPost): Observable<BlogPost> {
    return from(
      this.supabase
        .from('posts')
        .update({
          title: post.title,
          content: post.content,
          author: post.author,
          excerpt: post.excerpt,
          featured_image: post.featured_image,
          updated_at: new Date()
        })
        .eq('id', parseInt(id))
        .select()
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data?.[0] as BlogPost;
      })
    );
  }

  // Eliminar un post
  deletePost(id: string): Observable<void> {
    return from(
      this.supabase
        .from('posts')
        .delete()
        .eq('id', parseInt(id))
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return;
      })
    );
  }
}
