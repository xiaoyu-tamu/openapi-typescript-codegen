import { resolve } from 'path';
import prettier from 'prettier';

import type { Model } from '../client/interfaces/Model';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate Schemas using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param useUnionTypes Use union types instead of enums
 */
export const writeClientSchemas = async (
    models: Model[],
    templates: Templates,
    outputPath: string,
    useUnionTypes: boolean
): Promise<void> => {
    for (const model of models) {
        const file = resolve(outputPath, `$${model.name}.ts`);
        const templateResult = templates.exports.schema({
            ...model,
            useUnionTypes,
        });

        const prettireConfig = await prettier.resolveConfig(process.cwd());
        await writeFile(file, prettier.format(templateResult, prettireConfig ?? {}));
    }
};
