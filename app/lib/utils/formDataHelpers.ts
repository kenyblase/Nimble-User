// utils/formDataHelpers.ts
export const prepareProductFormData = (productData: any, files: File[]): FormData => {
  const formData = new FormData();
  
  // Append files
  files.forEach((file, index) => {
    formData.append('images', file);
  });
  
  // Append product data
  Object.keys(productData).forEach(key => {
    if (productData[key] !== undefined && productData[key] !== null) {
      // Handle arrays and objects (convert to JSON string)
      if (Array.isArray(productData[key]) || typeof productData[key] === 'object') {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, String(productData[key]));
      }
    }
  });
  
  return formData;
};