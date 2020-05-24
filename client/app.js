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
      name: null,
      label: "х",
      icon: ">",
      active: "false"
    },
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

  $scope.font = {
    family: null,
    size: null,
    color: null
  };

  const cvsW = canvas.width;
  const cvsH = canvas.height;

  const imagePath = "images/";

  const mouse = {
    x: 0,
    y: 0
  };

  const elemsTypes = ["labels", "text"];


  // отображает пунктиром отступы, если editMode == true
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
    context.fillStyle = "rgba(100, 150, 185, 0.05)";
    context.font = `${el.font}px ${el.family}`;
    context.setLineDash([5, 5]);

    let x = offsets.left + el.x;
    let y = offsets.top + el.y;

    const lines = getLines(el.value, cvsW - (offsets.left + offsets.right));

    const text = {
      w: getWidthLongString(context, lines),
      h: el.font * lines.length
    };

    // console.log("SELECTED");
    console.log(el.w);
    console.log(el.h);
    context.fillRect(x, y, text.w, text.h);
    context.strokeRect(x, y, text.w, text.h);
  };

  const drawElements = (elems, offsets, item) => {
    const elemsType = ["labels", "text"];
    const shift = 5;

    for (let i = 0; i < elemsType.length; i++) {
      for (let j = 0; elems[elemsType[i]] && j < elems[elemsType[i]].length; j++) {
        const el = elems[elemsType[i]][j];

        context.font = `${el.font}px ${el.family}`;
        
        if ($scope.selected) {
          context.fillStyle = (el == elems[dragElem.type][dragElem.id]) ? `black` : "gray";
        } else {
          context.fillStyle = el.color ? `${el.color}` : "black";
        }

        if (elemsType[i] === "text") {
          if ($scope.data) {
            el.value = $scope.data[item][el.name];
          } else {
            context.fillStyle = "red";
            el.value = el.name;
          }
        }

        let lines = getLines(el.value, cvsW - (offsets.left + offsets.right));

        el.w = getWidthLongString(context, lines);
        el.h = el.font * lines.length;

        if (offsets.left + el.x + el.w > cvsW - offsets.right) {
          el.x -= offsets.left + el.x + el.w - (cvsW - offsets.right);
        }

        if (offsets.top + el.y + el.h > cvsH - offsets.bottom) {
          el.y -= offsets.top + el.y + el.h - (cvsH - offsets.bottom);
        }

        for (let k = 0; k < lines.length; k++) {
          const line = lines[k];
          const lineW = context.measureText(lines[k]).width;

          // el.defaultX = el.x;
          switch (el.align) {
            case "left":
              el.x = 0;
              break;
            case "center":
              el.x = parseInt(cvsW - offsets.right - offsets.left - lineW) / 2;
              break;
            case "right":
              el.x = cvsW - offsets.right - lineW - offsets.left - 1;
              break;
            default:
              // el.x = el.defaultX;
              break;
          };
          
          context.fillText(line, offsets.left + el.x, offsets.top + el.y + el.font - shift + k * el.font);
        };

        // if (dragging || $scope.selected) {
        //   if (dragElem.type === elemsType[i] && dragElem.id === j) {
        //     // console.log("Element");
        //     // console.log(el);
        //     drawSelection(el, offsets);
        //   }
        // }


        if (dragging || $scope.selected) {
          if (dragElem.type === elemsType[i] && dragElem.id === j) {
            drawSelection(elems[dragElem.type][dragElem.id], offsets);
          }
        }
        
      };
    };
  };


  let resizing = false;
  let resizeOffset = null;

  let dragging = false;
  let dragElem = null;


  const mouseDown = (event) => {
    const t = $scope.curTemplate;

    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;

    resizeOffset = getNameResizingOffset(mouse, t.offsets, cvsW, cvsH);

    if (resizeOffset && !$scope.selected) {
      canvas.style.cursor = (resizeOffset === "left" || resizeOffset === "right") ? 'col-resize' : 'row-resize';
      resizing = true;
      $scope.changeCanvas(t);
    }
    

    const selectedElem = getSelectedElement(mouse, t, elemsTypes);

    if (selectedElem) {
      if (!$scope.selected) {
        canvas.style.cursor = 'move';
        dragging = true;
        dragElem = selectedElem;

        $scope.$apply(() => {
          $scope.selected = true;
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
      } else {
        if (t.elems[selectedElem.type][selectedElem.id] == t.elems[dragElem.type][dragElem.id]) {
          $scope.$apply(() => {
            $scope.selected = false;
          });
        }
      }
    } 
  };

  const mouseMove = (event) => {
    const shift = 4;
    const t = $scope.curTemplate;

    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;


    if(!resizing && !$scope.selected) {
      const offsetDetected = getNameResizingOffset(mouse, t.offsets, cvsW, cvsH);
      const selectedElem = getSelectedElement(mouse, t, elemsTypes);

      if(offsetDetected) {
        canvas.style.cursor = (offsetDetected == "left" || offsetDetected == "right") ? 'col-resize' : 'row-resize';
      } else if(selectedElem) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = 'default';
      }
    }


    if (resizing) {

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

    if (dragging) {
      // const t = $scope.curTemplate;
      const el = t.elems[dragElem.type][dragElem.id];

      // mouse.x = event.pageX - canvas.offsetLeft;
      // mouse.y = event.pageY - canvas.offsetTop;

      const lines = getLines(el.value, cvsW - (t.offsets.left + t.offsets.right));
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


  $scope.chooseTemplate = (template) => {
    if ($scope.curTemplate !== template) {
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

  $scope.changeCanvas = (template, editMode = true) => {
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

      await createPDF(canvas)
        .then((docPDF) => {
          try {
            zip.file(template.name + " " + (item + 1) + '.pdf', docPDF.output('blob'));
          } catch {
            console.error('Something went wrong!');
          }
        });
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
  };

  // $scope.changeFontFiled = (fieldName, fieldValue) => {
  //   // if (family) {family, size, 
  //   //   $scope.curTemplate.selectedElem.font.family = family;
  //   // }
  //   // if (size) {
  //   //   $scope.curTemplate.selectedElem.font.size = size;
  //   // }
  //   // if (color) {
  //   // }

  //   $scope.curTemplate.selectedElem.font[fieldName] = fieldValue;
  //   $scope.changeCanvas($scope.curTemplate);
  // };

  // e.changeFontSize = (size) => {
  //   $scope.curTemplate.selectedElem.font = size;
  //   $scope.changeCanvas($scope.curTemplate);
  // };

  // $scope.changeFontFamily = (family) => {
  //   $scope.curTemplate.selectedElem.family = family;
  //   $scope.changeCanvas($scope.curTemplate);
  // };

  // $scope.changeFontFamily = (family) => {
  //   $scope.curTemplate.selectedElem.family = family;
  //   $scope.changeCanvas($scope.curTemplate);
  // };
});
