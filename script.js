function splitImage() {
  const fileInput = document.getElementById("imageInput");
  const gridValue = parseInt(document.getElementById("gridSelect").value);
  const preview = document.getElementById("preview");

  preview.innerHTML = "";

  if (!fileInput.files[0]) {
    alert("Please upload an image first.");
    return;
  }

  const file = fileInput.files[0];
  const img = new Image();

  img.onload = function () {
    let rows, cols;

    if (gridValue === 3) {
      rows = 1;
      cols = 3;
    } else if (gridValue === 9) {
      rows = 3;
      cols = 3;
    } else if (gridValue === 12) {
      rows = 4;
      cols = 3;
    }

    preview.style.gridTemplateColumns = `repeat(${cols}, auto)`;

    const tileWidth = img.width / cols;
    const tileHeight = img.height / rows;

    let count = 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = tileWidth;
        canvas.height = tileHeight;

        ctx.drawImage(
          img,
          col * tileWidth,
          row * tileHeight,
          tileWidth,
          tileHeight,
          0,
          0,
          tileWidth,
          tileHeight
        );

        const imageUrl = canvas.toDataURL("image/png");

        const tileDiv = document.createElement("div");
        tileDiv.className = "tile";

        const splitImg = document.createElement("img");
        splitImg.src = imageUrl;

        const downloadLink = document.createElement("a");
        downloadLink.href = imageUrl;
        downloadLink.download = `instagram-grid-${count}.png`;
        downloadLink.innerText = "Download";

        tileDiv.appendChild(splitImg);
        tileDiv.appendChild(downloadLink);
        preview.appendChild(tileDiv);

        count++;
      }
    }
  };

  img.src = URL.createObjectURL(file);
}
