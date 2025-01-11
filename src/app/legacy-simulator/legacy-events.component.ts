import { Component } from '@angular/core';
import { IRumine, Rumine } from '../services/rumine';
import { Event, EventTypes } from '../services/event';

@Component({
  selector: 'legacy-events',
  standalone: false,
  templateUrl: './legacy-events.component.html',
  styleUrl: './legacy-events.component.css'
})
export class LegacyEventsComponent {
  tab : number = 1;

  public readonly rumine : IRumine;

  public events : Event[];
  public currentEvent : Event;
  public categories : Set<EventTypes>;
  public category : EventTypes;


  public get Category() : EventTypes{
    return this.category;
  }
  public set Category(value : EventTypes){
    this.category = value;
    this.UpdateEvents();
  }


  constructor(rumine : Rumine){
    this.rumine = rumine;
    this.category = EventTypes.All;

    const allEvents : Event[] = rumine.history.AllEvents();
    this.categories = new Set([EventTypes.All].concat(allEvents.map(e => e.type)));
    this.UpdateEvents();
    this.currentEvent = this.events[this.events.length - 1];
  }
  private UpdateEvents(){
    if(this.category === EventTypes.All){
      this.events = this.rumine.history.AllEvents();
    }
    else{
      this.events = this.rumine.history.AllEvents().filter(e => e.type === this.category);
    }
  }



  public SetEvent(eve : Event){
    this.currentEvent = eve;
  }
  public IsActiveEvent(eve : Event) : boolean{
    return this.currentEvent === eve;
  }
  public IsActive(tab : number) : boolean{
    return tab === this.tab;
  }
}