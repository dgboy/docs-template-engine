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

const getWidthLongString = (ctx, strings) => {
  let idLongStr = 0;

  for (let i = 1; i < strings.length; i++) {
    const longTemp = ctx.measureText(strings[idLongStr]).width;
    const element = ctx.measureText(strings[i]).width;

    if(longTemp < element) {
      idLongStr = i;
    }
  }

  return Number(ctx.measureText(strings[idLongStr]).width);
};

const getNameResizingOffset = (mouse, offsets, cvsW, cvsH) => {
  const shift = 5;

  if (mouse.x >= offsets.left - shift && mouse.x <= offsets.left + shift) {
    return "left";
  }

  if (mouse.x >= cvsW - offsets.right - shift && mouse.x <= cvsW - offsets.right + shift) {
    return "right";
  }

  if (mouse.y >= offsets.top - shift && mouse.y <= offsets.top + shift) {
    return "top";
  }

  if (mouse.y >= cvsH - offsets.bottom - shift && mouse.y <= cvsH - offsets.bottom + shift) {
    return "bottom";
  }

  return null;
};

const getDraggingElement = (mouse, elems, offsets, elemsTypes, cvsW) => {
  for (let i = 0; i < elemsTypes.length; i++) {
    const type = elemsTypes[i];

    for (let j = 0; j < elems[type].length; j++) {
      const el = elems[type][j];

      let x = offsets.left + el.x;
      let y = offsets.top + el.y;

      const lines = getLines(el.value, cvsW - (offsets.left + offsets.right + el.x));
      const widthLongString = getWidthLongString(context, lines);

      const text = {
        w: widthLongString,
        h: el.font * lines.length
      };
      
      if (mouse.x >= x && mouse.x <= x + text.w && mouse.y >= y && mouse.y <= y + text.h) {
        return {
          type: type,
          id: j,
          shift: {
            x: mouse.x - x,
            y: mouse.y - y
          }
        };
      }
    };
  };

  return null;
};

const initButtons = (mouse, aligns, el) => {
  let fields = ["left", "center", "right"];
  
  buttonsAling = ["left", "center", "right"];
  const box = {
    w: 20,
    h: 20
  }
  const len = 3;
  const icons = ["<", "=", ">"];
  const offset = 5;

  context.font = `${el.font}px Times New Roman`;
  context.setLineDash([]);

  for (let i = 0; i < buttonsAling.length; i++) {
    // let 
    let shift = i * box.w + offset;

    context.fillStyle = el.align === buttonsAling[i] ? "white" : "gray";

    context.fillRect(el.x + shift, el.y + el.font, box.w, box.h);
    context.strokeRect(el.x + shift, el.y + el.font, box.w, box.h);
    
    context.fillStyle = "black";
    context.fillText(icons[i], el.x + shift + 4, el.y + el.font * 2 - 4, box.w, box.h);
  }


  return null;
};

const getPressButton = (mouse, aligns, el) => {
  let fields = ["left", "center", "right"];


  // if (el.align && buttons.align[el.align]) {
  //   return true;
  // } else {
  //   return null;
  // }


  for (let i = 0; i < fields.length; i++) {
    const type = fields[i];
      
    if (mouse.x >= el.x && mouse.x <= x + text.w && mouse.y >= y && mouse.y <= y + text.h) {
      return {
        type: type,
        id: j,
        shift: {
          x: mouse.x - x,
          y: mouse.y - y
        }
      };
    }

    for (let j = 0; j < buttons[type].length; j++) {
      const el = buttons[type][j];

      let x = offsets.left + el.x;
      let y = offsets.top + el.y;

      const lines = getLines(el.value, cvsW - (offsets.left + offsets.right + el.x));
      const widthLongString = getWidthLongString(context, lines);

      const text = {
        w: widthLongString,
        h: el.font * lines.length
      };
    };
  };

  return null;
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
