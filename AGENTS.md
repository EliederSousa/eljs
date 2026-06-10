# eljs — Agent instructions

General-purpose 2D canvas drawing library for animation, physics, and games.

## Quick start

```bash
npx vite  # index.html is the entrypoint (no package.json needed)
```

No `package.json`, no build, test, lint, or typecheck commands exist. `.vite/` is Vite cache (ignore).

## Architecture

- `src/main.ts` — app entrypoint, imported via `<script type="module">` in `index.html`
- All imports use explicit `.js` extensions (TypeScript ESM convention)
- `Item` (base, UUID identity + Timer lifecycle) → `Shape` (position, color, vertices, drawMode) → concrete shapes (`CircleObject`, `SquareObject`, `RectangleObject`, etc.)
- `drawMode` determines how `position` is interpreted: `"UPLEFT"`, `"CENTER"`, or `"VERTICES"`
- Every `Shape` must implement `updateVertices()` (kept in sync before draw) and `draw()`
- Composition pattern: `RigidBody` composes `Shape` (visual) + `MovableObject` (physics) rather than inheriting from either
- `Screen` — wraps `<canvas>`, supports `"fullscreen"` or a container element; `draw()` fills background; `drawItem()` applies camera/zoom transforms
- `Camera` — follow/move-to with easing functions; `apply()` is called by `Screen.drawItem()`
- `Timer` — `compare()` / `update()` cycle for frame-rate-independent waits
- `World` — orchestrator with 3-phase loop (input → physics → render), owns screen, camera, emitters, objects
- `Properties` — global static flags (`debugBox`, `velocityLine`, `circularScreen`, etc.)
- No tests, no CI, no linter or formatter config

## Point module (`src/physics/Point.ts`)

2D vector used everywhere (position, velocity, acceleration, vertices). Already converted to TypeScript. Uses constructor overloads for normal vs. angle-based construction.

### Constructor
```ts
new Point(x, y)        // normal cartesian
new Point(angle, "angle")  // from angle in degrees, unit vector
```

### Key behaviors
- All arithmetic methods (`add`, `sub`, `mul`, `div`, `scale`, `rotate`) **mutate in place** and return `this` for chaining
- `normal()` returns a **new** Point (does not mutate)
- `fastSize()` returns squared magnitude (avoids `Math.sqrt`)
- `rotate(angleDeg)` — rotates in degrees
- `getAngle()` — returns angle in degrees
- `limit(max)` — scales magnitude down to `max` if exceeded (mutates)
- `clone()` — returns a new Point copy

### Dependencies
Depends on `MathHelper` (`src/util/MathHelper.js`) for `_PI180` (deg→rad conversion).

## TypeScript

All source files are `.ts`. Imports use `.js` extensions (ESM convention — Vite/TypeScript resolve to the `.ts` source). The `jsconfig.json` includes `src/**/*.ts` for editor type-checking.

## Conventions

- Source files in `src/objects/`, `src/core/`, `src/util/`, `src/input/`, `src/physics/`
- Examples in `examples/` — standalone `.js` files you can load in place of `main.ts`
- Canvas rendering via `CanvasRenderingContext2D`
- Prefer `requestAnimationFrame` game loop pattern (see `src/main.ts`)
