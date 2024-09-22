ARG image

FROM $image

WORKDIR /src

COPY . .
RUN deno cache interface/main.ts && \
    deno task build

EXPOSE 8000

CMD ["run", "-A", "interface/main.ts"]