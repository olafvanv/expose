import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Aperture, apertureOptions, IsoValue, LightCondition, Photo, RollStateService, ShutterSpeed } from '@expose/data-access';
import { PhotoStateService } from '@expose/photos/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { ScrollPicker, TextInputComponent } from '@expose/ui/form-fields';
import { toFormOptions } from '@expose/util';

type PhotoForm = {
  subject: FormControl<string | null>;
  aperture: FormControl<Aperture | null>;
  shutterSpeed: FormControl<ShutterSpeed | null>;
  iso: FormControl<IsoValue | null>;
  lightCondition: FormControl<LightCondition | null>;
  frameNumber: FormControl<string | null>;
  notes: FormControl<string | null>;
  rollId: FormControl<string | null>;
};

@Component({
  imports: [ReactiveFormsModule, TextInputComponent, ScrollPicker],
  selector: 'lib-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrl: './photo-edit.component.scss',
})
export class PhotoEditComponent implements OnInit {
  private readonly headerService = inject(HeaderService);
  private readonly rollStateService = inject(RollStateService);
  private readonly photoStateService = inject(PhotoStateService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Route param :id
  public id = input<string | null>(null);
  public rollOptions = this.rollStateService.rollOptions;
  public isEditMode = computed(() => !!this.id());

  public photoForm: FormGroup<PhotoForm> = this.fb.group({
    subject: ['', [Validators.required]],
    aperture: [5.6, [Validators.required]],
    shutterSpeed: ['auto'],
    iso: [200 as IsoValue],
    lightCondition: ['' as LightCondition],
    frameNumber: [''],
    notes: [''],
    rollId: [''],
  });

  public apertureFormOptions = toFormOptions(
    apertureOptions,
    (v) => v,
    (v) => `f/${v}`,
  );

  public ngOnInit(): void {
    this.photoStateService.loadAll();
    this.setupHeader();
    this.checkEditMode();
  }

  public async onSave() {
    if (this.photoForm.invalid) {
      this.photoForm.markAllAsTouched();
      return;
    }

    const formVal = this.photoForm.value as Photo;

    if (this.isEditMode()) {
      await this.photoStateService.updatePhoto(this.id() as string, formVal);
    } else {
      await this.photoStateService.addPhoto(formVal);
    }

    this.router.navigate(['/photos']);
  }

  private setupHeader() {
    this.headerService.setConfig({
      title: '',
      showBackButton: true,
      backAction: () => this.router.navigate(['/rolls']),
      actionButtons: [
        {
          id: 'save-photo',
          label: 'Save',
          type: 'text',
          action: () => this.onSave(),
        },
      ],
    });
  }

  private checkEditMode(): void {
    if (this.isEditMode()) {
      const existing = this.photoStateService.getById(this.id() as string);
      if (existing) {
        this.photoForm.patchValue({
          subject: existing.subject,
          aperture: existing.aperture,
          shutterSpeed: existing.shutterSpeed,
          iso: existing.iso,
          lightCondition: existing.lightCondition,
          frameNumber: existing.frameNumber,
          notes: existing.notes,
          rollId: existing.rollId,
        });
      } else {
        this.router.navigate(['/photos']);
      }
    }
  }
}
