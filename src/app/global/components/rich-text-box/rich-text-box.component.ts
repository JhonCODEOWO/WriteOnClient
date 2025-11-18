import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
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

  quillInstance = signal<Quill | null>(null);

  //Reload text every time initialText or instance change
  setText = effect(() => {
    if(!this.quillInstance()) return;
    
    this.quillInstance()?.setText('');
    this.quillInstance()?.clipboard.dangerouslyPasteHTML(0, this.initialText());
  })

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

      this.quillInstance.set(quill);

      this.quillInstance()?.on('text-change', (delta, oldContent) => {
        if(this.quillInstance()?.getText().trim().length === 0) {
          this.writingContent.emit('');
          return;
        }

        this.writingContent.emit(this.quillInstance()!.getSemanticHTML());
      })
  }
}
