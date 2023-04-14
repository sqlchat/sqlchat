FROM alpine:3.17

# Metadata.
LABEL \
  org.label-schema.name="sqlchat" \
  org.label-schema.description="Docker container for sqlchat" \
  org.label-schema.vcs-url="https://github.com/sqlchat/sqlchat"

RUN apk add --no-cache wget

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

RUN source $HOME/.shrc

WORKDIR /app

COPY . .

ARG OPENAI_API_KEY=YOUR_API_KEY
ARG OPENAI_API_ENDPOINT=YOUR_API_ENDPOINT

RUN pnpm i

CMD ["pnpm", "dev"]
