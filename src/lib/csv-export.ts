export const convertToCSV = (arr: Record<string, unknown>[]) => {
    if (!arr.length) return "";
    const array: (string[] | Record<string, unknown>)[] = [Object.keys(arr[0])];
    const data = array.concat(arr);

    return data.map(it => {
        return Object.values(it).toString();
    }).join("\n");
};

export const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
