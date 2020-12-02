export class ConfigApp {
  private modelAreaHeight:string;
  private sidebarBackgroundColor:string;
  private displayTopBar:string;
  private installedModels:any;
  
  public constructor(modelAreaHeight:string, sidebarBackgroundColor:string, displayTopBar:string, installedModels:any) {
      this.modelAreaHeight = modelAreaHeight;
      this.sidebarBackgroundColor = sidebarBackgroundColor;
      this.displayTopBar = displayTopBar;
      this.installedModels = installedModels;
  }

  public getModelAreaHeight(){
    return this.modelAreaHeight;
  }

  public getSidebarBackgroundColor(){
    return this.sidebarBackgroundColor;
  }

  public getDisplayTopBar(){
    return this.displayTopBar;
  }

  public getInstalledModels(){
    return this.installedModels;
  }

  public setInstalledModels(installedModels:string[]){
    this.installedModels = installedModels;
  }

  public static objectToThisClass(dataJson:any){
    let object = new ConfigApp(dataJson.modelAreaHeight, dataJson.sidebarBackgroundColor, 
      dataJson.displayTopBar, dataJson.installedModels);
    return object;
  }
}