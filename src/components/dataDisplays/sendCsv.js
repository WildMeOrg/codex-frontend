import Papa from 'papaparse';
import { get } from 'lodash-es';

export function downloadFileFromBackend(excelData, filename) {
  console.log('excelData', excelData);
  const blob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
}

function startDownload(csv, filename) {
  /* copied from https://github.com/gregnb/mui-datatables/blob/ed3b8e38889d061a8cc858637b1d1dfe0fa55556/src/utils.js#L106 */
  const blob = new Blob([csv], { type: 'text/csv' });

  if (navigator && navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const dataURI = `data:text/csv;charset=utf-8,${csv}`;

    const URL = window.URL || window.webkitURL;
    const downloadURI =
      typeof URL.createObjectURL === 'undefined'
        ? dataURI
        : URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', downloadURI);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function defaultParser(x) {
  if (typeof x === 'string') return x;
  return JSON.stringify(x);
}

export default function sendCsv(columns, data) {
  const dataArray = data.map(datum =>
    Object.keys(datum).reduce((memo, dataKey) => {
      const column = columns.find(c => c.name === dataKey);
      if (!column) return memo;
      const dataParser =
        get(column, 'options.getStringValue') || defaultParser;
      memo[dataKey] = dataParser(datum[dataKey]);
      return memo;
    }, {}),
  );

  const fileData = Papa.unparse(dataArray, {
    columns: columns.map(c => c.name),
  });
  startDownload(fileData, 'table_export.csv');
}