//--------------------------------------------------------------------------------------------------------------
// HISTORY:
//    Date:  2020-10-02
//        V 0.1.0
//--------------------------------------------------------------------------------------------------------------
// Testing
//--------------------------------------------------------------------------------------------------------------

if (typeof appMain === "undefined") {
  console.log("undefind: app.controller(modalDlg_controller)");
  if (_debug) {
    alert("app: for modalDlg_controller not defnied.");
  }
}

appMain.controller("modalDlg.controller", function(
    $scope
  //, $uibModalInstance
  , $http
  //, selectedItem
) {
  $scope.apiUrl = _baseUrl + "/api/VehiclesTypes_";
  if (_mock) {
    $scope.apiUrl += ".json";
  }
  
  var CRUD = new BaseApiController($scope, $http, $scope.apiUrl,"");

  $scope.itemList = null;
  $scope.selectedItem = null;
  $scope.rowSelected = false;
  $scope.txtSearch = "";

  $scope.btnOk_click = function() {
    $uibModalInstance.close($scope.selectedItem);
  };

  $scope.btnCancel_click = function() {
    $uibModalInstance.dismiss("cancel");
  };

  $scope.rowClick = function(item) {
    $scope.itemList.forEach(function(item, index) {
      item.Selected = null;
    });
    item.Selected = true;
    $scope.rowSelected = true;
    $scope.selectedItem = item;

    if (_debug) {
      console.log(item);
    }
  };

  // so shoudl this use Basem adn it will need to if 
  /// there is security and headers on everyting, 
  // get List. 

  $scope.init = function() {
    $scope.All();
  };

  $scope.init();
});
