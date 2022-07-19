import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
    name: 'memoryValidation',
    regexp: /((?:is |do |does |to )?(not |to not )?(?:to )?(?:be )?(equal|have member|match|contain|above|below|greater than|less than|have type)(?:s|es)?)/,
    transformer: p => p,
    useForSnippets: false
});
