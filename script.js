let mode = "grid";

function setMode(selectedMode){

mode = selectedMode;

document
.getElementById("gridOptions")
.classList
.toggle("hidden", mode !== "grid");

document
.getElementById("carouselOptions")
.classList
.toggle("hidden", mode !== "carousel");

}

function processImage(){

const file =
document.getElementById("imageInput").files[0];

if(!file){
alert("Upload an image first");
return;
}

const img = new Image();

img.onload = function(){

if(mode==="grid"){
createGrid(img);
}else{
createCarousel(img);
}

};

img.src = URL.createObjectURL(file);

}

function createGrid(img){

const total =
parseInt(
document.getElementById("gridSelect").value
);

const cols = 3;
const rows = total / 3;

splitImage(img, cols, rows, true);

}

function createCarousel(img){

const slides =
parseInt(
document.getElementById("carouselSelect").value
);

splitImage(img, slides, 1, false);

}

function splitImage(img, cols, rows, reverse){

const preview =
document.getElementById("preview");

preview.innerHTML = "";

const pieceWidth = img.width / cols;
const pieceHeight = img.height / rows;

let pieces = [];

let counter = 1;

for(let row=0; row<rows; row++){

for(let col=0; col<cols; col++){

const canvas =
document.createElement("canvas");

const ctx =
canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 1350;

ctx.drawImage(
img,
col * pieceWidth,
row * pieceHeight,
pieceWidth,
pieceHeight,
0,
0,
1080,
1350
);

pieces.push({
number:counter,
url:canvas.toDataURL("image/png")
});

counter++;

}

}

if(reverse){
pieces.reverse();
}

pieces.forEach((piece,index)=>{

const tile =
document.createElement("div");

tile.className="tile";

const image =
document.createElement("img");

image.src = piece.url;

const link =
document.createElement("a");

link.href = piece.url;

link.download =
`Upload-${index+1}.png`;

link.innerText =
`Upload #${index+1}`;

tile.appendChild(image);
tile.appendChild(link);

preview.appendChild(tile);

});

}
