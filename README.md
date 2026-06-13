# Expose

Expose is a mobile-first web application designed for analog photographers to log and analyze the settings used for every photo they take. By tracking parameters like aperture, shutter speed, ISO, focal length, lighting conditions, and subject details, Expose helps photographers gain insights into how their settings translate to final developed images.

In the future, Expose aims to assist photographers by dynamically calculating recommended exposure settings based on situational descriptions or real-time photo analyses (powered by AI).

Notably, the codebase, architecture, and UI of this application have been designed and implemented primarily by AI coding assistants, serving as a showcase of modern agentic software development.

---

## 🚀 Key Features

- **Shooting Sessions**: Group exposures by sessions/outings to keep logbooks organized.
- **Film Roll Management**: Track active and completed rolls, including format (35mm, 120, etc.), box speed (ISO), brand, and dynamic exposure frame counts.
- **Detailed Photo Logging**: Log aperture, shutter speed, focal length, light conditions, subjects, and custom notes per frame.
- **Customizable Preferences**: Toggle between Light, Dark, and System appearance modes. Define a preferred startup homepage (Sessions, Film Rolls, or Photos) for quick access.
- **Offline-First & Mobile-First**: Built with a responsive layout designed for mobile screens, persisting data directly on-device using IndexedDB (no backend required in Phase 1).

---

## 🛠️ Tech Stack

- **Frontend Framework**: Angular 21 (using Standalone Components and Signals)
- **Monorepo Management**: Nx
- **Styling**: Vanilla SCSS (nested selectors, custom design tokens, responsive layouts)
- **Data Persistence**: IndexedDB (via local repository services)
- **Testing**: Vitest

---

## 📁 Repository Structure

- `apps/web` — The main Angular single-page frontend application.
- `libs/ui` — Reusable, standalone UI elements (e.g., `<lib-text-input>`, `<lib-select-input>`, dynamic headers).
- `libs/data-access` — The state management and database access services (using Angular Signals to manage rolls, sessions, photos, and settings state).
- `libs/features/*` — Feature-specific component libraries (e.g., sessions overview, film roll forms, settings panels).

---

## 💻 Developer Commands

To run the development server:
```sh
npx nx serve web
```

To run lint checks across all workspace projects:
```sh
npx nx run-many --target=lint --all
```

To execute unit tests:
```sh
npx nx run-many --target=test --all
```

To compile a production build:
```sh
npx nx build web
```
