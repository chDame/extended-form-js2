# @bpmn-io/form-js extended

This is an example of a library of custom components on top of @bpmn-io/form-js.

## Display a form <a id="viewer" />

Renders a form. **Note** : newForm method returns a native @bpmn-io/form-js Form object.

```javascript
import { newForm } from '@camunda-community/form-js-extended';
import { Form } from '@bpmn-io/form-js';

const form = newForm({
  container: document.querySelector('#form'),
});

await form.importSchema(schema, data);

form.on('submit', (event) => {
  console.log(event.data, event.errors);
});
```

## Display a form <a id="viewer" />

Renders a form. **Note** : newForm method returns a native @bpmn-io/form-js Form object.

```javascript
import { newForm } from '@camunda-community/form-js-extended';
import { Form } from '@bpmn-io/form-js';

const form = newForm({
  container: document.querySelector('#form'),
});

await form.importSchema(schema, data);

form.on('submit', (event) => {
  console.log(event.data, event.errors);
});

### Create and edit a form <a id="builder" />

Create a new form or edit an exsting one. **Note** : newFormEditor method returns a native @bpmn-io/form-js FormEditor object.

```javascript
import { newFormEditor } from '@camunda-community/form-js-extended';
import { FormEditor } from '@bpmn-io/form-js';

const formEditor = newFormEditor({
  container: document.querySelector('#form-editor'),
});

await formEditor.importSchema(schema);
```

## Project structure

In assets, you'll find custom css or icons used in the components or in the FormEditor

### custom

Under custom, you'll find components and properties-panel. Components is the folder hosting the code of the custom components. 
These components may require some specific properties at design time. These properties are managed in the properties-panel folder.

#### custom/components

Under this folder, you'll find the components and there dependencies (in shared). api-select and range are 2 examples of custom components.
Under shared, you'll find some hooks and utils as well as some parts (sub parts of components that are reusables).


#### custom/properties-panel

In there, you'll find the specific "groups" used in the FormEditor for the components. There is also a "utils" folder hosting some reusable code.

## How to add a new component

1. Add a folder with your component name in components. Add an index.js file into it that will contain your component code..
2. Add the component into the RenderExtension in custom/components/index.js
3. If this component requires some specific configurations, add a folder in custom/properties-panel and register it in the PropertiesPanelExtension in custom/properties-panel/index.js

## How to use it in a react/angular/vue project ?

```bash
npm i @camunda-community/form-js-extended
```