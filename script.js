let mode = "grid";

function setMode(selectedMode) {
  mode = selectedMode;

  document.getElementById("gridOptions").classList.toggle("hidden", mode !== "grid");
  document.getElementById("carouselOptions").classList.toggle("hidden", mode !== "carousel");
}

function processImage() {
  const fileInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  preview.innerHTML = "";

  if (!fileInput.files[0]) {
    alert("Please upload an image first.");
    return;
  }

  const img = new Image();

  img.onload = function () {
    if (mode === "grid") {
      createInstagramGrid(img);
    } else {
      createCarousel(img);
    }
  };

  img.src = URL.createObjectURL(fileInput.files[0]);
}

function createInstagramGrid(img) {
  const gridValue = parseInt(document.getElementById("gridSelect").value);

  const cols = 3;
  const rows = gridValue / 3;

  const tileWidth = 1080;
  const tileHeight = 1350;

  const finalWidth = cols * tileWidth;
  const finalHeight = rows * tileHeight;

  const fittedCanvas = cropImageToExactSize(img, finalWidth, finalHeight);

  let pieces = [];
  let count = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = tileWidth;
      canvas.height = tileHeight;

      ctx.drawImage(
        fittedCanvas,
        col * tileWidth,
        row * tileHeight,
        tileWidth,
        tileHeight,
        0,
        0,
        tileWidth,
        tileHeight
      );

      pieces.push({
        number: count,
        url: canvas.toDataURL("image/png")
      });

      count++;
    }
  }

  // Reverse order because Instagram shows latest post first
  pieces.reverse();

  pieces.forEach((piece, index) => {
    showTile(piece.url, `upload-${index + 1}-grid-piece-${piece.number}.png`);
  });
}

function cropImageToExactSize(img, targetWidth, targetHeight) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const imageRatio = img.width / img.height;
  const targetRatio = targetWidth / targetHeight;

  let sourceWidth, sourceHeight, sourceX, sourceY;

  if (imageRatio > targetRatio) {
    sourceHeight = img.height;
    sourceWidth = img.height * targetRatio;
    sourceX = (img.width - sourceWidth) / 2;
    sourceY = 0;
  } else {
    sourceWidth = img.width;
    sourceHeight = img.width / targetRatio;
    sourceX = 0;
    sourceY = (img.height - sourceHeight) / 2;
  }

  ctx.drawImage(
    img,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return canvas;
}

function createCarousel(img) {
  const slides = parseInt(document.getElementById("carouselSelect").value);

  const tileWidth = 1080;
  const tileHeight = 1350;

  const finalWidth = slides * tileWidth;
  const finalHeight = tileHeight;

  const fittedCanvas = cropImageToExactSize(img, finalWidth, finalHeight);

  for (let i = 0; i < slides; i++) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = tileWidth;
    canvas.height = tileHeight;

    ctx.drawImage(
      fittedCanvas,
      i * tileWidth,
      0,
      tileWidth,
      tileHeight,
      0,
      0,
      tileWidth,
      tileHeight
    );

    showTile(canvas.toDataURL("image/png"), `carousel-slide-${i + 1}.png`);
  }
}

function showTile(imageUrl, filename) {
  const preview = document.getElementById("preview");

  const tile = document.createElement("div");
  tile.className = "tile";

  const image = document.createElement("img");
  image.src = imageUrl;

  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = filename;
  link.innerText = "Download";

  tile.appendChild(image);
  tile.appendChild(link);
  preview.appendChild(tile);
}
