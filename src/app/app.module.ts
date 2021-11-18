import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SimulatorComponent } from './simulator.component';
import { OptionsComponent } from './options.component';
import { AboutComponent } from './about.component';
import { LegacyMainComponent } from './legacy-simulator/legacy-main.component';
import { LegacyEventsComponent } from './legacy-simulator/legacy-events.component';
import { LegacyUsersComponent } from './legacy-simulator/legacy-users.component';
import { Rumine } from './services/rumine';
import { ReforgedComponent } from './reforged.component';
import { ActivityComponent } from './reforged/activity.component';
import { UsersComponent } from './reforged/users.component';

const appRoutes = [
  { path: '', component: SimulatorComponent },
  { path: 'reforged', component: ReforgedComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'about', component: AboutComponent },

];

@NgModule({
  declarations: [
    AppComponent, SimulatorComponent, OptionsComponent, AboutComponent,
    LegacyMainComponent, LegacyEventsComponent, LegacyUsersComponent,
    ReforgedComponent, ActivityComponent, UsersComponent
  ],
  imports: [
    BrowserModule, FormsModule, RouterModule.forRoot(appRoutes)
  ],
  providers: [ Rumine ],
  bootstrap: [AppComponent]
})
export class AppModule { }
