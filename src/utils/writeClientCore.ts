import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import type { HttpClient } from '../HttpClient';
import type { Indent } from '../Indent';
import { copyFile, exists, writeFile } from './fileSystem';
import { getHttpRequestName } from './getHttpRequestName';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate OpenAPI core files, this includes the basic boilerplate code to handle requests.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param indent Indentation options (4, 2 or tab)
 * @param clientName Custom client class name
 * @param request Path to custom request file
 */
export const writeClientCore = async (
    client: Client,
    templates: Templates,
    outputPath: string,
    httpClient: HttpClient,
    indent: Indent,
    clientName?: string,
    request?: string
): Promise<void> => {
    const httpRequest = getHttpRequestName(httpClient);
    const context = {
        httpClient,
        clientName,
        httpRequest,
        server: client.server,
        version: client.version,
    };

    const content = templates.core.baseHttpRequest(context);

    await writeFile(resolve(`${outputPath}.ts`), content);

    if (request) {
        const requestFile = resolve(process.cwd(), request);
        const requestFileExists = await exists(requestFile);
        if (!requestFileExists) {
            throw new Error(`Custom request file "${requestFile}" does not exists`);
        }
        await copyFile(requestFile, resolve(outputPath, 'request.ts'));
    }
};
