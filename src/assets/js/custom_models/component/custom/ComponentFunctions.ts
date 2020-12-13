/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ComponentFunctions {
  public static customize(graph:any) {
    // collect the information of the components and files to be customized
    const binding_root = graph.getModel().getCell('binding_feature_component');
    const binding_relations = graph.getModel().getChildEdges(binding_root);

    const customizations = [];

    for (let i = 0; i < binding_relations.length; i++) {
      const { source } = binding_relations[i];
      const { target } = binding_relations[i];
      if (source.getAttribute('selected') == 'true') { // only selected concrete features are analyzed
        const label = target.getAttribute('label');
        const clon_id = target.getId();
        const id = clon_id.replace('clon', '');
        const inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
        for (let j = 0; j < inco_egdes.length; j++) {
          const file_source = inco_egdes[j].source;
          if (file_source.getAttribute('type') == 'custom') {
            customizations.push(label);
          }
        }
      }
    }

    return customizations;
  }

  public static verify(graph:any) {
    // collect the information of the components and files to be derived
    const binding_root = graph.getModel().getCell('binding_feature_component');
    const binding_relations = graph.getModel().getChildEdges(binding_root);

    const destinations = [];

    for (let i = 0; i < binding_relations.length; i++) {
      const { source } = binding_relations[i];
      const { target } = binding_relations[i];
      if (source.getAttribute('selected') == 'true') { // only selected concrete features are analyzed
        const label = target.getAttribute('label');
        const clon_id = target.getId();
        const id = clon_id.replace('clon', '');
        const inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
        for (let j = 0; j < inco_egdes.length; j++) {
          const file_source = inco_egdes[j].source;
          if (file_source.getAttribute('type') == 'file') {
            const data = { destination: '' };
            data.destination = file_source.getAttribute('destination');
            destinations.push(data.destination);
          }
        }
      }
    }

    return destinations;
  }

  public static execute(graph:any) {
    // collect the information of the components and files to be derived
    const binding_root = graph.getModel().getCell('binding_feature_component');
    const binding_relations = graph.getModel().getChildEdges(binding_root);
    const files = [];
    for (let i = 0; i < binding_relations.length; i++) {
      let source:any;
      let target:any;
      try {
        source = binding_relations[i].source;
        target = binding_relations[i].target;
        if (source.getAttribute('selected') == 'true') { // only selected concrete features are analyzed
          const label = target.getAttribute('label');
          const clon_id = target.getId();
          const id = clon_id.replace('clon', '');
          const inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
          for (let j = 0; j < inco_egdes.length; j++) {
            const file_source = inco_egdes[j].source;
            if (file_source.getAttribute('type') != 'custom') {
              const data = {
                component_folder: '', ID: '', filename: '', destination: '',
              };
              data.component_folder = label;
              data.ID = file_source.getAttribute('label');
              data.filename = file_source.getAttribute('filename');
              if (file_source.getAttribute('type') == 'file') {
                data.destination = file_source.getAttribute('destination');
              } else {
                data.destination == '';
              }
              files.push(data);
            }
          }
        }
      } catch {
        // remove strange generated rels
        const cells = [];
        cells[0] = binding_relations[i];
        graph.removeCells(cells);
      }
    }

    const complete_data = [];
    complete_data[0] = files;

    return complete_data;
  }
}
