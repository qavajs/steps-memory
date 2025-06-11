import Memory from './memory/index';

export default {
    paths: [
        'test-e2e/features/*.feature'
    ],
    require: [
        'test-e2e/step-definitions/*.ts',
        'src/steps.ts'
    ],
    format: [
        '@qavajs/console-formatter',
        ['junit', 'test-e2e/report.xml']
    ],
    formatOptions: {
        console: {
            showLogs: true
        }
    },
    memory: new Memory(),
    parallel: 1
}
