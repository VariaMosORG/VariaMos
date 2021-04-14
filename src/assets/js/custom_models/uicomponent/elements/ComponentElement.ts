import { ModelElement } from '../../../model/ModelElement';

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ComponentElement extends ModelElement {
  public constructor(currentModel:any) {
    super(
      'rectangle.png',
      'component',
      100,
      35,
      '',
      'UI Component',
      currentModel,
    );

    const properties = this.getProperties();
    properties.push(
      {
        id: 'code',
        label: 'Code',
        defValue: '',
        inputType: 'text',
        disabled: 'false',
        display: 'true',
      },
    );
    this.setProperties(properties);
  }
}
