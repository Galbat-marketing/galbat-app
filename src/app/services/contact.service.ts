import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export interface Contact {
  id?: number;
  name: string;
  email: string;
  company?: string;
  message: string;
  created_at?: string;
  status?: 'new' | 'read';
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = this.supabaseService.getClient();
  }

  // Enviar mensaje de contacto
  sendContact(contact: Contact): Observable<any> {
    return new Observable(observer => {
      this.supabase
        .from('contacts')
        .insert([
          {
            name: contact.name,
            email: contact.email,
            company: contact.company || null,
            message: contact.message,
            status: 'new'
          }
        ])
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data);
            observer.complete();
          }
        });
    });
  }

  // Obtener todos los contactos
  getContacts(): Observable<Contact[]> {
    return new Observable(observer => {
      this.supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data || []);
            observer.complete();
          }
        });
    });
  }

  // Marcar como leído
  markAsRead(id: number): Observable<any> {
    return new Observable(observer => {
      this.supabase
        .from('contacts')
        .update({ status: 'read' })
        .eq('id', id)
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data);
            observer.complete();
          }
        });
    });
  }

  // Eliminar contacto
  deleteContact(id: number): Observable<any> {
    return new Observable(observer => {
      this.supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data);
            observer.complete();
          }
        });
    });
  }
}
