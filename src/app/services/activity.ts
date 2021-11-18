import { Random } from "./random";
import { DateRange, Season } from "./ranges";
import { IRsConfig } from "./rumine";


export class Activity{
    private dates : DateRange;

    prevPages : number;
    pages : number;
    lampa : number;
    mod : ActivityMod;
    
    //Написанные сообщения должны распределяться по активным пользователям


    constructor(dates : DateRange, mod : ActivityMod, pages : number, prevPages : number, lampa : number){
        this.dates = dates;
        this.pages = pages;
        this.lampa = lampa;
        this.prevPages = prevPages;
        this.mod = mod;
    }

}
export class ActivityMod{
    month : number;
    season : number | undefined;

    up : number;
    down : number;      //Каждые пол-года год увеличивается

    constructor(dates : DateRange, influence : number, down : number){
        let mods = new Map<Season, number>();
        mods.set(Season.Winter, 0.9);
        mods.set(Season.Spring, 1.1);
        mods.set(Season.Summer, 1.25);
        mods.set(Season.Autumn, 0.7);


        this.month = 1 + influence;
        this.season = mods.get(dates.Season());
        this.up = 6;
        this.down = 12 + down;
    }
}