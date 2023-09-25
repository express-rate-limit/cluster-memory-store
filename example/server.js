import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import process from 'node:process'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import {
	ClusterMemoryStorePrimary,
	ClusterMemoryStoreWorker,
} from '@express-rate-limit/cluster-memory-store'

if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running`)

	const rateLimiterStore = new ClusterMemoryStorePrimary()
	rateLimiterStore.init()

	// One worker per CPU core
	const numberCPUs = availableParallelism()
	for (let i = 0; i < numberCPUs; i++) {
		cluster.fork()
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(
			`worker ${worker.process.pid} died with code ${code} from signal ${signal}.`,
		)
	})
} else {
	// Worker
	const app = express()
	// App.set('trust proxy', 1)

	app.use(
		rateLimit({
			store: new ClusterMemoryStoreWorker(),
			legacyHeaders: false,
			standardHeaders: 'draft-7',
		}),
	)

	app.get('/', (request, response) =>
		response.send(`hello from ${process.pid}`),
	)

	// Tip: run with PORT=0 to have the system automatically choose an avaliable port
	const server = app.listen(process.env.PORT ?? 3000, () => {
		console.log(
			`Worker ${process.pid} listening at on http://localhost:${
				server.address().port
			}/`,
		)
	})
}
