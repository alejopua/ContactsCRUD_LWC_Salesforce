public with sharing class ContactsManageSevice {
  /**
   * `MÉTODO DE ACTUALIZACIÓN DE CONTACTOS`:
   * He decidido no crear un método Apex personalizado porque:
   * - Utilizar @wire con `getContacts` y `@AuraEnabled(cacheable=true)` permite almacenar los datos en caché de manera eficiente.
   * - El componente `lightning-record-edit-form` gestiona automáticamente las actualizaciones y la validación de campos, reduciendo la necesidad de código adicional.
   * - Con `refreshApex`, puedo actualizar los datos en el componente sin realizar llamadas adicionales al servidor, optimizando el rendimiento.
   */

  /**
   * `MÉTODO DE CREACIÓN DE CONTACTO`:
   * Opté por no implementar un método Apex personalizado porque:
   * - El componente `lightning-record-edit-form` maneja automáticamente la creación de registros, simplificando el proceso.
   * - Este componente valida los campos según las configuraciones del objeto, lo que minimiza errores y asegura la integridad de los datos.
   * - Además, gestiona la seguridad a nivel de campo, garantizando que los usuarios solo puedan ver y editar los datos para los que tienen permisos, sin necesidad de lógica adicional en Apex.
   */

  /**
   * Devuelve una lista de contactos con su información básica.
   *
   * Esta consulta puede ser almacenada en caché (cacheable=true) evitando consultas repetitivas.
   * @return Lista de Contactos con campos Id, Name, Email, Phone, Address, City
   * @throws AuraHandledException si ocurre un error al consultar los contactos.
   */
  @AuraEnabled(cacheable=true)
  public static List<Contacts__c> getContacts(String searchTerm) {
    if (String.isNotBlank(searchTerm)) {
      String searchTermWithout = '%' + searchTerm + '%';
      return [
        SELECT Id, Name, Email__c, Phone__c, Address__c, City__c, Gender__c
        FROM Contacts__c
        WHERE Name LIKE :searchTermWithout
      ];
    } else {
      return [
        SELECT Id, Name, Email__c, Phone__c, Address__C, City__C, Gender__C
        FROM Contacts__c
      ];
    }
  }

  /**
   * Elimina un contacto de tipo Contacts__c de la organización basado en su Id.
   *
   * @param contactId Id del Contacts__c a eliminar.
   * @throws AuraHandledException si el contactId es inválido o ya no existe, se lanzan la excepción QueryException.
   */
  @AuraEnabled
  public static void deleteContact(String contactId) {
    try {
      // Consultar el registro a eliminar
      Contacts__c contactToDelete = [
        SELECT Id
        FROM Contacts__c
        WHERE Id = :contactId
        LIMIT 1
      ];

      // Realizar la eliminación
      delete contactToDelete;
    } catch (QueryException e) {
      // Manejar errores de consulta
      throw new AuraHandledException(
        'Error al eliminar el contacto: ' + e.getMessage()
      );
    }
  }

  /**
   * Elimina múltiples contactos de tipo Contacts__c de la organización basados en sus Ids.
   *
   * @param contactIds Lista de Ids de los Contacts__c a eliminar.
   * @throws AuraHandledException si alguno de los contactIds es inválido, los registros no existen, el usuario no tiene permisos o ocurre un error durante la eliminación.
   */
  @AuraEnabled
  public static void bulkDeleteContacts(List<Id> contactIds) {
    try {
      List<Contacts__c> contactsToDelete = [
        SELECT Id
        FROM Contacts__c
        WHERE Id IN :contactIds
      ];

      delete contactsToDelete;
    } catch (AuraHandledException de) {
      // Manejar errores de DML
      throw new AuraHandledException(
        'Error al eliminar los contactos: ' + de.getMessage()
      );
    }
  }
}
