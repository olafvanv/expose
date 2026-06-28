import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateSessionInput, RollStateService } from '@expose/data-access';
import { SessionStateService } from '@expose/sessions/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { SelectInputComponent, TextInputComponent } from '@expose/ui/form-fields';
import { toFormOptionsComputed } from '@expose/util';
import { format } from 'date-fns';

type SessionForm = {
  title: FormControl<string | null>;
  date: FormControl<string | null>;
  location: FormControl<string | null>;
  rollId: FormControl<string | null>;
  notes: FormControl<string | null>;
};

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
  public isEditMode = computed(() => !!this.id());

  public sessionForm: FormGroup<SessionForm> = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    date: [format(new Date(), 'yyyy-MM-dd'), [Validators.required]],
    location: [''],
    rollId: [''],
    notes: [''],
  });

  public readonly rollOptions = toFormOptionsComputed(this.rollStateService.rolls, {
    valueFn: (roll) => roll.id,
    labelFn: (roll) => `${roll.brand} ${roll.name} (ISO ${roll.iso})`,
  });

  public ngOnInit(): void {
    this.rollStateService.loadAll();
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
    const sessionData: CreateSessionInput = {
      title: formValue.title as string,
      date: formValue.date as string,
      location: formValue.location as string,
      rollId: formValue.rollId as string,
      notes: formValue.notes as string,
    };

    if (this.isEditMode()) {
      await this.sessionStateService.updateSession(this.id() as string, sessionData);
    } else {
      await this.sessionStateService.addSession(sessionData);
    }

    this.router.navigate(['/sessions']);
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
