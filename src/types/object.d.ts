export type OptionObjectFromArgs<T, Arg> = {
    [K in keyof NonNullable<Parameters<T>[Arg]>]-?: NonNullable<MyType[K]>;
}



