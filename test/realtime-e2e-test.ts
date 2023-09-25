// /test/realtime-e2e-test.ts
// A full end-to-end test, including a brief pause waiting for the limit to reset

import assert from 'node:assert/strict'
import cluster from 'node:cluster'
import process from 'node:process'
import express from 'express'
import fetch from 'node-fetch'
import { rateLimit } from 'express-rate-limit'
import {
	ClusterMemoryStorePrimary,
	ClusterMemoryStoreWorker,
} from '../source/index'

async function getStatus(port: number) {
	const resp = await fetch(`http://localhost:${port}`)
	return resp.status
}

if (cluster.isPrimary) {
	const rateLimiterStore = new ClusterMemoryStorePrimary()
	rateLimiterStore.init()

	// One worker
	const worker = cluster.fork()

	// Get the port the worker ends up listening on
	const port: number = await new Promise((resolve) =>
		cluster.on('listening', (worker: any, address: any) => {
			resolve(address.port)
		}),
	)

	// Make a few requests
	assert.equal(await getStatus(port), 200) // Success
	assert.equal(await getStatus(port), 429) // Rate limited
	await new Promise((resolve) => setTimeout(resolve, 100)) // Wait for the limit to be reset
	assert.equal(await getStatus(port), 200) // Success

	// cleanup
	worker.kill()

	console.log('test completed successfully')
} else {
	// Worker
	const app = express()

	app.use(
		rateLimit({
			store: new ClusterMemoryStoreWorker(),
			validate: false,
			limit: 1,
			windowMs: 100,
		}),
	)

	app.get('/', (request, response) =>
		response.send(`hello from ${process.pid}`),
	)

	// Port 0 lets the system assign an avaliable port
	const server = app.listen(
		0 /* , () => {
			console.log(
				`Worker ${process.pid} listening at on http://localhost:${
					(server.address() as any).port
				}/`,
			)
		} */,
	)
}
