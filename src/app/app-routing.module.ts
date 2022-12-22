import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SidebarComponent} from "./entities/sidebar/sidebar.component";

const routes: Routes = [
  {
    path: '', component: SidebarComponent, children: [
      {path: '', loadChildren: () => import('./entities/entities.module').then(m => m.EntitiesModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
