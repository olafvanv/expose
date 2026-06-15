import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SettingsStateService } from '@expose/data-access';

/**
 * Guard that redirects the user from the root path to their preferred home page.
 */
export const homeGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const settingsState = inject(SettingsStateService);
  const preference = settingsState.preferredHomePage();

  router.navigate([`/${preference}`]);
  return false;
};
