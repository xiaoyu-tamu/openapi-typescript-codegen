import { resolve } from 'path';
import prettier from 'prettier';

import type { Model } from '../client/interfaces/Model';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate Models using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param useUnionTypes Use union types instead of enums
 */
export const writeClientModels = async (
    models: Model[],
    templates: Templates,
    outputPath: string,
    useUnionTypes: boolean
): Promise<void> => {
    const file = resolve(`${outputPath}.ts`);
    const templateResult = models.map(model => templates.exports.model({ ...model, useUnionTypes })).join('\n');
    const prettireConfig = await prettier.resolveConfig(process.cwd());
    await writeFile(file, prettier.format(templateResult, prettireConfig ?? {}));
};
