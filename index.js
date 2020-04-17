const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

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




const handleImage = (e) => {
  var reader = new FileReader();
  reader.onload = function(event){
    var img = new Image();
    img.onload = function(){
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img,0,0);
    }
    img.src = event.target.result;
  }

  reader.readAsDataURL(e.target.files[0]);
}

const imageLoader = document.getElementById('imageFile');

imageLoader.addEventListener('change', handleImage, false);

// var img = new Image();
// img.src = "client/images/drive-rule.jpg";
// img.onload = function () {
//   context.drawImage(img, 0, 0);
// };
