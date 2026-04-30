import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, maxLength, minLength, required, submit, validate } from '@angular/forms/signals';
import { ProductsApi } from './products-api';
import { ProductUpdateRequest } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductEditStore {
  private readonly api = inject(ProductsApi);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly submitError = signal<string | null>(null);

  private readonly originalDateRelease = signal('');

  readonly originalValues = signal<{
    name: string;
    description: string;
    logo: string;
    date_release: string;
  } | null>(null);

  readonly editModel = signal({
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
  });

  readonly dateRevision = computed(() => {
    const release = this.editModel().date_release;
    if (!release) return '';
    const d = new Date(release + 'T00:00:00');
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  readonly isDirty = computed(() => {
    const original = this.originalValues();
    if (!original) return false;
    const current = this.editModel();
    return (
      current.name !== original.name ||
      current.description !== original.description ||
      current.logo !== original.logo ||
      current.date_release !== original.date_release
    );
  });

  readonly editForm = form(this.editModel, (s) => {
    required(s.name, { message: 'Nombre es requerido' });
    minLength(s.name, 5, { message: 'Nombre debe tener entre 5 y 100 caracteres' });
    maxLength(s.name, 100, { message: 'Nombre debe tener entre 5 y 100 caracteres' });

    required(s.description, { message: 'Descripción es requerida' });
    minLength(s.description, 10, { message: 'Descripción debe tener entre 10 y 200 caracteres' });
    maxLength(s.description, 200, { message: 'Descripción debe tener entre 10 y 200 caracteres' });

    required(s.logo, { message: 'Logo es requerido' });

    required(s.date_release, { message: 'Fecha Liberación es requerida' });
    validate(s.date_release, ({ value }) => {
      const val = value();
      if (!val) return undefined;
      if (val === this.originalDateRelease()) return undefined;
      const releaseDate = new Date(val + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (releaseDate < today) {
        return {
          kind: 'date-past',
          message: 'Fecha Liberación debe ser igual o mayor a la fecha actual',
        };
      }
      return undefined;
    });
  });

  loadProduct(productId: string): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.submitError.set(null);
    this.originalValues.set(null);
    this.editModel.set({ id: '', name: '', description: '', logo: '', date_release: '' });

    this.api.getProducts().subscribe({
      next: (response) => {
        const product = response.data.find((p) => p.id === productId);
        if (!product) {
          this.router.navigate(['/products']);
          return;
        }
        this.originalDateRelease.set(product.date_release);
        this.originalValues.set({
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release,
        });
        this.editModel.set({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release,
        });
        this.editForm().reset();
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Error al cargar el producto. Por favor, intenta nuevamente.');
        this.loading.set(false);
      },
    });
  }

  onSave(): void {
    submit(this.editForm, async () => {
      this.loading.set(true);
      this.submitError.set(null);
      try {
        const data = this.editModel();
        const updateData: ProductUpdateRequest = {
          name: data.name,
          description: data.description,
          logo: data.logo,
          date_release: data.date_release,
          date_revision: this.dateRevision(),
        };
        await new Promise<void>((resolve, reject) => {
          this.api
            .updateProduct(data.id, updateData)
            .subscribe({ next: () => resolve(), error: (err) => reject(err) });
        });
        this.router.navigate(['/products']);
      } catch {
        this.submitError.set('Error al actualizar el producto. Por favor, intenta nuevamente.');
      } finally {
        this.loading.set(false);
      }
    });
  }
}
