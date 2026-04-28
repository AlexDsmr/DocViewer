# DocViewer

Angular application for viewing documents and managing page annotations.

## What Is Implemented

- Documents list page.
- Opening a document by route: `/documents/:id`.
- Mock API via `json-server`.
- Single-page document viewer.
- Page navigation with `Prev` / `Next`.
- Zoom controls with `+` / `-`.
- Wheel navigation between pages when the cursor is outside the page area.
- `Fit` mode that fits the current page into the available viewer area.
- Pan scrolling by dragging the empty viewer/page area.
- `View` and `Edit` page modes.
- Page-level text annotations with optional image URLs stored in `page.annotations`.
- Annotation create/edit/move/delete in `Edit` mode.
- `Save` and `Cancel` edit flow with local snapshot rollback.
- Config-driven shared UI primitives: `Button`, `Toolbar`, `List`, internal `ListItem`.
- Light/dark theme toggle with localStorage persistence and Bootstrap Icons.
- Responsive base layout for desktop and narrow/mobile screens.
- Zone-less Angular setup.
- ESLint and Prettier scripts.

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
- `PUT http://localhost:3000/documents/test-doc`

`json-server` is used only as development infrastructure for API simulation. It is not a viewer, drag, annotation, or state-management library.

## Architecture Notes

The project is split into application components and shared primitives.

- `src/app/components` contains pages and domain-specific components.
- `src/app/shared/ui` contains reusable UI primitives that know nothing about documents.
- `src/app/shared/models` contains typed domain models.
- `src/app/shared/services` contains API and state services.
- `src/app/shared/directives` contains reusable pointer-based behavior.

`DocumentList` builds a `ListConfig` and passes it to the shared `List`. The shared `List` owns rendering of its internal `ListItem`.

`DocumentActionToolbar` builds a `ToolbarConfig` and passes it to the shared `Toolbar`. The shared `Toolbar` owns rendering of button and text controls.

`PageEditStateService` is component-scoped at `DocumentViewerPageComponent` level. This keeps edit drafts and snapshots local to one viewer instance instead of turning page editing into global app state.

`ThemeService` is a root service that applies `data-theme` to the document root and persists the selected theme in localStorage. Color themes are implemented through CSS custom properties in `src/styles/colors.scss`.

Document pages currently support image content and page-level annotations:

```ts
export interface DocumentPage {
  readonly id: string;
  readonly number: number;
  readonly type: 'image';
  readonly imageUrl: string;
  readonly annotations: readonly PageAnnotation[];
}
```

Annotation coordinates are normalized to the page and refer to the top-left anchor point of the annotation block.

## Edit Flow

`View` mode:

- annotations are rendered as formatted text;
- `Edit` button is available;
- page navigation, zoom and fit are available.
- wheel over the page zooms relative to the cursor;
- wheel outside the page switches between pages.

`Edit` mode:

- `Save` and `Cancel` replace `Edit`;
- `Prev` / `Next` are disabled;
- clicking an empty page area creates an annotation;
- dragging empty page/viewer area pans the scroll container;
- annotations render image URL input, textarea and a compact annotation toolbar with delete action;
- annotation images are rendered above text and use Angular `NgOptimizedImage` for sizing and lazy loading hints;
- annotations can be moved with pointer drag;
- `Save` persists the whole document with `PUT /documents/:id`;
- `Cancel` restores the snapshot taken on entering edit mode.

## Trade-offs

- The viewer is page-by-page instead of an infinite vertical document stream. This keeps navigation and annotation editing predictable.
- Wheel-based page navigation is used as a lightweight alternative to a virtualized multi-page infinite scroll.
- Theme switching is implemented with CSS variables and localStorage. Icons are provided by Bootstrap Icons.
- Current page and zoom are internal UI state and are not stored in the URL. This can be improved later if shareable viewer state is required.
- Saving uses whole-document `PUT` because it maps cleanly to `json-server`. A real backend should likely expose page-level or annotation-level endpoints.
- Annotation images are stored as URLs. Angular `NgOptimizedImage` improves loading behavior, but real image compression/resizing for arbitrary URLs would require an image loader, CDN or backend media endpoint.
- The UI is intentionally simple. The first goal is clear structure and stable interaction.
- The mock API is local and assumes `json-server` is running on port `3000`.

## Known Limitations

- No resize for annotation blocks yet.
- No separate annotation API yet.
- No full-scroll mode.
- No retry action for failed document loading/saving.
- No image upload pipeline for annotation images.
- No keyboard shortcuts for navigation or zoom.

## Next Steps

- Add annotation resize and width persistence.
- Add a real annotation persistence API.
- Add backend-backed image upload and optimized image delivery.
- Add optimistic save/error states.
- Add optional virtualized full-scroll mode.
- Add keyboard shortcuts.
- Improve visual polish and accessibility details.
