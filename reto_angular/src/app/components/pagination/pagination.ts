import { Component, input, output } from '@angular/core';
import { PageSize } from '@core/products-store';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent {
  readonly totalCount = input<number>(0);
  readonly pageSize = input<PageSize>(5);
  readonly pageSizeChange = output<PageSize>();

  readonly pageSizeOptions: PageSize[] = [5, 10, 20];

  onSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value) as PageSize;
    this.pageSizeChange.emit(value);
  }
}
