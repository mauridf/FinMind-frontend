import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { DataTableComponent } from './components/data-table/data-table.component';
import { DataTableCustomCellDirective } from './components/data-table/data-table-custom-cell.directive';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    DataTableComponent,
    DataTableCustomCellDirective
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  exports: [
    DataTableComponent,
    DataTableCustomCellDirective
  ]
})
export class SharedModule { }