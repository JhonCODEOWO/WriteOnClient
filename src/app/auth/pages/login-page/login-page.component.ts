import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";

@Component({
  selector: 'app-login-page',
  imports: [InputComponentComponent],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent { }
