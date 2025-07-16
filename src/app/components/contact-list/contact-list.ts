import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ContactAdd } from '../contact-add/contact-add';
import { ColDef, ValueGetterParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { ContactActionsRenderer } from '../contact-actions-renderer/contact-actions-renderer.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, ContactAdd, AgGridModule, ContactActionsRenderer],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  errorMessage: string = '';
  message: string = '';
  gridApi: any;
  gridColumnApi: any;

columnDefs: ColDef<Contact>[] = [
  {
    headerName: 'ID',
    field: 'id',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Ad',
    valueGetter: (params: ValueGetterParams<Contact>) =>
      `${params.data?.firstName ?? ''} ${params.data?.lastName ?? ''}`,
    sortable: true,
    filter: true
  },
  {
    headerName: 'Telefon',
    field: 'phoneNumber',
    sortable: true,
    filter: true
  },
  {
    headerName: 'İşlemler',
    cellRenderer: ContactActionsRenderer, // 🔥 Burası önemli!
    sortable: false,
    filter: false
  }
];

  private contactsChangedSubscription!: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();

    this.contactsChangedSubscription = this.contactService.contactsChanged$.subscribe(() => {
      this.loadContacts();
    });
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
      },
      error: (err) => {
        console.error('Kişiler alınırken hata oluştu:', err);
      }
    });
  }

deleteContact(id: number): void {
  const confirmed = confirm('Bu kişiyi silmek istediğinize emin misiniz?');
  if (confirmed) {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        // Silinen kişiyi çıkar ve diziye yeniden atama yap
        const updatedContacts = this.contacts.filter(c => c.id !== id);
        this.contacts = [...updatedContacts]; // referansı değiştiriyoruz ✔

        // Bilgi mesajı göster
        this.message = 'Kişi başarıyla silindi!';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Kişi silinirken hata oluştu:', err);
        this.errorMessage = 'Kişi silinirken bir hata oluştu.';
      }
    });
  }
}

onGridReady(params: any): void {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
}

editContactData: Contact | null = null;
isModalOpen: boolean = false;

openAddModal(): void {
  this.editContactData = null; // Yeni kişi ekleme modu için null yapıyoruz
  this.isModalOpen = true;
}

openEditModal(contact: Contact): void {
  console.log('Modal açılıyor, kişi:', contact);
  this.editContactData = contact;
  this.isModalOpen = true;
  console.log('isModalOpen:', this.isModalOpen);
}

closeModal(): void {
  console.log('Modal kapanıyor');
  this.isModalOpen = false;
  this.editContactData = null;
}

  ngOnDestroy() {
    this.contactsChangedSubscription.unsubscribe();
  }


showMessage(msg: string): void {
  this.message = msg;
  setTimeout(() => {
    this.message = '';
  }, 3000); // 3 saniye sonra mesajı temizle
}

context = {
  componentParent: this,
};

}