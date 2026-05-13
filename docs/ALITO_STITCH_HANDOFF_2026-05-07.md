# ALITO Stitch Handoff

Date: 2026-05-07

## Stitch Project

- Project title: `ALITO Quantum Industrial`
- Project id: `759036247473864965`

## Local Inputs Created

- `.stitch/DESIGN.md`
- `.stitch/SITE.md`
- `.stitch/STITCH_MASTER_PROMPT.md`

## Design System

- Asset id: `assets/9a0ceed7cba542b5b5d6a6eaf04fa528`
- Name: `ALITO Quantum Industrial`

## Generated Screens

### 1. Homepage Hero

- Screen id: `e5d5def044434ab8b1c00b33e339bee1`
- Screenshot:
  `https://lh3.googleusercontent.com/aida/ADBb0ujdHTUgk4CaJas8AXIRzZPZa88mbKqNhxm5qdq8sMCOVTWRu3xcWjGKdteOBiCVj_hwnOc3R7QgF9NKMhRBuPYaNI0-AaVeuixtiuV-vC4skdKmLt4_CNx3P2MvC-cjd45DQ_Jx61Vnk5-FWMI4UdrTuTjN0oNGaZudrQnldEr80h1SfaePAeGXLY_ZHmYmzafmzLjjC80dEutfFL6PEFIHeJfXOnAGaQaxNQ63yNRf4ciAJzzR2TUzhg`
- HTML:
  `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzMwM2ZkNGUxYzU1ODQ3M2I4MjdlOTQxNDVhODc2MTYzEgsSBxDF8KWEyAMYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTkwMzYyNDc0NzM4NjQ5NjU&filename=&opi=96797242`

### 2. Categories / Catalog

- Screen id: `314cc951dd844663a0f83a4041492e6d`
- Screenshot:
  `https://lh3.googleusercontent.com/aida/ADBb0ujvzZ5hxryWPnlJw96H6rCuefD6IVM0BcwagUkyHI8QuUl3Kmj3Yv65fuf65KIM6bH_i1TNd3vv-Wut17Z-QqHv8abnJTLlimaEboXk1QQrm2hJayCRoe0i1C66m5h9h412Q0oWf-mAeP6ZFWo-0VWvS_bU2f5ytADxHppqn_HYWT1grZ8BSeyCoX9T__Cpw9k8gyTeilRnPnakfWOJeBqgbwPm4MyG9qaInStxx_vTAGuRteJgGgf9Mw`
- HTML:
  `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzIyMDQyNDUzOGFiZTQ1MzRiYjQ2MjZmNjIxMzRlNjE4EgsSBxDF8KWEyAMYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTkwMzYyNDc0NzM4NjQ5NjU&filename=&opi=96797242`

### 3. Guided Quote Workflow

- Screen id: `cacd9063666e4f169c54268cf1d2f625`
- Screenshot:
  `https://lh3.googleusercontent.com/aida/ADBb0uhsBu5fkKu2JIBB8uygFP4mC1KuwbT4oQaFHU3YqDDx_YO_YXY1Z0V54zEE1Y1NYbVY4QIrWUyXyYimAkuhRI1kETVTfpeiteNrWISCIooI3_FcuPJHCNaAXeiWWdmnGxMWXLG0xiqkfBzX6rOf6CcgmwmlSHdXcOh1NqBY7Y4WoAbGx7BhjLK-0R5AHVimpbVEa0ztki4Vc0OgdWsdeFbgbtwYUHqc_L5fgafwS3-MRBYp0QI_R4B-`
- HTML:
  `https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzM1MjI2YjkxZmEwMjQxNjM4NzA5Nzg5NzY5OGYyNWNlEgsSBxDF8KWEyAMYAZIBIgoKcHJvamVjdF9pZBIUQhI3NTkwMzYyNDc0NzM4NjQ5NjU&filename=&opi=96797242`

## Stack Recommendation

These libraries are already present in `apps/storefront/package.json` and are the correct base for this redesign:

- `framer-motion`
- `gsap`
- `lenis`
- `three`
- `@react-three/fiber`
- `@react-three/drei`

## Recommended Build Strategy

Do not convert the entire site into a heavy WebGL experience.

Use a hybrid approach:

1. Real product PNG renders for category cards and hero machinery.
2. Soft 3D accents and abstract geometry only in hero / premium sections.
3. Motion and depth via `framer-motion`, `gsap`, and `lenis`.
4. `react-three-fiber` only where spatial value is highest.

## Repo Assets Worth Reusing

- `apps/storefront/public/alito-catalog`
- `apps/storefront/public/videos`
- `apps/storefront/public/alito-logo.png`
- `apps/storefront/public/alito-catalog/selected-images.json`

## Notes

- The full long-form screen generation through HTTP timed out, but the project, design system, and three key screens were generated successfully.
- The generated screens are a strong visual direction and should be treated as source concepts for implementation in the storefront.
