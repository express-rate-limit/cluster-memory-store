# <div align="center">`cluster-memory-store`</div>

<div align="center">

[![tests](https://github.com/express-rate-limit/cluster-memory-store/actions/workflows/ci.yaml/badge.svg)](https://github.com/express-rate-limit/cluster-memory-store/actions/workflows/ci.yaml)
[![npm version](https://img.shields.io/npm/v/cluster-memory-store.svg)](https://npmjs.org/package/cluster-memory-store 'View this project on NPM')
[![npm downloads](https://img.shields.io/npm/dm/cluster-memory-store)](https://www.npmjs.com/package/cluster-memory-store)

A memory store for the
[`express-rate-limit`](https://github.com/express-rate-limit/express-rate-limit)
middleware made for use with the
[node.js cluster module](https://nodejs.org/api/cluster.html).

</div>

## Installation

From the npm registry:

```sh
# Using npm
> npm install @express-rate-limit/cluster-memory-store
# Using yarn or pnpm
> yarn/pnpm add @express-rate-limit/cluster-memory-store
```

From Github Releases:

```sh
# Using npm
> npm install https://github.com/express-rate-limit/cluster-memory-store/releases/download/v{version}/cluster-memory-store.tgz
# Using yarn or pnpm
> yarn/pnpm add https://github.com/express-rate-limit/cluster-memory-store/releases/download/v{version}/cluster-memory-store.tgz
```

Replace `{version}` with the version of the package that you want to your, e.g.:
`1.0.0`.

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
import { ClusterMemoryStoreWorker } from 'cluster-memory-store'

const limiter = rateLimit({
	store: new ClusterMemoryStoreWorker(),
	/* ...*/
})

app.use(limiter)
```

See the `example/` folder for a complete, working example.

## Configuration

`ClusterMemoryStoreWorker` takes an optional configuration object with the
following options:

### `prefix`

> `string`

When applying multiple rate limits (e.g. a global limit and a more strict limit
for a specific endpoint), set this to a unique value on each to prevent
double-counting of visits.

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
