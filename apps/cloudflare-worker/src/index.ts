import EngineSDK from './engine';

export interface Env {
	DB_USERNAME: string;
	DB_PASSWORD: string;
}

export default {
	async fetch(request: Request, env: Env) {
		EngineSDK.getInstance(env);
		const ciEngine = EngineSDK.getEngine();

		try {
			// console.log('we came here to call createe -----', JSON.stringify(ciEngine.config));

			const createdUser: any = await ciEngine.create('users', {
				payload: {
					password: 'Kissmiss9!',
					tenant_id: 'default',
				},
				transformations: ['pick_first'],
			});
			console.log('createdUser', createdUser);

			return new Response(JSON.stringify(createdUser), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (error) {
			console.log('error', error);

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
