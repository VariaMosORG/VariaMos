export class ConfigApp {
  private modelAreaHeight:string;
  private sidebarBackgroundColor:string;
  
  public constructor(modelAreaHeight:string, sidebarBackgroundColor:string) {
      this.modelAreaHeight = modelAreaHeight;
      this.sidebarBackgroundColor = sidebarBackgroundColor;
  }

  public getModelAreaHeight(){
    return this.modelAreaHeight;
  }

  public getSidebarBackgroundColor(){
    return this.sidebarBackgroundColor;
  }

  public static objectToThisClass(dataJson:any){
    let object = new ConfigApp(dataJson.modelAreaHeight, dataJson.sidebarBackgroundColor);
    return object;
  }
}