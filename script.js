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

    // reset old glow
    nameText.className = "name-text";

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
// SANITIZE STYLES FOR html2canvas
// ======================
function sanitizeForCanvas() {
  const modified = [];

  document.querySelectorAll("*").forEach(el => {
    const style = getComputedStyle(el);

    // Unsupported color()
    if (style.color.includes("color(")) {
      modified.push({ el, prop: "color", value: el.style.color });
      el.style.color = "#ffffff";
    }

    if (style.background.includes("color(")) {
      modified.push({ el, prop: "background", value: el.style.background });
      el.style.background = "transparent";
    }

    // Filters break html2canvas
    if (style.filter !== "none") {
      modified.push({ el, prop: "filter", value: el.style.filter });
      el.style.filter = "none";
    }

    if (style.backdropFilter && style.backdropFilter !== "none") {
      modified.push({ el, prop: "backdropFilter", value: el.style.backdropFilter });
      el.style.backdropFilter = "none";
    }
  });

  return modified;
}

function restoreStyles(modified) {
  modified.forEach(({ el, prop, value }) => {
    el.style[prop] = value || "";
  });
}

// ======================
// DOWNLOAD IMAGE (SAFE)
// ======================
downloadBtn.onclick = async () => {

  try {
    await roomPreview.decode();
  } catch {}

  await new Promise(r => requestAnimationFrame(r));

  // 🔥 SANITIZE BEFORE CAPTURE
  const modifiedStyles = sanitizeForCanvas();

  const canvasTarget = document.querySelector(".editor-canvas");

  const canvas = await html2canvas(canvasTarget, {
    backgroundColor: "#000000",
    scale: 4,          // 6 was overkill, this is safer
    useCORS: true,
    logging: false
  });

  // 🔁 RESTORE STYLES
  restoreStyles(modifiedStyles);

  const link = document.createElement("a");
  link.download = "seismic-room.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

