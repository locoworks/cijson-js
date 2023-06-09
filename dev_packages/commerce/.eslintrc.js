module.exports = {
	root: true,
	extends: [
		"../../node_modules/@betalectic-reusejs/shared-config-eslint-node",
		"prettier",
	],
	ignorePatterns: ["dist/"],
	rules: {
		"prettier/prettier": "error",
	},
	plugins: ["prettier"],
	overrides: [
		{
			files: ["**/__tests__/**/*"],
			env: {
				jest: true,
				node: true,
				es6: true,
			},
		},
	],
};
