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

  $scope.vm = {
    data: {
      valid: true,
      message: ""
    },
    template: {
      valid: true,
      message: ""
    }
  }

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
  const drawOffsets = (offsets, w, h) => {
    context.beginPath();
    context.fillStyle = "lightgray";
    context.setLineDash([10, 10]);

    // top
    context.moveTo(0, offsets.top);
    context.lineTo(w, offsets.top);
    // bottom
    context.moveTo(0, h - offsets.bottom);
    context.lineTo(w, h - offsets.bottom);
    // left
    context.moveTo(offsets.left, 0);
    context.lineTo(offsets.left, h);
    // right
    context.moveTo(w - offsets.right, 0);
    context.lineTo(w - offsets.right, h);

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
    };

    const x = offsets.left + el.x;
    const y = offsets.top + el.y;


    context.fillRect(x, y, dataFields.w, dataFields.h);
    context.strokeRect(x, y, dataFields.w, dataFields.h);
  };

  const drawElements = (elems, offsets, w, h) => {
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

        if (offsets.top + el.y + el.h > h - offsets.bottom) {
          el.y -= offsets.top + el.y + el.h - (h - offsets.bottom);
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

    resizeOffset = getNameResizingOffset(mouse, t.offsets, t.width, t.height);
    if (resizeOffset && !$scope.selected) {
      canvas.style.cursor = (resizeOffset === "left" || resizeOffset === "right") ? 'col-resize' : 'row-resize';
      resizing = true;
      $scope.changeCanvas(t);
    }

    const selectedElem = getSelectedElement(mouse, t, elemsTypes, context);
    if (selectedElem) {
      if (!$scope.selected) {
        canvas.style.cursor = 'move';
        dragging = true;
        dragElem = selectedElem;

        $scope.$apply(() => {
          $scope.selected = -$scope.selected;
          t.selectedElem = t.elems[dragElem.type][dragElem.id];
        });
        $scope.changeCanvas(t);
      }
    }
  };

  const mouseMove = (event) => {
    // Небольшой сдвиг для определения элементов по ширине
    const shift = 4;
    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;

    if ($scope.cur.template && !resizing && !$scope.selected) {
      const t = JSON.parse($scope.cur.template);

      const offsetDetected = getNameResizingOffset(mouse, t.offsets, t.width, t.height);
      const selectedElem = getSelectedElement(mouse, t, elemsTypes, context);

      if (offsetDetected) {
        canvas.style.cursor = (offsetDetected == "left" || offsetDetected == "right") ? 'col-resize' : 'row-resize';
      } else if (selectedElem) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = 'default';
      }
    }

    if (resizing) {
      const t = JSON.parse($scope.cur.template);

      const freeSpaceW = t.width / 6;
      const freeSpaceH = t.height / 8;

      if (resizeOffset === "left" && mouse.x >= 0 && mouse.x <= freeSpaceW) {
        t.offsets.left = mouse.x;
      }

      if (resizeOffset === "right" && mouse.x >= t.width - freeSpaceW && mouse.x <= t.width) {
        t.offsets.right = t.width - mouse.x;
      }

      if (resizeOffset === "top" && mouse.y >= 0 && mouse.y <= freeSpaceH) {
        t.offsets.top = mouse.y;
      }

      if (resizeOffset === "bottom" && mouse.y >= t.height - freeSpaceH && mouse.y <= t.height) {
        t.offsets.bottom = t.height - mouse.y;
      }

      $scope.changeCanvas(t);
    }

    if (dragging) {
      const t = JSON.parse($scope.cur.template);
      const el = t.elems[dragElem.type][dragElem.id];

      const lines = getLines(el.value, t.width - (t.offsets.left + t.offsets.right), context);
      const lineW = getWidthLongString(context, lines);
      const startElemX = mouse.x - dragElem.shift.x;
      const startElemY = mouse.y - dragElem.shift.y;

      if (!el.align && startElemX >= t.offsets.left && startElemX + lineW < t.width - t.offsets.right + shift) {
        el.x = mouse.x - t.offsets.left - dragElem.shift.x;
      }
      if (startElemY >= t.offsets.top && startElemY + el.font < t.height - t.offsets.top) {
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
    let data;
    try {
      data = JSON.parse(jsonData);
    } catch (e) {
      console.log('Ошибка с JSON-данными:\n' + e);
      $scope.vm.data.valid = false;
      $scope.vm.data.message = 'Невалидные JSON-данные наборов данных.';
    }

    if (data) {
      $scope.vm.data.valid = true;
      $scope.vm.data.message = null;
      $scope.cur.data = jsonData;
      
      const t = JSON.parse($scope.cur.template);
      t.elems.dataFields = fillTemplateDataFields(t.elems.dataFields, data[$scope.cur.dataset]);
      $scope.changeCanvas(t);
    }
  };

  $scope.updateTemplate = (jsonTemplate) => {
    let template;
    
    try {
      template = JSON.parse(jsonTemplate);
    } catch (e) {
      console.log('Ошибка с JSON-данными:\n' + e);
      $scope.vm.template.valid = false;
      $scope.vm.template.message = 'Невалидные JSON-данные шаблона.';
    }

    if (template) {
      $scope.vm.template.valid = true;
      $scope.vm.template.message = null;
      $scope.cur.template = jsonTemplate;

      $scope.changeCanvas(template);
    }
  };


  $scope.chooseTemplate = (template) => {
    $scope.cur.templateName = template.name;
    const temp = JSON.parse($scope.cur.template);
    $scope.cur.img = null;
    // temp.background = null;

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
          console.log(img);
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
    canvas.width = template.width;
    canvas.height = template.height;
    
    const data = JSON.parse($scope.cur.data);
    template.elems.dataFields = fillTemplateDataFields(template.elems.dataFields, data[$scope.cur.dataset]);

    context.clearRect(0, 0, template.width, template.height);
    if (template.background && $scope.cur.img) {
      context.drawImage($scope.cur.img, 0, 0, template.width, template.height);
    }

    drawElements(template.elems, template.offsets, template.width, template.height);

    if (editMode) {
      drawOffsets(template.offsets, template.width, template.height);
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
      t.elems.dataFields = fillTemplateDataFields(t.elems.dataFields, data[$scope.cur.dataset]);
      $scope.changeCanvas(t);
    }
  };


  $scope.loadBackground = (template) => {
    const handleImage = (e) => {
      let reader = new FileReader();
      reader.onload = (event) => {
        let img = new Image();
        img.onload = () => {
          canvas.width = template.width = img.width;
          canvas.height = template.height = img.height;
          $scope.cur.img = img;
          $scope.changeCanvas(template);
        };
        img.src = event.target.result;
      };
      // template.background = e.target.files[0].name;
      reader.readAsDataURL(e.target.files[0]);
    }

    const imageLoader = document.getElementById('imageFile');
    imageLoader.addEventListener('change', handleImage, false);
  };

  $scope.createDocs = async () => {
    const data = JSON.parse($scope.cur.data);
    const template = JSON.parse($scope.cur.template);
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
