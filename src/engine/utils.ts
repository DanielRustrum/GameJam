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