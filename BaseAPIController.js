//--------------------------------------------------------------------------------
// Version
//   0.1.7.0
//            - Modifed to use JWT authorisation token
//   0.1.6.0
//            - MOdifed to handle .Net 2.2 core error messages using custom Middleware on
//
//
//  Version
//   2018-10-17
//      0.1.5.0 - modified delete routine, removed alert message
//   2018-09-17
//      0.1.4.1 - Minor syntax error fixed
//   2018-09-11
//      0.1.4 - Modified error function
//   2018-07-24
//      0.1.3 - Added indexCreate
//   2018-02-12:
//      0.1.2 - Modified errorCallback to check for different complete message errors
//
//      0.1.1 - Modified the Error handler message to work when Only Message is
//              present and not just MessageDetail.
//
//--------------------------------------------------------------------------------
function BaseApiController($scope, $http, urlbase, securityToken) {
  /// Alert attributes
  $scope._Error = "";
  $scope._errorFlag = false;
  $scope._operationFlag = false;
  $scope._Operation = "";
  $scope._debugMessage = "";

  $scope._lockEdit = true;
  $scope._seeEdit = false; // if starting with blank edit cannot be enabled as there is nothing to edit.
  $scope._loading = 0;
  //$scope._status = 0; // 1 = edit // 2 = create // 3 = delete // 4 - list
  $scope._currMode = 0;

  $scope._url = urlbase;
  $scope._securityToken = securityToken;


  $scope.All = function() {
    var req = {
      method: "GET",
      url: $scope._url ,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      $scope.itemList = data.data;
      if (_debug) {
        console.log($scope.Item);
      }
    }, errorCallback);
  };


  $scope.index = function(ID) {
    var url = $scope._url + "/" + ID;
    var req = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      $scope.Item = data.data;
      if (_debug) {
        console.log($scope.Item);
      }
    }, errorCallback);
  };

  $scope.indexedit = function(ID) {
    var url = $scope._url + "/" + ID;
    var req = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      //$http.get(url).then(function (data) {
      $scope.Item = data.data;
      $scope.edit();
    }, errorCallback);
  };

  $scope.indexCreate = function(ID) {
    var url = $scope._url + "/" + ID;
    var req = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      //$http.get(url).then(function (data) {
      //$scope.Item = data.data;
      $scope.create(data.data);
    }, errorCallback);
  };

  $scope.saveItem = function(id) {
    switch ($scope._status) {
      case 1: // EDIT
        return $scope.updateItem(id);

      case 2: // CREATE
        return $scope.post();

      default:
        return null;
    }
  };

  // ----------------------------  BASIC CRUD functionality
  // --------------------------------------------------------

  $scope.save = function() {
    switch ($scope._status) {
      case 1: // EDIT
        return $scope.update();

      case 2: // CREATE
        return $scope.post();

      default:
        return null;
    }
  };

  // ----------------------------  CREATE
  // Must be newed
  $scope.create = function(Item) {
    $scope._status = 2;
    $scope.Item = Item; //new Client();
    $scope._lockEdit = false;
  };

  // ----------------------------  INSERT
  $scope.post = function() {
    var url = $scope._url;

    var req = {
      method: "POST",
      url: url,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      //return $http.post(url, $scope.Item).then(function (data) {
      $scope._Operation = "Created:";
      $scope._operationFlag = true;
      $scope._lockEdit = true;
      $scope.Item = data.data;
      $scope._seeEdit = true;
      $scope._status = 0;
    }, errorCallback);
  };

  // ----------------------------  EDIT
  /// So at this point we would want to edit what we have
  $scope.edit = function() {
    $scope._status = 1;
    $scope._lockEdit = false;
  };

  // ----------------------------  UPDATE

  $scope.updateItem = function(id) {
    var url = $scope._url + "/" + id;
    var req = {
      method: "PUT",
      url: url,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      //return $http.put(url, $scope.Item).then(function (data) {
      //var usr = data.data;
      $scope._Operation = "Updated:";
      $scope._operationFlag = true;
      $scope._lockEdit = true;
      $scope._status = 0;
    }, errorCallback);
  };

  $scope.update = function() {
    var url = $scope._url;
    //var out = Out($scope.Client);
    return $http.put(url, $scope.Item).then(function(data) {
      //var usr = data.data;
      $scope._Operation = "Updated:";
      $scope._operationFlag = true;
      $scope._lockEdit = true;
      $scope._status = 0;
    }, errorCallback);
  };

  // ----------------------------  DELETE
  $scope.deleteItem = function(PrimaryKey) {
    var url = $scope._url + "/" + PrimaryKey; // $scope.Client.ID;// + "/" + $scope.Client.;
    $scope._status = 0;

    var req = {
      method: "DELETE",
      url: url,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      //return $http.delete(url).then(function (data) {
      $scope.Item = null;
      $scope._Operation = "Deleted:";
      $scope._operationFlag = true;
      $scope._lockEdit = true;
      $scope._status = 0;
    }, errorCallback);
  };

  // ----------------------------  DELETE
  $scope.delete = function(PrimaryKey) {
    var url = $scope._url + "/" + PrimaryKey; // $scope.Client.ID;// + "/" + $scope.Client.;
    $scope._status = 0;
    var req = {
      method: "DELETE",
      url: url,
      headers: {
        Authorization: "Bearer " + $scope._securityToken
      }
    };
    $http(req).then(function(data) {
      //return $http.delete(url).then(function (data) {
      $scope.Item = null;
      $scope._Operation = "Deleted:";
      $scope._operationFlag = true;
      $scope._lockEdit = true;
      $scope._status = 0;
    }, errorCallback);
  };

  $scope.cancel = function() {
    $scope._status = 0;
    $scope._lockEdit = true;
  };

  var errorCallback = function(result) {
    try {
      var DebugErr = "";

      $scope._errorFlag = true;
      $scope._Error = "";

      if (typeof result.statusText !== "undefined") {
        $scope._Error += result.statusText.replace(/(\r\n|\n|\r)/gm, " ");
        DebugErr += result.statusText.replace(/(\r\n|\n|\r)/gm, " ");
      }

      if (typeof result.data.error !== "undefined") {
        $scope._Error += result.data.error.replace(/(\r\n|\n|\r)/gm, " ");
        DebugErr += result.data.error.replace(/(\r\n|\n|\r)/gm, " ");
      }

      if (typeof result.data.stackTrace !== "undefined") {
        //$scope._Error += result.data.error.replace(/(\r\n|\n|\r)/gm, " ");
        DebugErr += result.data.stackTrace.replace(/(\r\n|\n|\r)/gm, " ");
      }

      if (typeof result.config !== "undefined") {
        DebugErr += JSON.stringify(result.config);
      }

      $scope._debugMessage = DebugErr;
      //console.log(data);
      return false;
    } catch (e) {
      $scope._debugMessage += " " + status;
      console.log(result);
      console.log(e);
    }
  };

  $scope.closeError = function() {
    $scope._errorFlag = false;
  };

  $scope.closeAlert = function() {
    $scope._operationFlag = false;
  };

  $scope.testAlerts = function() {
    $scope._operationFlag = true;
    $scope._errorFlag = true;
  };
}
