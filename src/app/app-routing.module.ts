import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';

import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: ':id', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
