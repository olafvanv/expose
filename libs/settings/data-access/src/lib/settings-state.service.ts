import { Injectable, signal } from '@angular/core';

// =============================================================================
// SettingsStateService
// Reactive state manager for user configurations (theme, preferred homepage)
// with LocalStorage persistence.
// =============================================================================

export type AppTheme = 'light' | 'dark' | 'system';
export type HomePagePreference = 'sessions' | 'rolls' | 'photos';

const THEME_KEY = 'expose_theme';
const HOME_PAGE_KEY = 'expose_preferred_home_page';

@Injectable({ providedIn: 'root' })
export class SettingsStateService {
  private readonly _theme = signal<AppTheme>('system');
  public readonly theme = this._theme.asReadonly();

  private readonly _preferredHomePage = signal<HomePagePreference>('sessions');
  public readonly preferredHomePage = this._preferredHomePage.asReadonly();

  public constructor() {
    this._loadSettings();
    this._applyTheme(this._theme());
    this._listenToSystemThemeChanges();
  }

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Sets the application theme and persists it to local storage.
   */
  public setTheme(theme: AppTheme): void {
    this._theme.set(theme);
    localStorage.setItem(THEME_KEY, theme);
    this._applyTheme(theme);
  }

  /**
   * Sets the preferred home page and persists it to local storage.
   */
  public setPreferredHomePage(page: HomePagePreference): void {
    this._preferredHomePage.set(page);
    localStorage.setItem(HOME_PAGE_KEY, page);
  }

  // ---------------------------------------------------------------------------
  // Private Methods
  // ---------------------------------------------------------------------------

  /**
   * Loads saved settings from local storage.
   */
  private _loadSettings(): void {
    const savedTheme = localStorage.getItem(THEME_KEY) as AppTheme;
    if (savedTheme) {
      this._theme.set(savedTheme);
    }

    const savedPage = localStorage.getItem(HOME_PAGE_KEY) as HomePagePreference;
    if (savedPage) {
      this._preferredHomePage.set(savedPage);
    }
  }

  /**
   * Resolves the theme and sets the HTML data-theme attribute.
   */
  private _applyTheme(theme: AppTheme): void {
    let resolvedTheme: 'light' | 'dark' = 'light';

    if (theme === 'system') {
      const systemPrefersDark =
        typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolvedTheme);
    }
  }

  /**
   * Configures event listener to track system theme shifts.
   */
  private _listenToSystemThemeChanges(): void {
    if (typeof window !== 'undefined' && !!window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this._theme() === 'system') {
          this._applyTheme('system');
        }
      });
    }
  }
}
