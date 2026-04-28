import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { VisionMissionComponent } from './components/vision-mission/vision-mission';
import { ValuesComponent } from './components/values/values';
import { IdentityQuoteComponent } from './components/identity-quote/identity-quote';
import { ServicesComponent } from './components/services/services';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
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
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  isAdminRoute = false;
  isHomePage = false;

  ngOnInit() {
    // Manejar fragmentos (anchors #)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateRouteState(event.url);
        // Desplazarse al elemento si hay un fragment
        this.scrollToFragment();
      });

    // Inicializar con la ruta actual
    this.updateRouteState(this.router.url);
    setTimeout(() => this.scrollToFragment(), 100);

    // Intersection Observer para animaciones fade-in
    setTimeout(() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });

      document.querySelectorAll('.fade-in').forEach((el) => {
        obs.observe(el);
      });
    }, 100);
  }

  private scrollToFragment() {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        // Esperar a que el DOM se renderice completamente
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    });
  }

  private updateRouteState(url: string) {
    // Detectar si es página home (sin considerar el fragment ni los query params)
    const path = url.split('?')[0].split('#')[0];
    this.isHomePage = path === '/';

    // Detectar si es ruta admin
    this.isAdminRoute = path.includes('/admin');

    console.log('URL:', url, 'isHomePage:', this.isHomePage, 'isAdminRoute:', this.isAdminRoute);
  }
}
