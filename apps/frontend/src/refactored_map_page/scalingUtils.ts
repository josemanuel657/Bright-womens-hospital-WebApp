import { Scaling } from "common/src/types/map_page_types.ts";

export function getWidthScaling(divWidth: number, imageWidth: number): number {
  return divWidth / imageWidth;
}

export function getHeightScaling(
  divHeight: number,
  imageHeight: number,
): number {
  return divHeight / imageHeight;
}

export function getScaling(
  divWidth: number,
  divHeight: number,
  imageWidth: number,
  imageHeight: number,
): Scaling {
  return {
    widthScaling: getWidthScaling(divWidth, imageWidth),
    heightScaling: getHeightScaling(divHeight, imageHeight),
  };
}

export function imageToDisplayCoordinates(
  x: number,
  scalingX: number,
  y: number,
  scalingY: number,
): {
  displayX: number;
  displayY: number;
} {
  return {
    displayX: x * scalingX, // scaling X == divWidth / IMAGE_WIDTH;
    displayY: y * scalingY, // scalingY == divHeight / IMAGE_HEIGHT
  };
}

export function displayToImageCoordinates(
  clientX: number,
  clientY: number,
  translationX: number,
  translationY: number,
  scale: number,
  widthScaling: number,
  heightScaling: number,
): {
  imageX: number;
  imageY: number;
} {
  // First, adjust the display coordinates by the current pan and scale
  const adjustedX = (clientX - translationX - 55) / scale;
  const adjustedY = (clientY - translationY) / scale;

  // Then, convert these adjusted coordinates back to the original image's scale
  const imageX = adjustedX / widthScaling;
  const imageY = adjustedY / heightScaling;

  return {
    imageX: imageX,
    imageY: imageY,
  };
}
