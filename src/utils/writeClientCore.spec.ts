import type { Client } from '../client/interfaces/Client';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientCore } from './writeClientCore';

jest.mock('./fileSystem');

describe('writeClientCore', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: '1.0',
            models: [],
            services: [],
        };

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

        await writeClientCore(client, templates, '/');

        expect(writeFile).toBeCalledWith('/OpenAPI.ts', 'settings');
        expect(writeFile).toBeCalledWith('/ApiError.ts', 'apiError');
        expect(writeFile).toBeCalledWith('/ApiRequestOptions.ts', 'apiRequestOptions');
        expect(writeFile).toBeCalledWith('/ApiResult.ts', 'apiResult');
        expect(writeFile).toBeCalledWith('/CancelablePromise.ts', 'cancelablePromise');
        expect(writeFile).toBeCalledWith('/request.ts', 'request');
    });
});
