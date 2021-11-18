import { Component } from '@angular/core';
import { IRumine, Rumine } from '../services/rumine';
import { Activity } from '../services/activity';
import { DateRange, Season } from '../services/ranges';
import { History } from '../services/history';
import { Story } from '../services/story';
import { EventTypes } from '../services/event';
import { Event } from '../services/event';

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: [ './activity.component.css']
})
export class ActivityComponent {
    readonly rumine : IRumine;
    tab : number = 1;
    amount : number = 30;
    info : string = "";
    infoVisibility : number = 0;

    public get LastActivity() : Activity{
      return this.rumine.history.last.activity;
    }
    public DateNow() : string{
      return DateRange.Format(this.rumine.nowDate, 'dd MMMM yyyy');
    }

    constructor(rumine : Rumine){
      this.rumine = rumine;
      
    }

    private inProgress : boolean = false;
    public StartSimulation(){
      const stories : number = this.rumine.history.passed.length;
      const events : number = this.rumine.history.AllEvents().length;

      this.rumine.TellStories(this.amount);

      const storiesDiff = this.rumine.history.passed.length - stories;
      const eventsDiff = this.rumine.history.AllEvents().length - events;      
      this.info = `+${storiesDiff} историй, +${eventsDiff} событий`;
      this.infoVisibility = 1;
      if(!this.inProgress){
        this.inProgress  = true;
        setTimeout(() => {
          this.infoVisibility = 0;
          this.inProgress = false;
        }, 2000);
      }
    }
    public ToggleSimulation(){
      this.rumine.TogglePause();
    }

    
    public SetTab(tab : number){
      this.tab = tab;
    }
    public IsActive(tab : number) : boolean{
      return tab === this.tab;
    }

    public PagesSumFor(stories : Story[]) : number{
      return History.PagesSumFor(stories);
    }
    public EventsAmountFor(stories : Story[]) : number{
      return History.AllEventsFor(stories).length;
    }



    public search : string = "";
    public category : EventTypes = EventTypes.All;
    public EventCates() : Set<EventTypes>{
      return new Set([EventTypes.All].concat(this.rumine.history.AllEvents().map(e => e.type)));
    }
    public ShowedEvents() : Event[]{
      const filter = (eve : Event) => {
        if(!eve.description.includes(this.search)){
          return false;
        }
        if(this.category !== EventTypes.All && eve.type !== this.category){
          return false;
        }
        return true;
      };
      return this.rumine.history.AllEvents().filter(e => filter(e));
    }
}