import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css']
})
export class AppComponent {
  isMaxed : boolean = false;
  title : string = 'RumineSimReforged';

  public ToggleMaxed(){
    this.isMaxed = !this.isMaxed;
  }
  public SetMinned(){
    this.isMaxed = false;
  }
  public IsMaxed(){
    return this.isMaxed;
  }
}
