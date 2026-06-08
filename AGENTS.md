# Expose

Een (mobile-first) applicatie om te loggen welke instellingen de gebruiker heeft gebruikt per gemaakte foto met een analoge camera
Denk hierbij aan diafragma, sluitertijd, ISO, focusafstand, lichtomstandigheden, onderwerp, etc.

Het initiele doel is om inzicht te krijgen in welke instellingen leiden tot welke resultaten.
Later zou ik graag willen toevoegen dat je instellingen kan berekenen (wellicht met hulp van AI?) op basis van een situatieschets of een foto.

## Tech stack

- Angular 21
- Nx
- SCSS
- Vitest voor tests
- IndexDB voor opslag van data (fase 1: geen backend)
- Zodra er een eigen backend moet komen, dan wordt dit NestJS

## Structuur

- `apps/web` - Angular frontend applicatie
- `libs/*` - Libraries voor hergebruik van code
  - `libs/ui` - UI componenten
  - `libs/data-access` - Data access lagen
  - `libs/utils` - Utility functies
  - `libs/features` - Features van de applicatie

## Conventies

- Standalone Angular componenten altijd
- Signals gebruiken
- Mobile first tailwind classes
- Geen Angular Material
- Spartan UI voor Angular componenten
- Geen andere third party UI libraries, tenzij expliciet goedgekeurd
- Altijd losse html en scss bestanden per component
- Altijd prefix component bestanden zoals `.component.` of `.service.` etc.
- Voor type definitions gebruik `type` in plaats van `interface`.
- De web app bevat state management in een service met signals. Ngrx of SignalStore is voor nu nog te veel.
- Duidelijke scheiding tussen een state service en een http service.
- Components roepen het liefst geen http service aan, maar gaan via een state service

## Wat nog niet bestaat

- Er zijn nog geen features gebouwd
- Er moet een state laag komen voor de web app
- Er moeten http service(s) aangemaakt worden voor de web app
- de data moet worden opgeslagen (in eerste instantie indexDB, later evt een eigen backend)
