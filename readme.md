# <div align="center">`cluster-memory-store`</div>

<div align="center">

[![tests](https://github.com/express-rate-limit/cluster-memory-store/actions/workflows/ci.yaml/badge.svg)](https://github.com/express-rate-limit/cluster-memory-store/actions/workflows/ci.yaml)
[![npm version](https://img.shields.io/npm/v/@express-rate-limit/cluster-memory-store.svg)](https://npmjs.org/package/@express-rate-limit/cluster-memory-store 'View this project on NPM')
[![npm downloads](https://img.shields.io/npm/dm/@express-rate-limit/cluster-memory-store)](https://www.npmjs.com/package/@express-rate-limit/cluster-memory-store)

A memory store for the
[`express-rate-limit`](https://github.com/express-rate-limit/express-rate-limit)
middleware made for use with the
[node.js cluster module](https://nodejs.org/api/cluster.html).

</div>

## Installation

```sh
npm install @express-rate-limit/cluster-memory-store
```

([Alternate installation methods](https://github.com/express-rate-limit/cluster-memory-store/wiki/Installation-Methods) -
pnpm, yarn, Github Releases, etc.)

## Usage

**This package requires you to use Node 16 or above.**

In the cluster primary:

```ts
import { ClusterMemoryStorePrimary } from '@express-rate-limit/cluster-memory-store'

const rateLimiterStore = new ClusterMemoryStorePrimary()
rateLimiterStore.init()
```

In each cluster worker:

```ts
import { rateLimit } from 'express-rate-limit'
import { ClusterMemoryStoreWorker } from '@express-rate-limit/cluster-memory-store'

const limiter = rateLimit({
	store: new ClusterMemoryStoreWorker(),
	/* ...*/
})

app.use(limiter)
```

See the `example/` folder for a
[complete, working example](https://github.com/express-rate-limit/cluster-memory-store/tree/main/example).

## Configuration

`ClusterMemoryStoreWorker` takes an optional configuration object with the
following options:

### `prefix`

> `string`

When applying multiple rate limits (e.g. a global limit and a more strict limit
for a specific endpoint), set this to a unique value on each to prevent
double-counting of visits.

## Usage with PM2, gatling, and other process managers

Because this store requires code execution in the primary process, it doesn't
work with process managers that need full control of the primary process,
including PM2 when in `cluster` mode.

### PM2

To work with [PM2](https://pm2.keymetrics.io/), use the following configuration:

    instances: 1,
    exec_mode: 'fork',

And then edit your main JS file to include the clustering code, similar to
[this example](https://github.com/express-rate-limit/cluster-memory-store/blob/8745cb4da4035f84255e1c0146951a0fe2fbcc10/example/server.js).

This looses some of the benefits of using PM2, because it can no longer directly
manage worker processes.

### Gatling

[Gatling](https://www.npmjs.com/package/gatling) is not currently compatibile
with `cluster-memory-store`.

## Issues and Contributing

If you encounter a bug or want to see something added/changed, please go ahead
and
[open an issue](https://github.com/express-rate-limitedly/cluster-memory-store/issues/new)!
If you need help with something, feel free to
[start a discussion](https://github.com/express-rate-limit/cluster-memory-store/discussions/new)!

If you wish to contribute to the library, thanks! First, please read
[the contributing guide](contributing.md). Then you can pick up any issue and
fix/implement it!

## License

MIT © [Nathan Friedly](http://nfriedly.com) and
[Vedant K](https://github.com/gamemaker1)
