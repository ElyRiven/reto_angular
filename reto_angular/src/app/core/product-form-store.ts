import { computed, inject, Injectable, signal } from '@angular/core';
import { resource } from '@angular/core';
import { Router } from '@angular/router';
import {
  form,
  maxLength,
  minLength,
  required,
  submit,
  validate,
  validateAsync,
} from '@angular/forms/signals';
import { ProductsApi } from './products-api';

@Injectable({ providedIn: 'root' })
export class ProductFormStore {
  private readonly api = inject(ProductsApi);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly productModel = signal({
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
  });

  readonly dateRevision = computed(() => {
    const release = this.productModel().date_release;
    if (!release) return '';
    const d = new Date(release + 'T00:00:00');
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  readonly productForm = form(this.productModel, (s) => {
    required(s.id, { message: 'ID es requerido' });
    minLength(s.id, 3, { message: 'ID debe tener entre 3 y 10 caracteres' });
    maxLength(s.id, 10, { message: 'ID debe tener entre 3 y 10 caracteres' });
    validateAsync(s.id, {
      params: ({ value }) => value(),
      factory: (idSignal) =>
        resource({
          params: idSignal,
          loader: async ({ params: idValue }) => {
            if (!idValue || idValue.length < 3 || idValue.length > 10) return false;
            return new Promise<boolean>((resolve) => {
              this.api.verifyProductId(idValue).subscribe({
                next: (exists) => resolve(exists),
                error: () => resolve(false),
              });
            });
          },
        }),
      onSuccess: (exists) =>
        exists ? { kind: 'id-taken', message: 'ID ya existente' } : undefined,
      onError: () => ({
        kind: 'verify-error',
        message: 'Error al verificar ID. Por favor, reintentar.',
      }),
    });

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

  onSubmit(): void {
    submit(this.productForm, async () => {
      this.loading.set(true);
      this.submitError.set(null);
      try {
        const data = this.productModel();
        await new Promise<void>((resolve, reject) => {
          this.api
            .createProduct({
              id: data.id,
              name: data.name,
              description: data.description,
              logo: data.logo,
              date_release: data.date_release,
              date_revision: this.dateRevision(),
            })
            .subscribe({ next: () => resolve(), error: (err) => reject(err) });
        });
        this.resetForm();
        this.router.navigate(['/products']);
      } catch {
        this.submitError.set('Error al crear el producto. Por favor, intenta nuevamente.');
      } finally {
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.productModel.set({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
    });
    this.productForm().reset();
    this.submitError.set(null);
  }
}
