import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SettingsStateService } from '@expose/data-access';

/**
 * Guard that redirects the user from the root path to their preferred home page if it is not 'sessions'.
 */
export const homeGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const settingsState = inject(SettingsStateService);
  const preference = settingsState.preferredHomePage();

  if (preference !== 'sessions') {
    router.navigate([`/${preference}`]);
    return false;
  }

  return true;
};
