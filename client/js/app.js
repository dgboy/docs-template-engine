const docsTemplateEngine = angular.module('docsTemplateEngine', []);

docsTemplateEngine.controller('appController', ($scope, templateService) => {
  // Присваивание наборов шаблонов из соответствующего сервиса
  $scope.templates = templateService.templates;
  // Набор переменных, хранящих временные значения
  $scope.cur = {
    templateName: null,
    template: null,
    img: null,
    data: null,
    dataset: 0
  };
  
  // Определяет выбран ли объект или нет
  $scope.selected = false;

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Путь к фоновым изображениям для шаблонов по умолчанию
  const imagePath = "images/";

  const mouse = {
    x: 0,
    y: 0
  };

  const elemsTypes = ["labels", "dataFields"];

  let resizing = false;
  let resizeOffset = null;

  let dragging = false;
  let dragElem = null;


  // отображает пунктиром отступы, если editMode == true
  const drawOffsets = (offsets) => {
    context.beginPath();
    context.fillStyle = "lightgray";
    context.setLineDash([10, 10]);

    // top
    context.moveTo(0, offsets.top);
    context.lineTo(canvas.width, offsets.top);
    // bottom
    context.moveTo(0, canvas.height - offsets.bottom);
    context.lineTo(canvas.width, canvas.height - offsets.bottom);
    // left
    context.moveTo(offsets.left, 0);
    context.lineTo(offsets.left, canvas.height);
    // right
    context.moveTo(canvas.width - offsets.right, 0);
    context.lineTo(canvas.width - offsets.right, canvas.height);

    context.stroke();
  };

  const drawSelection = (el, offsets, w) => {
    context.fillStyle = "rgba(100, 150, 185, 0.05)";
    context.font = `${el.font}px ${el.family}`;
    context.setLineDash([5, 5]);

    const lines = getLines(el.value, w - (offsets.left + offsets.right), context);

    const dataFields = {
      w: getWidthLongString(context, lines),
      h: el.font * lines.length
    };

    switch (el.align) {
      case "left":
        el.x = 0;
        break;
      case "center":
        el.x = parseInt(w - offsets.right - offsets.left - dataFields.w) / 2;
        break;
      case "right":
        el.x = w - offsets.right - dataFields.w - offsets.left - 1;
        break;
      default:
        // el.x = el.defaultX;
        break;
    };

    const x = offsets.left + el.x;
    const y = offsets.top + el.y;


    context.fillRect(x, y, dataFields.w, dataFields.h);
    context.strokeRect(x, y, dataFields.w, dataFields.h);
  };

  const drawElements = (elems, offsets, item, w) => {
    const data = JSON.parse($scope.cur.data);
    const elemsType = ["labels", "dataFields"];
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

        if (elemsType[i] === "dataFields") {
          if (el.name === el.value) {
            context.fillStyle = "red";
          }
        }

        let lines = getLines(el.value, w - (offsets.left + offsets.right), context);

        el.w = getWidthLongString(context, lines);
        el.h = el.font * lines.length;

        if (offsets.left + el.x + el.w > w - offsets.right) {
          el.x -= offsets.left + el.x + el.w - (w - offsets.right);
        }

        if (offsets.top + el.y + el.h > canvas.height - offsets.bottom) {
          el.y -= offsets.top + el.y + el.h - (canvas.height - offsets.bottom);
        }

        for (let k = 0; k < lines.length; k++) {
          const line = lines[k];
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
          
          context.fillText(line, offsets.left + el.x, offsets.top + el.y + el.font - shift + k * el.font);
        };

        if (dragging || $scope.selected) {
          if (dragElem.type === elemsType[i] && dragElem.id === j) {
            drawSelection(elems[dragElem.type][dragElem.id], offsets, w);
          }
        }
      };
    };
  };


  const mouseDown = (event) => {
    const t = JSON.parse($scope.cur.template);
    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;

    resizeOffset = getNameResizingOffset(mouse, t.offsets, canvas.width, canvas.height);

    if (resizeOffset && !$scope.selected) {
      canvas.style.cursor = (resizeOffset === "left" || resizeOffset === "right") ? 'col-resize' : 'row-resize';
      resizing = true;
      $scope.changeCanvas(t);
    }

    const selectedElem = getSelectedElement(mouse, t, elemsTypes, context, true);
    console.log(mouse);


    if (selectedElem) {
      if (!$scope.selected) {
        canvas.style.cursor = 'move';
        dragging = true;
        dragElem = selectedElem;

        $scope.$apply(() => {
          $scope.selected = -$scope.selected;
          t.selectedElem = t.elems[dragElem.type][dragElem.id];
          console.log(t.selectedElem);
        });

        $scope.changeCanvas(t);
      }
    } 
  };

  const mouseMove = (event) => {
    const shift = 4;

    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;


    if($scope.cur.template && !resizing && !$scope.selected) {
      const t = JSON.parse($scope.cur.template);

      const offsetDetected = getNameResizingOffset(mouse, t.offsets, t.width, t.height);
      const selectedElem = getSelectedElement(mouse, t, elemsTypes, context);

      if(offsetDetected) {
        canvas.style.cursor = (offsetDetected == "left" || offsetDetected == "right") ? 'col-resize' : 'row-resize';
      } else if(selectedElem) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = 'default';
      }
    }


    if (resizing) {
      const t = JSON.parse($scope.cur.template);
      
      const freeSpaceW = canvas.width / 6;
      const freeSpaceH = canvas.height / 8;

      if (resizeOffset === "left" && mouse.x >= 0 && mouse.x <= freeSpaceW) {
        t.offsets.left = mouse.x;
      }

      if (resizeOffset === "right" && mouse.x >= canvas.width - freeSpaceW && mouse.x <= canvas.width) {
        t.offsets.right = canvas.width - mouse.x;
      }

      if (resizeOffset === "top" && mouse.y >= 0 && mouse.y <= freeSpaceH) {
        t.offsets.top = mouse.y;
      }

      if (resizeOffset === "bottom" && mouse.y >= canvas.height - freeSpaceH && mouse.y <= canvas.height) {
        t.offsets.bottom = canvas.height - mouse.y;
      }

      $scope.changeCanvas(t);
    }

    if (dragging) {
      const t = JSON.parse($scope.cur.template);
      const el = t.elems[dragElem.type][dragElem.id];

      const lines = getLines(el.value, canvas.width - (t.offsets.left + t.offsets.right), context);
      const width = getWidthLongString(context, lines);

      const startElemX = mouse.x - dragElem.shift.x;
      const startElemY = mouse.y - dragElem.shift.y;

      if (!el.align && startElemX >= t.offsets.left && startElemX + width < canvas.width - t.offsets.right + shift) {
        el.x = mouse.x - t.offsets.left - dragElem.shift.x;
      }

      if (startElemY >= t.offsets.top && startElemY + el.font < canvas.height - t.offsets.top) {
        el.y = mouse.y - t.offsets.top - dragElem.shift.y;
      }

      $scope.changeCanvas(t);
    }
  };

  const mouseUp = (event) => {
    const t = JSON.parse($scope.cur.template);
    
    canvas.style.cursor = "default";
    resizing = false;
    resizeOffset = null;

    dragging = false;
    if (!$scope.selected) {
      dragElem = null;
    }

    $scope.changeCanvas(t);
  };

  canvas.onmousedown = mouseDown;
  canvas.onmouseup = mouseUp;
  canvas.onmousemove = mouseMove;

  $scope.updateData = (jsonData) => {
    if (jsonData && JSON.parse(jsonData)) {
      $scope.cur.data = jsonData;
      console.log(jsonData);
      const template = JSON.parse($scope.cur.template);
      $scope.changeCanvas(template);
    }
  };

  $scope.updateTemplate = (jsonStr) => {
    $scope.cur.template = jsonStr;
    const template = JSON.parse($scope.cur.template);
    $scope.changeCanvas(template);
  };


  $scope.chooseTemplate = (template) => {
    $scope.cur.templateName = template.name;
    const temp = JSON.parse($scope.cur.template);
    
    if (temp && temp.name === template.name) {
      return;
    }
    
      $scope.cur.template = JSON.stringify(template, null, 4);
      const data = initData(template.elems.dataFields);
      $scope.cur.data = JSON.stringify(data, null, 4);

      template.elems.dataFields = fillTemplateDataFields(template.elems.dataFields, data[$scope.cur.dataset]);
      
      if (template.background) {
        loadImageAsync(imagePath + template.background)
          .then(img => {
            $scope.cur.img = img;
            $scope.changeCanvas(template);
          });
      } else {
        $scope.cur.img = null;
        $scope.changeCanvas(template);
      }
  };

  $scope.changeCanvas = (template, editMode = true) => {
    $scope.cur.template = JSON.stringify(template, null, 4);
    context.clearRect(0, 0, canvas.width, canvas.height);

    const data = JSON.parse($scope.cur.data);
    template.elems.dataFields = fillTemplateDataFields(template.elems.dataFields, data[$scope.cur.dataset]);

    if ($scope.cur.img) {
      context.drawImage($scope.cur.img, 0, 0, canvas.width, canvas.height);
    }

    drawElements(template.elems, template.offsets, $scope.cur.dataset, template.width);

    if (editMode) {
      drawOffsets(template.offsets);
    }
  };

  $scope.changeDataset = (step) => {
    const t = JSON.parse($scope.cur.template);
    const data = JSON.parse($scope.cur.data);
    if (!data) {
      return;
    }

    if ($scope.cur.dataset + step >= 0 && $scope.cur.dataset + step < data.length) {
      $scope.cur.dataset += step;
      $scope.changeCanvas(t);
    }
  };


  $scope.loadBackground = (template) => {
    const handleImage = (e) => {
      let reader = new FileReader();

      reader.onload = (event) => {
        let img = new Image();

        img.onload = () => {
          $scope.cur.img = img;
          $scope.changeCanvas(template);
        };

        img.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }

    const imageLoader = document.getElementById('imageFile');
    imageLoader.addEventListener('change', handleImage, false);
  };

  $scope.createDocs = async (template) => {
    const data = JSON.parse($scope.cur.data);
    if (!data) {
      return;
    }

    let zip = new JSZip();

    for (let item = 0; item < data.length; item++) {
      $scope.cur.dataset = item;
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
      type: 'blob',
      mimeType: "application/ods",
      compression: "DEFLATE"
    }).then(content => {
      try {
        saveAs(content, 'docs.zip');
      } catch (e) {
        console.log(e);
      }
      $scope.changeCanvas(template);
    });
  };
});
