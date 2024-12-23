import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactsManageSevice.getContacts';
import deleteContact from '@salesforce/apex/ContactsManageSevice.deleteContact';
import bulkDeleteContacts from '@salesforce/apex/ContactsManageSevice.bulkDeleteContacts';
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
  // 1. Decoradores y propiedades reactivas
  @track recordId; // ID del registro actual

  // 2. Propiedades relacionadas con la búsqueda
  searchKey = ''; // Término ingresado en el campo de búsqueda

  // 3. Propiedades obtenidas mediante wire
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
  wiredContactsResult;

  // 4. Almacenamiento de datos y errores
  contacts; // Lista de contactos obtenida
  error; // Error en caso de que ocurra al obtener los contactos

  // 5. Configuración de columnas para la tabla
  columns = COLUMNS;

  // 6. Estado de la interfaz de usuario (UI)
  isOpenModal = false; // Controla la visibilidad del modal
  isEditContact = false; // Indica si se está editando un contacto
  selectedContacts = []; // Lista de contactos seleccionados

  // 7. Maneja el evento de acciones en la fila de la tabla (edit, delete)
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

  // 8. Elimina un contacto
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

  // 9. Abre el modal para crear un nuevo contacto
  handleCreateContact() {
    this.isOpenModal = true;
    this.isEditContact = false;
    this.recordId = undefined;
  }

  // 10. Abre el modal para editar un nuevo contacto
  handleEditContact(contactId) {
    this.isOpenModal = true;
    this.isEditContact = true;
    this.recordId = contactId;
  }

  // 11. Maneja la selección de filas en la tabla
  handleRowSelection(event) {
    const selectedRows = event.detail.selectedRows;
    this.selectedContacts = selectedRows;
  }

  // 11.1 Elimina los contactos seleccionados
  handleDeleteContacts() {
    const selectedIds = this.selectedContacts.map((contact) => contact.Id); // Extraer los Ids de los contactos seleccionados en una lista
    if (selectedIds.length === 0) {
      this.showToast('Info', 'Seleccione al menos un contacto', 'info');
      return;
    }
    bulkDeleteContacts({ contactIds: selectedIds })
      .then(() => {
        this.showToast('Success', 'Contactos Eliminados', 'success');
        this.refreshData();
      })
      .catch((error) => {
        this.showToast(
          'Error al eliminar los contactos',
          error.body.message,
          'error'
        );
      });
  }

  // 12. Maneja el evento de éxito al crear o editar un contacto
  handleSuccess(event) {
    if (this.isEditContact) {
      this.showToast('Success', 'Contacto Actualizado', 'success');
    } else {
      this.showToast('Success', 'Contacto Creado', 'success');
    }
    this.isOpenModal = false;
    this.refreshData();
  }

  // 13. Maneja el evento de búsqueda
  handleSearch(event) {
    this.searchKey = event.target.value;
  }

  // 14. Refresca la lista de contactos
  refreshData() {
    return this.wiredContactsResult
      ? refreshApex(this.wiredContactsResult)
      : undefined;
  }

  closeModal() {
    this.isOpenModal = false;
  }

  // 15. Función reutilizable para la creación de un Toast
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
