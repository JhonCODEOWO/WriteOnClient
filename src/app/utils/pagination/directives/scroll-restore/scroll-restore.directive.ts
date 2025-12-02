import { Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { PaginationService } from '../../services/pagination.service';
import { ActivatedRoute } from '@angular/router';

export interface BottomReached {
  state: boolean,
  element: HTMLElement
}

@Directive({
  selector: '[scrollRestore]',
  host: {
    '(scroll)': 'handleScroll()'
  }
})
export class ScrollRestoreDirective {
  private scrollElement = inject(ElementRef);
  paginationService = inject(PaginationService);

  /**
   * Emits the state and the element when the client scroll and scroll height are the same.
   */
  bottomReached = output<BottomReached>();

  /**
   * To apply changes with requests
   */
  isLoading = input<boolean | null>(null);

  /**
   * Navigate the user view to the last location saved if exists.
   */
  navigateTo = effect(() => {
    const element = this.scrollElement.nativeElement as HTMLElement;

    if(this.isLoading() === null) {
      this.paginationService.restoreLocation(element);
      return;
    }

    if(this.isLoading()) return;
    requestAnimationFrame(() => {
      this.paginationService.restoreLocation(element);
    })
  })
  
  constructor() {
    console.log(this.scrollElement.nativeElement);
  }

  /**
   * Every time client use scroll save the location and emit events.
   * @todo Prevent dispatch a lot of emits.
   */
  handleScroll(){
    const element = this.scrollElement.nativeElement as HTMLElement;
    const scrollTop = element.scrollTop;
    this.paginationService.putState(scrollTop);
    
    if(this.paginationService.isAtBottom(element, 500)) this.bottomReached.emit({state: true, element});
  }
}
