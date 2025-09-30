import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  template: ` <div
    class="animate-spin inline-block size-8 md:size-12 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
    role="status"
    aria-label="loading"
  >
    <span class="sr-only">Loading...</span>
  </div>`,
  styleUrl: './loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  
}
