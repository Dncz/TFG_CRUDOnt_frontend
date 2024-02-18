import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'shared-pagination',
  templateUrl: './pagination.component.html',
  styles: ``
})
export class PaginationComponent {
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

}
