import { Component } from '@angular/core';
import { ClassicDates, IDatesCreator, IRumine, Rumine } from './services/rumine';
import { IEventCreator, KnanepNewsEvents } from './services/eventLegacy';
import { IActivityCreator, LegacyActivityCreator } from './services/activityConfig';
import { IUserCreator, LegacyUserCreator } from './services/userConfig';
import { IStoryTeller } from './services/storyteller';
import { LegacyEvents } from './services/eventLegacy';
import { DayStoryTeller } from './services/storyteller';
import { IGroupsCreator, LegacyGroupCreator } from './services/groupConfig';
import { Random } from './services/random';



class ConfigInfo<T> {
  name : string;
  description : string[];
  config : T;

  constructor(name : string, config : T, ...descr : string[]){
    this.name = name;
    this.description = descr;
    this.config = config;
  }
}

@Component({
  selector: 'options',
  standalone: false,
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
  random : Random;
  rumine : IRumine
  
  groupConfig : ConfigInfo<IGroupsCreator>;
  eventsConfig : ConfigInfo<IEventCreator>;
  activityConfig : ConfigInfo<IActivityCreator>;
  userConfig : ConfigInfo<IUserCreator>;
  storyConfig : ConfigInfo<IStoryTeller>;
  datesConfig : ConfigInfo<IDatesCreator>;

  groupConfigs : ConfigInfo<IGroupsCreator>[];
  eventsConfigs : ConfigInfo<IEventCreator>[];
  activityConfigs : ConfigInfo<IActivityCreator>[];
  userConfigs : ConfigInfo<IUserCreator>[];
  storyConfigs : ConfigInfo<IStoryTeller>[];

  optionsVisibility = 0;

  constructor(rumine : Rumine){
    this.rumine = rumine;
    this.random = rumine.random;
    this.CreateConfigs();
  }

  private CreateConfigs(){
    this.groupConfigs = [
      new ConfigInfo<IGroupsCreator>("Классические группы", new LegacyGroupCreator(), "8 групп с возможностями лета 2013 года"),
    ];
    this.eventsConfigs = [
      new ConfigInfo<IEventCreator>("Классические события", new LegacyEvents(this.random), "~ 52 исхода"),
      new ConfigInfo<IEventCreator>("Газета Злого Кнанепа", new KnanepNewsEvents(this.random), "Сегодня что-то произошло?"),
    ];
    this.activityConfigs = [
      new ConfigInfo<IActivityCreator>("Классическая активность", new LegacyActivityCreator(this.random), "Не поддается рациональному объяснению"),
    ]
    this.userConfigs = [
      new ConfigInfo<IUserCreator>("Классические пользователи", new LegacyUserCreator(this.random, this.rumine.foundDate), "87 различных пользователей готовы принять участие")
    ]
    this.storyConfigs = [
      new ConfigInfo<IStoryTeller>("Дневная история", new DayStoryTeller(this.rumine), "События происходят раз в день и зависят от активности")
    ]


    //this.datesConfig = new ClassicDates();
    this.groupConfig = this.groupConfigs[0];
    this.eventsConfig = this.eventsConfigs[0];
    this.activityConfig = this.activityConfigs[0];
    this.userConfig = this.userConfigs[0];
    this.storyConfig = this.storyConfigs[0]; 
  }


  public ApplySettings(){
    this.rumine.ClearData();
    this.rumine.SetConfig(
      this.groupConfig.config,
       this.activityConfig.config,
        this.eventsConfig.config,
         this.userConfig.config,
          this.storyConfig.config);
          this.CreateConfigs();
    this.optionsVisibility = 1;
    setTimeout(() => {
      this.optionsVisibility = 0;
    }, 1000);
  }
}