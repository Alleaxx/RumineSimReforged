import { Random } from "./random";
import { UserCollection} from "./user";
import { IUserCreator, LegacyUserCreator } from "./userConfig";

import { GroupsCollection, IGroupsCollection } from "./group";
import { IGroupsCreator, LegacyGroupCreator } from "./groupConfig";
import { IActivityCreator, LegacyActivityCreator } from "./activityConfig";
import { IEventCreator } from "./eventLegacy";
import { LegacyEvents } from "./eventLegacy";
import { Story } from "./story";
import { IStoryTeller, DayStoryTeller } from "./storyteller";
import { History } from "./history";
import { Injectable } from "@angular/core";



export interface IRumine{
    foundDate : Date;
    nowDate : Date;
    random : Random;


    paused : boolean;
    TogglePause() : void;

    users : UserCollection;
    groups : IGroupsCollection,
    history : History;
    EventChance() : number;

    eventsCreator : IEventCreator;
    activityCreator : IActivityCreator;

    SetConfig(groupsCreator : IGroupsCreator, activityCreator : IActivityCreator, eventsCreator : IEventCreator, userCreator : IUserCreator, storyteller : IStoryTeller) : void;
    ClearData() : void;
    
    TellStories(times : number) : void;
}
@Injectable()
export class Rumine implements IRumine{
    foundDate : Date;
    startDate : Date;
    
    nowDate : Date;

    private speed : number;
    random : Random;
    paused : boolean;

    private groupCreator : IGroupsCreator;
    groups : IGroupsCollection;

    private userCreator : IUserCreator;
    users : UserCollection;

    private storyTeller : IStoryTeller;
    eventsCreator : IEventCreator;
    activityCreator : IActivityCreator;
    history : History;

    constructor(){
        this.speed = 250;
        this.paused = true;

        const dates : IDatesCreator = new ClassicDates();
        this.foundDate = dates.FoundDate();
        this.startDate = dates.StartDate();
        this.nowDate = this.startDate;
        this.random = new Random();
        this.SetDefaultConfig();
    }
    

    //Генератор пользователей (какие пользователи наличествуют)
    //Генератор истории (как идет и развивается)
    //Генератор групп (какие группы есть)
    //Генератор активности (как генерируется)
    //Генератор событий (какие события происходит)
    private SetDefaultConfig(){
        const groupConfig : IGroupsCreator = new LegacyGroupCreator();
        const eventsConfig : IEventCreator = new LegacyEvents(this.random);
        const activityConfig : IActivityCreator = new LegacyActivityCreator(this.random);
        const userConfig : IUserCreator = new LegacyUserCreator(this.random, this.foundDate);
        const dayStoryConfig : IStoryTeller = new DayStoryTeller(this);
        this.SetConfig(
            groupConfig, activityConfig, eventsConfig, userConfig, dayStoryConfig
        );
    }

    public SetConfig(groupsCreator : IGroupsCreator, activityCreator : IActivityCreator, eventsCreator : IEventCreator, userCreator : IUserCreator, storyteller : IStoryTeller){
        this.activityCreator = activityCreator
        this.eventsCreator = eventsCreator;
        this.storyTeller = storyteller;
        this.groupCreator = groupsCreator;
        this.userCreator = userCreator;

        this.CreateContent();
    }
    private CreateContent(){
        this.history = new History();
        this.groups = new GroupsCollection(this.groupCreator.Create(this.random));
        this.users = new UserCollection(this.userCreator.CreateList(this.nowDate, this.groups));
    }
    public ClearData(){
        const dates : IDatesCreator = new ClassicDates();
        this.startDate = dates.StartDate();
        this.nowDate = this.startDate;

        this.history = new History();
        this.groups = new GroupsCollection({ groups: [], changer: undefined });
        this.users = new UserCollection([]);
    }



    public TellStories(times : number = 4){
        for (let i = 0; i < times; i++) {
            this.TellStory();
        }
    }
    private TellStory(){
        const story : Story = this.storyTeller.CreateStory();
        this.history.Add(story);
        story.Confirm();
        this.nowDate = story.dates.end;
    }

    
    public EventChance() : number{
        return this.eventsCreator.ChanceFor(this.history.last.activity.pages);
    }

    public TogglePause(){   
      let tick : () => void;
      tick = () => {
        this.TellStories(1);
        if(!this.paused){
          setTimeout(tick, this.speed);
        }
      }

      this.paused = !this.paused;
      if(!this.paused){
        tick();   
      } 
    }
}

export interface IRsConfig{

}

export interface IDatesCreator{
    FoundDate() : Date;
    StartDate() : Date;
}
export class ClassicDates implements IDatesCreator, IRsConfig{
    found : Date;
    start : Date;
    
    constructor(found : Date = new Date(2011, 7, 27), start : Date = new Date(2013, 7, 19)) {
        this.found = found;
        this.start = start;
    }
    public FoundDate() : Date{
        return this.found;
    }
    public StartDate() : Date{
        return this.start;
    }
}

    

