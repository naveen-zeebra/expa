# Test Cases: CI/CD, Dockerfile, Jenkinsfile.frontend (expa frontend)

Scope: validates `Dockerfile`, `.dockerignore`, and `Jenkinsfile.frontend` in this repo, and the
end-to-end CI/CD pipeline built from them. Run the Docker cases locally before relying on Jenkins.

## 1. Dockerfile — Build

| ID | Title | Preconditions | Steps | Expected Result |
|----|-------|----------------|-------|------------------|
| DK-01 | Image builds successfully | Docker installed, in `expa/` | `docker build -t expa-frontend:test .` | Build completes with exit code 0, no stage errors |
| DK-02 | `deps` stage uses lockfile | — | Inspect build log for `deps` stage | `npm ci` runs (not `npm install`); fails if `package-lock.json` is missing/out of sync |
| DK-03 | Build fails fast on lint/type errors | Introduce a TS type error in `src/` | `docker build .` | `builder` stage's `npm run build` fails, image is not produced |
| DK-04 | Final image excludes dev dependencies | Image built | `docker run --rm expa-frontend:test sh -c "ls node_modules | wc -l"` (or inspect layer) | Runner stage has no top-level `node_modules` — only `.next/standalone` copied output is used |
| DK-05 | `.dockerignore` respected | — | `docker build .` with `node_modules/` and `.next/` present locally | Build context excludes `node_modules`, `.next`, `.git` (check `docker build` context size / `du` on sent context) |
| DK-06 | Image size is reasonable | Image built | `docker images expa-frontend:test` | Image size in the tens of MB–low hundreds of MB range (Alpine + standalone output), not GB-scale |
| DK-07 | Non-root user | Image built | `docker run --rm expa-frontend:test whoami` | Output is `nextjs`, not `root` |

## 2. Dockerfile — Runtime

| ID | Title | Preconditions | Steps | Expected Result |
|----|-------|----------------|-------|------------------|
| DK-08 | Container starts and serves on port 3000 | Image built | `docker run -d -p 3000:3000 --name expa-test expa-frontend:test` then `curl -I http://localhost:3000` | HTTP response (200/307) within a few seconds; container stays `Up` (not restarting/crash-looping) |
| DK-09 | Static assets served | Container running | `curl -I http://localhost:3000/_next/static/...` (path from page HTML) or check `public/` asset | 200 response, correct `content-type` |
| DK-10 | Custom port via `PORT` env | — | `docker run -e PORT=4000 -p 4000:4000 expa-frontend:test` | App listens on 4000, `curl http://localhost:4000` succeeds |
| DK-11 | Graceful shutdown | Container running | `docker stop expa-test` | Container stops within Docker's default timeout (10s), no forced kill needed |
| DK-12 | Image remote-image config respected | Container running | Request a page that renders a `next/image` from `cdn.sanity.io` or the Vercel blob host configured in `next.config.ts` | Image loads (not blocked by `remotePatterns` mismatch) |
| DK-13 | No secrets baked into image | Image built | `docker history --no-trunc expa-frontend:test` and inspect layers | No `.env` values, tokens, or credentials present in any layer |

## 3. Jenkinsfile.frontend — Syntax & Structure

| ID | Title | Preconditions | Steps | Expected Result |
|----|-------|----------------|-------|------------------|
| JK-01 | Pipeline syntax is valid | Jenkins CLI or Blue Ocean access | Jenkins → *Pipeline Syntax* → *Declarative Linter*, or `java -jar jenkins-cli.jar declarative-linter < Jenkinsfile.frontend` | No syntax errors reported |
| JK-02 | Job picks up `Jenkinsfile.frontend` | Multibranch/Pipeline job configured with `Script Path: Jenkinsfile.frontend` | Trigger a build | Jenkins reads this file (not a default `Jenkinsfile`) and stage view matches its stages |
| JK-03 | Parameters render correctly | Job configured | Open job's *Build with Parameters* page | `PUSH_IMAGE` and `DEPLOY` boolean parameters are visible, default unchecked |

## 4. Jenkinsfile.frontend — Stage Behavior

| ID | Title | Preconditions | Steps | Expected Result |
|----|-------|----------------|-------|------------------|
| JK-04 | Checkout stage | Repo accessible from Jenkins agent | Run build | `Checkout` stage succeeds, workspace contains `expa/` |
| JK-05 | Install stage fails on broken lockfile | Corrupt/mismatch `package-lock.json` | Run build | `Install Dependencies` stage fails clearly (does not silently continue) |
| JK-06 | Lint stage blocks bad code | Introduce an ESLint violation | Run build | `Lint` stage fails, pipeline stops before `Build App` |
| JK-07 | Build stage produces `.next` output | Lint passes | Run build | `Build App` stage succeeds; workspace has `expa/.next/standalone` |
| JK-08 | Docker Build stage tags correctly | Docker available on agent | Run build | Image tagged `IMAGE_NAME:<BUILD_NUMBER>` and `IMAGE_NAME:latest` both exist locally on agent |
| JK-09 | Smoke test stage catches a broken image | Temporarily break `CMD` in Dockerfile | Run build | `Docker Image Smoke Test` stage fails (non-200/307 or container exits), pipeline marked failed |
| JK-10 | Smoke test cleans up container | Normal build | Run build, then check agent | No leftover `expa-frontend` containers running after the stage (stopped/removed) |
| JK-11 | Push stage skipped by default | `PUSH_IMAGE=false` (default) | Run build | `Push Image` stage shows as skipped in stage view, no registry call made |
| JK-12 | Push stage runs when enabled | `PUSH_IMAGE=true`, valid `docker-registry-credentials` in Jenkins credentials store | Run build with parameter checked | Image pushed to `DOCKER_REGISTRY`; verify via `docker pull` or registry UI |
| JK-13 | Push stage fails cleanly on bad credentials | Invalid/revoked credential ID | Run build with `PUSH_IMAGE=true` | Stage fails with an auth error, does not mark build as success |
| JK-14 | Deploy stage gated correctly | `DEPLOY=false` (default) | Run build | `Deploy` stage skipped |
| JK-15 | Post-build cleanup always runs | Force a failure in any stage | Run build | `post { always { ... } }` still executes `docker image prune`, regardless of stage outcome |
| JK-16 | No concurrent builds | Trigger two builds on same branch quickly | Start build A, then trigger build B before A finishes | Build B queues/waits (`disableConcurrentBuilds()` honored), does not run in parallel with A |
| JK-17 | Build log retention | Multiple builds run | Check job's build history after >20 builds | Only the last 20 builds retained (`buildDiscarder` honored) |

## 5. CI/CD Pipeline — End to End

| ID | Title | Preconditions | Steps | Expected Result |
|----|-------|----------------|-------|------------------|
| CI-01 | Green path on clean commit | Clean `main`/feature branch | Push commit, pipeline triggers (webhook or poll) | All stages pass, final status SUCCESS |
| CI-02 | Pipeline triggers on push | Webhook/SCM polling configured | Push a commit to the tracked branch | Jenkins job auto-starts within expected interval |
| CI-03 | Failing test/lint blocks image build | Push a commit with a lint error | Pipeline runs | Pipeline fails before `Docker Build` stage; no new image produced or pushed |
| CI-04 | Rollback safety — `latest` not clobbered on failed build | Prior successful `latest` image exists | Trigger a build that fails at `Build App` | Existing `IMAGE_NAME:latest` in registry is untouched (failed build never reaches push stage) |
| CI-05 | Build number traceability | Any successful build | Compare Jenkins `BUILD_NUMBER` to image tag | `docker images` on agent shows a tag matching the Jenkins build number, enabling traceability from a running container back to a build |
| CI-06 | Notification on failure | Failure notification configured (email/Slack, if added) | Force a failing build | Notification is sent to the configured channel |
| CI-07 | Agent has required tools | Fresh Jenkins agent | Run build | Agent has `node`/`npm` (or uses a Docker agent) and `docker` CLI available; stages don't fail with "command not found" |
| CI-08 | Reproducible build | Same commit, two separate pipeline runs | Run pipeline twice on identical commit | Both runs produce a semantically equivalent `.next/standalone` output (no non-determinism from caches) |

## How to run the Docker cases locally before pushing

```bash
cd expa
docker build -t expa-frontend:test .
docker run -d -p 3000:3000 --name expa-test expa-frontend:test
curl -I http://localhost:3000
docker logs expa-test
docker stop expa-test && docker rm expa-test
```
