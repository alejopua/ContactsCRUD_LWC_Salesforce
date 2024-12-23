@isTest
private class ContactsManageSeviceTest {
  @testSetup
  static void setup() {
    // Crear datos de prueba
    List<Contacts__c> contacts = new List<Contacts__c>();
    contacts.add(
      new Contacts__c(
        Name = 'Juan Perez',
        Email__c = 'JuanPerez@example.com',
        Phone__c = '1234567890',
        Address__c = '123 Main St',
        City__c = 'Anytown',
        Gender__c = 'Masculino'
      )
    );
    contacts.add(
      new Contacts__c(
        Name = 'Jane Smith',
        Email__c = 'jane.smith@example.com',
        Phone__c = '0987654321',
        Address__c = '456 Elm St',
        City__c = 'Othertown',
        Gender__c = 'Femenino'
      )
    );
    contacts.add(
      new Contacts__c(
        Name = 'Bob Brown',
        Email__c = 'Juan@exam.com',
        Phone__c = '1234567890',
        Address__c = 'Calle 123',
        City__c = 'Bogota',
        Gender__c = 'Masculino'
      )
    );
    contacts.add(
      new Contacts__c(
        Name = 'Pablo Ramirez',
        Email__c = 'pablo@example.com',
        Phone__c = '3116160101',
        City__c = 'Bogota',
        Address__c = 'CL 24  35 ',
        Gender__c = 'Masculino'
      )
    );
    insert contacts;
  }

  @isTest
  static void getContacts_noSearchTerm_returnsAllContacts() {
    // GIVEN - Creación de datos, escenarios...

    // WHEN - Llamado al método a probar
    Test.startTest();
    List<Contacts__c> result = ContactsManageSevice.getContacts('');
    Test.stopTest();

    // THEN - Chequear el resultado esperado
    Assert.areEqual(3, result.size(), 'Se esperan 3 contactos');
  }

  @isTest
  static void getContacts_withSearchTerm_returnsFilteredContacts() {
    // GIVEN - Creación de datos, escenarios...

    // WHEN - Llamado al método a probar con un término de búsqueda
    Test.startTest();
    List<Contacts__c> result = ContactsManageSevice.getContacts('Juan');
    Test.stopTest();

    // THEN - Chequear el resultado esperado
    Assert.areEqual(1, result.size(), 'Se esperaba 1 contacto');
    Assert.areEqual(
      'Juan Perez',
      result[0].Name,
      'El nombre del contacto no coincide'
    );
  }

  @isTest
  static void getContacts_invalidSearchTerm_returnsNoContacts() {
    // GIVEN - Creación de datos, escenarios...

    // WHEN - Llamado al método a probar con un término de búsqueda que no coincide
    Test.startTest();
    List<Contacts__c> result = ContactsManageSevice.getContacts('Invalid');
    Test.stopTest();

    // THEN - Chequear el resultado esperado
    Assert.areEqual(0, result.size(), 'Se esperaban 0 contactos');
  }

  @isTest
  static void deleteContact_validId_contactDeleted() {
    // GIVEN - Crear un contacto para eliminar
    Contacts__c contact = new Contacts__c(
      Name = 'Bob Brown',
      Email__c = 'bob.brown@example.com',
      Phone__c = '6666666666',
      Address__c = '321 Oak St',
      City__c = 'Anycity',
      Gender__c = 'Masculino'
    );
    insert contact;

    // WHEN - Llamar al método para eliminar el contacto
    Test.startTest();
    ContactsManageSevice.deleteContact(contact.Id);
    Test.stopTest();

    // THEN - Verificar que el contacto ha sido eliminado
    Contacts__c deletedContact = [
      SELECT Id
      FROM Contacts__c
      WHERE Id = :contact.Id
      LIMIT 1
    ];

    Assert.areEqual(
      null,
      deletedContact,
      'El contacto debería haber sido eliminado'
    );
  }

  @isTest
  static void deleteContact_invalidId_throwsException() {
    // GIVEN - Un Id de contacto inválido
    String invalidId = '001000000000000AAA';

    // WHEN - Llamar al método para eliminar el contacto
    Test.startTest();
    try {
      ContactsManageSevice.deleteContact(invalidId);
    } catch (AuraHandledException e) {
      // THEN - Verificar que se lanza una excepción
      Assert.isNotNull(e);
    }
    Test.stopTest();
  }

  @isTest
  static void bulkDeleteContacts_validIds_contactsDeleted() {
    // GIVEN - Crear múltiples contactos para eliminar
    List<Contacts__c> contacts = [
      SELECT Id
      FROM Contacts__c
    ];

    List<Id> contactIdsToDelete = new List<Id>();
    for (Contacts__c contact : contacts) {
      contactIdsToDelete.add(contact.Id);
    }

    // WHEN - Llamar al método para eliminar los contactos
    Test.startTest();
    ContactsManageSevice.bulkDeleteContacts(contactIdsToDelete);
    Test.stopTest();

    // THEN - Verificar que los contactos han sido eliminados
    List<Contacts__c> deletedContacts = [
      SELECT Id
      FROM Contacts__c
      WHERE Id IN :contactIdsToDelete
    ];
    System.assertEquals(
      0,
      deletedContacts.size(),
      'Todos los contactos deberían haber sido eliminados'
    );
  }
}
