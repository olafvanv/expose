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

- `apps/web` - Angular frontend application
- `libs/*` - Shared libraries
  - `libs/ui` - UI components
  - `libs/data-access` - Data access layers
  - `libs/utils` - Utility functions
  - `libs/features` - Application features

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
