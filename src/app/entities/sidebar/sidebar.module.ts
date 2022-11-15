import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
    declarations: [
        SidebarComponent
    ],
    exports: [
        SidebarComponent
    ],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule
  ]
})
export class SidebarModule { }
