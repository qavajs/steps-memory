import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
    name: 'memoryValidation',
    regexp: /((?:is |do |does |to )?(not |to not )?(?:to )?(?:be )?(equal|strictly equal|deeply equal|have member|match|contain|above|below|greater than|less than|have type|have property|match schema|include members)(?:s|es)?)/,
    transformer: p => p,
    useForSnippets: false
});
