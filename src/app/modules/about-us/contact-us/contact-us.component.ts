import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-contact-us',
  standalone: true,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  imports: [ RouterModule ]
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
