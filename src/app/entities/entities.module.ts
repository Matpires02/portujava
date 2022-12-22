import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)}
    ]),
  ]
})

export class EntitiesModule {
}
