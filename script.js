// ======================
// ELEMENT REFERENCES
// ======================
const rooms = document.querySelectorAll(".room");
const gridView = document.querySelector(".grid-view");
const editorView = document.querySelector(".editor-view");

const roomPreview = document.getElementById("roomPreview");
const nameInput = document.getElementById("nameInput");
const nameText = document.getElementById("nameText");

const backBtn = document.getElementById("backBtn");
const downloadBtn = document.getElementById("downloadBtn");

// ======================
// FORCE INITIAL VIEW (ON LOAD)
// ======================
editorView.classList.add("hidden");
gridView.classList.remove("hidden");

// ======================
// OPEN EDITOR ON ROOM CLICK
// ======================
rooms.forEach(room => {
  room.addEventListener("click", () => {
    const img = room.querySelector("img");
    if (!img) return;

    roomPreview.src = img.src;

       nameText.className = "name-text"; // reset old glow

    const roomIndex = [...rooms].indexOf(room) + 1;
    nameText.classList.add(`glow-room-${roomIndex}`);

    gridView.classList.add("hidden");
    editorView.classList.remove("hidden");
  });
});

// ======================
// NAME INPUT LOGIC
// ======================
nameInput.addEventListener("input", () => {
  let value = nameInput.value.toUpperCase();
  value = value.slice(0, 20);
  nameInput.value = value;

  if (value.length <= 10) {
    nameText.textContent = value || "YOUR NAME";
    return;
  }

  const firstTen = value.slice(0, 10);
  const remaining = value.slice(10);
  const lastSpaceIndex = firstTen.lastIndexOf(" ");

  if (lastSpaceIndex !== -1) {
    const firstLine = value.slice(0, lastSpaceIndex);
    const secondLine = value.slice(lastSpaceIndex + 1);
    nameText.innerHTML = `${firstLine}<br>${secondLine}`;
  } else {
    nameText.innerHTML = `${firstTen}<br>${remaining}`;
  }
});

// ======================
// BACK BUTTON
// ======================
backBtn.addEventListener("click", () => {
  editorView.classList.add("hidden");
  gridView.classList.remove("hidden");

  nameInput.value = "";
  nameText.textContent = "YOUR NAME";
});

// ======================
// DOWNLOAD IMAGE (ONLY ONCE)
// ======================
downloadBtn.onclick = async () => {

  try {
    await roomPreview.decode();
  } catch (e) {}

  await new Promise(r => requestAnimationFrame(r));

  const canvasTarget = document.querySelector(".editor-canvas");

  const canvas = await html2canvas(canvasTarget, {
    backgroundColor: "#000000",
    scale: 6,
    useCORS: true
  });

  const link = document.createElement("a");
  link.download = "seismic-room.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
