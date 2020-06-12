import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';

function scaleImage(image, multiplier) {
  image.width *= multiplier;
  image.height *= multiplier;
}

async function preloadImages(srcArr) {
  const results = await Promise.allSettled(
    srcArr.map(src => {
      const image = new Image();
      image.src = src;
      return new Promise((resolve, reject) =>
        image
          .decode()
          .then(() => resolve(image))
          .catch(() =>
            reject(new Error(`Error decoding image "${image.src}"`)),
          ),
      );
    }),
  );

  return results
    .filter(({ value }) => !!value)
    .map(({ value }) => value);
}

function getGalleryRatio([header, sub1, sub2]) {
  // scale any sub images so that their width is half the header width
  const halfHeaderWidth = header.width / 2;
  if (sub1) {
    const widthAdjustmentMultiplier = halfHeaderWidth / sub1.width;
    scaleImage(sub1, widthAdjustmentMultiplier);
  }

  if (sub2) {
    const widthAdjustmentMultiplier = halfHeaderWidth / sub2.width;
    scaleImage(sub2, widthAdjustmentMultiplier);
  }

  // calculate the cumulative height of the header and taller sub image
  let taller;
  if (sub1) {
    if (sub2) taller = sub2.height > sub1.height ? sub2 : sub1;
    else taller = sub1;
  } else if (sub2) taller = sub2;

  const totalGalleryHeight = taller
    ? header.height + taller.height
    : header.height;

  return header.width / totalGalleryHeight;
}

export default function PictureBookGallery({
  images = [],
  onLoad,
  name,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayImages, setDisplayImages] = useState([]);
  const [galleryRatio, setGalleryRatio] = useState();

  useEffect(
    () => {
      try {
        if (isLoading) {
          if (images.length === 0) {
            setIsLoading(false);
            if (onLoad) onLoad();
            return;
          }

          const prepareGallery = async () => {
            // Preload Images
            let loadedImages = [];
            if (images.length <= 3) {
              loadedImages = await preloadImages(images);
            } else {
              // If an image does not load, replace it with the next image
              // in the array
              let startingIndex = 0;
              let numImagesToLoad = 3;
              let numRemainingImagesToTry = images.length;

              while (
                loadedImages.length < 3 &&
                numRemainingImagesToTry > 0
              ) {
                const imagesToTry = images.slice(
                  startingIndex,
                  startingIndex + numImagesToLoad,
                );

                // eslint-disable-next-line no-await-in-loop
                const results = await preloadImages(imagesToTry);
                loadedImages.push(...results);

                startingIndex += numImagesToLoad;
                numRemainingImagesToTry -= numImagesToLoad;
                numImagesToLoad = Math.min(
                  3 - loadedImages.length,
                  numRemainingImagesToTry,
                );
              }
            }

            if (loadedImages.length === 0) {
              setIsLoading(false);
              if (onLoad) onLoad();
              return;
            }

            // Determine Gallery Aspect Ratio
            const ratio = getGalleryRatio(loadedImages);

            setDisplayImages(loadedImages.map(({ src }) => src));
            setGalleryRatio(ratio);
          };
          prepareGallery();
        }
      } catch (err) {
        console.error('Error loading picture book gallery');
        console.error(err);
        if (isLoading) {
          setIsLoading(false);
          if (onLoad) onLoad();
        }
      }
    },
    [images, isLoading],
  );

  useEffect(
    () => {
      if (isLoading && galleryRatio) {
        setIsLoading(false);
        if (onLoad) onLoad();
      }
    },
    [isLoading, galleryRatio],
  );

  if (
    images.length === 0 ||
    (!isLoading && displayImages.length === 0)
  ) {
    return (
      <Typography>
        <FormattedMessage id="NO_IMAGES" />
      </Typography>
    );
  }
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;

        width: 4.5in;
        height: calc(4.5in / ${galleryRatio || 1});
        max-height: 5in;
        max-width: calc(5in * ${galleryRatio || 1});

        img {
          width: 50%;
        }

        img:first-of-type {
          width: 100%;
        }
      `}
    >
      {displayImages.map((imageSrc, index) => (
        <img
          key={imageSrc}
          src={imageSrc}
          alt={`${name} #${index}`}
        />
      ))}
    </div>
  );
}
