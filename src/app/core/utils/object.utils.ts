export function jsonToFormData(
  data: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (data[key] instanceof Blob) {
        // Type assertion to ensure 'name' property exists
        const fileName = (data[key] as File).name || 'file';
        formData.append(fullKey, data[key], fileName);
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        // If the value is an object or array, recursively call jsonToFormData
        if (Array.isArray(data[key])) {
          for (let i = 0; i < data[key].length; i++) {
            jsonToFormData({ [i]: data[key][i] }, formData, fullKey);
          }
        } else {
          jsonToFormData(data[key], formData, fullKey);
        }
      } else {
        // If the value is a primitive type, append it to the FormData
        formData.append(fullKey, String(data[key]));
      }
    }
  }

  return formData;
}
