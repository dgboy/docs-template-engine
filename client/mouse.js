var mouse = {
  x: 0,
  y: 0
};

var dragging = false;
var draw = false;
// console.log("L: " + canvas.offsetLeft);
// console.log("T: " + canvas.offsetTop);
// console.log("1) " + elemsNames.length);
// console.log("2) " + JSON.stringify(temp.elems));

const myDown = (e) => {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;

  if (!dragging) {
    let elemsType = ["labels", "text"];

    for (let i = 0; i < elemsType.length; i++) {
      for (let j = 0; j < temp.elems[elemsType[i]].length; j++) {
        const el = temp.elems[elemsType[i]][j];
        let x = temp.offsets.left + el.x;
        let y = temp.offsets.top + el.y;

        context.fillStyle = "rgba(100,150,185,0.5)";
        context.font = `${el.font}px Times New Roman`;
        let textLen = context.measureText(el.value).width;
        console.log("Len: " + textLen);

        if (mouse.x >= x && mouse.x <= x + textLen && mouse.y >= y && mouse.y <= y + el.font) {
          dragging = true;
          console.log("V= " + el.value.length + ", x=" + el.x + ", y=" + el.y);
          context.fillRect(x, y, textLen, el.font);
          context.strokeRect(x, y, textLen, el.font);
        }
      }
    }
  }

  draw = true;
  context.beginPath();
  context.setLineDash([]);
  context.moveTo(mouse.x, mouse.y);


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
}

const myMove = (e) => {
  if (draw == true) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
  }



  if (draw == true) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
  }
  
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
}

const myUp = (e) => {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
  context.lineTo(mouse.x, mouse.y);
  context.stroke();
  context.closePath();
  draw = false;
  
  // dragok = false;
  // for (var i = 0; i < box.length; i++) {
  //   box[i].isDragging = false;
  // }
}





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
