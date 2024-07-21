import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SatisfactionSurveyComponent} from "../satisfaction-survey/satisfaction-survey.component";
import {ColorSchemeService} from "../color-service/ColorSchemeService";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  modeSelected: 'light' | 'dark' = 'light'

  constructor(protected colorSchemeService: ColorSchemeService,  private matDialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  changeMode(selectedMode: 'light' | 'dark') {
    this.colorSchemeService.update(selectedMode)
  }

  openSurvey() {
    this.matDialog.open(SatisfactionSurveyComponent);
  }
}
