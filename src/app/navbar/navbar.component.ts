import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dbJSON from "../../assets/db.json";

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: { 'ngSkipHydration': '' } 
})
export class NavbarComponent implements OnInit {
  menuItems: any[] = [];

  // constructor() {}

  ngOnInit(): void {
    this.menuItems = dbJSON.menuItems;   
}


// isVisible = false;

//   @HostListener('window:scroll', [])
//   onWindowScroll() {
//     this.isVisible = window.pageYOffset > 50;
//   }

//   scrollToTop() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }


constructor(private renderer: Renderer2, private el: ElementRef) {}

// Scroll event listener
@HostListener('window:scroll', [])
onWindowScroll() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const button = this.el.nativeElement.querySelector('.js-top');

  if (scrollPosition > 150) {
    this.renderer.addClass(button, 'active');
  } else {
    this.renderer.removeClass(button, 'active');
  }
}

// Smooth scroll to top
scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}