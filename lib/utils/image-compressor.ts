import Resizer from 'react-image-file-resizer';

interface ImageCompressorOptions {
  maxWidth: number;
  maxHeight: number;
  compressFormat?: 'JPEG' | 'PNG'; // It supports WEBP but stripe does not allow this extension for the current porpouse in the back used to upload the image.
  quality?: number; // 0-100
  rotation?: number; // 0-360
}

export function imageCompressor(image: File, opts: ImageCompressorOptions): Promise<File> {
  const { maxWidth, maxHeight, compressFormat = 'JPEG', quality = 80, rotation = 0 } = opts;

  return new Promise((resolve, reject) => {
    if (!maxWidth || !maxHeight) {
      reject('Max width and height are required');
      return;
    }

    Resizer.imageFileResizer(
      image,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      rotation,
      (compressedResult) => {
        if (compressedResult instanceof Blob) {
          const newFile = new File([compressedResult], image.name, {
            type: compressedResult.type,
            lastModified: Date.now(),
          });
          resolve(newFile);
        } else {
          reject(new Error('Resizer did not return a Blob as expected.'));
        }
      },
      'blob'
    );
  });
}