const сonvertPxToMM = px => Math.floor(px * 0.264583);

const convertMmToPx = mm => Math.floor(mm / 0.264583);

const loadImageAsync = async (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const getLines = (text, maxLen) => {
  let words = text.split(" ");
  let lastWord = words[0];
  let splitChar = " ";
  let lines = [];

  if (words.length <= 1) {
    return words;
  }
  
  for (let i = 1; i < words.length; i++) {
    let w = words[i];

    let width = context.measureText(lastWord + splitChar + w).width;

    if (width < maxLen) {
      lastWord += (splitChar + w);
    } else {
      lines.push(lastWord);
      lastWord = w;
    }
    
    if (i === words.length - 1) {
      lines.push(lastWord);
      break;
    }
  }

  return lines;
};

const getWidthLongString = (strings) => {
  let idLongStr = 0;

  for (let i = 1; i < strings.length; i++) {
    const longTemp = context.measureText(strings[idLongStr]).width;
    const element = context.measureText(strings[i]).width;

    if(longTemp < element) {
      idLongStr = i;
    }
  }

  return context.measureText(strings[idLongStr]).width;
};


// if (dragok) {
//   var mx = parseInt(e.clientX - offsetX);
//   var my = parseInt(e.clientY - offsetY);

//   var dx = mx - startX;
//   var dy = my - startY;

//   for (var i = 0; i < box.length; i++) {
//     if (box[i].isDragging == true) {
//       box[i].x += dx;
//       box[i].y += dy;
//     }
//   }
//   draw();
//   startX = mx;
//   startY = my;
// }

// dragging = false;

// dragok = false;
// for (var i = 0; i < box.length; i++) {
//   box[i].isDragging = false;
// }



// var mx = parseInt(e.clientX - offsetX);
// var my = parseInt(e.clientY - offsetY);

// dragok = true;
// var group = [];
// for (var i = 0; i < box.length; i++) {

//   if (mx > box[i].x && mx < box[i].x + box[i].width && my > box[i].y && my < box[i].y + box[i].height) {
//     group.push(box[i]);
//   }
// }

// if (group.length === 1) {
//   group[0].isDragging = true;
// } else if (group.length >= 2) {
//   var maxZ = group[0].z;
//   var b = group[0];

//   for (var i = 1; i < group.length; i++) {
//     if (maxZ < group[i].z) {
//       maxZ = group[i].z;
//       b = group[i];
//     }
//   }
//   b.isDragging = true;
// }

// startX = mx;
// startY = my;


// canvas.addEventListener("mousedown", (e) => {
//   mouse.x = e.pageX - canvas.offsetLeft;
//   mouse.y = e.pageY - canvas.offsetTop;
//   draw = true;
//   context.beginPath();
//   context.moveTo(mouse.x, mouse.y);
// });

// canvas.addEventListener("mousemove", (e) => {
//   if (draw == true) {
//     mouse.x = e.pageX - canvas.offsetLeft;
//     mouse.y = e.pageY - canvas.offsetTop;
//     context.lineTo(mouse.x, mouse.y);
//     context.stroke();
//   }
// });

// canvas.addEventListener("mouseup", (e) => {
//   mouse.x = e.pageX - canvas.offsetLeft;
//   mouse.y = e.pageY - canvas.offsetTop;
//   context.lineTo(mouse.x, mouse.y);
//   context.stroke();
//   context.closePath();
//   draw = false;
// });
