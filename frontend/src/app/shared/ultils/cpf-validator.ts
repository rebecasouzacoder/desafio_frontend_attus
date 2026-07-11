import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
    return (
        control: AbstractControl
    ): ValidationErrors | null => {

        const value = control.value?.replace(/\D/g, '');

        if (!value || value.length !== 11) {
            return {
                cpfInvalid: true
            };
        }

        if (/^(\d)\1+$/.test(value)) {
            return {
                cpfInvalid: true
            };
        }

        const digits = value.split('').map(Number);

        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += digits[i] * (10 - i);
        }

        let firstDigit = (sum * 10) % 11;

        if (firstDigit === 10) {
            firstDigit = 0;
        }


        if (firstDigit !== digits[9]) {
            return {
                cpfInvalid: true
            };
        }

        sum = 0;

        for (let i = 0; i < 10; i++) {
            sum += digits[i] * (11 - i);
        }

        let secondDigit = (sum * 10) % 11;

        if (secondDigit === 10) {
            secondDigit = 0;
        }

        if (secondDigit !== digits[10]) {
            return {
                cpfInvalid: true
            };
        }

        return null;
    };
}