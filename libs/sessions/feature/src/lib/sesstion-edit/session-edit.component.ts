import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RollStateService } from '@expose/rolls/data-access';
import { SessionStateService } from '@expose/sessions/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { SelectInputComponent, TextInputComponent } from '@expose/ui/form-fields';
import { format } from 'date-fns';

// =============================================================================
// SessionEditComponent
// Standalone form component for creating and editing shooting sessions.
// Operates in 'create' mode for /sessions/new and 'edit' for /sessions/:id/edit.
// =============================================================================

@Component({
  selector: 'lib-session-edit',
  templateUrl: './session-edit.component.html',
  styleUrl: './session-edit.component.scss',
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, SelectInputComponent],
})
export class SessionEditComponent implements OnInit {
  private readonly headerService = inject(HeaderService);
  private readonly sessionStateService = inject(SessionStateService);
  private readonly rollStateService = inject(RollStateService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // Route param :id
  public id = input<string>();
  public isEditMode = computed<boolean>(() => !!this.id());

  public sessionForm!: FormGroup;
  public sessionId: string | null = null;

  /** Dropdown options for roll selection, built from loaded rolls. */
  public readonly rollOptions = this.rollStateService.rolls().map((roll) => ({
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

  public ngOnInit(): void {
    console.log(this.id(), this.isEditMode());
    this.rollStateService.loadAll();
    this.initForm();
    this.checkEditMode();
    this.setupHeader();
  }

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

    if (this.isEditMode()) {
      await this.sessionStateService.updateSession(this.id() as string, sessionData);
    } else {
      await this.sessionStateService.addSession(sessionData);
    }

    this.router.navigate(['/sessions']);
  }

  private initForm(): void {
    const today = format(new Date(), 'yyyy-MM-dd');
    this.sessionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      date: [today, [Validators.required]],
      location: [''],
      rollId: [''],
      notes: [''],
    });
  }

  private checkEditMode(): void {
    if (this.isEditMode()) {
      const existing = this.sessionStateService.getById(this.id() as string);
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
        this.router.navigate(['/sessions']);
      }
    }
  }

  private setupHeader(): void {
    this.headerService.setConfig({
      title: this.isEditMode() ? 'Edit Session' : 'New Session',
      showBackButton: true,
      backAction: () => this.router.navigate(['/sessions']),
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
