import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import { mkdir } from './fileSystem';
import { isSubDirectory } from './isSubdirectory';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientCore } from './writeClientCore';
import { writeClientModels } from './writeClientModels';
import { writeClientSchemas } from './writeClientSchemas';
import { writeClientServices } from './writeClientServices';

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 * @param output The relative location of the output directory
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore Generate core client classes
 * @param exportServices Generate services
 * @param exportModels Generate models
 * @param exportSchemas Generate schemas
 * @param exportSchemas Generate schemas
 * @param postfix Service name postfix
 * @param clientName Custom client class name
 * @param request Path to custom request file
 */
export const writeClient = async (
    client: Client,
    templates: Templates,
    output: string,
    useOptions: boolean,
    useUnionTypes: boolean,
    exportCore: boolean,
    exportServices: boolean,
    exportModels: boolean,
    exportSchemas: boolean,
    postfix: string,
    clientName?: string,
    request?: string
): Promise<void> => {
    const outputPath = resolve(process.cwd(), output);
    const outputPathCore = resolve(outputPath, 'core');
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathSchemas = resolve(outputPath, 'schemas');
    const outputPathServices = resolve(outputPath, 'services');

    if (!isSubDirectory(process.cwd(), output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    await mkdir(outputPath);

    if (exportCore) {
        await writeClientCore(client, templates, outputPathCore, clientName, request);
    }

    if (exportServices) {
        await writeClientServices(
            client.services,
            templates,
            outputPathServices,
            useUnionTypes,
            useOptions,
            postfix,
            clientName
        );
    }

    if (exportSchemas) {
        await writeClientSchemas(client.models, templates, outputPathSchemas, useUnionTypes);
    }

    if (exportModels) {
        await writeClientModels(client.models, templates, outputPathModels, useUnionTypes);
    }
};
