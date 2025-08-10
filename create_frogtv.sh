#!/usr/bin/env bash

# Script to bootstrap the FrogTV.live monorepo directory structure.
# Run this from the root of your project to populate the standard folder
# hierarchy used by the FrogTV.live MVP. It creates nested directories
# for the web client, scene runner, shared packages, infrastructure,
# and tooling. It also adds placeholder `.gitkeep` files so empty
# directories are tracked by git. This script is idempotent and
# can safely be re-run.

set -euo pipefail

echo "Creating FrogTV.live directory structure..."

# Apps: web client
mkdir -p apps/web/src/components
mkdir -p apps/web/src/scenes
mkdir -p apps/web/src/state
mkdir -p apps/web/src/pages

# Apps: scene runner
mkdir -p apps/scene-runner/src/engine
mkdir -p apps/scene-runner/src/rules
mkdir -p apps/scene-runner/src/pubsub

# Shared packages for types, schemas, event contracts
mkdir -p packages/shared

# Infrastructure configuration (Docker, Terraform)
mkdir -p infra/docker
mkdir -p infra/terraform

# Tooling, e.g. playlist curator CLI
mkdir -p tools/playlist-curator

# Add placeholder files so git tracks empty directories
touch apps/web/src/components/.gitkeep
touch apps/web/src/scenes/.gitkeep
touch apps/web/src/state/.gitkeep
touch apps/web/src/pages/.gitkeep
touch apps/scene-runner/src/engine/.gitkeep
touch apps/scene-runner/src/rules/.gitkeep
touch apps/scene-runner/src/pubsub/.gitkeep
touch packages/shared/.gitkeep
touch infra/docker/.gitkeep
touch infra/terraform/.gitkeep
touch tools/playlist-curator/.gitkeep

echo "Directory structure created successfully."

if [[ ! -f README.md ]]; then
  cat > README.md <<'README'
# FrogTV.live Monorepo

This repository contains the code for the **FrogTV.live** project, including:

- **apps/web** — the React client built with Vite and Tailwind
- **apps/scene-runner** — a headless scene renderer for server-side animation
- **packages/shared** — shared TypeScript definitions and zod schemas used by both client and server
- **infra** — Dockerfiles, Terraform modules, and other infrastructure as code
- **tools/playlist-curator** — a CLI for ingesting and validating media clips for the in‑app TV

To bootstrap a fresh clone with the expected folder layout, run:

```bash
chmod +x create_frogtv.sh
./create_frogtv.sh
```

The script will create the directories listed above and add `.gitkeep` files so that empty directories are tracked by git. Feel free to delete or rename these placeholders as you add real content.

README
fi 
