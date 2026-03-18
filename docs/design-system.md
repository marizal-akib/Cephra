# Cephra Design System Basics

This prototype uses a lean Apple-inspired clinical system focused on readability and calm hierarchy.

## Color Tokens

### Foundation
- `background`: `#F5F5F7`
- `surface`: `#FFFFFF`
- `text-primary`: `#1D1D1F`
- `text-secondary`: `#86868B`
- `border`: `#D2D5DA`

### Action
- `primary`: `#007AFF`
- `primary-foreground`: `#FFFFFF`
- `accent`: `#EDF2FF`

### Clinical Semantics
- `red-flag`: `#C62828`
- `red-flag-soft`: `#FDECEC`
- `warning`: `#B7791F`
- `warning-soft`: `#FFF6E6`
- `success`: `#2E7D32`
- `success-soft`: `#ECF8EF`

## Typography Scale

- `display`: `36px / 1.2` (hero only)
- `h1`: `28px / 1.25`
- `h2`: `22px / 1.3`
- `h3`: `18px / 1.35`
- `body-lg`: `16px / 1.5`
- `body`: `15px / 1.45`
- `caption`: `13px / 1.4`
- `label`: `12px / 1.3` + uppercase + `0.04em` tracking

## Spacing and Radius

- Base grid: `8px`
- Card padding: `16px-24px`
- Card radius: `12px-16px`
- Touch targets (patient side): `44px` min height

## Component Rules

- Use cards for all grouped information and section boundaries.
- Keep destructive color usage reserved for safety and red flags.
- Prefer 1 primary action per section; keep secondary actions outlined.
- Use sticky summary rail on desktop assessment workflow only.
