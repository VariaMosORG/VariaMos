import { Model } from '../../model/Model';

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class UicomponentModel extends Model {
  public constructor() {
    super(
      'uicomponent',
      ['ComponentElement'],
    );
  }

  public customGraphConfig() {
    const graph = this.getModelUtil().getVGraph().getGraph();
    graph.setDropEnabled(true);
  }
}
