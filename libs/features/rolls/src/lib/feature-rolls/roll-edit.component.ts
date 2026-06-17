import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmFormat, RollStateService } from '@expose/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { SelectInputComponent, TextInputComponent } from '@expose/ui-styles';

// =============================================================================
// RollEditComponent
// Standalone form component for adding and editing film rolls.
// =============================================================================

@Component({
  selector: 'lib-roll-edit',
  templateUrl: './roll-edit.component.html',
  styleUrl: './roll-edit.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    SelectInputComponent,
  ],
})
export class RollEditComponent implements OnInit {
  private readonly _headerService = inject(HeaderService);
  private readonly _rollStateService = inject(RollStateService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);

  public rollForm!: FormGroup;
  public isEditMode = false;
  public rollId: string | null = null;
  public readonly formatOptions: FilmFormat[] = ['35mm', '120', '4x5', '8x10'];
  public readonly isoOptions: number[] = [
    25, 50, 64, 100, 125, 160, 200, 400, 800, 1600, 3200, 6400,
  ];

  public readonly isoSelectOptions = this.isoOptions.map((opt) => ({
    label: `ISO ${opt}`,
    value: opt,
  }));

  public get brandControl(): FormControl {
    return this.rollForm.get('brand') as FormControl;
  }

  public get nameControl(): FormControl {
    return this.rollForm.get('name') as FormControl;
  }

  public get frameCountControl(): FormControl {
    return this.rollForm.get('frameCount') as FormControl;
  }

  public get isoControl(): FormControl {
    return this.rollForm.get('iso') as FormControl;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks
  // ---------------------------------------------------------------------------

  public ngOnInit(): void {
    this._initForm();
    this._checkEditMode();
    this._setupHeader();
    this._setupFormSubscriptions();
  }

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Submits the form to save the film roll (creates new or updates existing).
   */
  public async onSave(): Promise<void> {
    if (this.rollForm.invalid) {
      this.rollForm.markAllAsTouched();
      return;
    }

    const formValue = this.rollForm.value;
    const rollData = {
      brand: formValue.brand,
      name: formValue.name,
      iso: Number(formValue.iso),
      format: formValue.format as FilmFormat,
      frameCount: Number(formValue.frameCount),
      notes: formValue.notes || undefined,
    };

    if (this.isEditMode && this.rollId) {
      await this._rollStateService.updateRoll(this.rollId, rollData);
    } else {
      await this._rollStateService.addRoll(rollData);
    }

    this._router.navigate(['/rolls']);
  }

  // ---------------------------------------------------------------------------
  // Private Methods
  // ---------------------------------------------------------------------------

  private _initForm(): void {
    this.rollForm = this._fb.group({
      brand: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required]],
      iso: [400, [Validators.required]],
      format: ['35mm', [Validators.required]],
      frameCount: [36, [Validators.required, Validators.min(1)]],
      notes: [''],
    });
  }

  private _checkEditMode(): void {
    this.rollId = this._route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.rollId;

    if (this.isEditMode && this.rollId) {
      const existingRoll = this._rollStateService
        .rolls()
        .find((r) => r.id === this.rollId);
      if (existingRoll) {
        this.rollForm.patchValue({
          brand: existingRoll.brand,
          name: existingRoll.name,
          iso: existingRoll.iso,
          format: existingRoll.format || '35mm',
          frameCount: existingRoll.frameCount,
          notes: existingRoll.notes || '',
        });
      } else {
        this._router.navigate(['/rolls']);
      }
    }
  }

  private _setupHeader(): void {
    this._headerService.setConfig({
      title: this.isEditMode ? 'Edit Film Roll' : 'Add Film Roll',
      showBackButton: true,
      actionButtons: [
        {
          id: 'save-roll',
          label: 'Save',
          type: 'text',
          action: () => this.onSave(),
        },
      ],
    });
  }

  private _setupFormSubscriptions(): void {
    this.rollForm.get('format')?.valueChanges.subscribe((format) => {
      const frameCountCtrl = this.rollForm.get('frameCount');
      if (frameCountCtrl && !frameCountCtrl.dirty) {
        if (format === '120') {
          frameCountCtrl.setValue(12);
        } else if (format === '35mm') {
          frameCountCtrl.setValue(36);
        }
      }
    });
  }
}
