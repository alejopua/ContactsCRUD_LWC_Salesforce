import { LightningElement, track, wire } from 'lwc';
import getAllContacts from '@salesforce/apex/ContactsManageSevice.getAllContacts';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// CONSTANTES ROW_ACTIONS y COLUMNS (Se definen fuera de la clase para mantener el código limpio)
// 1. contiene los objetos que describen las acciones disponibles
const ROW_ACTIONS = [
  { label: 'Edit', name: 'edit' },
  { label: 'Delete', name: 'delete' },
];

// 2. Configura las columnas que se mostrarán en el lightning-datatable.
const COLUMNS = [
  { label: 'Name', fieldName: 'Name' },
  { label: 'Email', fieldName: 'Email__c', type: 'email' },
  { label: 'Phone', fieldName: 'Phone__c', type: 'phone' },
  { label: 'Address', fieldName: 'Address__c' },
  { label: 'City', fieldName: 'City__c' },
  { label: 'Gender', fieldName: 'Gender__c' },
  {
    type: 'action',
    typeAttributes: { rowActions: ROW_ACTIONS },
  },
];

export default class ContactsManageCRUD extends LightningElement {
  // 3. Propiedades
  @track recordId;

  wiredContactsResult;

  contacts;
  error;
  columns = COLUMNS;

  isOpenModal = false;

  // 4. Obtenemos la lista de contactos desde el ContactManageService via wire
  @wire(getAllContacts)
  wiredContacts(result) {
    this.wiredContactsResult = result;
    const { data, error } = result;
    if (data) {
      this.contacts = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.contacts = [];
    }
  }

  // 5. Maneja el evento de acciones en la fila de la tabla (edit, delete)
  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const rowId = event.detail.row.Id;

    switch (actionName) {
      case 'edit':
        this.isOpenModal = true;
        this.recordId = rowId;
        break;
      case 'delete':
        break;
      default:
    }
  }

  closeModal() {
    this.isOpenModal = false;
  }

  handleSuccess(event) {
    this.showToast('Success', 'Contact updated', 'success');
    this.isOpenModal = false;
    this.refreshData();
  }

  refreshData() {
    return this.wiredContactsResult
      ? refreshApex(this.wiredContactsResult)
      : undefined;
  }

  // Funcion reutilizable para mostrar mensajes Toast
  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant,
      })
    );
  }
}
