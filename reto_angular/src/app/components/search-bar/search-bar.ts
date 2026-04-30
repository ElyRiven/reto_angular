import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBarComponent {
  readonly search = output<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
