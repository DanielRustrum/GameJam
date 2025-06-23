type ObjectKeysRequired<T> = {
    [K in keyof T]-?: T[P];
}

export type OptionObject<T, Arg> = NonNullable<Parameters<T>[Arg]>

export type OptionObjectDefaults<T, Arg> = 
    ObjectKeysRequired<OptionObject<T, Arg>>


export type OptionObjectDefinition<Options extends Object> = Partial<Options> | undefined