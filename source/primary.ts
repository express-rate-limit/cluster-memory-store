// /source/primary.ts
// Central process for cluster-memory-store, stores hit counts and makes them avaliable to workers

import cluster, { type Worker } from 'node:cluster'
import { MemoryStore, type Store } from 'express-rate-limit'
import { type WorkerToPrimaryMessage, from } from './shared'
// Import type { Options } from './types'

export class ClusterMemoryStorePrimary {
	private stores: Record<string, MemoryStore> = {}

	constructor() {
		if (!cluster.isPrimary) {
			console.warn(
				new Error(
					'ClusterMemoryStorePrimary instance created in non-primary process',
				),
			)
		}
	}

	public init() {
		cluster.on('message', this.handleMessage.bind(this))
	}

	private async handleMessage(worker: Worker, message: any, handle?: any) {
		if (message?.from === from) {
			const message_ = message as WorkerToPrimaryMessage
			const { command, args, requestId, prefix } = message_
			if (command === 'init' && !this.stores[prefix]) {
				console.log('creating store', prefix)
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
				const result = await (
					store[command] as (this: Store, ...[]) => Promise<any>
				).apply(store, args)
				worker.send({
					requestId,
					result,
					from,
				})
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
