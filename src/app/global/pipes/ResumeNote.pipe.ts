import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'ResumeNote',
})
export class ResumeNotePipe implements PipeTransform {

  transform(value: string, cutLength: number = 100): unknown {
    const div = document.createElement('div');
    div.innerHTML = value;
    const text = div.textContent ?? '';
    const resume = text.slice(0, cutLength);
    //Validate if there is an argument with slice length
    return `${resume}...`; 
  }

}
