import Handlebars from 'handlebars/runtime';

import { registerHandlebarHelpers } from './registerHandlebarHelpers';

describe('registerHandlebarHelpers', () => {
    it('should register the helpers', () => {
        registerHandlebarHelpers({
            useOptions: false,
            useUnionTypes: false,
        });
        const helpers = Object.keys(Handlebars.helpers);
        expect(helpers).toContain('equals');
        expect(helpers).toContain('notEquals');
        expect(helpers).toContain('containsSpaces');
        expect(helpers).toContain('union');
        expect(helpers).toContain('intersection');
        expect(helpers).toContain('enumerator');
        expect(helpers).toContain('escapeComment');
        expect(helpers).toContain('escapeDescription');
        expect(helpers).toContain('camelCase');
    });
});
