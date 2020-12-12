/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */

import { Vue } from 'vue-class-component';

export default class GlobalVueFunctions extends Vue {
    //returns the model name in a beauty way
    public getBeautyModelName(name:any){
        if(name.includes("_")){
            let parts = name.split("_");
            let completeName = "";
            for (let i = 0; i < parts.length; i++) {
                completeName = completeName + parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
            }
            completeName = completeName + "Model";
            return completeName;
        }else{
            return name.charAt(0).toUpperCase() + name.slice(1) + "Model";
        }
    }
}