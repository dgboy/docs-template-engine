const myApp = angular.module('myApp', []);

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

const imagePath = "images/";


myApp.controller('appController', ($rootScope, $scope) => {
  // $scope.dataAddress = "";
  $scope.templates = [
    {
      "name": "Грамота",
      "background": "charter.jpg",
      "width": 793,
      "height": 1122,
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
          "type": "label",
          "value": "Выполнил:",
          "x": 250,
          "y": 350,
          "font": 14
        },
        {
          "type": "text",
          "value": "<student>",
          "x": 250,
          "y": 350,
          "font": 14
        }
      ]
    },
    {
      "name": "Титульный лист диплома",
      "background": "diplom-title.jpg",
      "width": 793,
      "height": 1122,
      "elems": [
        {
          "name": "student",
          "type": "text",
          "value": "",
          "x": 140,
          "y": 855,
          "font": 20
        },
        {
          "name": "group",
          "type": "text",
          "value": "",
          "x": 160,
          "y": 833,
          "font": 20
        },
        {
          "name": "teacher",
          "type": "text",
          "value": "",
          "x": 480,
          "y": 835,
          "font": 20
        }
      ]
    }
  ];
  $scope.datasetItem = 0;

  let сonvertPxToMM = px => Math.floor(px * 0.264583);
  let convertMmToPx = mm => Math.floor(mm / 0.264583);

  let printText = (elems) => {
    for (let i = 0; i < elems.length; i++) {
      const element = elems[i];
      context.font = `${element.font}px Times New Roman`;

      if (element.type === "text") {
        if ($scope.data) {
          element.value = $scope.data[$scope.datasetItem][element.name];
        }
        context.fillText(element.value, element.x, element.y);
      }

      // if (element.type === 'text') {
      //   // if (!value) {
          
      //   // }
      //   context.fillText(element.value, element.x, element.y);
      // } else if(element.type === 'label') {
      // }
    }
  }


  $scope.chooseTemplate = (template) => {
    $scope.activeT = template;

    $scope.templates.forEach(template => {
      if (template.name === $scope.activeT.name) {
        $scope.changeCanvas(template);
      }
    });
  };

  $scope.changeCanvas = (template) => {
    canvas.width = template.width;
    canvas.height = template.height;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // console.log("Need: " + convertMmToPx(210) + "x" + convertMmToPx(297));
    // console.log("Have: " + сonvertPxToMM(canvas.width) + "x" + сonvertPxToMM(canvas.height));

    if (template.background) {
      let img = new Image();
      img.src = imagePath + template.background;

      img.onload = () => {
        context.drawImage(img, 0, 0, template.width, template.height);
        printText(template.elems);
      }
    } else {
      printText(template.elems);
    }
  };

  $scope.createPDF = (template) => {
    printText(template.elems);

    const quality = 1; // качество от 0 до 1, заодно и сжать можно
    let image = {
      data: canvas.toDataURL('image/png', quality),
      height: canvas.height,
      width: canvas.width
    };

    let w = сonvertPxToMM(image.width);
    let h = сonvertPxToMM(image.height);
    let orientation = w > h ? 'l' : 'p';

    //Создаем документ PDF размером с нашу картинку
    var docPDF = new jsPDF(orientation, 'mm', [w, h]);
    //рисуем картинку на всю страницу
    docPDF.addImage(image.data, 'JPEG', 0, 0);

    //Сохраням полученный файл
    //Возможные значения : dataurl, datauristring, bloburl, blob, arraybuffer, ('save', filename)
    docPDF.output('save', 'test.pdf');
  };

  $scope.loadData = () => {
    fetch($scope.address)
      .then(res => res.json())
      .then(data => $scope.data = data)
      .then($scope.changeCanvas($scope.activeT));
  };

  $scope.changeDataset = (step) => {
    console.log($scope.data.length + " :L = C: " + $scope.datasetItem);

    if($scope.datasetItem + step >= 0 && $scope.datasetItem + step < $scope.data.length) {
      $scope.datasetItem += step;
      $scope.changeCanvas($scope.activeT);
    }
  };
});
