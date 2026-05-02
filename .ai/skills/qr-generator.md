---
name: qr-generator
description: Generate QR code image assets from JSON records, especially facility data where each QR payload should be a plain ID such as facility-001. Use when asked to create QR images, QR test fixtures, QR manifests, or facility QR codes from a JSON file.
---

# QR Generator

Use this when generating QR code image assets from a JSON file such as `src/data/facilities.json`.

## Workflow

1. Confirm the QR payload format. For facility check-in, use the plain facility ID by default, for example `facility-001`.
2. Use the project utility rather than rewriting QR generation code:

   ```bash
   bun run qr:generate -- --input src/data/facilities.json --output public/qr/facilities
   ```

3. Use `--id-field <field>` only when the JSON records do not use `id`.
4. Use `--format svg` by default. SVGs are small, deterministic, and easy to inspect in a static app. Use `--format png` only when a target device or testing tool requires raster images.
5. Verify the output directory contains one image per source record and a `manifest.json` mapping IDs to generated files.
6. Do not add backend, API route, database, or build-time service machinery for QR generation. The utility is a developer/test asset generator.

## Examples

Generate all facility QR SVGs:

```bash
bun run qr:generate -- --input src/data/facilities.json --output public/qr/facilities
```

Generate PNG files from a JSON file with a custom key:

```bash
bun run qr:generate -- --input ./facilities.json --output public/qr/facilities --id-field facilityId --format png
```
