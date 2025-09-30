import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appDataTableCustomCell]'
})
export class DataTableCustomCellDirective {
  @Input() column: string = '';
  
  constructor(public templateRef: TemplateRef<any>) {}
}