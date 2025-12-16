import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-security-profile-page',
  templateUrl: './security-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityProfilePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
