import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';

@NgModule({
  declarations: [ReportGeneratorComponent],
  imports: [CommonModule, FormsModule],
  exports: [],
})
export class LayoutModule {}
