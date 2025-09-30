import { Component, Input, Output, EventEmitter, OnInit, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DataTableCustomCellDirective } from './data-table-custom-cell.directive';

export interface ColumnDefinition {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'custom';
  format?: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() totalItems = 0;
  @Input() loading = false;
  @Input() showActions = true;
  
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();

  @ContentChildren(DataTableCustomCellDirective) customCells!: QueryList<DataTableCustomCellDirective>;

  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onDelete(item: any): void {
    this.delete.emit(item);
  }

  onView(item: any): void {
    this.view.emit(item);
  }

  formatValue(value: any, column: ColumnDefinition): string {
    if (value == null) return '-';
    
    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(value);
      
      case 'date':
        return new Date(value).toLocaleDateString('pt-BR');
      
      case 'number':
        return new Intl.NumberFormat('pt-BR').format(value);
      
      case 'boolean':
        return value ? 'Sim' : 'Não';
      
      default:
        return value.toString();
    }
  }

  getCustomTemplate(columnKey: string): TemplateRef<any> | null {
    const customCell = this.customCells.find(cell => cell.column === columnKey);
    return customCell ? customCell.templateRef : null;
  }

  hasCustomTemplate(columnKey: string): boolean {
    return this.customCells.some(cell => cell.column === columnKey);
  }
}