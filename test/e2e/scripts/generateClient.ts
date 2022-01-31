import { generate as __generate } from '../../../';

export const generateClient = async (
    dir: string,
    version: string,
    useOptions: boolean = false,
    useUnionTypes: boolean = false,
    clientName?: string
) => {
    await __generate({
        input: `./test/spec/${version}.json`,
        output: `./test/e2e/generated/${dir}/`,
        useOptions,
        useUnionTypes,
        clientName,
    });
};
