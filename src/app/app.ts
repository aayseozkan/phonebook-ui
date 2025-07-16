import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ContactList } from './components/contact-list/contact-list';
import { ContactAdd } from './components/contact-add/contact-add';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, ContactList, ContactAdd],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'phonebook-ui';
}
