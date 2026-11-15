import Fastify from 'fastify'
import { registerSecurity } from './plugins/security.js'

export async function buildServer() {
	const app = Fastify({
		logger: {
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
			redact: [
				'req.headers.authorization',
				'req.headers.cookie',
				'request.headers.authorization',
				'request.headers.cookie',
				'*.password',
				'*.token',
				'*.accessToken',
				'*.refreshToken',
			],
		},
		requestIdHeader: 'x-request-id',
		bodyLimit: 1_048_576,
		trustProxy: false,
	})

	await registerSecurity(app)

	app.get('/health/live', async () => {
		return { status: 'ok' }
	})

	app.setNotFoundHandler(async (_request, reply) => {
		return reply.code(404).send({
			error: {
				code: 'NOT_FOUND',
				message: 'Resource not found',
			},
		})
	})

	app.setErrorHandler(async (error, request, reply) => {
		if (typeof error === 'object' && error !== null && 'validation' in error && error.validation) {
			return reply.code(400).send({
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Request validation failed',
				},
			})
		}

		request.log.error({ err: error }, 'Request failed')

		return reply.code(500).send({
			error: {
				code: 'INTERNAL_SERVER_ERROR',
				message: 'An unexpected error occurred',
			},
		})
	})

	return app
}
