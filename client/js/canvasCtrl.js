docsTemplateEngine.controller('canvasCtrl', ($scope, templatesService, dataService) => {
  console.log(dataService.json);
  $scope.data = dataService.data[0].teacher;
  // $scope.data = JSON.stringify(dataService.data);
});
