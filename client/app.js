const myApp = angular.module('myApp', []);

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


myApp.controller('appController', ($scope) => {
  $scope.datasetItem = 0;
  $scope.templates = templates;
  $scope.curTemplate = null;
  $scope.data = null;

  $scope.selected = false;
  
  $scope.aligns = [
    {
      name: "left",
      label: "Слева",
      icon: "<",
      active: "false"
    },
    {
      name: "center",
      label: "Центр",
      icon: "=",
      active: "false"
    },
    {
      name: "right",
      label: "Справа",
      icon: ">",
      active: "false"
    }

  ];

  const cvsW = canvas.width;
  const cvsH = canvas.height;
  
  const imagePath = "images/";
  
  const mouse = {
    x: 0,
    y: 0
  };
  
  const buttons = {
    align: {
      left: {
        icon: "<"
      },
      center: {
        icon: "="
      },
      right: {
        icon: ">"
      }
    },
    font: {
      famaly: {
        icon: "шрифт"
      },
      size: {
        icon: "размер"
      },
      color: {
        icon: "цвет"
      }
    },
  };

  const elemsTypes = ["labels", "text"];
  // let doff;
  
  let resizing = false;
  let resizeOffset = null;
  
  let dragging = false;
  let dragElem = null;
  // let pressButton = null;

  const mouseDown = (event) => {
    const t = $scope.curTemplate;

    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;

    resizeOffset = getNameResizingOffset(mouse, t.offsets, cvsW, cvsH);

    if (resizeOffset) {
      canvas.style.cursor = (resizeOffset === "left" || resizeOffset === "right") ? 'col-resize' : 'row-resize';
      resizing = true;
      $scope.changeCanvas(t);
    }

    dragElem = getDraggingElement(mouse, t.elems, t.offsets, elemsTypes, cvsW);

    if (dragElem) {
      canvas.style.cursor = 'move';
      dragging = true;
      
      $scope.$apply(() => {
        $scope.selected = !$scope.selected;
        t.selectedElem = t.elems[dragElem.type][dragElem.id];

        for (let i = 0; i < $scope.aligns.length; i++) {
          if (t.selectedElem.align === $scope.aligns[i].name) {
            $scope.aligns[i].active = true;
          } else {
            $scope.aligns[i].active = false;
          }
        };
        
      });
      
      $scope.changeCanvas(t);
    }
  };

  const mouseMove = (event) => {
    const shift = 4;

    if (resizing === true) {
      const t = $scope.curTemplate;

      mouse.x = event.pageX - canvas.offsetLeft;
      mouse.y = event.pageY - canvas.offsetTop;
      
      const freeSpaceW = cvsW / 6;
      const freeSpaceH = cvsH / 8;

      if (resizeOffset === "left" && mouse.x >= 0 && mouse.x <= freeSpaceW) {
        // doff = mouse.x - t.offsets.left;
        t.offsets.left = mouse.x;
      }

      if (resizeOffset === "right" && mouse.x >= cvsW - freeSpaceW && mouse.x <= cvsW) {
        // doff = cvsW - mouse.x - t.offsets.right;
        t.offsets.right = cvsW - mouse.x;
      }
      
      if (resizeOffset === "top" && mouse.y >= 0 && mouse.y <= freeSpaceH) {
        // doff = mouse.y - t.offsets.top;
        t.offsets.top = mouse.y;
      }

      if (resizeOffset === "bottom" && mouse.y >= cvsH - freeSpaceH && mouse.y <= cvsH) {
        // doff = cvsH - mouse.y - t.offsets.bottom;
        t.offsets.bottom = cvsH - mouse.y;
      }

      $scope.changeCanvas(t);
    }

    if (dragging === true) {
      const t = $scope.curTemplate;
      const el = t.elems[dragElem.type][dragElem.id];

      mouse.x = event.pageX - canvas.offsetLeft;
      mouse.y = event.pageY - canvas.offsetTop;
      
      const lines = getLines(el.value, cvsW - (t.offsets.left + t.offsets.right + el.x));
      const width = getWidthLongString(context, lines);
      
      const startElemX = mouse.x - dragElem.shift.x;
      const startElemY = mouse.y - dragElem.shift.y;

      if (!el.align && startElemX >= t.offsets.left && startElemX + width < cvsW - t.offsets.right + shift) {
        el.x = mouse.x - t.offsets.left - dragElem.shift.x;
      }

      if (startElemY >= t.offsets.top && startElemY + el.font < cvsH - t.offsets.top) {
        el.y = mouse.y - t.offsets.top - dragElem.shift.y;
      }

      $scope.changeCanvas(t);
    }
  };

  const mouseUp = (event) => {
    canvas.style.cursor = "default";
    resizing = false;
    resizeOffset = null;
    
    dragging = false;
    if (!$scope.selected) {
      dragElem = null;
    }

    $scope.changeCanvas($scope.curTemplate);
  };

  canvas.onmousedown = mouseDown;
  canvas.onmouseup = mouseUp;
  canvas.onmousemove = mouseMove;


  const drawOffsets = (offsets) => {
    context.beginPath();
    context.fillStyle = "lightgray";
    context.setLineDash([10, 10]);
  
    // top
    context.moveTo(0, offsets.top);
    context.lineTo(cvsW, offsets.top);
    // bottom
    context.moveTo(0, cvsH - offsets.bottom);
    context.lineTo(cvsW, cvsH - offsets.bottom);
    // left
    context.moveTo(offsets.left, 0);
    context.lineTo(offsets.left, cvsH);
    // right
    context.moveTo(cvsW - offsets.right, 0);
    context.lineTo(cvsW - offsets.right, cvsH);
  
    context.stroke();
  };

  const drawSelection = (el, offsets) => {
    let x = offsets.left + el.x;
    let y = offsets.top + el.y;

    context.fillStyle = "rgba(100, 150, 185, 0.05)";
    context.font = `${el.font}px Times New Roman`;
    context.setLineDash([5, 5]);

    const lines = getLines(el.value, cvsW - (offsets.left + offsets.right + el.x));

    const text = {
      w: getWidthLongString(context, lines),
      h: el.font * lines.length
    };

    context.fillRect(x, y, text.w, text.h);
    context.strokeRect(x, y, text.w, text.h);
  };

  const drawMenu = (el) => {
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
  };

  const drawElements = (elems, offsets, item) => {
    const elemsType = ["labels", "text"];
    const shift = 5;
    let x;
    let y;

    for (let i = 0; i < elemsType.length; i++) {
      for (let j = 0; elems[elemsType[i]] && j < elems[elemsType[i]].length; j++) {
        const el = elems[elemsType[i]][j];
        // const textW = context.measureText(el.value).width;

        context.font = `${el.font}px Times New Roman`;
        context.fillStyle = "black";

        if (elemsType[i] === "text") {
          if ($scope.data) {
            el.value = $scope.data[item][el.name];
          } else {
            context.fillStyle = "red";
            el.value = el.name;
          }
        }

        let lines = getLines(el.value, cvsW - (offsets.left + offsets.right + el.x));
        const width = getWidthLongString(context, lines);

        if (offsets.left + el.x + width > cvsW - offsets.right) {
          el.x -= offsets.left + el.x + width - (cvsW - offsets.right);
        }
        
        
        // if (resizing && offsets.top < el.y) {
        //   el.y += doff;
        // }

        if (offsets.top + el.y + el.font > cvsH - offsets.bottom) {
          el.y -= offsets.top + el.y + el.font - (cvsH - offsets.bottom);
        }
        
        if(el.align && el.align === "center") {
          el.x = parseInt(cvsW - width - offsets.left - offsets.right) / 2;
        }

        for (let k = 0; k < lines.length; k++) {
          const element = lines[k];
          
          // if(el.align && el.align === "center") {
          //   const textW = context.measureText(lines[k]).width;
          //   el.x = parseInt(cvsW - textW - offsets.left - offsets.right) / 2;
          // }

          context.fillText(element, offsets.left + el.x, offsets.top + el.y + el.font - shift + k * el.font);
        };

        if (dragging || $scope.selected) {
          drawSelection(elems[dragElem.type][dragElem.id], offsets);
          // drawMenu(elems[dragElem.type][dragElem.id]);
        }
      };
    };
  };


  const createPDF = async () => {
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


  $scope.chooseTemplate = (template) => {
    if($scope.curTemplate !== template) {
      $scope.data = null;
      $scope.curTemplate = template;

      if (template.background.path) {
        loadImageAsync(imagePath + template.background.path)
          .then(img => {
            template.background.img = img;
            $scope.changeCanvas(template);
          });
      } else {
        $scope.changeCanvas(template);
      }
    }
  };

  $scope.changeCanvas = (template, editMode=true) => {
    context.clearRect(0, 0, cvsW, cvsH);

    if (template.background.img) {
      context.drawImage(template.background.img, 0, 0, cvsW, cvsH);
    }

    drawElements(template.elems, template.offsets, $scope.datasetItem);

    if (editMode) {
      drawOffsets(template.offsets);
    }
  };

  $scope.loadBackground = (template) => {
    const handleImage = (e) => {
      let reader = new FileReader();
      
      reader.onload = (event) => {
        let img = new Image();

        img.onload = () => {
          template.background.img = img;
          $scope.changeCanvas(template);
        };

        img.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }

    const imageLoader = document.getElementById('imageFile');
    imageLoader.addEventListener('change', handleImage, false);
  };

  $scope.loadData = () => {
    fetch($scope.address)
      .then(res => res.json())
      .then(data => {
        $scope.$apply(() => {
          $scope.data = data;
        });
        $scope.changeCanvas($scope.curTemplate);
      });
  };

  $scope.changeDataset = (step) => {
    if (!$scope.data) {
      return;
    }
    
    if ($scope.datasetItem + step >= 0 && $scope.datasetItem + step < $scope.data.length) {
      $scope.datasetItem += step;
      $scope.changeCanvas($scope.curTemplate);
    }
  };

  $scope.createDocs = async (template) => {
    if (!$scope.data) {
      return;
    }
    
    let zip = new JSZip();

    for (let item = 0; item < $scope.data.length; item++) {
      $scope.datasetItem = item;
      $scope.changeCanvas(template, false);

      await createPDF()
        .then((docPDF) => {
          try {
            zip.file(template.name + " " + (item + 1) + '.pdf', docPDF.output('blob'));
          } catch {
            console.error('Something went wrong!');
          }
        });

      // let docPDF = createPDF2();
      // try {
      //   zip.file($scope.data[item].student + '.pdf', docPDF.output('blob'));
      // } catch {
      //   console.error('Something went wrong!');
      // }
    };

    zip.generateAsync({
      type: 'blob'
    }).then(content => {
      saveAs(content, 'docs.zip');
      $scope.changeCanvas(template);
    });
  };

  $scope.changeAlign = (align) => {
    $scope.curTemplate.selectedElem.align = align;
    $scope.changeCanvas($scope.curTemplate);
  }
});
