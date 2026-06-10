import { inject, Injectable, signal } from '@angular/core';
import { CreateRollInput, Roll, UpdateRollInput } from '../models/roll.model';
import { RollDataService } from './roll-data.service';

// =============================================================================
// RollStateService
// Intermediary reactive state management layer for film rolls using Signals.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class RollStateService {
  private readonly _rollDataService = inject(RollDataService);
  private readonly _rolls = signal<Roll[]>([]);
  private readonly _loading = signal<boolean>(false);

  public readonly rolls = this._rolls.asReadonly();
  public readonly loading = this._loading.asReadonly();

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Loads all rolls from the database into the state.
   */
  public async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const rolls = await this._rollDataService.getAll();
      this._rolls.set(rolls);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Adds a new roll to the database and updates state.
   */
  public async addRoll(input: CreateRollInput): Promise<Roll> {
    this._loading.set(true);
    try {
      const newRoll = await this._rollDataService.create(input);
      this._rolls.update((rolls) => [...rolls, newRoll]);
      return newRoll;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Updates an existing roll in the database and state.
   */
  public async updateRoll(id: string, input: UpdateRollInput): Promise<Roll> {
    this._loading.set(true);
    try {
      const updatedRoll = await this._rollDataService.update(id, input);
      this._rolls.update((rolls) =>
        rolls.map((roll) => (roll.id === id ? updatedRoll : roll))
      );
      return updatedRoll;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Deletes a roll from the database and updates state.
   */
  public async deleteRoll(id: string): Promise<void> {
    this._loading.set(true);
    try {
      await this._rollDataService.delete(id);
      this._rolls.update((rolls) => rolls.filter((roll) => roll.id !== id));
    } finally {
      this._loading.set(false);
    }
  }
}
