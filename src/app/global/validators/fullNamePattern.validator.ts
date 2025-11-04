import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import { FormHelper } from "../helpers/form-helpers";

export function fullNameValidator(control: AbstractControl): ValidationErrors | null {
    const pattern = FormHelper.fullNamePattern;
    const patternValidator = Validators.pattern(pattern);
    const patternError = patternValidator(control);
    return patternError? {fullNameInvalid: true, actualValue: control.value}: null;
}