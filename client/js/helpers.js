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

const createPDF = async (canvas) => {
  const quality = 1;
  let w = сonvertPxToMM(canvas.width);
  let h = сonvertPxToMM(canvas.height);
  let orientation = w > h ? 'l' : 'p';
  let docPDF = new jsPDF(orientation, 'mm', [w, h]);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      docPDF.addImage(canvas.toDataURL('image/png', quality), 'JPEG', 0, 0);
      resolve(docPDF);
    }, 100);
  });
};

const getLines = (dataFields, maxLen, ctx) => {
  let words = dataFields.split(" ");
  let lastWord = words[0];
  let splitChar = " ";
  let lines = [];

  if (words.length <= 1) {
    return words;
  }
  
  for (let i = 1; i < words.length; i++) {
    let w = words[i];
    let width = ctx.measureText(lastWord + splitChar + w).width;

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
  let longStrW = Number(ctx.measureText(strings[0]).width);

  for (let i = 1; i < strings.length; i++) {
    const strW = Number(ctx.measureText(strings[i]).width);

    if(longStrW < strW) {
      longStrW = strW;
    }
  }

  return longStrW;
};

const getNameResizingOffset = (mouse, offsets, w, h) => {
  const shift = 5;

  if (mouse.x >= offsets.left - shift && mouse.x <= offsets.left + shift) {
    return "left";
  }

  if (mouse.x >= w - offsets.right - shift && mouse.x <= w - offsets.right + shift) {
    return "right";
  }

  if (mouse.y >= offsets.top - shift && mouse.y <= offsets.top + shift) {
    return "top";
  }

  if (mouse.y >= h - offsets.bottom - shift && mouse.y <= h - offsets.bottom + shift) {
    return "bottom";
  }

  return null;
};

const getSelectedElement = (mouse, t, elemsTypes, ctx, downfalse) => {
  const offsets = t.offsets;
  const elems = t.elems;

  for (let i = 0; i < elemsTypes.length; i++) {
    const type = elemsTypes[i];

    for (let j = 0; j < elems[type].length; j++) {
      const el = elems[type][j];

      const x = offsets.left + el.x;
      const y = offsets.top + el.y;

      const lines = getLines(el.value, t.width - (offsets.left + offsets.right), ctx);

      el.w = getWidthLongString(ctx, lines);
      el.h = el.font * lines.length;
      
      if (mouse.x >= x && mouse.x <= x + el.w && mouse.y >= y && mouse.y <= y + el.h) {
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

const initData = (dataFields) => {
  const data = [];
  const dataset = {};
  
  for (let i = 0; i < dataFields.length; i++) {
    dataset[dataFields[i].name] = dataFields[i].name;
  }

  data.push(dataset);
  return data;
};

const fillTemplateDataFields = (dataFields, data) => {
  for (let i = 0; i < dataFields.length; i++) {
    dataFields[i].value = data[dataFields[i].name];
  }

  return dataFields;
};

const applyAlignment = (t) => {
  for (let i = 0; i < elemsType.length; i++) {
    for (let j = 0; elems[elemsType[i]] && j < elems[elemsType[i]].length; j++) {
      const lineW = context.measureText(lines[k]).width;
    
      switch (el.align) {
        case "left":
          el.x = 0;
          break;
        case "center":
          el.x = parseInt(w - offsets.right - offsets.left - lineW) / 2;
          break;
        case "right":
          el.x = w - offsets.right - lineW - offsets.left - 1;
          break;
        default:
          break;
      };

    }
  }
};
