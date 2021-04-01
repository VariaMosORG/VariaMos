import { ModelElement } from '../../../model/ModelElement';

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ContainerElement extends ModelElement {
  public constructor(currentModel: any) {
    super(
      'rectangle.png',
      'container',
      200,
      100,
      'shape=swimlane;startSize=15;',
      'Container',
      currentModel,
    );
  }
}
