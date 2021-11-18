import { StoryContext } from "./story";
import { Random } from "./random";
import { Event, EventTypes } from "./event";
import { Chanced } from "./random";


export class EventOption {
    private eve : Event;
    private context : StoryContext;

    chance : number;
    condition : (eve : Event, context : StoryContext) => boolean;
    simpleCondition : () => boolean;
    options : EventOption[];
    preAction : () => boolean;

    private eveName : string;
    private eveDescr : string;
    private eveType : EventTypes | null;
    private eveAction : () => void;
    private eveInfluence : number = 0;

    constructor(chance : number = 1) {
        this.eveType = null;
        this.chance = chance;
        this.condition = (eve, context) => true;   
        this.preAction = () => true; 
        this.options = [];
        this.eveAction = () => {};
    }


    //Настройка опции
    public SetCheck(condition : (eve : Event, context : StoryContext) => boolean) : EventOption{
        this.condition = condition;
        return this;
    }
    public SetPreAction(action : () => boolean) : EventOption{
        this.preAction = action;
        return this;
    }
    public AddOptions(...options : EventOption[]) : EventOption{
        options.forEach(option => this.options.push(option));
        return this;
    }

    //Настройка события
    public OfType(type : EventTypes) : EventOption{
        this.eveType = type;
        return this;
    }
    public Info(influence : number, name : string, desciption : string, action : null | (() => void) = null) : EventOption{
        this.eveName = name;
        this.eveDescr = desciption;
        this.eveInfluence = influence;
        if(action !== null){
            this.eveAction = action;
        }
        return this;
    }


    //Совершаем действия и проверяем под-действия по цепочке
    public Invoke(random : Random, eve : Event, context : StoryContext){
        this.SetContext(eve, context);
        this.ModifyEvent();
        const fitOptions : EventOption[] = this.options.filter(o => o.condition(eve, context));
        if(fitOptions.length > 0){
            const chanced : Chanced<EventOption>[] = fitOptions.map(o => new Chanced<EventOption>(o.chance, o));
            const exe : EventOption | null = random.ElementChanced(chanced);
            exe?.Invoke(random, eve, context);
        }
    }
    private SetContext(eve : Event, context : StoryContext) : EventOption{
        this.eve = eve;
        this.context = context;
        return this;
    }
    private ModifyEvent(){
        this.eve.SetInfo(this.eveName, this.eveDescr);
        if(this.eveType !== null){
            this.eve.SetType(this.eveType);
        }
        this.eve.SetInfluence(this.eveInfluence);
        this.eve.SetAction(this.eveAction);
    }
}