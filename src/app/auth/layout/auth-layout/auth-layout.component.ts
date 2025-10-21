import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../../global/components/theme-toggle/theme-toggle.component';
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet,ThemeToggleComponent],
  templateUrl: './auth-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent { }
