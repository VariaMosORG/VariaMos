import { ModelElement } from '../../../model/ModelElement';

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class CustomElement extends ModelElement {
  public constructor(currentModel:any) {
    super(
      'custom.png',
      'custom',
      100,
      40,
      'shape=custom',
      'Custom. File',
      currentModel,
    );
  }
}
