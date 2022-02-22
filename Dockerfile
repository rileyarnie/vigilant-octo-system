# syntax=docker/dockerfile:1.2

FROM node:16 AS builder


RUN apt-get update && \
    apt-get install --yes --no-install-recommends \
    openssh-client \ 
    git \
    && apt-get clean

RUN mkdir -p -m 0600 ~/.ssh && \
    ssh-keyscan -H bitbucket.org >> ~/.ssh/known_hosts

RUN echo $(ssh-add -l) && echo $SSH_AUTH_SOCK

RUN npm install -g npm@8.5.1

WORKDIR /staff_portal

COPY package.json ./

# COPY package-lock.json ./

RUN --mount=type=ssh \
    npm install --force

COPY ./ ./

RUN --mount=type=ssh \
    npm run build

FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*
# Copies static resources from builder stage
COPY --from=builder /staff_portal/build /usr/share/nginx/html
# Containers run nginx with global directives and daemon off

ENTRYPOINT ["nginx", "-g", "daemon off;"]

