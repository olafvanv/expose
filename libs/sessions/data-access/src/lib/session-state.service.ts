import { inject, Injectable, signal } from '@angular/core';
import { CreateSessionInput, Session, UpdateSessionInput } from '@expose/data-access';
import { SessionDataService } from './session-data.service';

// =============================================================================
// SessionStateService
// Intermediary reactive state management layer for photo sessions using Signals.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class SessionStateService {
  private readonly _sessionDataService = inject(SessionDataService);
  private readonly _sessions = signal<Session[]>([]);
  private readonly _loading = signal<boolean>(false);

  public readonly sessions = this._sessions.asReadonly();
  public readonly loading = this._loading.asReadonly();

  /**
   * Returns a single session by id from the currently loaded state, or undefined if not found.
   */
  public getById(id: string): Session | undefined {
    return this._sessions().find((s) => s.id === id);
  }

  /**
   * Loads all sessions from the database into the state.
   */
  public async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const sessions = await this._sessionDataService.getAll();
      this._sessions.set(sessions);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Adds a new session to the database and updates state.
   */
  public async addSession(input: CreateSessionInput): Promise<Session> {
    this._loading.set(true);
    try {
      const newSession = await this._sessionDataService.create(input);
      this._sessions.update((sessions) => [...sessions, newSession]);
      return newSession;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Updates an existing session in the database and state.
   */
  public async updateSession(id: string, input: UpdateSessionInput): Promise<Session> {
    this._loading.set(true);
    try {
      const updatedSession = await this._sessionDataService.update(id, input);
      this._sessions.update((sessions) => sessions.map((session) => (session.id === id ? updatedSession : session)));
      return updatedSession;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Deletes a session from the database and updates state.
   */
  public async deleteSession(id: string): Promise<void> {
    this._loading.set(true);
    try {
      await this._sessionDataService.delete(id);
      this._sessions.update((sessions) => sessions.filter((session) => session.id !== id));
    } finally {
      this._loading.set(false);
    }
  }
}
