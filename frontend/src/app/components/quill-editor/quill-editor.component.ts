import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

@Component({
  selector: 'app-quill-editor',
  standalone: true,
  template: `
    <div #editorContainer class="quill-editor-container"></div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .quill-editor-container {
      min-height: 150px;
    }

    /* Customize Quill toolbar */
    :host ::ng-deep .ql-toolbar {
      border: 1px solid #d1d5db;
      border-bottom: none;
      border-radius: 0.5rem 0.5rem 0 0;
      background: #f9fafb;
    }

    :host ::ng-deep .ql-container {
      border: 1px solid #d1d5db;
      border-radius: 0 0 0.5rem 0.5rem;
      font-family: inherit;
      font-size: 0.875rem;
    }

    :host ::ng-deep .ql-editor {
      min-height: 150px;
      line-height: 1.6;
    }

    :host ::ng-deep .ql-editor.ql-blank::before {
      color: #9ca3af;
      font-style: normal;
    }

    /* Remove default paragraph margins to avoid excess spacing */
    :host ::ng-deep .ql-editor p {
      margin: 0;
      padding: 0;
    }

    :host ::ng-deep .ql-editor ul,
    :host ::ng-deep .ql-editor ol {
      margin: 0.25rem 0;
      padding-left: 1.5rem;
    }

    :host ::ng-deep .ql-editor li {
      margin: 0;
      padding: 0.125rem 0;
    }

    /* Add spacing between consecutive paragraphs (but not line breaks) */
    :host ::ng-deep .ql-editor p + p {
      margin-top: 0.5rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true
    }
  ]
})
export class QuillEditorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @Input() placeholder = '';
  @Input() modules: any = {};
  @Output() contentChanged = new EventEmitter<string>();

  private quill: Quill | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.initializeEditor();
  }

  ngOnDestroy() {
    if (this.quill) {
      this.quill = null;
    }
  }

  private initializeEditor() {
    const defaultModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]
    };

    const modules = Object.keys(this.modules).length > 0 ? this.modules : defaultModules;

    this.quill = new Quill(this.editorContainer.nativeElement, {
      modules,
      theme: 'snow',
      placeholder: this.placeholder
    });

    // Custom Enter key handling via DOM event
    const editorElement = this.quill.root;
    editorElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const selection = this.quill!.getSelection();
        if (selection) {
          // Check if we're in a list
          const format = this.quill!.getFormat(selection.index);
          if (format.list) {
            // Allow default list behavior
            return;
          }

          // Prevent default paragraph creation
          e.preventDefault();

          // Insert a single line break and update cursor position
          const currentIndex = selection.index;
          this.quill!.insertText(currentIndex, '\n', 'user');

          // Use setTimeout to ensure DOM is updated before setting selection
          setTimeout(() => {
            this.quill!.setSelection(currentIndex + 1);
          }, 0);
        }
      }
    });

    // Listen for text changes
    this.quill.on('text-change', () => {
      const html = this.quill!.root.innerHTML;
      const plainText = this.quill!.getText();

      // Only emit if there's actual content (not just empty tags)
      const value = plainText.trim() ? html : '';

      this.onChange(value);
      this.contentChanged.emit(value);
    });

    // Mark as touched on blur
    this.quill.on('selection-change', (range) => {
      if (!range) {
        this.onTouched();
      }
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (this.quill) {
      if (value) {
        this.quill.root.innerHTML = value;
      } else {
        this.quill.setText('');
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }

  // Public API
  getQuillInstance(): Quill | null {
    return this.quill;
  }

  focus() {
    if (this.quill) {
      this.quill.focus();
    }
  }
}
