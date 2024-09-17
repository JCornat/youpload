FROM denoland/deno:1.46.3

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno cache interface/main.ts && \
    deno task build

EXPOSE 8000

CMD ["run", "-A", "interface/main.ts"]