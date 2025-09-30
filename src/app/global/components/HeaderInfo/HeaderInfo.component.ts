import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-header-info',
  imports: [],
  template: `
    <div class="dark:text-white mb-3">
      <h3 class="text-xl font-bold">{{title()}}</h3>
      <p class="text-xs text-justify">
        {{description()}}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderInfoComponent {
  title = input.required<string>();
  description = input.required<string>();
}
