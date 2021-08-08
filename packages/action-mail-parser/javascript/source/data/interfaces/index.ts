// #region module
export interface RegistryEntry {
    type: string;
    shape: Record<string, 'string' | 'boolean'>;
    groupsLength?: number;
};

export interface RegistryParse {
    type: string;
    values: any;
};


export interface ParserOption {
    spacer: string;
    groupsKey: string;
}
// #endregion module
