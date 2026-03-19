# Changelog

## [0.6.1](https://github.com/workflowlogs/n8n-nodes-workflowlogs/compare/v0.6.0...v0.6.1) (2026-03-19)

### Bug Fixes

* **workflowlogs:** normalize ingest base URL and expose API 400 details ([2bddf56](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/2bddf5684fef0f09adb8869bc63b317d01ca1ef8))

## 0.6.0 (2026-03-19)

### Features

* add Auto-Detect mode with smart error extraction ([8869b7f](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/8869b7f14a2952628331b4afdb57393e921dcad5))
* add release-it for automated npm publishing and GitHub releases ([5972635](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/59726353170a737abb955c85e1ac8a672d0c94fb))
* **node:** auto-bind workflow metadata from n8n context ([7e4e918](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/7e4e918c8c0d3e7c02cabf42d18f0d0a234cb583))
* **WorkflowLogs:** add base URL validation and metadata protection ([4b1d61d](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/4b1d61d76c3226255ea68a21cd8e220d001ddabb))

### Bug Fixes

* **build:** copy SVG icon to dist during build ([4f5a139](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/4f5a13972f898d48623a0609e099e52244f4513f))
* bump version to 0.2.2 for npm publish ([b2233ec](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/b2233ec49a50786577b7640feda9f695cae523f3))
* **ci:** normalize repository.url format for npm publish ([7722cd7](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/7722cd72be71fc8ad2ccd66de9b3885774ae91b8))
* **ci:** update dist paths in release workflow to match rename ([30b72a3](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/30b72a35526c0e18676d4d2270207aa41013a773))
* complete project rename from n8nLogs to WorkflowLogs ([13faefd](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/13faefd6dbcd5c246ddbea89defe8868feed4449))
* pin n8n-workflow to ^1.0.0 to avoid isolated-vm on Node <22 ([323ec71](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/323ec71245eb9a2ecebf002f2168e3a1958f9f45))
* update node icon with transparent background for n8n compatibility ([43ecb71](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/43ecb711d3f4ca8fad3c6a8af772d34d7f02b312))
* update package.json references to match project rename ([0946a25](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/0946a25db5ab9d48c9c43de1954ce06083914e8b))
* use string literals for inputs/outputs for n8n-workflow v1 compat ([091fe31](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/091fe3118835a61bb65cfdd0fa83f808533d6eaf))

## [0.4.0](https://github.com/workflowlogs/n8n-nodes-workflowlogs/compare/v0.3.1...v0.4.0) (2026-03-14)

### Features

* **node:** auto-bind workflow metadata from n8n context ([7e4e918](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/7e4e918c8c0d3e7c02cabf42d18f0d0a234cb583))

## [0.3.1](https://github.com/workflowlogs/n8n-nodes-workflowlogs/compare/v0.3.0...v0.3.1) (2026-03-14)

### Bug Fixes

* **build:** copy SVG icon to dist during build ([4f5a139](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/4f5a13972f898d48623a0609e099e52244f4513f))

## [0.3.0](https://github.com/workflowlogs/n8n-nodes-workflowlogs/compare/v0.2.3...v0.3.0) (2026-03-14)

### Features

* add Auto-Detect mode with smart error extraction ([8869b7f](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/8869b7f14a2952628331b4afdb57393e921dcad5))

## [0.2.3](https://github.com/workflowlogs/n8n-nodes-workflowlogs/compare/v0.2.0...v0.2.3) (2026-03-14)

### Bug Fixes

* bump version to 0.2.2 for npm publish ([b2233ec](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/b2233ec49a50786577b7640feda9f695cae523f3))
* **ci:** update dist paths in release workflow to match rename ([30b72a3](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/30b72a35526c0e18676d4d2270207aa41013a773))
* complete project rename from n8nLogs to WorkflowLogs ([13faefd](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/13faefd6dbcd5c246ddbea89defe8868feed4449))
* update node icon with transparent background for n8n compatibility ([43ecb71](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/43ecb711d3f4ca8fad3c6a8af772d34d7f02b312))
* update package.json references to match project rename ([0946a25](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/0946a25db5ab9d48c9c43de1954ce06083914e8b))

## 0.2.0 (2026-03-13)

### Features

* add release-it for automated npm publishing and GitHub releases ([5972635](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/59726353170a737abb955c85e1ac8a672d0c94fb))

### Bug Fixes

* pin n8n-workflow to ^1.0.0 to avoid isolated-vm on Node <22 ([323ec71](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/323ec71245eb9a2ecebf002f2168e3a1958f9f45))
* use string literals for inputs/outputs for n8n-workflow v1 compat ([091fe31](https://github.com/workflowlogs/n8n-nodes-workflowlogs/commit/091fe3118835a61bb65cfdd0fa83f808533d6eaf))
