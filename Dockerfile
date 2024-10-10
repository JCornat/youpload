ARG image

FROM $image

WORKDIR /src

COPY . .
RUN deno cache interface/main.ts && \
    deno task build

EXPOSE 8000

CMD ["run", "--unstable-cron", "-A", "interface/main.ts"]