import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', children: [
          {path: '', component: HomeComponent}
        ]
      }
    ]),
  ]
})
export class EntitiesModule { }
