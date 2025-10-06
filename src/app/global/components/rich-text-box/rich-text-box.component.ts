import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import Quill from 'quill';

@Component({
  selector: 'app-rich-text-box',
  imports: [],
  template: `
  <div class="bg-white">
    <div #toolbar>

  </div>
  <div #textbox class="text-black">

  </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextBoxComponent implements AfterViewInit{
  box = viewChild<ElementRef>('textbox');
  initialText = input<string>('');
  writingContent = output<string>();

  ngAfterViewInit(): void {
      const element = this.box()?.nativeElement as HTMLDivElement;

      const quill = new Quill(
        element, 
        {
          placeholder: 'Contenido de la nota', 
          modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }, {'header': 3}],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                // [{ 'font': [] }],
                [{ 'align': [] }],
            ]
          },
          theme: 'snow'
        }
      );

      quill.clipboard.dangerouslyPasteHTML(0, this.initialText());
      quill.on('text-change', (delta, oldContent) => {
        if(quill.getText().trim().length === 0) {
          this.writingContent.emit('');
          return;
        }

        this.writingContent.emit(quill.getSemanticHTML());
      })
  }
}
