import { Component, OnDestroy } from '@angular/core';
import { IRumine, Rumine } from '../services/rumine';
import { Activity } from '../services/activity';
import { DateRange, Season } from '../services/ranges';
import { History } from '../services/history';

@Component({
  selector: 'legacy-main',
  standalone: false,
  templateUrl: './legacy-main.component.html',
  styleUrl: './legacy-main.component.css'
})
export class LegacyMainComponent{
    readonly rumine : IRumine;
    tab : number = 1;


    public get LastActivity() : Activity{
      return this.rumine.history.last.activity;
    }
    public DateNow() : string{
      return DateRange.Format(this.rumine.nowDate, 'dd MMMM yyyy');
    }
    public EventsLog() : string{
      return History.LogFor(this.rumine.history.AllEvents());
    }
    public ActivityLog() : string{
      let log : string = "";
      const stat = this.rumine.history.GroupedByMonth();
      if(stat.length === 0){
        return "Пока ничего не произошло...";
      }
      let season : Season = DateRange.Season(stat[0].date);

      stat.forEach(pair => {
        const newSeason = DateRange.Season(pair.date);
        if(newSeason !== season){
          season = newSeason;
          log = log.concat("Наступил новый сезон - " + season + "!\n");
        }
        log = log.concat(`За ${DateRange.Format(pair.date, "MMMM yyyy")} произошло ${History.AllEventsFor(pair.stories).length} событий, в среднем ${Math.round(History.PagesAverageFor(pair.stories) * 10) / 10} страниц\n`);

      });
      return log;
    }

    constructor(rumine : Rumine){
      this.rumine = rumine;
    }


    public StartSimulation(){
      this.rumine.TogglePause();
    }




    public SetTab(tab : number){
      this.tab = tab;
    }
    public IsActive(tab : number) : boolean{
      return tab === this.tab;
    }
}