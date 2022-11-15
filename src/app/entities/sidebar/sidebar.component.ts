import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  modeSelected: string = 'dark_mode'

  constructor() { }

  ngOnInit(): void {
  }

}
