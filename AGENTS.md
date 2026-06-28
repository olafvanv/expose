# Expose

A mobile-first application for logging the settings used per photo taken with an analog camera.
Think aperture, shutter speed, ISO, focal length, light conditions, subject, etc.

The initial goal is to gain insight into which settings lead to which results.
In the future I would like to add the ability to calculate settings (perhaps with the help of AI?) based on a situation description or a photo.

## Tech stack

- Angular 21
- Nx
- SCSS
- Vitest for tests
- IndexedDB for data storage (phase 1: no backend)
- When a backend is needed, it will be NestJS

## Structure

Libraries are organized by domain. Each domain can contain the following library types:

- `libs/shared/` - Cross-domain shared libraries
  - `libs/shared/data-access` — shared models, base services, and the IndexedDB setup (`@expose/data-access`)
  - `libs/shared/shell/data-access` — `HeaderService` and other shell-level services (`@expose/shell-data-access`)
  - `libs/shared/ui/components/form-fields` — shared form components: `TextInputComponent`, `SelectInputComponent`, `ScrollPicker` (`@expose/ui/form-fields`)
  - `libs/shared/ui/components/empty-state` — shared empty state component (`@expose/ui/empty-state`)
  - `libs/shared/ui/styles` — global SCSS tokens, mixins and base styles (`@expose/ui-styles`)
  - `libs/shared/util` — shared utility functions and types, e.g. `toFormOptions` (`@expose/util`)
- `libs/photos/` — Photos domain
  - `libs/photos/data-access` — `PhotoStateService` (`@expose/photos/data-access`)
  - `libs/photos/feature` — photo list, photo-detail and photo-edit pages (`@expose/photos/feature`)
- `libs/rolls/` — Rolls domain
  - `libs/rolls/data-access` — `RollStateService` (`@expose/rolls/data-access`)
  - `libs/rolls/feature` — rolls list and roll-edit pages (`@expose/rolls/feature`)
- `libs/sessions/` — Sessions domain
  - `libs/sessions/data-access` — `SessionStateService` (`@expose/sessions/data-access`)
  - `libs/sessions/feature` — sessions list, session-detail and session-edit pages (`@expose/sessions/feature`)
- `libs/settings/` — Settings domain
  - `libs/settings/data-access` — `SettingsStateService` (`@expose/settings/data-access`)
  - `libs/settings/feature` — settings page (`@expose/settings/feature`)
- `apps/web` — Angular frontend application (shell, routing)

## Conventions

- Always use standalone Angular components
- Use signals
- Mobile-first approach
- No other third-party UI libraries unless explicitly approved
- Always use separate HTML and SCSS files per component
- Always prefix component files with `.component.`, `.service.`, etc.
- Use `type` instead of `interface` for type definitions
- State management lives in a service using signals. NgRx or SignalStore is too much for now.
- Clear separation between a state service and a http service
- Components should not call http services directly — they go through a state service
- All methods in components and services must be sorted public → protected → private
- Every method and property in a class must have an access modifier
- Every method in a service must have a short description (JSDoc)
- All comments, descriptions, code, and UI text must be in English.
- You don't have to verify your changes by running the app and by opening a browser. You can see what's going on from the terminal output.
- All private variables should start with an underscore, except for the injects.
- Always nest SCSS selectors.
- Always place private injects at the top of the class.
- Never import the `CommonModule`
- Use typed `FormGroup<T>` instead of the untyped `FormGroup` where possible
- Use `toFormOptions()` or `toFormOptionsComputed()` from `@expose/util` to map arrays to `FormOption[]` for use in form controls
- Route parameters passed as Angular inputs use `input<string | null>(null)` — do not use `ActivatedRoute.snapshot` when an input signal is available
