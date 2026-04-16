import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { VisionMissionComponent } from './components/vision-mission/vision-mission';
import { ValuesComponent } from './components/values/values';
import { IdentityQuoteComponent } from './components/identity-quote/identity-quote';
import { ServicesComponent } from './components/services/services';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    VisionMissionComponent,
    ValuesComponent,
    IdentityQuoteComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  ngOnInit() {
    // Intersection Observer para animaciones fade-in
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }
}
