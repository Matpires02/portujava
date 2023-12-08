import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import { SatisfactionSurveyComponent } from './satisfaction-survey/satisfaction-survey.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    SatisfactionSurveyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)}
    ]),
    MatDialogModule,
  ]
})

export class EntitiesModule {
}
