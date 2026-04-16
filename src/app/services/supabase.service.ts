import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://gjbitkwtdnmlqkfjfhou.supabase.co'; // Cambiar
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqYml0a3d0ZG5tbHFrZmpmaG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTMyNDAsImV4cCI6MjA5MTkyOTI0MH0.JIToJWHULKpbe_PBBcw4kV1PKkvmioKFr8AtcmeVJ3s'; // Cambiar

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
