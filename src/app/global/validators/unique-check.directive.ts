import { inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UtilRequestsService } from '../services/util-requests.service';

/**
 * Options to apply to a unique check validator
 */
interface uniqueCheckOptions {
  /**
   * Name of the table where searching for availability
   */
  table: string;

  /**
   * Name of the column to be checked in the server
   */
  column: string;

  /**
   * Indicates if the validator is checking a resource in a update
   * @default false
   * @Optional
   */
  updating?: boolean;

  /**
    * The ID of the resource to ignore
    * @default '' 
   */
  ignoreId?: string;
}

/**
 *  Global validator that checks if the value of a control is available to use.
 *  @param opts Options to apply in this validator
 *  @returns AsyncValidatorFn
 */
export function uniqueCheck(opts: uniqueCheckOptions): AsyncValidatorFn {
  const utilReqService = inject(UtilRequestsService);
  const { column, updating = false, table, ignoreId = '' } = opts;

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return utilReqService
      .checkIfIsAvailable(table, control.value, {
        column,
        updating,
        excludeId: ignoreId,
      })
      .pipe(
        map((response) => (!response.valid ? { notAvailable: true } : null)),
        catchError(() => of(null)),
      );
  };
}
