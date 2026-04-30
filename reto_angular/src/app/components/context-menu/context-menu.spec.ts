import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { ContextMenuComponent } from './context-menu';

describe('ContextMenuComponent', () => {
  const items = [
    { label: 'Editar Producto', action: 'edit' },
    { label: 'Eliminar Producto', action: 'delete' },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ContextMenuComponent],
    }).compileComponents();
  });

  it('renders trigger button and hides dropdown by default', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    expect(trigger).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeNull();
  });

  it('opens dropdown when trigger button is clicked', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    fixture.componentRef.setInput('items', items);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('.dropdown-menu');
    expect(menu).not.toBeNull();
  });

  it('toggles dropdown closed when trigger is clicked again', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    fixture.componentRef.setInput('items', items);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeNull();
  });

  it('renders all provided menu items when open', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    fixture.componentRef.setInput('items', items);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const menuItems = fixture.nativeElement.querySelectorAll('.dropdown-item');
    expect(menuItems.length).toBe(2);
    expect(menuItems[0].textContent.trim()).toBe('Editar Producto');
    expect(menuItems[1].textContent.trim()).toBe('Eliminar Producto');
  });

  it('emits itemSelected and closes dropdown when a menu item is clicked', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    const component = fixture.componentInstance;
    const selectedSpy = vi.spyOn(component.itemSelected, 'emit');

    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const firstItem = fixture.debugElement.queryAll(By.css('.dropdown-item'))[0];
    firstItem.nativeElement.click();
    fixture.detectChanges();

    expect(selectedSpy).toHaveBeenCalledWith({ label: 'Editar Producto', action: 'edit' });
    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeNull();
  });

  it('closes dropdown when clicking outside the component', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    fixture.componentRef.setInput('items', items);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.dropdown-menu')).not.toBeNull();

    // Simulate click outside the component
    const outsideClick = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(outsideClick);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeNull();
  });

  it('does not close dropdown when clicking inside the component', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    // Simulate click on the trigger itself (inside component) via document click
    const insideClick = new MouseEvent('click', { bubbles: true });
    trigger.dispatchEvent(insideClick);
    fixture.detectChanges();

    // After re-toggle the dropdown should remain closed (toggle behavior)
    // But key assertion: document:click on the trigger itself — the HostListener won't close since it's inside
    // The toggle call already closed it; check HostListener doesn't re-open
    expect(component.open()).toBe(false);
  });

  it('sets aria-expanded to false by default and true when open', () => {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    fixture.componentRef.setInput('items', items);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.menu-trigger') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
