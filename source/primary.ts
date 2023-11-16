// /source/primary.ts
// Central process for cluster-memory-store, stores hit counts and makes them avaliable to workers

import cluster, { type Worker } from 'node:cluster'
import { MemoryStore, type Store } from 'express-rate-limit'
import createDebug from 'debug'
import {
	type WorkerToPrimaryMessage,
	from,
	type PrimaryToWorkerMessage,
} from './shared.js'

const debug = createDebug(
	'cluster-memory-store:' + (cluster.isPrimary ? 'primary' : 'not-primary'),
)

export class ClusterMemoryStorePrimary {
	private stores: Record<string, MemoryStore> = {}

	constructor() {
		debug('Creating')
		if (!cluster.isPrimary) {
			console.warn(
				new Error(
					'ClusterMemoryStorePrimary instance created in non-primary process',
				),
			)
		}
	}

	public init() {
		debug('Initializing')
		cluster.on('message', this.handleMessage.bind(this))
	}

	private async handleMessage(worker: Worker, message: any, handle?: any) {
		debug('Got message from worker %d: %o', worker.id, message)
		if (message?.from === from) {
			const message_ = message as WorkerToPrimaryMessage
			const { command, args, requestId, prefix } = message_
			if (command === 'init' && !this.stores[prefix]) {
				debug('Initializing memory store for prefix %s', prefix)
				this.stores[prefix] = new MemoryStore()
			} // Todo: else validate that the windowMs is the same!

			const store = this.stores[prefix]
			if (!store) {
				console.error(
					new Error(
						'ClusterMemoryStorePrimary missing store: ' +
							JSON.stringify(message_),
					),
				)
				return
			}

			if (command in store && typeof store[command] === 'function') {
				const result: unknown =
					await // eslint-disable-next-line no-empty-pattern
					(store[command] as (this: Store, ...[]) => Promise<any>).apply(
						store,
						args,
					)
				const message: PrimaryToWorkerMessage = {
					requestId,
					result,
					from,
				}
				debug('Sending response to worker %d: %o', worker.id, message)
				worker.send(message)
			} else {
				console.error(
					new Error(
						'ClusterMemoryStorePrimary unexpected command: ' +
							JSON.stringify(message_),
					),
				)
			}
		} // Else it's not our message
	}
}
