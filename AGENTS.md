# Expose

Een (mobile-first) applicatie om te loggen welke instellingen de gebruiker heeft gebruikt per gemaakte foto met een analoge camera
Denk hierbij aan diafragma, sluitertijd, ISO, focusafstand, lichtomstandigheden, onderwerp, etc.

Het initiele doel is om inzicht te krijgen in welke instellingen leiden tot welke resultaten.
Later zou ik graag willen toevoegen dat je instellingen kan berekenen (wellicht met hulp van AI?) op basis van een situatieschets of een foto.

## Tech stack

- Angular 21
- Nx
- SCSS + tailwind css
- Vitest voor tests
- IndexDB voor opslag van data (fase 1: geen backend)

## Structuur

- `apps/web` - Angular frontend applicatie
- `libs/*` - Libraries voor hergebruik van code
  - `libs/ui` - UI componenten
  - `libs/data-access` - Data access lagen
  - `libs/utils` - Utility functies
  - `libs/features` - Features van de applicatie

## Conventies

- Standalone Angular componenten altijd
- Mobile first tailwind classes
- Geen Angular Material
- Spartan UI voor Angular componenten
- Geen andere third party UI libraries, tenzij expliciet goedgekeurd
- Altijd losse html en scss bestanden per component
- Altijd prefix component bestanden zoals `.component.` of `.service.` etc.

## Wat nog niet bestaat

- `libs/*` is nog niet gemaakt
- Er is nog geen routing aangemaakt
- Er zijn geen datamodellen gemaakt
- Er zijn nog geen features gebouwd
