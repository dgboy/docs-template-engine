const myApp = angular.module('myApp', []);

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

const imagePath = "images/";



myApp.controller('appController', ($scope) => {
  $scope.templates = [
    {
      "name": "Грамота",
      "background": "charter.jpg",
      "elems": [
        {
          "type": "label",
          "value": "Грамотой награждается",
          "x": 10,
          "y": 10
        },
        {
          "type": "text",
          "value": "<участник>",
          "x": 150,
          "y": 1000
        }
      ]
    },
    {
      "name": "Титульный лист",
      "background": null,
      "width": 793,
      "height": 1122,
      "elems": [
        {
          "type": "label",
          "value": "Министерство образования Нижегородской области",
          "x": 200,
          "y": 50,
          "font": 14
        },
        {
          "type": "label",
          "value": "Государственное бюджетное профессиональное образовательное учреждение «Нижегородский радиотехнический колледж»",
          "x": 50,
          "y": 80,
          "font": 14
        },
        {
          "type": "label",
          "value": "ОП.05 Основы программирования",
          "x": 200,
          "y": 250,
          "font": 14
        },
        {
          "type": "label",
          "value": "Титульный лист",
          "x": 250,
          "y": 300,
          "font": 20
        },
        {
          "type": "text",
          "value": "<студент>",
          "x": 250,
          "y": 350,
          "font": 14
        }
      ]
    }
  ];

  $scope.chooseTemplate = (templateName) => {
    $scope.active = templateName;

    $scope.templates.forEach(template => {
      if (template.name === $scope.active) {
        $scope.changeCanvas(template);
      }
    });
  };

  $scope.changeCanvas = (template) => {
    canvas.width = template.width;
    canvas.height = template.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const elems = template.elems;

    console.log("Need: " + convertMmToPx(210) + "x" + convertMmToPx(297));
    console.log("Have: " + ConvertPxToMM(canvas.width) + "x" + ConvertPxToMM(canvas.height));

    changeBackground(template.background);

    for (let i = 0; i < elems.length; i++) {
      const element = elems[i];
      context.font = `${element.font}px Times New Roman`;

      context.fillText(element.value, element.x, element.y);
      // if(element.type === 'label') {
      // } else if(element.type === 'text') {
      //   context.fillText(element.value, element.x, element.y);
      // }
    }
  };

  let changeBackground = (background) => {
    if (background) {
      let img = new Image();
      img.src = imagePath + background;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
      }
    }
  };

  $scope.createPDF = () => {
    const quality = 1; // качество от 0 до 1, заодно и сжать можно
    let image = {
      data: canvas.toDataURL('image/png', quality),
      height: canvas.height,
      width: canvas.width
    };

    let w = ConvertPxToMM(image.width);
    let h = ConvertPxToMM(image.height);
    let orientation = w > h ? 'l' : 'p';

    //Создаем документ PDF размером с нашу картинку
    var docPDF = new jsPDF(orientation, 'mm', [w, h]);
    //рисуем картинку на всю страницу
    docPDF.addImage(image.data, 'JPEG', 0, 0);

    //Сохраням полученный файл
    //Возможные значения : dataurl, datauristring, bloburl, blob, arraybuffer, ('save', filename)
    docPDF.output('save', 'test.pdf');
  };

  function ConvertPxToMM(pixels) {
    return Math.floor(pixels * 0.264583);
  }

  let convertMmToPx = mm => Math.floor(mm / 0.264583);
});


var mouse = {
  x: 0,
  y: 0
};

var draw = false;


canvas.addEventListener("mousedown", (e) => {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
  console.log("X: " + e.pageX + " + " + canvas.offsetLeft + " = ");
  console.log("Y: " + e.pageY + " + " + canvas.offsetTop + " = ");
  draw = true;
  context.beginPath();
  context.moveTo(mouse.x, mouse.y);
});

canvas.addEventListener("mousemove", (e) => {
  if (draw == true) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
  }
});

canvas.addEventListener("mouseup", (e) => {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
  context.lineTo(mouse.x, mouse.y);
  context.stroke();
  context.closePath();
  draw = false;
});


// const handleImage = (e) => {
//   var reader = new FileReader();
//   reader.onload = function(event){
//     var img = new Image();
//     img.onload = function(){
//       canvas.width = img.width;
//       canvas.height = img.height;
//       context.drawImage(img,0,0);
//     }
//     img.src = event.target.result;
//   }

//   reader.readAsDataURL(e.target.files[0]);
// }

// const imageLoader = document.getElementById('imageFile');

// imageLoader.addEventListener('change', handleImage, false);
