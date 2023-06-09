import { Env } from '.';

import { CIJConfig as CIConfig, CIJEngine as CIEngine } from '@locoworks/cijson-engine';
import { PScaleOperator } from '@locoworks/cijson-operator-pscale';
import timestamps from './cijson/mixins/timestamps.json';
import users from './cijson/resources/users.json';
import { connect } from '@planetscale/database';

class EngineSDK {
	private static instance: EngineSDK;
	private static engine: any;

	private constructor() {
		// Private constructor to prevent instantiation outside of this class
	}

	public static getInstance(env: any): EngineSDK {
		if (!EngineSDK.instance) {
			const config = {
				host: 'aws.connect.psdb.cloud',
				username: env.DB_USERNAME,
				password: env.DB_PASSWORD,
			};

			connect(config);
			const conn = connect(config);
			const operator = new PScaleOperator();
			operator.setInstance({}, conn);
			const ciConfig = new CIConfig();
			ciConfig.registerMixin('timestamps', timestamps);
			ciConfig.registerResource(users);
			ciConfig.registerOperator(operator);
			EngineSDK.engine = new CIEngine(ciConfig);
		}
		return EngineSDK.instance;
	}

	public static getEngine(): any {
		return EngineSDK.engine;
	}
}

export default EngineSDK;
