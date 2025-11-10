import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckResult {
  valid: boolean
}

/**
 * Interface to apply params in a check request
 */
export interface CheckParams {
  /**
   * Flag to indicate if is a update
   */
  updating?: boolean,
  
  /**
   * Column name of the table where we want to check the value
   */
  column: string,

  /**
   * Id of the excluded resource
   */
  excludeId?: string | number
}

@Injectable({
  providedIn: 'root'
})
export class UtilRequestsService {
  client = inject(HttpClient);
  
  /**
   * function that make a request to check if determined value in a table is available to use in a operation
   * @param tableName Name of the table (only work with table available provided by backend)
   * @param value The value to check for
   * @param params Object with params to apply in the requests
   * @returns 
   */
  checkIfIsAvailable(tableName: string, value: string, params: CheckParams): Observable<CheckResult>{
    //Check if the update flag is false to filter only necessary params
    let filtered:Partial<CheckParams> = !params.updating? {column: params.column}:params;

    //Convert all filtered entries to string to use it in httpParams correctly
    const httpParams = Object.fromEntries(
      Object.entries(filtered).map(([k, v]) => [k, String(v)])
    );
    
    return this.client.get<CheckResult>(`${environment.API_URL}/check/available/${tableName}/${value}`, {params:httpParams});
  }
}
