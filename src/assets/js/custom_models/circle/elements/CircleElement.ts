import { ModelElement } from '../../../model/ModelElement';

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class CircleElement extends ModelElement {
  public constructor(currentModel:any) {
    super(
      'circle.png',
      'circle',
      100,
      100,
      'shape=ellipse',
      'Circle',
      currentModel,
    );
  }
}
