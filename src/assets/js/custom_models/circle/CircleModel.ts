import { Model } from "../../model/Model";

/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class CircleModel extends Model {

  public constructor() {
    super(
      "circle",
      ["CircleElement", "ContainerElement"]
    );
  }

  public customGraphConfig() {
    let graph = this.getModelUtil().getVGraph().getGraph();
    graph.setDropEnabled(true);
  }
}