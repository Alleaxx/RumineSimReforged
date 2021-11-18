import { Component, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'simulator',
  templateUrl: './simulator.component.html',
  styleUrls: [ './simulator.component.css']
})
export class SimulatorComponent{
    selectedTab : number = 1;


    public IsActive(tab : number){
      return this.selectedTab === tab;
    }
    public SetActive(tab : number){
      this.selectedTab = tab;
    }
}