# ContactsCRUD_LWC_Salesforce

> Aplicación Lightning Web Components que te permite administrar Contactos en Salesforce. Sus principales funcionalidades incluyen:  
> - Creación de contactos  
> - Edición de contactos  
> - Eliminación masiva de contactos  
> - Búsqueda de contactos  

Esta aplicación demuestra cómo aprovechar el poder de la plataforma Salesforce para desarrollar componentes reutilizables y escalables en Lightning Web Components (LWC).

## Tabla de Contenidos

- [Instalación en un Scratch Org](#instalación-en-un-scratch-org)  
- [Instalación en un org Developer Edition o Trailhead Playground](#instalación-en-un-org-developer-edition-o-trailhead-playground)  
- [Notas sobre la Carga de Datos de Ejemplo](#notas-sobre-la-carga-de-datos-de-ejemplo)  
- [Instrucciones Opcionales](#instrucciones-opcionales)  
- [Tours de Código (Code Tours)](#tours-de-código-code-tours)
- [Documentación Consultada](#documentación-consultada)

---

## Instalación en un Scratch Org

Esta es la opción recomendada si eres desarrollador y quieres explorar de manera completa el proyecto y el código.

1. **Configura tu entorno**   
    - Habilitar Dev Hub en tu Trailhead Playground.  
    - Instalar Salesforce CLI.  
    - Instalar Visual Studio Code.  
    - Instalar las extensiones de Visual Studio Code para Salesforce, incluyendo la extensión de Lightning Web Components.

2. Autoriza tu Dev Hub si aún no lo has hecho (en el ejemplo, asignamos el alias `myhuborg`):

    ```bash
    sf org login web -d -a myhuborg
    ```

3. Clona este repositorio.

4. Crea un nuevo scratch org con alias `contactsCrud` (por ejemplo):

    ```bash
    sf org create scratch -d -f config/project-scratch-def.json -a contactsCrud
    ```

5. Despliega la aplicación a tu scratch org:

    ```bash
    sf project deploy start
    ```

6. Asigna el *permission set* correspondiente (si lo incluiste en tu proyecto) o el *System Administrator* (por defecto) a tu usuario:

    ```bash
    sf org assign permset -n ContactsCRUD
    ```
    > Ajusta el nombre del permission set si es necesario.

7. (Opcional) **Importa datos de ejemplo** si tu proyecto los incluye:

    ```bash
    sf data import tree --plan data/data-contacts.json  
    ```

8. Abre el scratch org:

    ```bash
    sf org open
    ```


9. Desde el **App Launcher**, selecciona la aplicación **My Contacts** (o el nombre que hayas configurado).

---

---

## Documentación Consultada

A continuación, algunas referencias y documentación oficial que se consultaron durante el desarrollo de este proyecto:

1. [lightning-datatable](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable)  
2. [lightning-record-edit-form](https://developer.salesforce.com/docs/component-library/bundle/lightning-record-edit-form)  
3. [lightning-button](https://developer.salesforce.com/docs/component-library/bundle/lightning-button)  
4. [lightning-layout-item](https://developer.salesforce.com/docs/component-library/bundle/lightning-layout-item)  
5. [Modals - Lightning Design System](https://www.lightningdesignsystem.com/components/modals/)  
6. [Utilities - Lightning Design System](https://www.lightningdesignsystem.com/utilities)  
7. [updateRecord Reference (LWC)](https://developer.salesforce.com/docs/platform/lwc/guide/reference-update-record.html)  
8. [Apex Result Caching (LWC)](https://developer.salesforce.com/docs/platform/lwc/guide/apex-result-caching.html)  
9. [lightning/uiRecordApi - Reference](https://developer.salesforce.com/docs/platform/lwc/guide/reference-lightning-ui-api-record.html)  
10. [Wire a Function to Apex (LWC)](https://developer.salesforce.com/docs/platform/lwc/guide/apex-wire-method.html)  
11. [Apex Error Handling (LWC)](https://developer.salesforce.com/docs/platform/lwc/guide/apex-error-handling.html)  
12. [lightning-datatable Documentation](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation)  
13. [System.Assert (Apex)](https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_class_System_Assert.htm)  
14. [Apex Error Handling (LWC) (Repetido)](https://developer.salesforce.com/docs/platform/lwc/guide/apex-error-handling.html)  

---

¡Listo! Con esto deberías poder configurar y explorar **ContactsCRUD_LWC_Salesforce** en tu propio entorno. Tambien es importante resaltar que debes contar con un conocimiento para configuración del proyecto en tu entorno.
