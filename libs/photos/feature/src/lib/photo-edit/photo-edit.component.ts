import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Aperture,
  apertureOptions,
  isoOptions,
  IsoValue,
  LightCondition,
  Photo,
  RollStateService,
  ShutterSpeed,
  shutterSpeedOptions,
} from '@expose/data-access';
import { PhotoStateService } from '@expose/photos/data-access';
import { SessionStateService } from '@expose/sessions/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { CounterComponent, GridPicker, ScrollPicker, SelectInputComponent, TextInputComponent } from '@expose/ui/form-fields';
import { toFormOptions, toFormOptionsComputed } from '@expose/util';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCloud,
  lucideCloudSun,
  lucideHouse,
  lucideLamp,
  lucideMoon,
  lucideStars,
  lucideSun,
  lucideSunset,
  lucideTrees,
} from '@ng-icons/lucide';

type PhotoForm = {
  subject: FormControl<string | null>;
  aperture: FormControl<Aperture | null>;
  shutterSpeed: FormControl<ShutterSpeed | null>;
  iso: FormControl<IsoValue | null>;
  lightCondition: FormControl<LightCondition | null>;
  frameNumber: FormControl<string | null>;
  notes: FormControl<string | null>;
  rollId: FormControl<string | null>;
  sessionId: FormControl<string | null>;
};

const lightConditionOptions = [
  { value: 'sunny', label: 'Zonnig', icon: 'lucideSun' },
  { value: 'partly-cloudy', label: 'Half bew.', icon: 'lucideCloudSun' },
  { value: 'overcast', label: 'Bewolkt', icon: 'lucideCloud' },
  { value: 'shade', label: 'Schaduw', icon: 'lucideTrees' },
  { value: 'golden-hour', label: 'Gouden uur', icon: 'lucideSunset' },
  { value: 'blue-hour', label: 'Blauwe uur', icon: 'lucideMoon' },
  { value: 'indoor-natural', label: 'Binnen/dag', icon: 'lucideHouse' },
  { value: 'indoor-artificial', label: 'Binnen/kunst', icon: 'lucideLamp' },
  { value: 'night', label: 'Nacht', icon: 'lucideStars' },
];

@Component({
  imports: [ReactiveFormsModule, TextInputComponent, ScrollPicker, GridPicker, CounterComponent, SelectInputComponent],
  selector: 'lib-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrl: './photo-edit.component.scss',
  providers: [
    provideIcons({
      lucideSun,
      lucideCloudSun,
      lucideCloud,
      lucideTrees,
      lucideSunset,
      lucideMoon,
      lucideHouse,
      lucideLamp,
      lucideStars,
    }),
  ],
})
export class PhotoEditComponent implements OnInit {
  private readonly headerService = inject(HeaderService);
  private readonly rollStateService = inject(RollStateService);
  private readonly photoStateService = inject(PhotoStateService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly sessionStateService = inject(SessionStateService);

  // Route param :id
  public id = input<string | null>(null);
  public isEditMode = computed(() => !!this.id());

  public photoForm: FormGroup<PhotoForm> = this.fb.group({
    subject: ['', [Validators.required]],
    aperture: [null as Aperture | null, [Validators.required]],
    shutterSpeed: [null as ShutterSpeed | null, [Validators.required]],
    iso: [null as IsoValue | null, [Validators.required]],
    lightCondition: ['' as LightCondition, [Validators.required]],
    frameNumber: ['', [Validators.required]],
    notes: [''],
    rollId: ['', [Validators.required]],
    sessionId: [null as string | null],
  });

  public apertureFormOptions = toFormOptions([...apertureOptions], {
    valueFn: (v) => v,
    labelFn: (v) => `f/${v}`,
  });
  public shutterSpeedOptions = toFormOptions([...shutterSpeedOptions], {
    valueFn: (v) => v,
    labelFn: (v) => v,
  });
  public isoOptions = toFormOptions([...isoOptions], {
    valueFn: (v) => v,

    labelFn: (v) => v.toString(),
  });
  public lightConditionOptions = toFormOptions([...lightConditionOptions], {
    valueFn: (v) => v.value,
    labelFn: (v) => v.label,
    iconFn: (v) => v.icon,
  });
  public rollOptions = toFormOptionsComputed(this.rollStateService.rolls, {
    valueFn: (roll) => roll.id,
    labelFn: (roll) => roll.name,
  });
  public sessionOptions = toFormOptionsComputed(this.sessionStateService.sessions, {
    valueFn: (session) => session.id,
    labelFn: (session) => session.title,
  });

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
      title: this.isEditMode() ? 'Edit Photo' : 'New Photo',
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
