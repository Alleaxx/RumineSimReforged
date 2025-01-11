import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'reforged',
  standalone: false,
  templateUrl: './reforged.component.html',
  styleUrl: './reforged.component.css'
})
export class ReforgedComponent{
    selectedTab : number = 1;


    public IsActive(tab : number){
      return this.selectedTab === tab;
    }
    public SetActive(tab : number){
      console.log('был клик по "вкладке"', tab);
      this.selectedTab = tab;
    }
}