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
import { RollStateService, SessionStateService } from '@expose/data-access';
import { HeaderService } from '@expose/shell-data-access';
import {
  SelectInputComponent,
  TextInputComponent,
} from '@expose/ui/form-controls';

// =============================================================================
// SessionEditComponent
// Standalone form component for creating and editing shooting sessions.
// Operates in 'create' mode for /sessions/new and 'edit' for /sessions/:id/edit.
// =============================================================================

@Component({
  selector: 'lib-session-edit',
  templateUrl: './session-edit.component.html',
  styleUrl: './session-edit.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    SelectInputComponent,
  ],
})
export class SessionEditComponent implements OnInit {
  private readonly _headerService = inject(HeaderService);
  private readonly _sessionStateService = inject(SessionStateService);
  private readonly _rollStateService = inject(RollStateService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);

  public sessionForm!: FormGroup;
  public isEditMode = false;
  public sessionId: string | null = null;

  /** Dropdown options for roll selection, built from loaded rolls. */
  public readonly rollOptions = this._rollStateService.rolls().map((roll) => ({
    label: `${roll.brand} ${roll.name} (ISO ${roll.iso})`,
    value: roll.id,
  }));

  public get titleControl(): FormControl {
    return this.sessionForm.get('title') as FormControl;
  }

  public get dateControl(): FormControl {
    return this.sessionForm.get('date') as FormControl;
  }

  public get locationControl(): FormControl {
    return this.sessionForm.get('location') as FormControl;
  }

  public get rollIdControl(): FormControl {
    return this.sessionForm.get('rollId') as FormControl;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks
  // ---------------------------------------------------------------------------

  public ngOnInit(): void {
    this._rollStateService.loadAll();
    this._initForm();
    this._checkEditMode();
    this._setupHeader();
  }

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Submits the form to save the session (creates new or updates existing).
   * Navigates back to the sessions list on success.
   */
  public async onSave(): Promise<void> {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    const formValue = this.sessionForm.value;
    const sessionData = {
      title: formValue.title,
      date: formValue.date,
      location: formValue.location || undefined,
      rollId: formValue.rollId || undefined,
      notes: formValue.notes || undefined,
    };

    if (this.isEditMode && this.sessionId) {
      await this._sessionStateService.updateSession(
        this.sessionId,
        sessionData,
      );
    } else {
      await this._sessionStateService.addSession(sessionData);
    }

    this._router.navigate(['/sessions']);
  }

  // ---------------------------------------------------------------------------
  // Private Methods
  // ---------------------------------------------------------------------------

  private _initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.sessionForm = this._fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      date: [today, [Validators.required]],
      location: [''],
      rollId: [''],
      notes: [''],
    });
  }

  private _checkEditMode(): void {
    this.sessionId = this._route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.sessionId;

    if (this.isEditMode && this.sessionId) {
      const existing = this._sessionStateService.getById(this.sessionId);
      if (existing) {
        this.sessionForm.patchValue({
          title: existing.title,
          date: existing.date,
          location: existing.location ?? '',
          rollId: existing.rollId ?? '',
          notes: existing.notes ?? '',
        });
      } else {
        // Session not found in state — navigate back to list.
        this._router.navigate(['/sessions']);
      }
    }
  }

  private _setupHeader(): void {
    this._headerService.setConfig({
      title: this.isEditMode ? 'Edit Session' : 'New Session',
      showBackButton: true,
      actionButtons: [
        {
          id: 'save-session',
          label: 'Save',
          type: 'text',
          action: () => this.onSave(),
        },
      ],
    });
  }
}
