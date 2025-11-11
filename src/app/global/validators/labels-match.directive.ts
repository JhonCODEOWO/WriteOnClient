import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

interface LabelsMatchArgs {
    fieldName: string;
    ruleName?: string;
    label?: string;
}

/**
 * Validate if two fields has the exact value by fieldName and fieldName_confirmation rule
 * @param fieldName The name of the field in reactive form
 * @param ruleName The string to search for the control to compare the default value is "confirmation".
 * @note To check if both control values match you should use _ to identify the control to compare.
 * @example 
 *  formExample = new FormGroup({
        "password": new FormControl(''),
        "password_confirmation": new FormControl('')
        }, 
    {
    validators: [labelsMatch('password')]
    })
 * 
 * 
 * 
 * @returns ValidationErrors | null
 */
export function labelsMatch({fieldName, ruleName = 'confirmation', label}: LabelsMatchArgs): ValidatorFn{
    return (group: AbstractControl<FormGroup>): ValidationErrors | null => {
        fieldName = fieldName.trim();
        if(fieldName.length === 0){
            console.error('labelsMatch: Cant compare controls with a empty field name');
            return null;
        }

        //Get controls
        const firstValue: AbstractControl | null = group.get(fieldName);
        const confirmationValue: AbstractControl | null = group.get(`${fieldName}_${ruleName}`);

        //Check if both exists
        if(!firstValue || !confirmationValue) console.error(`labelsMatch: ${fieldName} or ${fieldName}_${ruleName} doesn't exists in your form group.`);

        console.log(`Comparing: ${firstValue?.value.trim()} ${confirmationValue?.value.trim()}`);
        //Make comparisons
        return (firstValue?.value.trim() === confirmationValue?.value.trim())? null: {labelsNotMatch: {field: label || fieldName }};
    }
}