import type { Service } from '../client/interfaces/Service';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientServices } from './writeClientServices';

jest.mock('./fileSystem');

describe('writeClientServices', () => {
    it('should write to filesystem', async () => {
        const services: Service[] = [
            {
                name: 'User',
                operations: [],
                imports: [],
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

        await writeClientServices(services, templates, '/', false, false, 'Service');

        expect(writeFile).toBeCalledWith('/UserService.ts', 'service');
    });
});
