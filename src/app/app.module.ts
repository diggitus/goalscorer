import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OverviewComponent } from './views/overview/overview.component';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './views/game/game.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: 'game', component: GameComponent },
  { path: '', pathMatch: 'full', redirectTo: '/overview' },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    OverviewComponent,
    GameComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
