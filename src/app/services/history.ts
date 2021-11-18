import { Activity, ActivityMod } from "./activity";
import { Event, EventTypes } from "./event";
import { Story } from "./story";
import { DateRange } from "./ranges";

export type StoryStat = { date: Date, stories : Story[] }
//Накопленная история
export class History{
    passed : Story[] = [];
    last : Story;

    //Статистика
    statistics : Map<Date, number>
    //Количество учитываемых событий для активности
    countEvents : number;

    constructor(){
        this.countEvents = 30;

        const defaultRange : DateRange = new DateRange(new Date(), new Date());
        this.last = new Story(
            defaultRange,
            [],
            [],
            new Activity(defaultRange, new ActivityMod(defaultRange, 0, 0), 10, 10, 0)
        );
    }

    public Add(story : Story){
        this.passed.push(story);
        this.last = story;
    }



    public AllEvents() : Event[]{
        return History.AllEventsFor(this.passed);
    }
    public PagesSum() : number{
        return History.PagesSumFor(this.passed);
    }
    public PagesAverage() : number{
        return History.PagesAverageFor(this.passed);
    }
    public Influence() : number{
        return History.InfluenceFor(this.passed, this.countEvents);
    }

    public GroupedByMonth() : StoryStat[]{
        let grouped : StoryStat[] = [];
        const keys : string[] = this.passed.map(s => s.dates.MonthYear() );
        const uniqueKeys : Set<string> = new Set(keys);
        uniqueKeys.forEach(key => {
            const elements = this.passed.filter(s => s.dates.MonthYear() === key);
            grouped.push( { date: elements[0].dates.start, stories : elements } );
        });
        return grouped;
    }


    public static AllCategoriesFor(events : Event[]) : Set<EventTypes>{
        return new Set([EventTypes.All].concat(events.map(e => e.type)))
    }
    //Статистика по указанным историям
    public static AllEventsFor(stories : Story[]) : Event[]{
        if(stories.length === 0){
            return [];
        }
        else{
            return stories.map(p => p.events).reduce((now, exist) => exist.concat(now), []);
        }
    }
    public static PagesSumFor(stories : Story[]) : number{
        return stories.map(p => p.activity.pages).reduce((p : number, sum : number) => sum += p, 0);
    }
    public static PagesAverageFor(stories : Story[]) : number{
        return this.PagesSumFor(stories) / stories.length;     
    }
    public static InfluenceFor(stories : Story[], countEvents : number) : number{
        const allEvents : Event[] = this.AllEventsFor(stories);
        if(allEvents.length === 0){
            return 0;
        }
        const end = allEvents.length;
        const start = Math.max(0, end - countEvents);
        const influenceEvents = allEvents.slice(start, end);
        const result = influenceEvents.map(e => e.influence).reduce((prev, now) => now += prev, 0);
        return result;
    }
    public static LogFor(events : Event[]) : string{
        return events.length > 0 ? events.map(eve => {
            return `- ${eve.dates.Format()} ${eve.description}`;
        }).join('\n') : "Пока ничего не произошло...";
    }
}