import { Component, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'reforged',
  templateUrl: './reforged.component.html',
  styleUrls: [ './reforged.component.css']
})
export class ReforgedComponent{
    selectedTab : number = 1;


    public IsActive(tab : number){
      return this.selectedTab === tab;
    }
    public SetActive(tab : number){
      this.selectedTab = tab;
    }
}