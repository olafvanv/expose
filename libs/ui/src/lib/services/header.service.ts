import { Injectable, signal } from '@angular/core';

// =============================================================================
// Header Types
// =============================================================================

export type HeaderActionButton = {
  id: string;
  label?: string;
  icon?: 'filter' | 'more' | 'save' | 'plus' | string;
  type: 'icon' | 'text';
  action: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export type HeaderConfig = {
  title: string;
  showBackButton?: boolean;
  actionButtons?: HeaderActionButton[];
  backAction?: (() => void) | null;
};

// =============================================================================
// HeaderService
// Manages the global top navigation header state using Signals.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private readonly _title = signal<string>('Expose');
  private readonly _showBackButton = signal<boolean>(false);
  private readonly _actionButtons = signal<HeaderActionButton[]>([]);
  private readonly _backAction = signal<(() => void) | null>(null);

  // ---------------------------------------------------------------------------
  // Public Properties (Readonly Signals)
  // ---------------------------------------------------------------------------

  public readonly title = this._title.asReadonly();
  public readonly showBackButton = this._showBackButton.asReadonly();
  public readonly actionButtons = this._actionButtons.asReadonly();
  public readonly backAction = this._backAction.asReadonly();

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Updates the header configuration.
   */
  public setConfig(config: HeaderConfig): void {
    this._title.set(config.title);
    this._showBackButton.set(config.showBackButton ?? false);
    this._actionButtons.set(config.actionButtons ?? []);
    this._backAction.set(config.backAction ?? null);
  }

  /**
   * Resets the header to the default settings (title "Expose", no buttons).
   */
  public reset(): void {
    this._title.set('Expose');
    this._showBackButton.set(false);
    this._actionButtons.set([]);
    this._backAction.set(null);
  }
}
