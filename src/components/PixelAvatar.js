import React, { useEffect, useRef } from 'react';

const distance = (data, offset, color) => Math.hypot(
  data[offset] - color[0],
  data[offset + 1] - color[1],
  data[offset + 2] - color[2],
);

const colorKey = (data, offset) => [0, 1, 2]
  .map((channel) => Math.round(data[offset + channel] / 24) * 24)
  .join(',');

const findFrontier = (data, size) => {
  const frontier = [];
  for (let index = 0; index < size * size; index += 1) {
    if (!data[index * 4 + 3]) continue;
    const x = index % size;
    const y = Math.floor(index / size);
    const touchesEdge = x === 0 || y === 0 || x === size - 1 || y === size - 1;
    const touchesClear = (
      (x > 0 && !data[(index - 1) * 4 + 3])
      || (x < size - 1 && !data[(index + 1) * 4 + 3])
      || (y > 0 && !data[(index - size) * 4 + 3])
      || (y < size - 1 && !data[(index + size) * 4 + 3])
    );
    if (touchesEdge || touchesClear) frontier.push(index);
  }
  return frontier;
};

const peelBackgroundLayer = (data, size) => {
  const frontier = findFrontier(data, size);
  const colors = new Map();
  frontier.forEach((index) => {
    const key = colorKey(data, index * 4);
    colors.set(key, (colors.get(key) || 0) + 1);
  });
  const dominant = [...colors.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!dominant || dominant[1] < 3) return 0;
  const target = dominant[0].split(',').map(Number);
  const queue = frontier.filter((index) => distance(data, index * 4, target) < 48);
  const visited = new Uint8Array(size * size);
  let removed = 0;

  while (queue.length) {
    const index = queue.pop();
    if (visited[index]) continue;
    visited[index] = 1;
    const offset = index * 4;
    if (!data[offset + 3] || distance(data, offset, target) >= 58) continue;
    data[offset + 3] = 0;
    removed += 1;
    const x = index % size;
    const y = Math.floor(index / size);
    if (x > 0) queue.push(index - 1);
    if (x < size - 1) queue.push(index + 1);
    if (y > 0) queue.push(index - size);
    if (y < size - 1) queue.push(index + size);
  }
  return removed;
};

export default function PixelAvatar({ src }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const workSize = 64;
      const outputSize = 40;
      const work = document.createElement('canvas');
      work.width = workSize;
      work.height = workSize;
      const workContext = work.getContext('2d', { willReadFrequently: true });
      workContext.imageSmoothingEnabled = false;
      workContext.drawImage(image, 0, 0, workSize, workSize);

      const pixels = workContext.getImageData(0, 0, workSize, workSize);
      for (let layer = 0; layer < 4; layer += 1) {
        if (peelBackgroundLayer(pixels.data, workSize) < 3) break;
      }
      workContext.putImageData(pixels, 0, 0);

      let minX = workSize;
      let minY = workSize;
      let maxX = -1;
      let maxY = -1;
      for (let index = 0; index < workSize * workSize; index += 1) {
        if (pixels.data[index * 4 + 3] < 30) continue;
        const x = index % workSize;
        const y = Math.floor(index / workSize);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }

      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, outputSize, outputSize);
      if (maxX < minX || maxY < minY) return;
      const cropWidth = maxX - minX + 1;
      const cropHeight = maxY - minY + 1;
      const scale = Math.min(34 / cropWidth, 36 / cropHeight);
      const width = Math.max(1, Math.round(cropWidth * scale));
      const height = Math.max(1, Math.round(cropHeight * scale));
      context.drawImage(work, minX, minY, cropWidth, cropHeight, Math.floor((outputSize - width) / 2), outputSize - height - 2, width, height);
    };
    image.src = src;
  }, [src]);

  return <canvas ref={canvasRef} className="pixel-avatar-canvas" aria-label="Pixelated Ordinoooki sprite" />;
}
