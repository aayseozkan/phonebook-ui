import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { TranslateModule } from '@ngx-translate/core'; 
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-add',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './contact-add.html',
  styleUrl: './contact-add.css'
})
export class ContactAdd implements OnChanges {
  @Input() editContact: Contact | null = null; // Dışarıdan alınan kişi
  @Output() closeModal = new EventEmitter<void>(); // Modalı kapatma bildirimi
  @Output() operationMessage = new EventEmitter<string>();

  contact: Contact = { id: 0, firstName: '', lastName: '', phoneNumber: '' };
  message: string = '';
  isEditMode: boolean = false;

  constructor(
    private contactService: ContactService, 
    private translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editContact'] && this.editContact) {
      console.log('Düzenlenecek kişi:', this.editContact);
      this.contact = { ...this.editContact };
      this.isEditMode = true;
    }
  }

  onBackdropClick(event: MouseEvent) {
  this.closeModal.emit();
  }

  saveContact() {
    if (
      !this.contact.firstName.trim() ||
      !this.contact.lastName.trim() ||
      !this.contact.phoneNumber.trim()
    ) {
      this.message = this.translate.instant('FILL_ALL_FIELDS');
      return;
    }

    if (this.isEditMode) {
      // Güncelleme
      this.contactService.updateContact(this.contact.id, this.contact).subscribe({
        next: () => {
          this.operationMessage.emit(this.translate.instant('UPDATE_SUCCESS'));
          this.contactService.notifyContactsChanged();
          this.closeModal.emit();
        },
        error: (err) => {
          this.message = this.translate.instant('UPDATE_ERROR');
          console.error(err);
        }
      });
    } else {
      // Ekleme
      this.contactService.addContact(this.contact).subscribe({
        next: () => {
          this.operationMessage.emit(this.translate.instant('ADD_SUCCESS'));
          this.contact = { id: 0, firstName: '', lastName: '', phoneNumber: '' };
          this.contactService.notifyContactsChanged();
          this.closeModal.emit();
        },
        error: (err) => {
          this.message = this.translate.instant('ADD_ERROR');
          console.error(err);
        }
      });
    }
  }
}