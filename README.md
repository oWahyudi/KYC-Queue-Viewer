**Deployed Frontend URL:** [kyc-queue-viewer.vercel.app](https://kyc-queue-viewer.vercel.app)

# KYC Queue Viewer (React + Vite + Tailwind + shadcn/ui)

Single-page UI to browse KYC records by queue and view details. Click **File_Name** to preview in a modal.

## Quick Start

```bash
# 1) Install deps
npm i

# 2) Run dev server
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

## Data

- JSON: `public/data/KYC_Status_with_audit_revised.json` (copied from your upload)
- Docs base path for previews: `public/docs/` (change to S3/CDN by editing `docBaseUrl` in `src/App.tsx`).

## Stack

- React 18 + TypeScript (Vite)
- TailwindCSS
- Minimal **shadcn/ui** components (local) built with Radix Primitives:
  - Button, Card, Input, Dialog, Tabs, ScrollArea, Textarea, Badge

## Notes

- The left panel shows queues (PROCESSED, INPROCESSED, FAILED) with counts.
- Search by **display ID** (e.g., `KYC-2025-0001`). Display ID is derived from `created_at` year and numeric `id`.
- `audit_log` is shown in a read-only textarea, one line per entry.
- PDF files open in an `<iframe>`, images in `<img>`.


---

## Production API Mode

In **production builds**, the app fetches from `VITE_API_BASE + /v1/kycrecord`.

1. Create a `.env` file in the project root:
   ```env
   VITE_API_BASE=https://your-api-host
   ```
2. Build for production:
   ```bash
   npm run build
   npm run preview   # or deploy the dist/ folder behind your web server/CDN
   ```

### Expected API
- `GET /v1/kycrecord` → returns an array of records shaped like the sample JSON.
- If your API uses `final_decision: "INPROCESSED"`, it will be normalized to `INPROCESS` in the UI.
- Ensure **CORS** allows your frontend origin in production.
