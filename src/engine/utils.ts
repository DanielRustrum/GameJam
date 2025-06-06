export const bulkImportModules = (
    imports: Record<string, string>,
) => {
    return Object.fromEntries(
          Object.entries(imports).map((mod: any) => {
            return [mod[0], mod[1]]
        })
    ) as {[key: string]: any}
}