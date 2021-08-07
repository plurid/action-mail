// #region module
export interface RegistryEntry {
    type: string;
    shape: Record<string, 'string' | 'boolean'>;
};

export interface RegistryParse {
    type: string;
    values: any;
};
// #endregion module
