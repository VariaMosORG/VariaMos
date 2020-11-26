export class ConfigApp {
  private modelAreaHeight:string;
  private sidebarBackgroundColor:string;
  private displayTopBar:string;
  
  public constructor(modelAreaHeight:string, sidebarBackgroundColor:string, displayTopBar:string) {
      this.modelAreaHeight = modelAreaHeight;
      this.sidebarBackgroundColor = sidebarBackgroundColor;
      this.displayTopBar = displayTopBar;
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

  public static objectToThisClass(dataJson:any){
    let object = new ConfigApp(dataJson.modelAreaHeight, dataJson.sidebarBackgroundColor, 
      dataJson.displayTopBar);
    return object;
  }
}