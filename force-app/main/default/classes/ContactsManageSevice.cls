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
      List<Contacts__c> contacts = [
        SELECT Id, Name, Email__c, Phone__c, Address__C, City__C, Gender__C
        FROM Contacts__c
      ];
      return contacts;
    } catch (Exception e) {
      throw new AuraHandledException(
        'Error al consultar los contactos: ' + e.getMessage()
      );
    }
  }
}
