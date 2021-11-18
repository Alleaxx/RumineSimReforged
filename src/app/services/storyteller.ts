import { IRumine, IRsConfig } from "./rumine";
import { Random, Chanced } from "./random";
import { IEventCreator } from "./eventLegacy";
import { ActivityMod } from "./activity";
import { IActivityCreator } from "./activityConfig";
import { User } from "./user";
import { Story, StoryContext } from "./story";
import { DateRange } from "./ranges";

//Рассказать историю
export interface IStoryTeller{
    CreateStory() : Story;
}

//Создание истории за период, определение активных пользователей и активности
abstract class StoryTeller implements IStoryTeller, IRsConfig {
    context : IRumine;
    random : Random;
    timeDifference : number;

    private get eventsCreator() : IEventCreator{
        return this.context.eventsCreator;
    }
    private get activityCreator() : IActivityCreator{
        return this.context.activityCreator;
    }
    chanceToOld : number = 0.006;
    oldness : number = 0;

    constructor(context : IRumine) {
        this.context = context;
        this.random = context.random;
    }
    public CreateStory() : Story{
        const dateRange : DateRange = this.GetDaterange();
        const prevActivity : number = this.context.history.last.activity.pages;

        const usersActive = this.CreateActiveUsers();
        const activityMod = new ActivityMod(dateRange, this.context.history.Influence(), this.oldness);
        const activity = this.activityCreator.Generate(dateRange, prevActivity, activityMod);
        const storyContext : StoryContext  = new StoryContext(dateRange, usersActive, activity);

        const events = this.eventsCreator.Create(storyContext, this.context.groups);
        this.OnStoryCreated();
        return new Story(dateRange, usersActive, events, activity);
    }
    private GetDaterange() : DateRange{
        const now = this.context.nowDate;
        const newDay : Date = this.NewDate();
        const dateRange : DateRange = new DateRange(now, newDay);
        return dateRange;
    }
    
    private NewDate() : Date{
        const timeNow : number = this.context.nowDate.getTime();
        const timeNew : number = timeNow + this.timeDifference;
        return new Date(timeNew);
    }

    protected CreateActiveUsers() : User[]{
        const usersCanBeActive : Chanced<User>[] = this.context.users.collection.map(u => new Chanced<User>(u.chanceToActive, u));
        const usersActive = this.random.ElementsChanced(usersCanBeActive);
        return usersActive;
    }
    protected OnStoryCreated(){

    }
}
//История за день
export class DayStoryTeller extends StoryTeller{
    constructor(context : IRumine){
        super(context);
        this.timeDifference = 1000 * 60 * 60 * 24;
    }
    protected OnStoryCreated(){
        const yearDiff = this.context.nowDate.getFullYear() - this.context.foundDate.getFullYear()
        const chance : number = Math.max(0.006 - (yearDiff * 0.0005), 0.0002);
        if(this.random.CheckChance(chance)){
            this.oldness++;
        }
    }
}
