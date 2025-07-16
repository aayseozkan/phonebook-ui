import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Contact } from '../../models/contact.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-actions-renderer',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <button class="btn btn-sm btn-warning" (click)="onEdit()">{{ 'EDIT' | translate }}</button>
    <button class="btn btn-sm btn-danger" (click)="onDelete()">{{ 'DELETE' | translate }}</button>
  `
})
export class ContactActionsRenderer implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onEdit() {
    // ContactList bileşenindeki edit metodunu çağırıyoruz
    this.params.context.componentParent.openEditModal(this.params.data as Contact);
  }

  onDelete() {
    // ContactList bileşenindeki delete metodunu çağırıyoruz
    this.params.context.componentParent.deleteContact(this.params.data.id);
  }
}
