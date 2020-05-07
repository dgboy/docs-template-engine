const myApp = angular.module('myApp', []);

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

const imagePath = "images/";


myApp.controller('appController', ($scope) => {
  // $scope.dataAddress = "";
  $scope.datasetItem = 0;
  $scope.templates = [
    {
      "name": "Титульный лист диплома",
      "background": "diplom-title.jpg",
      // "background": null,
      "width": 793,
      "height": 1122,
      "elems": [{
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
    },
    {
      "name": "Грамота",
      "background": "charter.jpg",
      "width": 793,
      "height": 1122,
      "elems": [{
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
      "elems": [{
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
    }
  ];
  $scope.curTemplate = null;
  $scope.data = null;

  let сonvertPxToMM = px => Math.floor(px * 0.264583);
  // let convertMmToPx = mm => Math.floor(mm / 0.264583);
  let printElements = (elems, item) => {
    for (let i = 0; i < elems.length; i++) {
      const element = elems[i];
      context.font = `${element.font}px Times New Roman`;
      context.fillStyle = "black";

      if (element.type === "text") {
        if ($scope.data) {
          element.value = $scope.data[item][element.name];
        } else {
          context.fillStyle = "red";
          element.value = element.name;
        }

        context.fillText(element.value, element.x, element.y);
      }
    }
  };
  let printBackgroundAsync = async (src) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };


  $scope.chooseTemplate = (template) => {
    // $scope.data = null;
    $scope.curTemplate = template;
    $scope.changeCanvas(template);

    // $scope.templates.forEach(template => {
    //   if (template.name === $scope.curTemplate.name) {
    //   }
    // });
  };

  $scope.changeCanvas = (template) => {
    canvas.width = template.width;
    canvas.height = template.height;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (template.tempBG) {
      context.drawImage(template.tempBG, 0, 0, template.tempBG.width, template.tempBG.height);
      printElements(template.elems, $scope.datasetItem);
    } else if(template.background) {
      printBackgroundAsync(imagePath + template.background)
        .then(img => {
          context.drawImage(img, 0, 0, template.width, template.height);
          printElements(template.elems, $scope.datasetItem);
        });
    } else {
      printElements(template.elems, $scope.datasetItem);
    }
  };

  $scope.loadData = () => {
    fetch($scope.address)
      .then(res => res.json())
      .then(data => $scope.data = data)
      .then(() => {
        $scope.changeCanvas($scope.curTemplate);
      });
  };

  $scope.changeDataset = (step) => {
    console.log($scope.data.length + " :L = C: " + $scope.datasetItem);
    if ($scope.datasetItem + step >= 0 && $scope.datasetItem + step < $scope.data.length) {
      $scope.datasetItem += step;
      $scope.changeCanvas($scope.curTemplate);
      // $scope.apply();
    }
  };

  let createPDF = async () => {
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

  $scope.createDocs = async () => {
    let zip = new JSZip();

    for (let item = 0; item < $scope.data.length; item++) {
      $scope.datasetItem = item;
      $scope.changeCanvas($scope.curTemplate);

      await createPDF()
        .then((docPDF) => {
          try {
            zip.file($scope.data[item].student + '.pdf', docPDF.output('blob'));
          } catch {
            console.error('Something went wrong!');
          }
        });
    };

    zip.generateAsync({
      type: 'blob'
    }).then(content => {
      saveAs(content, 'docs.zip');
    });
  };

  $scope.loadBackground = (files) => {
    const handleImage = (e) => {
      var reader = new FileReader();
      reader.onload = function(event){
        var img = new Image();
  
        img.onload = () => {
          $scope.curTemplate.tempBG = img;
          $scope.changeCanvas($scope.curTemplate);
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }

    const imageLoader = document.getElementById('imageFile');
    imageLoader.addEventListener('change', handleImage, false);
  };
});
