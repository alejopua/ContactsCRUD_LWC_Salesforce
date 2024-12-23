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
  /***************************************
   *     PROPIEDADES REACTIVAS
   ***************************************/
  @track recordId = null; // ID del registro actual
  searchKey = ''; // Término ingresado en el campo de búsqueda

  // Almacenamiento de datos y errores
  contacts; // Lista de contactos obtenida
  error; // Error en caso de que ocurra relacionado al getContacts

  // Propiedades relacionadas con la UI
  columns = COLUMNS; // Columnas de la tabla
  isOpenModal = false; // Controla la visibilidad del modal
  isEditContact = false; // Indica si se está editando un contacto
  selectedContacts = []; // Lista de contactos seleccionados
  existingEmails = []; // Para validar correos existentes

  /***************************************
   *       PROPIEDADES CON @wire
   ***************************************/
  @wire(getContacts, { searchTerm: '$searchKey' })
  wiredContacts(result) {
    this.wiredContactsResult = result;
    const { data, error } = result;
    if (data) {
      this.existingEmails = data.map((contact) => contact.Email__c);
      this.contacts = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.contacts = [];
    }
  }
  wiredContactsResult;

  /***************************************
   *         MANEJO DE EVENTOS
   ***************************************/
  // Maneja el evento de acciones en la fila de la tabla (edit, delete)
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

  // Maneja la selección de filas en la tabla
  handleRowSelection(event) {
    const selectedRows = event.detail.selectedRows;
    this.selectedContacts = selectedRows;
  }

  // Maneja el evento de búsqueda
  handleSearch(event) {
    this.searchKey = event.target.value;
  }

  // Maneja el evento de éxito al crear o editar un contacto
  handleSuccess(event) {
    if (this.isEditContact) {
      this.showToast('Success', 'Contacto Actualizado', 'success');
    } else {
      this.showToast('Success', 'Contacto Creado', 'success');
    }
    this.isOpenModal = false;
    this.refreshData();
  }

  // Maneja el evento de envío del formulario
  handleSubmit(event) {
    console.log(event.detail);
    event.preventDefault(); // Evita que el formulario se envíe de inmediato

    // Validar solo al crear un nuevo contacto
    if (
      !this.recordId &&
      this.existingEmails.includes(event.detail.fields.Email__c)
    ) {
      // Muestra un error si el correo ya existe
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error',
          message: 'El correo ya está registrado.',
          variant: 'error',
        })
      );
    } else {
      // Envía el formulario si no hay conflicto
      this.template.querySelector('lightning-record-edit-form').submit();
    }
  }

  /***************************************
   *        MÉTODOS PARA ELIMINAR
   ***************************************/
  // Elimina un contacto
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

  // Deselecciona todas las filas
  deselectAllRows() {
    const dataTable = this.template.querySelector('lightning-datatable');
    dataTable.selectedRows = [];
    this.selectedContacts = [];
  }

  // Elimina los contactos seleccionados
  handleDeleteContacts() {
    const selectedIds = this.selectedContacts.map((contact) => contact.Id); // Extraer los Ids de los contactos seleccionados en una lista
    if (selectedIds.length === 0) {
      this.showToast('Info', 'Seleccione al menos un contacto', 'info');
      return;
    }
    bulkDeleteContacts({ contactIds: selectedIds })
      .then(() => {
        this.showToast('Success', 'Contactos Eliminados', 'success');
        this.deselectAllRows();
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

  /***************************************
   *       MÉTODOS PARA CREAR/EDITAR
   ***************************************/

  // Abre el modal para crear un nuevo contacto
  handleCreateContact() {
    this.isOpenModal = true;
    this.isEditContact = false;
    this.recordId = undefined;
  }

  // Abre el modal para editar un nuevo contacto
  handleEditContact(contactId) {
    this.isOpenModal = true;
    this.isEditContact = true;
    this.recordId = contactId;
  }

  /***************************************
   *         MÉTODOS AUXILIARES
   ***************************************/

  // Refresca la lista de contactos
  refreshData() {
    return this.wiredContactsResult
      ? refreshApex(this.wiredContactsResult)
      : undefined;
  }

  // Abre el modal
  closeModal() {
    this.isOpenModal = false;
  }

  // Función reutilizable para la creación de un Toast
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
