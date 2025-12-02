import { inject, Injectable, signal } from '@angular/core';
import { PaginateRecord } from '../interfaces/paginate-record.interface';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  /**
   * Store all urls with the last location of scroll
   */
  paginationMap = signal<PaginateRecord>({});

  activatedRoute = inject(ActivatedRoute);
  
  /**
   * Store a route and lastLocation of a scroll element.
   * @param route 
   * @param lastLocation
   * @notes In development (No tested) 
   */
  putState(lastLocation: number){
    const route = this.activatedRoute.snapshot.url.toString();
    this.paginationMap.update(latest => {
      return {
        ...latest, 
        [route]: ({location: lastLocation})
      }
    });
  }

  /**
   * Checks whether the user has scrolled to the bottom of an element.
   * @param element The scrollable element to evaluate 
   * @param offset Optional extra distance in pixels to from the bottom to trigger the condition earlier. Default is `0`.
   * @returns `true` if the current scroll element is at or beyond the bottom of the element (considering offset) `false` otherwise.
   */
  isAtBottom(element: HTMLElement, offset: number = 0): boolean{
    
    const scrollClientHeight = element.scrollHeight;
    const location = this.calculateClientScrollLocation(element, offset) + offset;
    const isAtBottom = location >= scrollClientHeight;

    return isAtBottom;
  }

  /**
   * Get the client location inside a scroll element
   * @param element The HTML Scroll element
   * 
   */
  calculateClientScrollLocation(element: HTMLElement, offset: number = 0): number{
    const scrollTop = element.scrollTop;
    const scrollElementClientHeight = element.clientHeight;

    return scrollTop + scrollElementClientHeight + offset;
  }

  /**
   * Calculates the total number of pages available.
   * @param limit Limit per page of the resource (Provided by backend).
   * @param total Total of the collection items (Provided by backend).
   * @returns The number of pages available.
   */
  calculatePages(limit: number, total: number): number{
    return Math.ceil(total/limit);
  }

  restoreLocation(element: HTMLElement){
    const route = this.activatedRoute.snapshot.url.toString();
    const record = this.paginationMap()[route];

    if(!record) return;
    console.log(record);
    element.scrollTo(
      {
        top: record.location,
        behavior: 'smooth'
      }
    );
  }
}
