import { CIJConfig as CIConfig, CIJEngine as CIEngine } from '@locoworks/cijson-engine';
import { PScaleOperator } from '@locoworks/cijson-operator-pscale';
import timestamps from './cijson/mixins/timestamps.json';
import users from './cijson/resources/users.json';
import { connect } from '@planetscale/database';

const config = {
	host: 'aws.connect.psdb.cloud',
	username: 'ttc1q0iyjgoout8g5rp2',
	password: 'pscale_pw_IKXdHDG45WxR5TXCbO8Sq8rPErhyU858DDlW12uhnFj',
};

connect(config);
const conn = connect(config);
const operator = new PScaleOperator();
operator.setInstance({}, conn);
const ciConfig = new CIConfig();
ciConfig.registerMixin('timestamps', timestamps);
ciConfig.registerResource(users);
ciConfig.registerOperator(operator);
const ciEngine = new CIEngine(ciConfig);

export default {
	async fetch(request: Request) {
		try {
			const createdUser: any = await ciEngine.create('users', {
				payload: {
					password: 'Kissmiss9!',
					tenant_id: 'default',
				},
				transformations: ['pick_first'],
			});
			console.log('createdUser', createdUser);

			return new Response(JSON.stringify(createdUser), {
				status: 201,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (error) {
			console.log('error', JSON.stringify(error));

			return new Response(JSON.stringify(error), {
				status: 422,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			return new Response(`request method: ${request.method}`);
		}

		// let users: any = await ciEngine.read('users', {
		// 	filterBy: [],
		// 	transformations: ['pick_first'],
		// });

		// return new Response(JSON.stringify({ users, region: request.cf?.region }), {
		// 	status: 200,
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// });

		// return new Response(`request method: ${request.method}`);
	},
};
