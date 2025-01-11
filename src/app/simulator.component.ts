import { Component, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'simulator',
  standalone: false,
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.css'
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