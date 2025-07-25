import Papa from 'papaparse';

export function loadCSVData(filePath) {
  return new Promise((resolve, reject) => {

    {/* Use PapaParse to load and parse the CSV file */}
    Papa.parse(filePath, {
      download: true, 
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}
