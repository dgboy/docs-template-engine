const myApp = angular.module('myApp', []);

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

const imagePath = "images/";
let temp = null;

var mouse = {
  x: 0,
  y: 0
};

// var editMode = true;
var dragging = false;
var draggingElem = null;
const elemsType = ["labels", "text"];


myApp.controller('appController', ($scope) => {
  $scope.datasetItem = 0;
  $scope.templates = templates;
  $scope.curTemplate = null;
  $scope.data = null;


  const myDown = (event) => {
    mouse.x = event.pageX - canvas.offsetLeft;
    mouse.y = event.pageY - canvas.offsetTop;

    for (let i = 0; i < elemsType.length; i++) {
      for (let j = 0; j < temp.elems[elemsType[i]].length; j++) {
        const el = temp.elems[elemsType[i]][j];

        let x = temp.offsets.left + el.x;
        let y = temp.offsets.top + el.y;

        const text = {
          w: context.measureText(el.value).width,
          h: el.font
        };

        if (mouse.x >= x && mouse.x <= x + text.w && mouse.y >= y && mouse.y <= y + text.h) {
          dragging = true;
          draggingElem = {
            type: elemsType[i],
            id: j,
            shift: {
              x: mouse.x - x,
              y: mouse.y - y
            }
          };
          $scope.changeCanvas(temp);
        }
      }
    }
  };

  const myMove = (event) => {
    if (dragging === true) {
      mouse.x = event.pageX - canvas.offsetLeft;
      mouse.y = event.pageY - canvas.offsetTop;

      temp.elems[draggingElem.type][draggingElem.id].x = mouse.x - temp.offsets.left - draggingElem.shift.x;
      temp.elems[draggingElem.type][draggingElem.id].y = mouse.y - temp.offsets.top - draggingElem.shift.y;
  
      $scope.changeCanvas(temp);
    }
  };

  const myUp = (event) => {
    dragging = false;
    draggingElem = null;
    $scope.changeCanvas(temp);
  };

  canvas.onmousedown = myDown;
  canvas.onmouseup = myUp;
  canvas.onmousemove = myMove;


  const drawOffsets = (offsets) => {
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

  const drawSelection = (el, offsets) => {
    let x = offsets.left + el.x;
    let y = offsets.top + el.y;

    context.fillStyle = "rgba(100, 150, 185, 0.1)";
    context.font = `${el.font}px Times New Roman`;
    context.setLineDash([5, 5]);

    const text = {
      w: context.measureText(el.value).width,
      h: el.font
    };

    context.fillRect(x, y, text.w, text.h);
    context.strokeRect(x, y, text.w, text.h);
  };

  const drawElements = (elems, offsets, item) => {
    const elemsType = ["labels", "text"];
    const shift = 5;
    let el;


    for (let i = 0; i < elemsType.length; i++) {
      for (let j = 0; elems[elemsType[i]] && j < elems[elemsType[i]].length; j++) {
        const el = elems[elemsType[i]][j];

        if (dragging) {
          drawSelection(elems[draggingElem.type][draggingElem.id], offsets);
        }

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

        context.fillText(el.value, offsets.left + el.x, offsets.top + el.y + el.font - shift);
      }
    }
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
      temp = template;

      if (template.background) {
        loadImageAsync(imagePath + template.background)
          .then(img => {
            template.background = img;
            $scope.changeCanvas(template);
          });
      } else {
        $scope.changeCanvas(template);
      }
    }

    // $scope.templates.forEach(template => {
    //   if (template.name === $scope.curTemplate.name) {
    //   }
    // });
  };

  $scope.changeCanvas = (template, editMode=true) => {
    context.clearRect(0, 0, w, h);

    if (template.background) {
      context.drawImage(template.background, 0, 0, w, h);
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
          template.background = img;
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
    // console.log($scope.address);
    fetch($scope.address)
      .then(res => res.json())
      .then(data => {
        $scope.data = data;
        $scope.changeCanvas($scope.curTemplate);
      });
  };

  $scope.changeDataset = (step) => {
    // console.log($scope.data.length + " :L = C: " + $scope.datasetItem);
    if ($scope.datasetItem + step >= 0 && $scope.datasetItem + step < $scope.data.length) {
      $scope.datasetItem += step;
      $scope.changeCanvas($scope.curTemplate);
      // $scope.apply();
    }
  };

  $scope.createDocs = async (template) => {
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
    });
  };
});
