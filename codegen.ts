import path from 'node:path'
import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const config: CodegenConfig = {
	schema: [
		{
			'https://api.quiltt.io/v1/graphql': {
				headers: {
					Authorization: `Bearer ${process.env.QUILTT_API_SECRET_KEY}`,
				},
			},
		},
	],
	generates: {
		'./src/generated/graphql.ts': {
			plugins: ['typescript', 'typescript-operations'],
			config: {
				skipTypename: false,
				withHooks: true,
				withHOC: false,
				withComponent: false,
			},
		},
	},
}

export default config
