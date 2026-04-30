import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { PaginationComponent } from './pagination';

describe('PaginationComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();
  });

  it('renders total count from input', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalCount', 12);

    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('.results-count') as HTMLElement;
    expect(span.textContent).toContain('12');
    expect(span.textContent).toContain('Resultados');
  });

  it('renders all page size options (5, 10, 20)', () => {
    const fixture = TestBed.createComponent(PaginationComponent);

    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll(
      'option',
    ) as NodeListOf<HTMLOptionElement>;
    const values = Array.from(options).map((o) => Number(o.value));
    expect(values).toEqual([5, 10, 20]);
  });

  it('reflects the current pageSize input in the component signal', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('pageSize', 10);

    fixture.detectChanges();

    expect(fixture.componentInstance.pageSize()).toBe(10);
  });

  it('emits pageSizeChange with correct value when a new page size is selected', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    const component = fixture.componentInstance;
    const changeSpy = vi.spyOn(component.pageSizeChange, 'emit');

    fixture.componentRef.setInput('pageSize', 5);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '10';
    select.dispatchEvent(new Event('change'));

    expect(changeSpy).toHaveBeenCalledWith(10);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  it('emits pageSizeChange as number type, not string', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    const component = fixture.componentInstance;
    const changeSpy = vi.spyOn(component.pageSizeChange, 'emit');

    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '20';
    select.dispatchEvent(new Event('change'));

    const emittedValue = changeSpy.mock.calls[0][0];
    expect(typeof emittedValue).toBe('number');
    expect(emittedValue).toBe(20);
  });

  it('shows 0 Resultados when totalCount is 0', () => {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalCount', 0);

    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('.results-count') as HTMLElement;
    expect(span.textContent).toContain('0');
    expect(span.textContent).toContain('Resultados');
  });
});
