import { Component } from '@angular/core';
import { Event } from '../services/event';
import { IRumine, Rumine } from '../services/rumine';
import { History } from '../services/history';
import { User, UserCate, UserCollection } from '../services/user';

@Component({
  selector: 'legacy-users',
  templateUrl: './legacy-users.component.html',
  styleUrls: [ './legacy-users.component.css']
})
export class LegacyUsersComponent {
  tabInfo : number = 1;
  tabMoreInfo : number = 1;

  users : UserCollection;

  userSelected : User;
  search : string = "";
  category : UserCate;
  categories : Set<UserCate>

  userEvents : Event[];
  eventSelected : Event | null = null;
  eventsLog : string;

  public Users() : User[]{
    return this.users.collection.filter(u => u.CreateCategories().includes(this.category) && u.nick.includes(this.search));
  }
  public UserEvents() : Event[]{
    return this.rumine.history.AllEvents().filter(e => e.creator === this.userSelected);
  }
  public EventsLog() : string{
    return History.LogFor(this.UserEvents());
  }

  readonly rumine : IRumine;

  constructor(rumine : Rumine){
    this.rumine = rumine;
    this.users = rumine.users;
    this.category = UserCate.All;
    this.categories = new Set<UserCate>([
      UserCate.All, UserCate.Usual, UserCate.Moders, UserCate.Raks, UserCate.Adeq, UserCate.Active, UserCate.Left, UserCate.Banned, UserCate.Healthy
    ]);
    this.userSelected = this.users.collection[0];
  }

  public SetInfoTab(tab: number){
    this.tabInfo = tab;
  }
  public SetMoreTab(tab: number){
    this.tabMoreInfo = tab;
  }
  public SetUser(user: User){
    this.userSelected = user;
  }
  public SetEvent(event: Event){
    this.eventSelected = event;
  }

  public IsInfoActive(tab : number) : boolean{
    return tab === this.tabInfo;
  }
  public IsMoreActive(tab : number) : boolean{
    return tab === this.tabMoreInfo;
  }
  public IsUserActive(user : User) : boolean{
    return user === this.userSelected;
  }
  public IsEventActive(event : Event) : boolean{
    return event === this.eventSelected;
  }
}