import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OverviewComponent } from './views/overview/overview.component';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './views/game/game.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: 'game', component: GameComponent },
  { path: '', pathMatch: 'full', redirectTo: '/overview' },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    CommonModule
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
