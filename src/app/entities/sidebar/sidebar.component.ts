import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SatisfactionSurveyComponent} from "../satisfaction-survey/satisfaction-survey.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  modeSelected: 'nightlight' | 'light_mode' | 'dark_mode' = 'light_mode'

  constructor(private cdr: ChangeDetectorRef, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  changeMode(selectedMode: 'nightlight' | 'light_mode' | 'dark_mode') {
    switch (selectedMode) {
      case "dark_mode":
        document.body.classList.remove('my-dark-theme');
        document.body.classList.add('my-full-dark-theme');
        /*        const a = document.querySelector('.ide-container')?.getElementsByTagName('iframe')[0] as HTMLIFrameElement;
                console.log(a?.contentWindow?.document);*/
        this.modeSelected = 'dark_mode';
        break;
      case "light_mode":
        document.body.classList.remove('my-dark-theme');
        document.body.classList.remove('my-full-dark-theme');
        this.modeSelected = 'light_mode';
        break;
      case "nightlight":
        document.body.classList.add('my-dark-theme');
        document.body.classList.remove('my-full-dark-theme');
        this.modeSelected = 'nightlight';
        break;
    }
    this.cdr.detectChanges();
  }

  openSurvey() {
    this.matDialog.open(SatisfactionSurveyComponent);
  }
}
