import type { Store } from 'express-rate-limit'

export const from = 'cluster-memory-store'

export type Command = keyof Omit<Store, 'prefix' | 'localKeys'>

export type WorkerToPrimaryMessage = {
	command: Command
	args: any[]
	requestId: number
	prefix: string
	from: 'cluster-memory-store'
}

export type PrimaryToWorkerMessage = {
	requestId: number
	result: any
}
