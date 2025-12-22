import { ThemeClasses } from "../interfaces/theme-classes.interface";

export const buttonThemes: Record<string, ThemeClasses> = {
    'danger': {
        buttonClasses: '',
        loaderClasses: '',
    },
    'error': {
        buttonClasses: 'bg-red-500 dark:bg-red-600 text-white',
        loaderClasses: 'text-red-200',
    },
    'success': {
        buttonClasses: 'bg-green-500 dark:bg-green-600 text-white',
        loaderClasses: 'text-white dark:text-white',
    },
    'alert': {
        buttonClasses: 'asdasdasd',
        loaderClasses: '',
    },
}