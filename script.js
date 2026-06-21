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
      createGrid(img);
    } else {
      createCarousel(img);
    }
  };

  img.src = URL.createObjectURL(fileInput.files[0]);
}

function getRatioSize() {
  const ratio = document.getElementById("ratioSelect").value;

  if (ratio === "1:1") return { width: 1080, height: 1080 };
  if (ratio === "4:5") return { width: 1080, height: 1350 };
  if (ratio === "3:4") return { width: 1080, height: 1440 };
}

function createGrid(img) {
  const gridValue = parseInt(document.getElementById("gridSelect").value);

  let rows, cols = 3;

  if (gridValue === 3) rows = 1;
  if (gridValue === 9) rows = 3;
  if (gridValue === 12) rows = 4;

  const size = getRatioSize();

  splitImage(img, cols, rows, size.width, size.height, "grid");
}

function createCarousel(img) {
  const slides = parseInt(document.getElementById("carouselSelect").value);
  const size = getRatioSize();

  splitImage(img, slides, 1, size.width, size.height, "carousel");
}

function splitImage(img, cols, rows, outputWidth, outputHeight, name) {
  const preview = document.getElementById("preview");

  const sourceWidth = img.width / cols;
  const sourceHeight = img.height / rows;

  let count = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.drawImage(
        img,
        col * sourceWidth,
        row * sourceHeight,
        sourceWidth,
        sourceHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );

      const imageUrl = canvas.toDataURL("image/png");

      const tile = document.createElement("div");
      tile.className = "tile";

      const image = document.createElement("img");
      image.src = imageUrl;

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${name}-${count}.png`;
      link.innerText = "Download";

      tile.appendChild(image);
      tile.appendChild(link);
      preview.appendChild(tile);

      count++;
    }
  }
}
