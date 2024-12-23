import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactsManageSevice.getContacts';
import deleteContact from '@salesforce/apex/ContactsManageSevice.deleteContact';
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
  { label: 'Nombre', fieldName: 'Name' },
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
  searchKey = ''; // Término ingresado en el campo de búsqueda

  wiredContactsResult;

  contacts;
  error;
  columns = COLUMNS;

  isOpenModal = false;
  isEditContact = false;

  // 4. Obtenemos la lista de contactos desde el ContactManageService via wire
  @wire(getContacts, { searchTerm: '$searchKey' })
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
        this.handleEditContact(rowId);
        break;
      case 'delete':
        this.deleteRecordIdFromContact(rowId);
        break;
      default:
    }
  }

  // 6. Elimina un contacto
  deleteRecordIdFromContact(contactId) {
    deleteContact({ contactId: contactId })
      .then(() => {
        this.showToast('Success', 'Contacto Eliminado', 'success');
        this.refreshData();
      })
      .catch((error) => {
        this.showToast(
          'Error al eliminar el contacto',
          error.body.message,
          'error'
        );
      });
  }

  // 7. Abre el modal para crear un nuevo contacto
  handleCreateContact() {
    this.isOpenModal = true;
    this.isEditContact = false;
    this.recordId = undefined;
  }

  // 8. Abre el modal para editar un nuevo contacto
  handleEditContact(contactId) {
    this.isOpenModal = true;
    this.isEditContact = true;
    this.recordId = contactId;
  }

  // 9. Cierra el modal
  closeModal() {
    this.isOpenModal = false;
  }

  // 10. Maneja el evento de éxito al crear o editar un contacto
  handleSuccess(event) {
    if (this.isEditContact) {
      this.showToast('Success', 'Contacto Actualizado', 'success');
    } else {
      this.showToast('Success', 'Contacto Creado', 'success');
    }
    this.isOpenModal = false;
    this.refreshData();
  }

  // 11. Maneja el evento de búsqueda
  handleSearch(event) {
    this.searchKey = event.target.value;
  }

  // 12. Refresca la lista de contactos
  refreshData() {
    return this.wiredContactsResult
      ? refreshApex(this.wiredContactsResult)
      : undefined;
  }

  // 13. Función reutilizable para la creación de un Toast
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
