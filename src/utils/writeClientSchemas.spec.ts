import type { Model } from '../client/interfaces/Model';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientSchemas } from './writeClientSchemas';

jest.mock('./fileSystem');

describe('writeClientSchemas', () => {
    it('should write to filesystem', async () => {
        const models: Model[] = [
            {
                export: 'interface',
                name: 'User',
                type: 'User',
                base: 'User',
                template: null,
                link: null,
                description: null,
                isDefinition: true,
                isReadOnly: false,
                isRequired: false,
                isNullable: false,
                imports: [],
                enum: [],
                enums: [],
                properties: [],
            },
        ];

        const templates: Templates = {
            exports: {
                model: () => 'model',
                schema: () => 'schema',
                service: () => 'service',
            },
            core: {
                baseHttpRequest: () => 'baseHttpRequest',
            },
        };

        await writeClientSchemas(models, templates, '/', false);

        expect(writeFile).toBeCalledWith('/$User.ts', 'schema');
    });
});
