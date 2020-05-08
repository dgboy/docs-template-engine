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
      "name": "Титульный лист отчёта",
      "background": null,
      "width": 793,
      "height": 1122,
      "elems": {
        "labels": [{
            "name": "org",
            "value": "Министерство образования Нижегородской области",
            "x": 200,
            "y": 50,
            "font": 20
          },
          {
            "name": "college",
            "value": "Государственное бюджетное профессиональное образовательное учреждение «Нижегородский радиотехнический колледж»",
            "x": 50,
            "y": 80,
            "font": 20
          },
          {
            "name": "discipline",
            "value": "ОП.05 Основы программирования",
            "x": 200,
            "y": 250,
            "font": 20
          },
          {
            "name": "header",
            "value": "ОТЧЁТ",
            "x": 320,
            "y": 400,
            "font": 26
          },
          {
            "name": "theme",
            "value": "по лабораторной работе № 1 Тема 'Двухмерные массивы'",
            "x": 130,
            "y": 430,
            "font": 20
          },
          {
            "name": "label",
            "value": "Выполнил:",
            "x": 50,
            "y": 810,
            "font": 20
          },
          {
            "name": "label",
            "value": "ученик группы",
            "x": 50,
            "y": 835,
            "font": 20
          },
          {
            "name": "label",
            "value": "Проверил:",
            "x": 500,
            "y": 810,
            "font": 20
          },
          {
            "name": "label",
            "value": "преподаватель",
            "x": 500,
            "y": 835,
            "font": 20
          },
          {
            "name": "city",
            "value": "г.Нижний Новгород",
            "x": 320,
            "y": 1030,
            "font": 20
          },
          {
            "name": "year",
            "value": "2020г.",
            "x": 380,
            "y": 1060,
            "font": 20
          }
        ],
        "text": [{
            "name": "student",
            "value": "",
            "x": 50,
            "y": 860,
            "font": 20
          },
          {
            "name": "group",
            "value": "",
            "x": 180,
            "y": 835,
            "font": 20
          },
          {
            "name": "teacher",
            "value": "",
            "x": 500,
            "y": 860,
            "font": 20
          }
        ]
      }
    },
    {
      "name": "Грамота",
      "background": "charter.jpg",
      "width": 793,
      "height": 1122,
      "elems": {
        "labels": [{
            "name": "header",
            "value": "НАГРАЖДАЕТСЯ",
            "x": 230,
            "y": 380,
            "font": 40
          },
          {
            "name": "city",
            "value": "За ловкость, силу и сноровку,\
              Упорный труд на тренировках,\
              За собранность, стальные нервы,\
              И за стремление быть первым,\
              За мужество и за терпенье,\
              Талант, напор и вдохновение\
              И за прекрасный результат,\
              Который лучше всех наград!\
            ",
            "x": 250,
            "y": 440,
            "font": 20
          },
          {
            "name": "date",
            "value": "Приказ №125 от",
            "x": 200,
            "y": 900,
            "font": 20
          },
          {
            "name": "ruk",
            "value": "Руководитель",
            "x": 200,
            "y": 930,
            "font": 20
          }
        ],
        "text": [{
            "name": "member",
            "value": "",
            "x": 350,
            "y": 410,
            "font": 20
          },
          {
            "name": "date",
            "value": "",
            "x": 345,
            "y": 900,
            "font": 20
          },
          {
            "name": "leader",
            "value": "",
            "x": 320,
            "y": 930,
            "font": 20
          }
        ]
      }
    },
    {
      "name": "Титульный лист диплома",
      "background": "diplom-title.jpg",
      // "background": null,
      "width": 793,
      "height": 1122,
      "elems": {
        "text": [
          {
            "name": "student",
            "value": "",
            "x": 140,
            "y": 855,
            "font": 20
          },
          {
            "name": "group",
            "value": "",
            "x": 160,
            "y": 833,
            "font": 20
          },
          {
            "name": "teacher",
            "value": "",
            "x": 480,
            "y": 835,
            "font": 20
          }
        ]
      }
    }
  ];
  $scope.curTemplate = null;
  $scope.data = null;

  let сonvertPxToMM = px => Math.floor(px * 0.264583);
  // let convertMmToPx = mm => Math.floor(mm / 0.264583);

  // let printElementsR = (elems, item) => {
  //   for (let i = 0; i < elems.length; i++) {
  //     const element = elems[i];
  //     context.font = `${element.font}px Times New Roman`;
  //     context.fillStyle = "black";

  //     if (element.type === "text") {
  //       if ($scope.data) {
  //         element.value = $scope.data[item][element.name];
  //       } else {
  //         context.fillStyle = "red";
  //         element.value = element.name;
  //       }

  //       context.fillText(element.value, element.x, element.y);
  //     }
  //   }
  // };

  let printElements = (elems, item) => {
    let element;

    if (elems.labels) {
      for (let i = 0; i < elems.labels.length; i++) {
        element = elems.labels[i];
        context.font = `${element.font}px Times New Roman`;
        context.fillStyle = "black";
        context.fillText(element.value, element.x, element.y);
      }
    }

    if(elems.text) {
      for (let i = 0; i < elems.text.length; i++) {
        element = elems.text[i];
        
        if ($scope.data || !element) {
          context.font = `${element.font}px Times New Roman`;
          context.fillStyle = "black";
          element.value = $scope.data[item][element.name];
        } else {
          context.font = `20px Verdana`;
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
  let getLines = (phrase, maxPxLength, textStyle) => {
    var wa = phrase.split(" "),
      phraseArray = [],
      lastPhrase = wa[0],
      measure = 0,
      splitChar = " ";
    if (wa.length <= 1) {
      return wa
    }
    context.font = textStyle;
    for (var i = 1; i < wa.length; i++) {
      var w = wa[i];
      measure = context.measureText(lastPhrase + splitChar + w).width;
      if (measure < maxPxLength) {
        lastPhrase += (splitChar + w);
      } else {
        phraseArray.push(lastPhrase);
        lastPhrase = w;
      }
      if (i === wa.length - 1) {
        phraseArray.push(lastPhrase);
        break;
      }
    }
    return phraseArray;
  }

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
    } else if (template.background) {
      printBackgroundAsync(imagePath + template.background)
        .then(img => {
          context.drawImage(img, 0, 0, template.width, template.height);
          printElements(template.elems, $scope.datasetItem);
        });
    } else {
      printElements(template.elems, $scope.datasetItem);
    }
  };

  $scope.loadBackground = (files) => {
    const handleImage = (e) => {
      var reader = new FileReader();
      reader.onload = function (event) {
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

  let createPDF2 = () => {
    const quality = 1;
    let w = сonvertPxToMM(canvas.width);
    let h = сonvertPxToMM(canvas.height);
    let orientation = w > h ? 'l' : 'p';
    let docPDF = new jsPDF(orientation, 'mm', [w, h]);

    for (let i = 0; i < $scope.curTemplate.elems.labels.length; i++) {
      const element = $scope.curTemplate.elems.labels[i];
      docPDF.text(element.value, 0, element.y, {
        lang: 'ru'
      });
    }

    for (let i = 0; i < $scope.curTemplate.elems.text.length; i++) {
      const element = $scope.curTemplate.elems.text[i];
      docPDF.text(element.value, element.x, element.y, {
        lang: 'ru'
      });
    }

    return docPDF;
  };

  $scope.createDocs = async () => {
    let zip = new JSZip();

    for (let item = 0; item < $scope.data.length; item++) {
      $scope.datasetItem = item;
      $scope.changeCanvas($scope.curTemplate);

      await createPDF()
        .then((docPDF) => {
          try {
            zip.file($scope.curTemplate.name + " " + (item + 1) + '.pdf', docPDF.output('blob'));
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
