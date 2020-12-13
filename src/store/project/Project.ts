/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class Project {
  private name:string;

  private xml:string;

  private availableModels:string[];

  public constructor(name:string, xml:string, availableModels:string[]) {
    this.name = name;
    this.xml = xml;
    this.availableModels = availableModels;
  }

  public getName() {
    return this.name;
  }

  public getXml() {
    return this.xml;
  }

  public getAvailableModels() {
    return this.availableModels;
  }

  public setXml(xml:string) {
    this.xml = xml;
  }

  public static objectToThisClass(objects:any) {
    const objectsToReturn = [];
    for (let i = 0; i < objects.length; i++) {
      const object = new Project(objects[i].name, objects[i].xml, objects[i].availableModels);
      objectsToReturn.push(object);
    }
    return objectsToReturn;
  }

  public static checkIfProjectExists(projects:any, newName:any) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].getName() == newName) {
        return true;
      }
    }
    return false;
  }

  public static getProjectIndexByName(projects:any, name:any) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].getName() == name) {
        return i;
      }
    }
    return -1;
  }

  public static getProjectByName(projects:any, name:any) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].getName() == name) {
        return projects[i];
      }
    }
    return null;
  }

  public static getProjectModelsByName(projects:any, name:any) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].getName() == name) {
        return projects[i].getAvailableModels();
      }
    }
    return null;
  }
}
