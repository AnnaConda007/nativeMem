let imageSrc = null;
let text = "";
let fontSize = 20;
let color = "#000000";
let dragging = false;
const imageInput = document.querySelector(".imageInput");
const textInput = document.querySelector(".textInput");
const fontSizeInput = document.querySelector(".fontSizeInput");
const colorInput = document.querySelector(".colorInput");
const memContainer = document.querySelector(".mem-container");
const canvas = document.querySelector(".mem-canvas");
const saveBtn = document.querySelector(".saveBtn");
const ctx = canvas.getContext("2d");

let textDiv;

const drawMem = () => {
  memContainer.innerHTML = "";
  if (!imageSrc) return;
  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "mem";
  memContainer.appendChild(img);
  textDiv = document.createElement("div");
  textDiv.classList.add("draggable-text");
  textDiv.style.fontSize = `${fontSize}px`;
  textDiv.style.color = color;
  textDiv.innerText = text;
  memContainer.prepend(textDiv);
  let dragOffsetX;
  let dragOffsetY;
  textDiv.onmousedown = (event) => {
    dragging = true;
    dragOffsetX = event.clientX - textDiv.offsetLeft;
    dragOffsetY = event.clientY - textDiv.offsetTop;
  };
  document.onmousemove = (event) => {
    if (dragging) {
      textDiv.style.left = event.clientX - dragOffsetX + "px";
      textDiv.style.top = event.clientY - dragOffsetY + "px";
    }
  };
  document.onmouseup = () => {
    dragging = false;
  };
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    imageSrc = reader.result;
    drawMem();
  };
  reader.readAsDataURL(file);
};

const drawMemeToCanvas = (callback) => {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, textDiv.offsetLeft, textDiv.offsetTop + fontSize);
    callback();
  };
};

const saveMem = () => {
  drawMemeToCanvas(() => {
    const imgData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imgData;
    a.download = "meme.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};
imageInput.addEventListener("change", handleImageChange);

textInput.addEventListener("input", (e) => {
  text = e.target.value;
  drawMem();
});
fontSizeInput.addEventListener("input", (e) => {
  fontSize = e.target.value;
  drawMem();
});
colorInput.addEventListener("input", (e) => {
  color = e.target.value;
  drawMem();
});

saveBtn.addEventListener("click", saveMem);
