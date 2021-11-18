import { User } from "./user";
import { DateRange } from "./ranges";

export class Event{
    dates : DateRange;
    creator : User;
    
    name : string;
    description : string;
    type : EventTypes;

    influence : number;

    action : () => void;

    static idCounter : number = 0;

    constructor(creator : User, dates: DateRange){
        this.name = "Событие " + creator;
        this.description = "Нет";
        this.influence = 0;
        Event.idCounter++;


        this.creator = creator;
        this.dates = dates;
        this.action = () => {};
    }

    public SetType(type : EventTypes) : Event{
        this.type = type;
        return this;
    }
    public SetInfo(name : string, description : string) : Event{
        this.name = `${name} ${Event.idCounter}`;
        this.description = description;
        return this;
    }
    public SetInfluence(influence : number) : Event{
        this.influence = influence;
        return this;
    }
    public SetAction(action : () => void) : Event{
        if(action !== null){
            this.action = action;
        }
        return this;
    }
}
export enum EventTypes{
    All = "Всё",
    Undefined = "Неопределено",
    MadModer = "Буйство модеров",
    UserChange = "Изменение юзера",
    Celebration = "Празднования",
    Group = "Группы",
    UserLeave = "Уход пользователя",
    Memories  = "Воспоминания",
    InactiveUser  = "Неактивный юзер",
    UserActive  = "Активный юзер",
    Ban = "Баны",
    Unban = "Разбаны",
    UserMisc = "Разное",
    Newspaper = "Газета"
}
