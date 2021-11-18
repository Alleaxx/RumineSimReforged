import { Component } from '@angular/core';
import { Event } from '../services/event';
import { IRumine, Rumine } from '../services/rumine';
import { History } from '../services/history';
import { User, UserCate, UserCollection } from '../services/user';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: [ './users.component.css']
})
export class UsersComponent {
  readonly rumine : IRumine;
  users : UserCollection;

  public Users() : User[]{
    return this.users.collection;
  }

  constructor(rumine : Rumine){
    this.rumine = rumine;
    this.users = rumine.users;
  }
}