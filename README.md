# Profile

Personal professional site built on [Adobe Edge Delivery Services](https://www.aem.live/) (EDS), based on the [AEM boilerplate](https://github.com/adobe/aem-boilerplate/). The codebase implements a discoverable online résumé, structured data for search engines, and client-side enhancements using standard web technologies.

[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%2F100-brightgreen?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/report?url=https%3A%2F%2Fmain--profile--gilbert-lee-tech.aem.live%2F)

## Objectives

- **Professional presence and SEO** — Publish résumé content on the open web with search-friendly markup so recruiters and hiring teams can find accurate, up-to-date information.
- **Edge Delivery Services** — Demonstrate practical EDS implementation skills in addition to traditional AEM Sites experience.
- **Front-end engineering** — Apply semantic HTML, CSS, and JavaScript within the Edge Delivery performance and authoring model.

## Custom Edge Delivery blocks

The following blocks extend the boilerplate beyond default components:

| Block | Description |
| --- | --- |
| `google-rich-results` | Accepts author-defined key–value pairs (including dotted paths for nested properties) and emits a single `application/ld+json` script. Defaults target Schema.org `Person`; values are coerced where appropriate (booleans, numbers, embedded JSON). Repeated keys are aggregated into arrays. |
| `company-position-period` | Expects three rows (company name, position, period) and lays them out on one line with block-scoped classes. Company links use `target="_blank"` and `rel="noopener noreferrer"`. The period is given a URL fragment `id` derived from its text (slug) for deep linking. |
| `three-cards` | Same content model as Cards (image plus body per row), rendered as a list with up to three cards per row on wide viewports; extra cards wrap and short last rows stay centered. Pictures are optimized via `createOptimizedPicture`; cards animate into view once (IntersectionObserver), with reduced-motion support in CSS. |
| `left-right-card` | Same content model as Cards (image plus body per row), but each card renders as a single horizontal row at 80% width. Placing the image in the first column puts it on the left; placing it in the second column puts it on the right. Uses a 4/8 flex ratio between image and body. Cards have rounded corners and a drop shadow. |
| `site-credit` | Footer strip that renders a single cell of rich text (supports inline links). Styled with the nav background and text colours; link hover uses a bottom-border underline animation. |

## Environments

| Environment | URL |
| --- | --- |
| Preview | [main--profile--gilbert-lee-tech.aem.page](https://main--profile--gilbert-lee-tech.aem.page/) |
| Production | [main--profile--gilbert-lee-tech.aem.live](https://main--profile--gilbert-lee-tech.aem.live/) |

## Documentation

Primary reference: [Adobe Edge Delivery documentation](https://www.aem.live/docs/). Recommended starting points:

1. [Developer tutorial](https://www.aem.live/developer/tutorial)
2. [Anatomy of a project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, sections, blocks, and auto-blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm install
```

## Linting

```sh
npm run lint
```

## Local development

1. Clone this repository and install dependencies (`npm install`).
2. Install the [AEM CLI](https://github.com/adobe/aem-cli): `npm install -g @adobe/aem-cli`
3. From the project root, run `aem up` (or `npx @adobe/aem-cli up`). The development proxy serves at `http://localhost:3000` by default.

For deployment and preview URLs, the repository must be connected to the [AEM Code Sync](https://github.com/apps/aem-code-sync) GitHub app, as described in the Edge Delivery onboarding documentation.
