import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import dbJSON from '../../../../assets/db.json';
import { TokenService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: { ngSkipHydration: '' },
})
export class NavbarComponent implements OnInit {
  menuItems: any[] = [];
  isAuthenticated: boolean = false;

  availableLanguages: any[] = [];
  selectedLanguage: string = 'en';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private tokenService: TokenService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang('en');
    if (isPlatformBrowser(this.platformId)) {
      this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
 
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
    this.updateAvailableLanguages();

  }

  switchLang(lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.selectedLanguage = lang;
      localStorage.setItem('selectedLanguage', lang);
    }
    this.translate.use(lang);
    this.updateAvailableLanguages();
  }

  updateAvailableLanguages(): void {
    this.translate.get('languages').subscribe((languages: any) => {
      if (!languages) return;
  
      // Tanlangan tilni tekshirish
      const availableLangCodes = Object.keys(languages);
      if (!availableLangCodes.includes(this.selectedLanguage)) {
        this.selectedLanguage = 'en'; // Agar noto'g'ri til bo'lsa, default tilga o'tkazish
      }
  
      // Tanlangan tilni birinchi bo'lib qo'shish
      const selectedLang = this.selectedLanguage; // Endi undefined emas
      const otherLanguages = Object.keys(languages)
        .filter(code => code !== selectedLang)
        .map(code => ({
          code,
          name: languages[code].name,
          flag: languages[code].flag,
        }));
  
      this.availableLanguages = [
        { code: selectedLang, name: languages[selectedLang].name, flag: languages[selectedLang].flag },
        ...otherLanguages,
      ];
  
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.menuItems = dbJSON.menuItems;

    this.tokenService.auth$.subscribe((val) => {
      this.isAuthenticated = val;

    });

      ////////
      // this.translate.get('Sitetitle').subscribe((res: string) => {
      //   console.log('Tarjima natijasi:', res);
      // });

      // console.log('Mavjud tillar:', this.translate.getLangs());
      // console.log('Hozirgi til:', this.translate.currentLang);


      ///////////////

      const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  this.translate.use(savedLang); // Tilni qo'llash
  this.selectedLanguage = savedLang; // Tanlangan tilni saqlash
  this.updateAvailableLanguages();

  }

  logout() {
    this.tokenService.logout();
    this.isAuthenticated = false;
  }

  // Scroll event listener
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const button = this.el.nativeElement.querySelector('.js-top');

    if (scrollPosition > 150) {
      this.renderer.addClass(button, 'active');
    } else {
      this.renderer.removeClass(button, 'active');
    }
  }

  navTop() {
    this.scrollToTop();
  }

  // Smooth scroll to top
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
