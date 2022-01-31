export type Options = {
    input: string | Record<string, any>;
    output: string;
    clientName?: string;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportSchemas?: boolean;
    postfix?: string;
    request?: string;
    write?: boolean;
};

export declare function generate(options: Options): Promise<void>;

export default { generate };
