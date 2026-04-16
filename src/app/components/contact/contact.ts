import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  private contactService = inject(ContactService);

  formData = {
    name: '',
    email: '',
    company: '',
    message: ''
  };

  submitStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  statusMessage = '';

  onSubmit() {
    const fields = this.formData;
    if (!fields.name || !fields.email || !fields.message) {
      this.submitStatus = 'error';
      this.statusMessage = 'Por favor completa todos los campos requeridos';
      setTimeout(() => {
        this.submitStatus = 'idle';
        this.statusMessage = '';
      }, 3000);
      return;
    }

    this.submitStatus = 'sending';
    this.statusMessage = 'Enviando mensaje...';

    this.contactService.sendContact(this.formData).subscribe({
      next: () => {
        this.submitStatus = 'success';
        this.statusMessage = '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.';
        this.formData = { name: '', email: '', company: '', message: '' };
        setTimeout(() => {
          this.submitStatus = 'idle';
          this.statusMessage = '';
        }, 4000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.submitStatus = 'error';
        this.statusMessage = 'Error al enviar el mensaje. Intenta de nuevo.';
        setTimeout(() => {
          this.submitStatus = 'idle';
          this.statusMessage = '';
        }, 3000);
      }
    });
  }
}
