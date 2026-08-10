# Custom Jenkins image: Node.js + Docker CLI

Fixes `npm: not found` and `docker: not found` in `Jenkinsfile.frontend` builds by
rebuilding the Jenkins controller image with both baked in, and giving it access
to the host's Docker daemon via a mounted socket (no Docker-in-Docker).

Run everything below **on the Jenkins host**, not on your dev machine.

## 0. Back up first

This replaces your running Jenkins container. Your job configs, build history,
credentials, and plugins live in the `jenkins_home` volume, not the container,
so as long as you reuse that same volume and don't delete it, nothing is lost.
Still, snapshot it before proceeding:

```bash
docker run --rm -v jenkins_home:/data -v "$PWD":/backup alpine \
  tar czf /backup/jenkins_home-backup-$(date +%Y%m%d).tar.gz -C /data .
```

## 1. Find your current setup

```bash
# Name of the currently running Jenkins container
docker ps --filter ancestor=jenkins/jenkins --format '{{.Names}}\t{{.Image}}'

# Volume(s) mounted into it (note the jenkins_home volume NAME)
docker inspect <jenkins_container_name> --format '{{json .Mounts}}' | jq

# GID that owns the host's docker.sock - the image needs to match this
stat -c '%g' /var/run/docker.sock
```

## 2. Build the custom image

```bash
cd expa/jenkins
docker build --build-arg DOCKER_GID=$(stat -c '%g' /var/run/docker.sock) \
  -t jenkins-custom:lts .
```

## 3. Swap the container (keep the existing volume)

```bash
docker stop <jenkins_container_name>
docker rm <jenkins_container_name>

docker run -d --name jenkins --restart unless-stopped \
  -p 8080:8080 -p 50000:50000 \
  -v <your_existing_jenkins_home_volume>:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins-custom:lts
```

Or, if you use `docker-compose.yml` in this folder: set `DOCKER_GID` and the
`jenkins_home` volume `name` to match what you found in step 1, then:

```bash
docker compose up -d --build
```

## 4. Verify

Open Jenkins, re-run the `web-Nextjs` job. In the console output, `npm ci`
and `docker build` should now execute instead of failing with "not found".
You can also check directly:

```bash
docker exec jenkins node -v
docker exec jenkins npm -v
docker exec jenkins docker -v
```

## Notes

- The image only installs the Docker **CLI**, not a daemon — `docker build`
  inside a pipeline is executed by the host's Docker daemon via the mounted
  socket. This means containers/images built by Jenkins are visible with
  `docker ps` / `docker images` on the host itself, not nested inside Jenkins.
- Anyone who can trigger a Jenkins build effectively has access to the host's
  Docker socket (root-equivalent on the host). This is the standard trade-off
  for Docker-outside-of-Docker; acceptable for a trusted, small team, but
  worth knowing.
- If you rebuild this image later (e.g. Node version bump), your existing
  jobs/credentials are untouched since they live in the `jenkins_home` volume,
  not the image.
