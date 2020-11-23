export class Project {
  private name:string;
  private xml:string;
  private availableModels:string[];
  
  public constructor(name:string, xml:string, availableModels:string[]) {
      this.name = name;
      this.xml = xml;
      this.availableModels = availableModels;
  }

  public getName(){
    return this.name;
  }

  public getXml(){
    return this.xml;
  }

  public getAvailableModels(){
    return this.availableModels;
  }

  public static objectToThisClass(objects:any){
    let objectsToReturn = [];
    for (let i = 0; i < objects.length; i++) {
      let object = new Project(objects[i].name, objects[i].xml, objects[i].availableModels);
      objectsToReturn.push(object);
    }
    return objectsToReturn;
  }

  public static checkIfProjectExists(projects:any, newName:any){
    for (let i = 0; i < projects.length; i++) {
      if(projects[i].getName() == newName){
        return true;
      }
    }
    return false;
  }

  public static getProjectByName(projects:any, name:any){
    for (let i = 0; i < projects.length; i++) {
      if(projects[i].getName() == name){
        return projects[i];
      }
    }
    return null;
  }

  public static getProjectModelsByName(projects:any, name:any){
    for (let i = 0; i < projects.length; i++) {
      if(projects[i].getName() == name){
        return projects[i].getAvailableModels();
      }
    }
    return null;
  }
}