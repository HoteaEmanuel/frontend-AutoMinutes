export type Area = { x: number; y: number; width: number; height: number };

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

// Decupeaza zona selectata intr un patrat de `size`px si intoarce un Blob webp.
// Serverul re-encodeaza oricum, dar decuparea clientside pastreaza uploadul mic.
export const getCroppedWebp = async (imageSrc: string, crop: Area, size = 512): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, size, size);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas is empty'))),
      'image/webp',
      0.9,
    );
  });
};
