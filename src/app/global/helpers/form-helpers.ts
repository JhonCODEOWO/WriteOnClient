import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormHelper {
  //Return the message of error inside a control or null if errors doesn't exists
  static showError(control: AbstractControl): string | null {
    return this.findError(control.errors);
  }

  //Find a key inside a ValidationErrors and return a personalized message
  static findError(errors: ValidationErrors | null): string | null {
    if (!errors) return null;

    for (const [key, value] of Object.entries(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'email':
          return 'El campo debe ser un email válido';

        case 'minlength':
          return `Este campo debe tener mínimo ${value.requiredLength} caracteres`;

        case 'notMatchFields':
          return `Los campos de ${value.fieldNames} deben coincidir`

        case 'uniqueEmail':
          return `El correo ya ha sido utilizado, por favor ingrese otro.`

        case 'maxlength':
          return `Este campo admite una longitud máxima de ${value.requiredLength} y actualmente tiene ${value.actualLength} elementos.`

        case 'fullNameInvalid':
          return `Debes llenar este campo con al menos un apellido.`
        
        case 'passwordNotValid':
          return `La contraseña debe tener: 1 letra minúscula, 1 letra mayúscula y 1 número además, no se admiten espacios.`
        
        case 'notAvailable':
          return `El valor escrito no está disponible para utilizar actualmente, escribe otro e intenta de nuevo.`

        default:
          console.info(value);
          return 'No se ha definido una descripción para el error ' + key + ' valor dentro del error: ' + value;
      }
    }
    return 'No se ha encontrado la key dentro de ValidationErrors';
  }

  static fullNamePattern: string = '^[a-zA-ZÁÉÍÓÚáéíóúÑñ]+( [a-zA-ZÁÉÍÓÚáéíóúÑñ]+)+$';
  static passwordPattern: string = '^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9]).{6,})\\S$';
}