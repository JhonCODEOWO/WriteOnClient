import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import { FormHelper } from "../helpers/form-helpers";

export function passwordValidation(control: AbstractControl): ValidationErrors | null{
    const pattern = FormHelper.passwordPattern;
    const fnValidate = Validators.pattern(pattern);
    const result = fnValidate(control);
    return result?{passwordNotValid: true}: null;
}