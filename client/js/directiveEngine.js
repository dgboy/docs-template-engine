docsTemplateEngine.directive('docsTemplateEngine', () => {
  return {
    restrict: "A",
    template: "<div class='row justify-content-between'>" +
      "<div class='col-4 ml-3'>" +
      "<h1 class='text-center'><span class='badge badge-light'>Шаблоны</span></h1>" +
      "<ul class='list-group mt-1'>" +
      "<li class='list-group-item list-group-item-action' ng-repeat='t in templates'" +
      "ng-class='{active : cur.templateName === t.name}' ng-click='chooseTemplate(t)'>" +
      "<div>{{t.name}}</div>" +
      "<div ng-if='cur.templateName === t.name'>" +
      "<hr>" +
      "<textarea class='form-control col' rows='5' ng-model='cur.data'></textarea>" +
      "<button class='mx-1 my-1 btn btn-warning' ng-click='updateData(cur.data)'>Применить</button>" +
      "<textarea class='form-control col' rows='10' ng-model='cur.template'></textarea>" +
      "<button class='mx-1 my-1 btn btn-warning' ng-click='updateTemplate(cur.template)'>Применить</button>" +
      "<div class='mx-auto my-1 custom-file'>" +
      "<input type='file' class='custom-file-input' id='imageFile' ng-click='loadBackground(t)'>" +
      "<label class='custom-file-label' for='imageFile'>Загрузить фон...</label>" +
      "</div>" +
      "<button class='col btn btn-success my-1' ng-class='{disabled : !cur.data}' ng-click='createDocs(t)'>Создать экземпляры</button>" +
      "<div class='row justify-content-between my-1' ng-show='cur.data'>" +
      "<button class='mx-1 btn btn-secondary' data-slide='prev' ng-click='changeDataset(-1)'><</button> " +
      "<span class='col pt-3 badge badge-dark'>Текущий набор: {{cur.dataset}}</span>" +
      "<button class='mx-1 btn btn-secondary' data-slide='next' ng-click='changeDataset(1)'>></button>" +
      "</div>" +
      "</div>" +
      "</li>" +
      "</ul>" +
      "</div>" +
      "<canvas id='canvas' width='793px' height='1122px'></canvas>" +
      "</div>" +
      "</div>"
  }
});
