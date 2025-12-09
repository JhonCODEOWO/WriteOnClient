import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { uniqueCheck } from "./unique-check.directive";
import { inject } from "@angular/core";
import { UtilRequestsService } from "../services/util-requests.service";
import { map } from "rxjs";

interface MustExistOptions {
    /** 
     *  Table where you want to search a value registered
    */
    table: string,

    /**
     * The column where the value is placed in the backend
     */
    column: string,
}

/**
 *  Validate if the value is available to use which means it isn't associated to an account.
 * @param opts Options to apply in this validator.
 * @returns 
 */
export function mustExistValidator(opts: MustExistOptions): AsyncValidatorFn{
    const {column, table} = opts;
    const utilReqService = inject(UtilRequestsService);

    return ({value}: AbstractControl) => {
        return utilReqService.checkIfIsAvailable(
            table,
            value,
            {column}
        ).pipe(
            map(response => response.valid? {notRegistered: true}: null)
        )
    }
}