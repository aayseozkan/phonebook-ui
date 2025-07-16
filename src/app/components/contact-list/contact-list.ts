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
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, ContactAdd, AgGridModule, ContactActionsRenderer, TranslateModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  errorMessage: string = '';
  message: string = '';
  gridApi: any;
  gridColumnApi: any;

  columnDefs: ColDef<Contact>[] = [];

constructor(private contactService: ContactService, private translate: TranslateService) {
  this.translate.setDefaultLang('tr');
  this.translate.use('tr');

  this.translate.onLangChange.subscribe(() => {
    this.columnDefs = this.getColumnDefs(); // Dili değişince başlıkları güncelle
  });
}

getColumnDefs(): ColDef<Contact>[] {
  return [
  {
    headerName: '',
    headerValueGetter: () => this.translate.instant('ID'),
    field: 'id',
    sortable: true,
    filter: true
  },
  {
    headerName: '',
    headerValueGetter: () => this.translate.instant('FULL_NAME'),
    valueGetter: (params: ValueGetterParams<Contact>) =>
      `${params.data?.firstName ?? ''} ${params.data?.lastName ?? ''}`,
    sortable: true,
    filter: true
  },
  {
    headerName: '',
    headerValueGetter: () => this.translate.instant('PHONE'),
    field: 'phoneNumber',
    sortable: true,
    filter: true
  },
  {
    headerName: '',
    headerValueGetter: () => this.translate.instant('ACTIONS'),
    cellRenderer: ContactActionsRenderer,
    sortable: false,
    filter: false
  }
]};

  private contactsChangedSubscription!: Subscription;

  ngOnInit(): void {
    this.columnDefs = this.getColumnDefs();
    
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
  const confirmed = confirm(this.translate.instant('DELETE_CONFIRM'));
  if (confirmed) {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        // Silinen kişiyi çıkar ve diziye yeniden atama yap
        const updatedContacts = this.contacts.filter(c => c.id !== id);
        this.contacts = [...updatedContacts]; // referansı değiştiriyoruz ✔

        // Bilgi mesajı göster
        this.message = this.translate.instant('DELETE_SUCCESS');
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Kişi silinirken hata oluştu:', err);
        this.errorMessage = this.translate.instant('DELETE_ERROR');
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

switchLanguage(lang: string): void {
  this.translate.use(lang);
}

}