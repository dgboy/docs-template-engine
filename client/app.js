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
      "elems": [
        {
          "type": "label",
          "value": "Титульный лист",
          "x": 100,
          "y": 100
        },
        {
          "type": "text",
          "value": "<студент>",
          "x": 100,
          "y": 150
        }
      ]
    }
  ];

  $scope.chooseTemplate = (templateName) => {
    $scope.active = templateName;
    console.log($scope.active);

    $scope.templates.forEach(template => {
      if (template.name === $scope.active) {
        $scope.changeCanvas(template);
      }
    });
  };

  $scope.changeCanvas = (template) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const elems = template.elems;

    changeBackground(template.background);

    context.font = "32px Verdana";
    for (let i = 0; i < elems.length; i++) {
      const element = elems[i];

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
});


var mouse = {
  x: 0,
  y: 0
};

var draw = false;


canvas.addEventListener("mousedown", (e) => {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
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
