/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'@tao/core': path.resolve(__dirname, 'src/testing/taoCoreStub.ts'),
		},
	},
	test: {
		globals: false,
		environment: 'node',
		coverage: {
			reporter: ['text', 'json', 'html'],
		},
	},
})