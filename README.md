# Digital Health Score

One Score. Complete Application Health.

A React and Vite prototype for reviewing application performance, security,
accessibility, and user experience in one dashboard. Scans use sample data and
are simulated locally; no backend or external API is required.

## Run locally

```bash
npm install
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## GitHub Pages

The production build is configured for the repository URL
`https://keerthika19js-dotcom.github.io/Digital-Health-Score-App/`. GitHub Pages
must use **GitHub Actions** as its build and deployment source. Pushing to
`main` runs `.github/workflows/deploy.yml`, which builds the app and deploys
the `dist` directory.
