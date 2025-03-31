import { Component } from '@angular/core';


@Component({
  selector: 'app-contact-us',
  standalone: true,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Form Submitted', this.contact);
    // Bu yerda formani backendga yuborish kodini qo'shish mumkin
  }
}
