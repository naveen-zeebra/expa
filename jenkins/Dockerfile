# Custom Jenkins controller image with Node.js and the Docker CLI baked in.
#
# The Docker CLI here talks to the HOST's Docker daemon via a mounted
# /var/run/docker.sock (Docker-outside-of-Docker) - there is no nested
# Docker daemon inside this image, so `docker build` in a pipeline actually
# builds on the host.
#
# If your existing Jenkins container uses a different base tag, change the
# FROM line below to match it before building.
FROM jenkins/jenkins:lts-jdk17

USER root

# ---- Node.js 22.x ----
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# ---- Docker CLI (client only, no daemon) ----
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
        > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# ---- Let the jenkins user talk to the host's docker.sock ----
# The socket's group ownership on the host determines which GID needs
# access. Pass it at build time:
#   docker build --build-arg DOCKER_GID=$(stat -c '%g' /var/run/docker.sock) -t jenkins-custom:lts jenkins
ARG DOCKER_GID=999
RUN existing_group="$(getent group "${DOCKER_GID}" | cut -d: -f1)"; \
    if [ -z "$existing_group" ]; then \
        groupadd -g "${DOCKER_GID}" docker; \
        usermod -aG docker jenkins; \
    else \
        usermod -aG "$existing_group" jenkins; \
    fi

USER jenkins
