module.exports = {
	extends: [require.resolve("@umijs/fabric/dist/eslint")],

	// in antd-design-pro
	globals: {
		ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
		page: true,
	},

	rules: {
		// your rules
		"@typescript-eslint/no-explicit-any": ["off"],
	},
};
