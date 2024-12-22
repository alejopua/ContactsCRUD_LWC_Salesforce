public with sharing class ContactsManageSevice {
  /**
   * Devuelve una lista de contactos con su información básica.
   *
   * Esta consulta puede ser almacenada en caché (cacheable=true) evitando consultas repetitivas.
   *
   * @return Lista de Contactos con campos Id, Name, Email, Phone, Address, City
   */
  @AuraEnabled(cacheable=true)
  public static List<Contacts__c> getAllContacts() {
    try {
      return [
        SELECT Id, Name, Email__c, Phone__c, Address__C, City__C, Gender__C
        FROM Contacts__c
      ];
    } catch (Exception e) {
      throw new AuraHandledException(
        'Error al consultar los contactos: ' + e.getMessage()
      );
    }
  }

  /**
   * Para el `MÉTODO DE ACTUALIZACIÓN DE CONTACTOS`, he optado por la siguiente alternativa:
   * Utilizando la decoración @wire en el LWC para llamar a `getAllContacts` de mi servicio, junto con @AuraEnabled(cacheable=true),
   * logramos almacenar el resultado de la llamada a Apex en caché. Además, al usar el componente `lightning-record-edit-form`,
   * se manejan automáticamente las operaciones de actualización sin necesidad de crear un método Apex personalizado.
   * `lightning-record-edit-form` también facilita la validación de campos al permitir definir previamente, desde el objeto,
   * cuáles campos son obligatorios y cuáles no, evitando así errores durante la actualización.
   * Combinado con `refreshApex` en LWC, podemos actualizar los datos en el componente sin realizar llamadas adicionales al servidor.
   * En lugar de eso, reutilizamos la respuesta almacenada en caché y solo actualizamos los datos si han cambiado.
   */
}
