import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-account-layout',
  templateUrl: './account-layout.component.html',
  imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class AccountLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
