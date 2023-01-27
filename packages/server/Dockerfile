FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update

RUN npm i -g turbo

WORKDIR /app
COPY . .
RUN turbo prune --scope="cow-dca-server" --docker

FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY --from=base /app/out/json/ /app/out/pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i
COPY --from=base /app/out/full/ ./
COPY turbo.json ./
RUN pnpm build --filter=cow-dca-server...
RUN pnpm prune --prod

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=installer /app .

ENV MONGO_URI=
ENV SERVER_PORT=
ENV ETHEREUM_RPC_ENDPOINT=
ENV GNOSIS_RPC_ENDPOINT=

EXPOSE $SERVER_PORT

CMD node ./packages/aggregator/dist/index.js