import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import {validate} from 'uuid'

export function isUUID(control: AbstractControl): ValidationErrors | null {
    return validate(control.value) ? null: {isUUID: {value: control.value}};
}