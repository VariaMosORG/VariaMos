/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ComponentFunctions {
  public static customize(graph:any) {
    // collect the information of the components and files to be customized
    const bindingRoot = graph.getModel().getCell('binding_feature_component');
    const bindingRelations = graph.getModel().getChildEdges(bindingRoot);

    const customizations = [];

    for (let i = 0; i < bindingRelations.length; i++) {
      const { source } = bindingRelations[i];
      const { target } = bindingRelations[i];
      if (source.getAttribute('selected') == 'true') { // only selected concrete features are analyzed
        const label = target.getAttribute('label');
        const clonId = target.getId();
        const id = clonId.replace('clon', '');
        const incoEgdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
        for (let j = 0; j < incoEgdes.length; j++) {
          const fileSource = incoEgdes[j].source;
          if (fileSource.getAttribute('type') == 'custom') {
            customizations.push(label);
          }
        }
      }
    }

    return customizations;
  }

  public static verify(graph:any) {
    // collect the information of the components and files to be derived
    const bindingRoot = graph.getModel().getCell('binding_feature_component');
    const bindingRelations = graph.getModel().getChildEdges(bindingRoot);

    const destinations = [];

    for (let i = 0; i < bindingRelations.length; i++) {
      const { source } = bindingRelations[i];
      const { target } = bindingRelations[i];
      if (source.getAttribute('selected') == 'true') { // only selected concrete features are analyzed
        const label = target.getAttribute('label');
        const clonId = target.getId();
        const id = clonId.replace('clon', '');
        const incoEgdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
        for (let j = 0; j < incoEgdes.length; j++) {
          const fileSource = incoEgdes[j].source;
          if (fileSource.getAttribute('type') == 'file') {
            const data = { destination: '' };
            data.destination = fileSource.getAttribute('destination');
            destinations.push(data.destination);
          }
        }
      }
    }

    return destinations;
  }

  public static execute(graph:any) {
    // collect the information of the components and files to be derived
    const bindingRoot = graph.getModel().getCell('binding_feature_component');
    const bindingRelations = graph.getModel().getChildEdges(bindingRoot);
    const files = [];
    for (let i = 0; i < bindingRelations.length; i++) {
      let source:any;
      let target:any;
      try {
        source = bindingRelations[i].source;
        target = bindingRelations[i].target;
        if (source.getAttribute('selected') == 'true') { // only selected concrete features are analyzed
          const label = target.getAttribute('label');
          const clonId = target.getId();
          const id = clonId.replace('clon', '');
          const incoEgdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(id));
          for (let j = 0; j < incoEgdes.length; j++) {
            const fileSource = incoEgdes[j].source;
            if (fileSource.getAttribute('type') != 'custom') {
              const data = {
                component_folder: '', ID: '', filename: '', destination: '',
              };
              data.component_folder = label;
              data.ID = fileSource.getAttribute('label');
              data.filename = fileSource.getAttribute('filename');
              if (fileSource.getAttribute('type') == 'file') {
                data.destination = fileSource.getAttribute('destination');
              } else {
                data.destination = '';
              }
              files.push(data);
            }
          }
        }
      } catch {
        // remove strange generated rels
        const cells = [];
        cells[0] = bindingRelations[i];
        graph.removeCells(cells);
      }
    }

    const completeData = [];
    completeData[0] = files;

    return completeData;
  }
}
