/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
export class ConfigApp {
  private modelAreaHeight:string;

  private sidebarBackgroundColor:string;

  private displayTopBar:string;

  private installedModels:any;

  private customConfig:string;

  public constructor(modelAreaHeight:string, sidebarBackgroundColor:string,
    displayTopBar:string, installedModels:any, customConfig:string) {
    this.modelAreaHeight = modelAreaHeight;
    this.sidebarBackgroundColor = sidebarBackgroundColor;
    this.displayTopBar = displayTopBar;
    this.installedModels = installedModels;
    this.customConfig = customConfig;
  }

  public getModelAreaHeight() {
    return this.modelAreaHeight;
  }

  public getSidebarBackgroundColor() {
    return this.sidebarBackgroundColor;
  }

  public getDisplayTopBar() {
    return this.displayTopBar;
  }

  public getInstalledModels() {
    return this.installedModels;
  }

  public getCustomConfig() {
    return this.customConfig;
  }

  public getCustomConfigAsJsonObject() {
    const jsonObject = JSON.parse(this.customConfig);
    return jsonObject;
  }

  public setInstalledModels(installedModels:string[]) {
    this.installedModels = installedModels;
  }

  public static objectToThisClass(dataJson:any) {
    const object = new ConfigApp(dataJson.modelAreaHeight, dataJson.sidebarBackgroundColor,
      dataJson.displayTopBar, dataJson.installedModels, dataJson.customConfig);
    return object;
  }
}
