import { resolve } from 'path';
import prettier from 'prettier';

import type { Service } from '../client/interfaces/Service';
import type { HttpClient } from '../HttpClient';
import type { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { isDefined } from './isDefined';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param useUnionTypes Use union types instead of enums
 * @param useOptions Use options or arguments functions
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 * @param clientName Custom client class name
 */
export const writeClientServices = async (
    services: Service[],
    templates: Templates,
    outputPath: string,
    httpClient: HttpClient,
    useUnionTypes: boolean,
    useOptions: boolean,
    indent: Indent,
    postfix: string,
    clientName?: string
): Promise<void> => {
    const file = resolve(`${outputPath}.ts`);
    const service = services.reduce(
        (acc, curr) => {
            acc.operations.push(...curr.operations);
            acc.imports.push(...curr.imports);
            return acc;
        },
        { name: 'Company', imports: [], operations: [] } as Service
    );
    service.imports = Array.from(new Set(service.imports));
    service.operations = Array.from(new Set(service.operations));

    const templateResult = templates.exports.service({
        ...service,
        httpClient,
        useUnionTypes,
        useOptions,
        postfix,
        exportClient: isDefined(clientName),
    });
    const prettireConfig = await prettier.resolveConfig(process.cwd());
    await writeFile(file, prettier.format(templateResult, prettireConfig ?? {}));
};
