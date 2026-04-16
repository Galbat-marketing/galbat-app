import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    company: '',
    message: ''
  };

  submitStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  statusMessage = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    // const fields = this.formData;
    // if (!fields.name || !fields.email || !fields.message) {
    //   this.submitStatus = 'error';
    //   this.statusMessage = 'Por favor completa todos los campos requeridos';
    //   return;
    // }

    // this.submitStatus = 'sending';
    // this.statusMessage = 'Enviando mensaje...';

    // this.http.post('http://localhost:3000/api/contact', this.formData)
    //   .subscribe({
    //     next: () => {
    //       this.submitStatus = 'success';
    //       this.statusMessage = 'Mensaje enviado correctamente';
    //       this.formData = { name: '', email: '', company: '', message: '' };
    //       setTimeout(() => {
    //         this.submitStatus = 'idle';
    //         this.statusMessage = '';
    //       }, 3000);
    //     },
    //     error: () => {
    //       this.submitStatus = 'error';
    //       this.statusMessage = 'Error al enviar el mensaje. Intenta de nuevo.';
    //       setTimeout(() => {
    //         this.submitStatus = 'idle';
    //         this.statusMessage = '';
    //       }, 3000);
    //     }
    //   });
    alert('Funcionalidad de contacto deshabilitada temporalmente, escribir al correo mostrado en la pagina');
  }
}
