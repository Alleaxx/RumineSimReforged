import { Random } from "./random";
import { DateRange, Season } from "./ranges";
import { IRsConfig } from "./rumine";
import { Activity, ActivityMod } from "./activity";


export interface IActivityCreator{
    Generate(dates : DateRange, prevPages : number, mod : ActivityMod) : Activity;
}
export class LegacyActivityCreator implements IActivityCreator, IRsConfig{
    private random : Random;
    constructor(random : Random) {
        this.random = random;
    }
    public Generate(dates : DateRange, prevPages : number, mod : ActivityMod) : Activity{
        let lampa : number = 0;
        let pages : number = 0;

        const rndIndex : number = this.random.CheckChance(0.25) ? 2 : 1;
        const fall : boolean = this.random.CheckChance(0.2);
        const constMod : number = 0.01;

        let inc : number = 0;
        if(fall){
            inc = -(prevPages * this.random.Next(1, mod.down * rndIndex) * constMod * (2 - mod.month)); 
        }
        else{
            inc = prevPages * this.random.Next(1, mod.up * rndIndex) * constMod * mod.month;
        }
        pages = prevPages + inc;
        const activity = new Activity(dates, mod, pages, prevPages, lampa);

        this.CountBigActivity(activity);
        this.CountSmallActivity(activity);
        this.CountSameActivity(activity);
        this.CountSummary(activity);
        return activity;
    }

    private CountBigActivity(activity : Activity){
        if(activity.pages >= 65){
            activity.lampa++;
            activity.pages *= 0.95;
            if(activity.pages > 100){
                activity.pages *= 0.7;
            }
        }
    }
    private CountSmallActivity(activity : Activity){
        if(activity.pages < 3){
            activity.pages += this.random.NextInt(0, 4);
        }
    }
    private CountSameActivity(activity : Activity){
        if(activity.pages === activity.prevPages){
            activity.pages *= this.random.Next(9,12) * 0.1;
        }
    }
    private CountSummary(activity : Activity){
        activity.lampa += activity.pages * 0.01;
        activity.pages = Math.floor(activity.pages * 10) / 10;
    }
}
