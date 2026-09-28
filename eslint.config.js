const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**']
    },
    {
        files: ['**/*.ts'],
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended, prettier],
        processor: angular.processInlineTemplates,
        rules: {
            // Dynamic form and table components intentionally use legacy selectors.
            '@angular-eslint/component-selector': 'off',
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix: 'app', style: 'camelCase' }
            ],
            '@angular-eslint/no-host-metadata-property': 'off',
            '@angular-eslint/no-output-on-prefix': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
            'no-console': 'off',
            'prefer-const': 'off'
        }
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, prettier],
        rules: {}
    }
);
