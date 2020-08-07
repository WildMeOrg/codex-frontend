import { get } from 'lodash-es';
import ExifReader from 'exifreader';

export function getExifData(files, callback) {
  const filePromises = files.map(file => {
    return new Promise((resolve, reject) => {
      fetch(file)
      .then(response => response.arrayBuffer())
      .then(data => {
        try {
          const tags = ExifReader.load(data, { expanded: true });
          /* Recommended by ExifReader maintainers to reduce memory usage */
          delete tags.MakerNote;
          const latitude = get(tags, ['gps', 'Latitude']);
          const longitude = get(tags, ['gps', 'Longitude']);
          const datetime = get(tags, ['exif', 'DateTime', 'description']);
          resolve({ imageSource: file, latitude, longitude, datetime });
        } catch (error) {
          reject(error);
        }
      })
      .catch(error => reject(error));
    });
  });

  Promise.all(filePromises).then(exifData => {
    console.log('here');
    console.log(exifData);
    callback(exifData);
  }).catch(error => console.error(error));
}
