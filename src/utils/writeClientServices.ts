import { resolve } from 'path';
import prettier from 'prettier';

import type { Service } from '../client/interfaces/Service';
import { writeFile } from './fileSystem';
import { isDefined } from './isDefined';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param useUnionTypes Use union types instead of enums
 * @param useOptions Use options or arguments functions
 * @param postfix Service name postfix
 * @param clientName Custom client class name
 */
export const writeClientServices = async (
    services: Service[],
    templates: Templates,
    outputPath: string,
    useUnionTypes: boolean,
    useOptions: boolean,
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
    // console.dir(
    //     service.operations.filter(x => x.path === '/crm/v3/objects/companies/batch/archive'),
    //     { depth: 9 }
    // );
    const templateResult = templates.exports.service({
        ...service,
        useUnionTypes,
        useOptions,
        postfix,
        exportClient: isDefined(clientName),
    });
    const prettireConfig = await prettier.resolveConfig(process.cwd());
    await writeFile(file, prettier.format(templateResult, prettireConfig ?? {}));
};
