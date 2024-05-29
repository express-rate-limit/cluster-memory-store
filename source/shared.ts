import type { IncrementResponse, Store } from 'express-rate-limit'

export const from = 'cluster-memory-store'

export type Command = keyof Omit<Store, 'prefix' | 'localKeys'>

type Message = {
	from: 'cluster-memory-store'
	prefix: string
}

export type WorkerToPrimaryMessage = Message & {
	command: Command
	args: any[]
	requestId: number
}

export type PrimaryToWorkerMessage = Message & {
	requestId: number
	result: unknown
}

export type SerializedIncrementResponse = IncrementResponse & {
	resetTime: string
}
