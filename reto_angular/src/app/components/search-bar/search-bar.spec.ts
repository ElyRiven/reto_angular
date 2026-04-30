import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { SearchBarComponent } from './search-bar';

describe('SearchBarComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
    }).compileComponents();
  });

  it('renders a text input with the correct placeholder', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.placeholder).toBe('Buscar por nombre...');
  });

  it('emits search event with input value when user types', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);
    const component = fixture.componentInstance;
    const searchSpy = vi.spyOn(component.search, 'emit');

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Cuenta';
    input.dispatchEvent(new Event('input'));

    expect(searchSpy).toHaveBeenCalledWith('Cuenta');
    expect(searchSpy).toHaveBeenCalledTimes(1);
  });

  it('emits empty string when input is cleared', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);
    const component = fixture.componentInstance;
    const searchSpy = vi.spyOn(component.search, 'emit');

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(searchSpy).toHaveBeenCalledWith('');
  });

  it('emits each character as user types progressively', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);
    const component = fixture.componentInstance;
    const searchSpy = vi.spyOn(component.search, 'emit');

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'C';
    input.dispatchEvent(new Event('input'));

    input.value = 'Cu';
    input.dispatchEvent(new Event('input'));

    input.value = 'Cuenta';
    input.dispatchEvent(new Event('input'));

    expect(searchSpy).toHaveBeenCalledTimes(3);
    expect(searchSpy).toHaveBeenLastCalledWith('Cuenta');
  });
});
