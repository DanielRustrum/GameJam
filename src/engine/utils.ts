export const createImportMap = (imports: Record<string, string>) => {
    return Object.values(
        imports
    ).reduce((obj: {[key: string]: string}, value) => {
        console.log(value)
        const key = value.split("/").pop()?.split(".").slice(0, -1).join(".") ?? ""
        obj[key] = value;
        return obj;
      }, {});
}

export const bulkImportModules = (
    imports: Record<string, string>,
) => {
    return Object.fromEntries(
          Object.entries(imports).map((mod: any) => {
            return [mod[0], mod[1]]
        })
    ) as {[key: string]: any}
}