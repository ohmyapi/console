import { AbstractControl, FormGroup } from '@angular/forms';

export class Form {
  public group: FormGroup = new FormGroup({});

  constructor(controlers: IFormController) {
    if (controlers) this.group = new FormGroup(controlers);
  }

  public setGroup(group: FormGroup): void {
    this.group = group;
  }

  public field(name: string) {
    const field = this.group.get(name);

    if (!field) throw new Error(`Field ${name} not found in form group.`);

    const errors = field.errors;
    const touched = field.touched;
    const valid = field.valid;
    const invalid = !valid && errors && touched;
    const value = field.value;

    let message: string = ''; // error message if field is not valid

    if (invalid) {
      // switch case for all possible errors
      if (errors['required']) message = 'این ورودی رو خالی نذارید';
      else if (errors['email']) message = 'آدرس ایمیل رو درست وارد کنید';
      else if (errors['minlength'])
        message = `حداقل ${errors['minlength'].requiredLength} کاراکتر وارد کنید`;
      else if (errors['maxlength'])
        message = `حداکثر ${errors['maxlength'].requiredLength} کاراکتر وارد کنید`;
      else if (errors['pattern']) message = 'ورودی رو درست وارد کنید';
      else if (errors['min']) message = `حداقل ${errors['min'].min} وارد کنید`;
      else if (errors['max']) message = `حداکثر ${errors['max'].max} وارد کنید`;
      else if (errors['server']) message = errors['server'];
      else message = 'ورودی رو درست وارد کنید';
    }

    return {
      controler: field,
      value,
      errors,
      valid,
      invalid,
      touched,
      message,
      setError: (key: string, value: string | boolean) => {
        field.setErrors({ ...errors, [key]: value });
      },
      unsetErrors: ()=> {
        field.setErrors(null);
      },
      setValue: (value: any) => {
        field.setValue(value);
      },
      checkValidation: () => {
        field.markAsTouched();
      },
    };
  }

  public get valid(): boolean {
    return this.group.valid;
  }

  public get value(): any {
    return this.group.value;
  }

  public set value(value: any) {
    this.group.patchValue(value);
  }

  public get disabled(): boolean {
    return this.group.disabled;
  }

  public set disabled(value: boolean) {
    if (value) this.group.disable();
    else this.group.enable();
  }

  public checkValidation(fields: string[] = []) {
    if (fields.length > 0) {
      for (let field of fields) {
        this.field(field).checkValidation();
      }
    } else {
      this.group.markAllAsTouched();
    }
  }

  public reset() {
    this.group.reset();
  }

  public validate(fields: string[] = []): boolean {
    if (fields.length > 0) {
      for (let field of fields) {
        this.field(field).checkValidation();
        if (this.field(field).invalid) return false;
      }
      return true;
    } else {
      return this.group.valid;
    }
  }
}

interface IFormController {
  [K: string]: AbstractControl;
}