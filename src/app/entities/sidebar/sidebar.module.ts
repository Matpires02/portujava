import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from './sidebar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    SidebarComponent
  ],
  exports: [],
    imports: [
        CommonModule,
        MatToolbarModule,
        RouterOutlet,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        RouterLink,
        RouterLinkActive,
        MatTooltipModule,
        MatDialogModule
    ]
})
export class SidebarModule {
}
