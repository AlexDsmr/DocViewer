# DocViewer

Angular document viewer prototype for the CWI test task.

## What Is Implemented

- Documents list page.
- Opening a document by route: `/documents/:id`.
- Mock API via `json-server`.
- Single-page document viewer.
- Page navigation with `Prev` / `Next`.
- Zoom controls with `+` / `-`.
- `Fit` mode that fits the current page into the available viewer area.
- Config-driven shared UI primitives: `Button`, `Toolbar`, `List`, internal `ListItem`.
- Responsive base layout for desktop and narrow/mobile screens.
- Zone-less Angular setup.
- ESLint and Prettier scripts.

Annotations are intentionally not implemented in this first iteration.

## Run

Install dependencies:

```bash
npm install
```

Run mock API:

```bash
npm run mock:api
```

Run Angular app in another terminal:

```bash
npm start
```

Open `http://localhost:4200/`.

## Quality Scripts

```bash
npm run lint
npm run format:check
npm run format
npm run build
```

## Mock API

The mock data is stored in `db.json`.

Available endpoints:

- `GET http://localhost:3000/documents`
- `GET http://localhost:3000/documents/test-doc`

`json-server` is used only as development infrastructure for API simulation. It is not a viewer, drag, annotation, or state-management library.

## Architecture Notes

The project is split into application components and shared UI primitives.

- `src/app/components` contains pages and domain-specific components.
- `src/app/shared/ui` contains reusable UI primitives that know nothing about documents.
- `src/app/shared/models` contains typed domain models.
- `src/app/shared/services` contains API and shell-level services.

`DocumentList` builds a `ListConfig` and passes it to the shared `List`. The shared `List` owns rendering of its internal `ListItem`.

`DocumentActionToolbar` builds a `ToolbarConfig` and passes it to the shared `Toolbar`. The shared `Toolbar` owns rendering of button and text controls.

Document pages currently support only image content:

```ts
type DocumentPageType = 'image';
```

This is a deliberate simplification for the first iteration. The model can later be extended with text layers, searchable content, selectable text, and annotation anchors.

## Trade-offs

- The viewer is page-by-page instead of an infinite vertical document stream. This keeps the first iteration focused and makes page navigation/zoom predictable.
- Current page and zoom are internal UI state and are not stored in the URL. This can be improved later if shareable viewer state is required.
- The UI is intentionally simple. The first goal is a clear structure and stable interaction model.
- The mock API is local and assumes `json-server` is running on port `3000`.

## Known Limitations

- No annotations yet.
- No annotation save payload yet.
- No full-scroll mode.
- No retry action for failed document loading.
- No keyboard shortcuts for navigation or zoom.

## Next Steps

- Add text annotations with normalized page coordinates.
- Add custom drag implementation without third-party drag libraries.
- Add annotation removal and save payload logging.
- Add optional full-scroll mode.
- Add better loading and error states.
- Improve visual polish and accessibility details.
# DocViewer

Angular document viewer prototype for the CWI test task.

## What Is Implemented

- Documents list page.
- Opening a document by route: `/documents/:id`.
- Mock API via `json-server`.
- Single-page document viewer.
- Page navigation with `Prev` / `Next`.
- Zoom controls with `+` / `-`.
- `Fit` mode that fits the current page into the available viewer area.
- Shared UI primitives: `Button`, `Toolbar`, `List`, `ListItem`.
- Responsive base layout for desktop and narrow/mobile screens.
- Zone-less Angular setup.

Annotations are intentionally not implemented in this first iteration.

## Run

Install dependencies:

```bash
npm install
```

Run mock API:

```bash
npm run mock:api
```

Run Angular app in another terminal:

```bash
npm start
```

Open `http://localhost:4200/`.

## Mock API

The mock data is stored in `db.json`.

Available endpoints:

- `GET http://localhost:3000/documents`
- `GET http://localhost:3000/documents/test-doc`

`json-server` is used only as development infrastructure for API simulation. It is not a viewer, drag, annotation, or state-management library.

## Architecture Notes

The project is split into application components and shared UI primitives.

- `src/app/components` contains pages and domain-specific components.
- `src/app/shared/ui` contains reusable UI primitives that know nothing about documents.
- `src/app/shared/models` contains typed domain models.
- `src/app/shared/services` contains API and shell-level services.

`DocumentList` composes the shared `List` and `ListItem` primitives. `DocumentActionToolbar` composes the shared `Toolbar` and `Button` primitives.

Document pages currently support only image content:

```ts
type DocumentPageType = 'image';
```

This is a deliberate simplification for the first iteration. The model can later be extended with text layers, searchable content, selectable text, and annotation anchors.

## Trade-offs

- The viewer is page-by-page instead of an infinite vertical document stream. This keeps the first iteration focused and makes page navigation/zoom predictable.
- Current page and zoom are internal UI state and are not stored in the URL. This can be improved later if shareable viewer state is required.
- The UI is intentionally simple. The first goal is a clear structure and stable interaction model.
- The mock API is local and assumes `json-server` is running on port `3000`.

## Known Limitations

- No annotations yet.
- No annotation save payload yet.
- No full-scroll mode.
- No retry action for failed document loading.
- No keyboard shortcuts for navigation or zoom.

## Next Steps

- Add text annotations with normalized page coordinates.
- Add custom drag implementation without third-party drag libraries.
- Add annotation removal and save payload logging.
- Add optional full-scroll mode.
- Add better loading and error states.
- Improve visual polish and accessibility details.
# Docviewer

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
