import { Activity } from "./activity";
import { Event } from "./event";
import { User } from "./user";
import { DateRange } from "./ranges";






//Период с событиями и написанными сообщениями
export class Story{
    name : string;
    dates : DateRange;

    users : User[];
    events : Event[];
    activity : Activity;

    confirmed : boolean;
    constructor(dates: DateRange, users : User[], events : Event[], activity : Activity){
        this.dates = dates;
        this.users = users;
        this.events = events;
        this.activity = activity;
    }

    public Confirm(){
        if(!this.confirmed){
            this.confirmed = true;
            this.events.forEach(e => {
                e.action();
            })
            //Добавляем к месячному модификатору влияние события
            //Распределяем активность по юзерам
        }
    }
}

//Контекст для истории
export class StoryContext {
    dates : DateRange;
    active : User[];
    activity : Activity;

    constructor(dates : DateRange, active: User[], activity : Activity) {
        this.dates = dates;
        this.active = active;
        this.activity = activity;
    }
}