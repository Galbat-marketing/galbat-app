import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient;
  private currentUser$ = new BehaviorSubject<AuthUser | null>(null);
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.supabase = this.supabaseService.getClient();
    this.checkSession();
  }

  private async checkSession() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        this.currentUser$.next({
          id: session.user.id,
          email: session.user.email || ''
        });
        this.isLoggedIn$.next(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        this.currentUser$.next({
          id: data.user.id,
          email: data.user.email || ''
        });
        this.isLoggedIn$.next(true);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signup(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await this.supabase.auth.signOut();
      this.currentUser$.next(null);
      this.isLoggedIn$.next(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  getAuthState() {
    return this.isLoggedIn$.value;
  }
}
