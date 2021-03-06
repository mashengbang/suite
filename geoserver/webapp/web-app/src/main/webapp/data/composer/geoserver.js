/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp', [
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngClipboard',
  'ngLodash',
  'ui.router',
  'ui.bootstrap',
  'gsApp.core',
  'gsApp.topnav',
  'gsApp.sidenav',
  'gsApp.login',
  'gsApp.login.modal',
  'gsApp.home',
  'gsApp.layers',
  'gsApp.workspaces',
  'gsApp.maps'
]).controller('AppCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  'AppEvent',
  'AppSession',
  '$window',
  '$modal',
  '$modalStack',
  '$timeout',
  'GeoServer',
  function ($scope, $rootScope, $state, AppEvent, AppSession, $window, $modal, $modalStack, $timeout, GeoServer) {
    $scope.session = AppSession;
    $scope.init = true;
    var timeout = null;
    var timeoutWarning = 15;
    //Show a login modal counting down from countdown. No countdown if countdown = 0.
    var loginModal = function (countdown) {
      //If a modal is not already open, we are not currently changing states, and we are not on the login page
      if (!($scope.modal || $scope.stateChange) && $state.current.url.indexOf('/login') == -1) {
        $scope.modal = true;
        var modalInstance = $modal.open({
            templateUrl: '/core/login/login.modal.tpl.html',
            controller: 'LoginModalCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
              countdown: function () {
                return countdown;
              }
            }
          });
      }
    };
    //Configure ZeroClipboard
    ZeroClipboard.config({ swfPath: 'assets/zeroclipboard/dist/ZeroClipboard.swf' });
    //handle fullscreen mode
    $scope.$on(AppEvent.ToggleFullscreen, function (e) {
      $scope.fullscreen = !$scope.fullscreen;
    });
    // On an unauthorized event show a login modal
    $scope.$on(AppEvent.Unauthorized, function (e) {
      loginModal(0);
    });
    $scope.$on(AppEvent.Login, function (e, login) {
      // update global session state
      AppSession.update(login.session, login.user);
      $timeout.cancel(timeout);
      timeout = $timeout(function () {
        loginModal(timeoutWarning);
      }, (login.timeout - timeoutWarning) * 1000);
    });
    $scope.$on(AppEvent.Logout, function (e) {
      AppSession.clear();
      $timeout.cancel(timeout);
      $state.go('login');
    });
    // track app state changes
    $rootScope.state = {};
    $rootScope.title = 'Composer';
    $rootScope.$on('$stateChangeSuccess', function (e, to, toParams, from, fromParams) {
      //Whenever we change states, pre-emptively check if we are logged in. If not, go to the login page.
      $scope.stateChange = true;
      //If this is not a login redirect, save curr/prev states
      if (to.url && to.url.indexOf('/login') == -1) {
        $rootScope.state.curr = {
          name: to,
          params: toParams
        };
        $rootScope.state.prev = {
          name: from,
          params: fromParams
        };
      }
      //Update page title
      if (to.url) {
        var title = 'Composer';
        switch (to.url) {
        case '/':
          if (toParams.workspace) {
            title += ' | ' + toParams.workspace;
          }
          break;
        case '/editlayer/:workspace/:name':
        case '/editmap/:workspace/:name':
          title += ' | Editing: ' + toParams.workspace + ':' + toParams.name;
          break;
        case '/layers':
          title += ' | All Layers';
          break;
        case '/list':
          title += ' | All Workspaces';
          break;
        case '/maps':
          title += ' | All Maps';
          break;
        }
        $rootScope.title = title;
      }
      var slowConnection = $timeout(function () {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Experiencing connection delays. Please verify GeoServer is running.',
              fadeout: true
            }];
        }, 10000);
      GeoServer.session().then(function (result) {
        $timeout.cancel(slowConnection);
        //if status is 0, request cancelled - check server connectivity
        if (!result.success && result.status == 0) {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Could not connect to the server',
              fadeout: true
            }];
        }
        //If we are in a series of modal windows, don't redirect
        if ($modalStack.getTop()) {
          $scope.stateChange = false;
          return result;
        }
        if (result.success) {
          //not logged in, not on the login page, not in a modal window - redirect to login
          if (!result.data.user && to.url && to.url.indexOf('/login') == -1) {
            $state.go('login').then(function () {
              $scope.stateChange = false;
            });
          } else {
            //Update timout
            $timeout.cancel(timeout);
            timeout = $timeout(function () {
              loginModal(timeoutWarning);
            }, (result.data.timeout - timeoutWarning) * 1000);
            $scope.stateChange = false;
          }
        } else {
          //not authorized
          AppSession.clear();
          $state.go('login').then(function () {
            $scope.stateChange = false;
          });
        }
        return result;
      });
    });
  }
]).factory('_', [
  'lodash',
  function (lodash) {
    return lodash;
  }
]).run([
  '$rootScope',
  'GeoServer',
  'AppSession',
  '$timeout',
  function ($rootScope, GeoServer, AppSession, $timeout) {
    GeoServer.session().then(function (result) {
      if (result.success) {
        AppSession.update(result.data.id, result.data.user);
      } else {
        AppSession.clear();
      }
    });
  }
]).constant('baseUrl', 'http://localhost:8000');angular.module('gsApp.alertlist', ['ui.bootstrap']).controller('AlertListCtrl', [
  '$modal',
  '$interval',
  '$log',
  '$timeout',
  '$scope',
  '$rootScope',
  '$modalInstance',
  function ($modal, $interval, $log, $timeout, $scope, $rootScope, $modalInstance) {
    $scope.alertList = $rootScope.alertList;
    $scope.scrollToBottom = function () {
      var listElement = document.getElementById('alert-list');
      listElement.scrollTop = listElement.offsetHeight;
    };
    $timeout(function () {
      //DOM has finished rendering
      $scope.scrollToBottom();
    });
    $scope.close = function () {
      $modalInstance.dismiss('close');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.alertpanel', ['ui.bootstrap']).directive('alertPanel', [
  '$modal',
  '$interval',
  '$log',
  '$rootScope',
  function ($modal, $interval, $log, $rootScope) {
    return {
      restrict: 'EA',
      scope: { alerts: '=?' },
      templateUrl: '/components/alertpanel/alertpanel.tpl.html',
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.showMessages = true;
          $scope.$watch(function () {
            return $rootScope.enableAlerts;  // set to true on login
          }, function (newVal) {
            if (newVal != null && newVal) {
              $scope.showMessages = true;
            } else if (newVal === false) {
              $scope.showMessages = false;
            }
          }, true);
          $rootScope.alertList = [];
          var maxLength = 100;
          $scope.$watch('alerts', function (newVal) {
            if (newVal != null) {
              $scope.messages = newVal.map(function (val) {
                //Save the message
                $rootScope.alertList.push(val);
                if ($rootScope.alertList.length > maxLength) {
                  $rootScope.alertList.shift();
                }
                var msg = angular.extend({ show: $scope.showMessages }, val);
                if (msg.fadeout == true) {
                  $interval(function () {
                    msg.show = false;
                  }, 5000, 1);
                }
                return msg;
              });
            }
          });
          $scope.closeAlert = function (i) {
            $scope.messages.splice(i, 1);
          };
          $scope.showDetails = function (message) {
            var modal = $modal.open({
                templateUrl: 'alert-modal',
                size: 'lg',
                resolve: {
                  message: function () {
                    return message;
                  }
                },
                controller: [
                  '$scope',
                  '$modalInstance',
                  'message',
                  function ($scope, $modalInstance, message) {
                    $scope.message = message;
                    $scope.copy = function (message) {
                      $modalInstance.close();
                    };
                    $scope.close = function () {
                      $modalInstance.close();
                    };
                  }
                ]
              });
          };
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 *
 * editor.layer.js, editor.layer.less, editor.layer.tpl.html
 * Also uses editor.less for styling shared with editor.map.tpl.html
 *
 * Layer view of the style editor. Sets up the layer context and provides links to layer and workspace modals
 *
 * NOTE: This module should only contain logic specific to the layer veiw. 
 * General editor or map functionality should go in styleeditor.js or olmap.js respectively.
 */
angular.module('gsApp.editor.layer', [
  'ui.codemirror',
  'gsApp.editor.olmap',
  'gsApp.editor.styleeditor',
  'gsApp.editor.tools.shortcuts',
  'gsApp.editor.tools.save',
  'gsApp.editor.tools.undo',
  'gsApp.editor.tools.color',
  'gsApp.editor.tools.icons',
  'gsApp.editor.tools.attributes',
  'gsApp.editor.tools.display',
  'gsApp.editor.tools.sld',
  'gsApp.editor.tools.fullscreen',
  'gsApp.alertpanel',
  'gsApp.featureinfopanel'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('editlayer', {
      url: '/editlayer/:workspace/:name',
      templateUrl: '/components/editor/editor.layer.tpl.html',
      controller: 'LayerStyleCtrl',
      params: {
        workspace: '',
        name: ''
      }
    });
  }
]).controller('LayerStyleCtrl', [
  '$log',
  '$modal',
  '$rootScope',
  '$scope',
  '$state',
  '$stateParams',
  'AppEvent',
  'GeoServer',
  function ($log, $modal, $rootScope, $scope, $state, $stateParams, AppEvent, GeoServer) {
    var wsName = $stateParams.workspace;
    var layerName = $stateParams.name;
    /** WARNING: Editor scope variables **/
    /* The $scope of the editor pages is shared between editor.map / editor.layer, 
       * olmap, layerlist, and styleeditor. As such, care must be taken when adding
       * or modifying these scope variables.
       * See app/components/editor/README.md for more details.
       */
    $scope.workspace = wsName;
    $scope.layer = null;
    $scope.map = null;
    $scope.mapOpts = null;
    $scope.isRendering = false;
    $scope.ysldstyle = null;
    //Todo - hide sidenav
    $rootScope.$broadcast(AppEvent.ToggleSidenav);
    GeoServer.layer.get(wsName, layerName).then(function (result) {
      if (result.success) {
        var layer = result.data;
        $scope.layer = layer;
        $scope.mapOpts = {
          workspace: wsName,
          layers: [{
              name: $scope.layer.name,
              visible: true
            }],
          proj: $scope.layer.proj,
          bbox: $scope.layer.bbox.native,
          center: $scope.layer.bbox.native.center,
          error: function (err) {
            if (err && typeof err == 'string' && err.lastIndexOf('Delays are occuring in rendering the map.', 0) === 0) {
              $scope.$apply(function () {
                $rootScope.alerts = [{
                    type: 'warning',
                    message: 'Map rendering may take a while...',
                    details: err,
                    fadeout: true
                  }];
              });
            } else {
              $scope.$apply(function () {
                $rootScope.alerts = [{
                    type: 'danger',
                    message: 'Map rendering error',
                    details: err.exceptions ? err.exceptions[0].text : err,
                    fadeout: true
                  }];
              });
            }
          },
          progress: function (state) {
            if (state == 'start') {
              $scope.isRendering = true;
            }
            if (state == 'end') {
              $scope.isRendering = false;
            }
            $scope.$apply();
          },
          activeLayer: $scope.layer,
          featureInfo: function (features) {
            $scope.$broadcast('featureinfo', features);
          }
        };
        GeoServer.style.get(wsName, layerName).then(function (result) {
          if (result.success == true) {
            $scope.ysldstyle = result.data;
          } else {
            $rootScope.alerts = [{
                type: 'danger',
                message: 'Could not retrieve style for layer: ' + layerName
              }];
          }
        });
      } else {
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Could not retrieve layer info for : ' + layerName
          }];
      }
    });
    $scope.viewWorkspace = function (workspace) {
      $state.go('workspace', { workspace: workspace });
    };
    $scope.editLayerSettings = function (layer) {
      var modalInstance = $modal.open({
          templateUrl: '/components/modalform/layer/layer.settings.tpl.html',
          controller: 'EditLayerSettingsCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return layer.workspace;
            },
            layer: function () {
              return layer;
            }
          }
        });
    };
    $rootScope.$on(AppEvent.LayerUpdated, function (scope, layer) {
      if ($scope.layer && $scope.layer.name == layer.original.name) {
        $scope.layer = layer.new;
        if (layer.new.name != layer.original.name) {
          $scope.mapOpts.layers = [{
              name: $scope.layer.name,
              visible: $scope.mapOpts.layers[0].visible
            }];
        }
        if (layer.new.proj != layer.original.proj) {
          $scope.mapOpts.proj = layer.new.proj;
        }
      }
    });
    $scope.onUpdatePanels = function () {
      $rootScope.$broadcast(AppEvent.SidenavResized);  // update map
    };
    $scope.toggleFullscreen = function () {
      $rootScope.broadcast(AppEvent.ToggleFullscreen);
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 *
 * editor.map.js, editor.map.less, editor.map.tpl.html
 * Also uses editor.less for styling shared with editor.layer.tpl.html
 *
 * Map view of the style editor. Sets up the map context and provides links to map, layer, and workspace modals
 * Also includes some functionality for showing/hiding layers (in conjunction with layerlist.js).
 *
 * NOTE: This module should only contain logic specific to the map veiw. 
 * General editor or map functionality should go in styleeditor.js or olmap.js respectively.
 */
angular.module('gsApp.editor.map', [
  'ui.codemirror',
  'ui.sortable',
  'gsApp.editor.olmap',
  'gsApp.editor.layerlist',
  'gsApp.editor.styleeditor',
  'gsApp.editor.tools.shortcuts',
  'gsApp.editor.tools.save',
  'gsApp.editor.tools.undo',
  'gsApp.editor.tools.layers',
  'gsApp.editor.tools.color',
  'gsApp.editor.tools.icons',
  'gsApp.editor.tools.attributes',
  'gsApp.editor.tools.display',
  'gsApp.editor.tools.sld',
  'gsApp.editor.tools.fullscreen',
  'gsApp.alertpanel',
  'gsApp.featureinfopanel',
  'gsApp.import',
  'gsApp.workspaces.maps.layerremove'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('editmap', {
      url: '/editmap/:workspace/:name',
      templateUrl: '/components/editor/editor.map.tpl.html',
      controller: 'MapComposeCtrl',
      params: {
        workspace: '',
        name: '',
        hiddenLayers: {}
      }
    });
  }
]).controller('MapComposeCtrl', [
  '$document',
  '$log',
  '$modal',
  '$rootScope',
  '$scope',
  '$state',
  '$stateParams',
  '$timeout',
  '$window',
  '_',
  'AppEvent',
  'GeoServer',
  function ($document, $log, $modal, $rootScope, $scope, $state, $stateParams, $timeout, $window, _, AppEvent, GeoServer) {
    var wsName = $stateParams.workspace;
    var mapName = $stateParams.name;
    var hiddenLayers = $stateParams.hiddenLayers;
    if (hiddenLayers && typeof hiddenLayers === 'string') {
      hiddenLayers = hiddenLayers.split(',');
    }
    /** WARNING: Editor scope variables **/
    /* The $scope of the editor pages is shared between editor.map / editor.layer, 
       * olmap, layerlist, and styleeditor. As such, care must be taken when adding
       * or modifying these scope variables.
       * See app/components/editor/README.md for more details.
       */
    $scope.workspace = wsName;
    $scope.layer = null;
    $scope.map = null;
    $scope.mapOpts = null;
    $scope.isRendering = false;
    $scope.ysldstyle = null;
    //todo - hide sidenav
    $rootScope.$broadcast(AppEvent.ToggleSidenav);
    GeoServer.map.get(wsName, mapName).then(function (result) {
      if (result.success) {
        var map = result.data;
        $scope.map = map;
        //get the detailed version of the layers
        GeoServer.map.layers.get(wsName, map.name).then(function (result) {
          if (result.success) {
            map.layers = result.data;
            $scope.layer = map.layers.length > 0 ? map.layers[0] : null;
            // map options, extend map obj and add visible flag to layers
            $scope.mapOpts = angular.extend(map, {
              layers: map.layers.map(function (l) {
                l.visible = true;
                if (hiddenLayers) {
                  // reinstate visibility
                  var found = _.contains(hiddenLayers, l.name);
                  if (found) {
                    l.visible = false;
                  }
                }
                return l;
              }),
              error: function (err) {
                if (err && typeof err == 'string' && err.lastIndexOf('Delays are occuring in rendering the map.', 0) === 0) {
                  $scope.$apply(function () {
                    $rootScope.alerts = [{
                        type: 'warning',
                        message: 'Map rendering may take a while...',
                        details: err,
                        fadeout: true
                      }];
                  });
                } else {
                  $scope.$apply(function () {
                    $rootScope.alerts = [{
                        type: 'danger',
                        message: 'Map rendering error',
                        details: err.exceptions ? err.exceptions[0].text : err,
                        fadeout: true
                      }];
                  });
                }
              },
              progress: function (state) {
                if (state == 'start') {
                  $scope.isRendering = true;
                }
                if (state == 'end') {
                  $scope.isRendering = false;
                }
                $scope.$apply();
              },
              featureInfo: function (features) {
                $scope.$broadcast('featureinfo', features);
              }
            });
            if ($scope.layer) {
              GeoServer.style.get(wsName, $scope.layer.name).then(function (result) {
                if (result.success == true) {
                  $scope.ysldstyle = result.data;
                } else {
                  $rootScope.alerts = [{
                      type: 'danger',
                      message: 'Could not retrieve style for layer: ' + $scope.layer.name
                    }];
                }
              });
            }
          } else {
            $rootScope.alerts = [{
                type: 'danger',
                message: 'Could not load layers for map ' + mapName + ': ' + result.data.message,
                details: result.data.trace,
                fadeout: true
              }];
          }
        });
      } else {
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Could not load map ' + mapName + ': ' + result.data.message,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
    $scope.viewWorkspace = function (workspace) {
      $rootScope.workspace = workspace;
      $state.go('workspace', { workspace: workspace });
    };
    // Save checkbox state as url parameters
    $scope.getHiddenLayers = function () {
      var hiddenLayers = _.remove($scope.map.layers, function (lyr) {
          return lyr.visible === false;
        });
      hiddenLayers = _.map(hiddenLayers, function (layer) {
        return layer.name;
      });
      return hiddenLayers.join();
    };
    $scope.reinstateVisiblility = function (prevLayers, newLayers) {
      for (var j = 0; j < newLayers.length; j++) {
        var newLayer = newLayers[j];
        var prevLayer = _.find(prevLayers, function (prevLayer) {
            return newLayer.name === prevLayer.name;
          });
        if (prevLayer) {
          newLayer.visible = prevLayer.visible;
        } else {
          newLayer.visible = true;
        }
      }
      return newLayers;
    };
    $scope.addMapLayer = function (workspace) {
      var modalInstance = $modal.open({
          templateUrl: '/components/editor/editor.map.modal.addlayer.tpl.html',
          controller: 'AddToMapLayerCtrl',
          size: 'lg',
          resolve: {
            map: function () {
              return $scope.map;
            },
            workspace: function () {
              return $scope.workspace;
            },
            reinstateVisibility: function () {
              return $scope.reinstateVisiblility;
            }
          }
        }).result.then(function (response, args) {
          if (response === 'import') {
            $scope.map.hiddenLayers = $scope.getHiddenLayers();
            $modal.open({
              templateUrl: '/components/import/import.tpl.html',
              controller: 'DataImportCtrl',
              backdrop: 'static',
              size: 'lg',
              resolve: {
                workspace: function () {
                  return $scope.workspace;
                },
                mapInfo: function () {
                  return $scope.map;
                },
                contextInfo: function () {
                  return {
                    title: 'Import Layers into <i class="icon-map"></i> <strong>' + $scope.map.name + '</strong>',
                    hint: 'Add selected layers to map ' + $scope.map.name,
                    button: 'Add layers to map'
                  };
                }
              }
            }).result.then(function (layers) {
              if (layers) {
                //Add returned layers to map
                GeoServer.map.layers.add($scope.workspace, $scope.map.name, layers).then(function (result) {
                  if (result.success) {
                    $scope.map.layers = $scope.reinstateVisiblility($scope.map.layers, result.data);
                    $scope.map.layer_count++;
                    $scope.refreshMap();
                    $rootScope.alerts = [{
                        type: 'success',
                        message: layers.length + ' layer(s) added to map ' + $scope.map.name + '.',
                        fadeout: true
                      }];
                  } else {
                    $rootScope.alerts = [{
                        type: 'danger',
                        message: 'Layer(s) could not be added to map ' + $scope.map.name + ': ' + result.data.message,
                        details: result.data.trace,
                        fadeout: true
                      }];
                  }
                });
              }
            });
          } else if (response === 'added') {
            $scope.refreshMap();
          }
        });
    };
    $scope.editLayerSettings = function (layer) {
      var modalInstance = $modal.open({
          templateUrl: '/components/modalform/layer/layer.settings.tpl.html',
          controller: 'EditLayerSettingsCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return layer.workspace;
            },
            layer: function () {
              return layer;
            }
          }
        });
    };
    $scope.editMapSettings = function (map) {
      var modalInstance = $modal.open({
          templateUrl: '/components/modalform/map/map.settings.tpl.html',
          controller: 'EditMapSettingsCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return $scope.workspace;
            },
            map: function () {
              return map;
            }
          }
        });
    };
    $scope.hideCtrl = {
      'all': false,
      'lonlat': false
    };
    $scope.$on(AppEvent.MapControls, function (scope, ctrl) {
      var val = $scope.hideCtrl[ctrl];
      if (ctrl && val !== undefined) {
        $scope.hideCtrl[ctrl] = !val;
      }
    });
    $rootScope.$on(AppEvent.MapUpdated, function (scope, map) {
      if ($scope.map.name == map.original.name) {
        for (var i = 0; i < $scope.mapOpts.layers.length; i++) {
          if (map.original.layers[i].name == $scope.mapOpts.layers[i].name) {
            map.new.layers[i].visible = $scope.mapOpts.layers[i].visible;
            $scope.mapOpts.layers[i] = map.new.layers[i];
          }
        }
        $scope.map = map.new;
        if (map.new.name != map.original.name) {
          $scope.mapOpts.name = map.new.name;
        }
        if (map.new.proj != map.original.proj) {
          $scope.mapOpts.proj = map.new.proj;
        }
        if (map.new.bbox != map.original.bbox) {
          $scope.mapOpts.bbox = map.new.bbox;
        }
      }
    });
    $rootScope.$on(AppEvent.LayerUpdated, function (scope, layer) {
      for (var i = 0; i < $scope.mapOpts.layers.length; i++) {
        if (layer.original.name == $scope.mapOpts.layers[i].name) {
          layer.new.visible = $scope.mapOpts.layers[i].visible;
          $scope.map.layers[i] = layer.new;
          $scope.mapOpts.layers[i] = layer.new;
          if ($scope.layer.name = layer.original.name) {
            $scope.layer = layer.new;
          }
        }
      }
    });
    $scope.toggleFullscreen = function () {
      $rootScope.broadcast(AppEvent.ToggleFullscreen);
    };
    $scope.onUpdatePanels = function () {
      $rootScope.$broadcast(AppEvent.SidenavResized);  // update map
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.layers.addtomap', ['ngGrid']).controller('AddToMapLayerCtrl', [
  'workspace',
  'map',
  'reinstateVisibility',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  'layersListModel',
  '_',
  '$timeout',
  function (workspace, map, reinstateVisibility, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent, layersListModel, _, $timeout) {
    $scope.workspace = workspace;
    $scope.map = map;
    $scope.addSelectedToMap = function () {
      var mapInfo = { 'name': map.name };
      mapInfo.layersToAdd = [];
      for (var k = 0; k < $scope.layerSelections.length; k++) {
        var layer = $scope.layerSelections[k];
        mapInfo.layersToAdd.push({
          'name': layer.name,
          'workspace': layer.workspace
        });
      }
      GeoServer.map.layers.add($scope.workspace, mapInfo.name, mapInfo.layersToAdd).then(function (result) {
        if (result.success) {
          $scope.map.layers = reinstateVisibility($scope.map.layers, result.data);
          $scope.map.layer_count++;
          $rootScope.alerts = [{
              type: 'success',
              message: mapInfo.layersToAdd.length + ' layer(s) added to map ' + mapInfo.name + '.',
              fadeout: true
            }];
          $scope.close('added');
        } else {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Layer(s) could not be added to map ' + mapInfo.name + ': ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
    };
    $scope.close = function () {
      $modalInstance.close('close');
    };
    $scope.importDataToNewLayers = function () {
      $modalInstance.close('import');
    };
    $scope.addToLayerSelections = function (layer) {
      if (!layer.selected) {
        _.remove($scope.layerSelections, function (lyr) {
          return lyr.name === layer.name;
        });
      } else {
        $scope.layerSelections.push(layer);
      }
    };
    $scope.addAllToLayerSelections = function (add) {
      //clear the selections
      $scope.layerSelections.length = 0;
      for (var i = 0; i < $scope.layerOptions.ngGrid.filteredRows.length; i++) {
        var layer = $scope.layerOptions.ngGrid.filteredRows[i].entity;
        if (add && !layer.alreadyInMap) {
          layer.selected = true;
          $scope.layerSelections.push(layer);
        } else {
          layer.selected = false;
        }
      }
    };
    // Available Layers Table with custom checkbox
    var modalWidth = 800;
    $scope.gridWidth = { 'width': modalWidth };
    $scope.opts = {
      paging: {
        pageSizes: [
          25,
          50,
          100
        ],
        pageSize: 25,
        currentPage: 1
      },
      sort: {
        fields: ['name'],
        directions: ['asc']
      },
      filter: { filterText: '' }
    };
    $scope.layerSelections = [];
    $scope.layerOptions = {
      data: 'layers',
      enableCellSelection: false,
      filterOptions: $scope.opts.filter,
      enableRowSelection: false,
      enableCellEdit: false,
      enableRowReordering: false,
      jqueryUIDraggable: false,
      checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox"' + 'ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
      int: function () {
        $log('done');
      },
      sortInfo: $scope.opts.sort,
      showSelectionCheckbox: false,
      selectWithCheckboxOnly: false,
      selectedItems: $scope.layerSelections,
      multiSelect: true,
      columnDefs: [
        {
          field: 'select',
          displayName: 'S',
          width: '24px',
          cellTemplate: '<div ng-if="!row.entity.alreadyInMap"' + 'style="margin: 12px 0px 6px 6px; padding: 0;">' + '<input type="checkbox" ng-model="row.entity.selected" ' + 'ng-click="addToLayerSelections(row.entity);"></div>',
          headerCellTemplate: '<input class="ngSelectionHeader" type="checkbox"' + 'ng-model="$parent.allSelected" ng-change="addAllToLayerSelections($parent.allSelected)"/>'
        },
        {
          field: 'name',
          displayName: 'Layer',
          cellTemplate: '<div class="grid-text-padding"' + 'title="{{row.entity.name}}">' + '{{row.entity.name}}' + '</div>',
          width: '20%'
        },
        {
          field: 'title',
          displayName: 'Title',
          enableCellEdit: false,
          cellTemplate: '<div class="grid-text-padding"' + 'alt="{{row.entity.description}}"' + 'title="{{row.entity.description}}">' + '{{row.entity.title}}' + '</div>',
          width: '30%'
        },
        {
          field: 'inMap',
          displayName: 'Status',
          cellClass: 'text-center',
          cellTemplate: '<div class="grid-text-padding"' + 'ng-show="row.entity.alreadyInMap">' + 'In Map</div>',
          width: '10%',
          sortable: false
        },
        {
          field: 'modified.timestamp',
          displayName: 'Modified',
          cellClass: 'text-center',
          cellFilter: 'modified.timestamp',
          cellTemplate: '<div class="grid-text-padding"' + 'ng-show="row.entity.modified">' + '{{ row.entity.modified.pretty }}</div>',
          width: '20%',
          sortable: false
        },
        {
          field: 'geometry',
          displayName: 'Type',
          cellClass: 'text-center',
          cellTemplate: '<div get-type ' + 'geometry="{{row.entity.geometry}}">' + '</div>',
          width: '10%',
          sortable: false
        }
      ],
      enablePaging: true,
      enableColumnResize: false,
      showFooter: false,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.opts.paging,
      useExternalSorting: true
    };
    $scope.$watch('opts', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        $scope.refreshLayers();
      }
    }, true);
    var refreshTimer = null;
    $scope.refreshLayers = function () {
      if (refreshTimer) {
        $timeout.cancel(refreshTimer);
      }
      refreshTimer = $timeout(function () {
        $scope.serverRefresh();
      }, 800);
    };
    function disableExistingLayers() {
      // disable layers already in map
      for (var k = 0; k < $scope.layers.length; k++) {
        var layer = $scope.layers[k];
        for (var j = 0; j < map.layers.length; j++) {
          var mapLayer = map.layers[j];
          if (layer.name === mapLayer.name) {
            layer.alreadyInMap = true;
          }
        }
      }
    }
    $scope.serverRefresh = function () {
      if ($scope.workspace) {
        var opts = $scope.opts;
        GeoServer.layers.get($scope.workspace, opts.paging.currentPage - 1, opts.paging.pageSize, opts.sort.fields[0] + ':' + opts.sort.directions[0], opts.filter.filterText).then(function (result) {
          if (result.success) {
            $scope.layers = result.data.layers;
            disableExistingLayers();
            if ($scope.layerOptions) {
              $scope.layerSelections.length = 0;
              $scope.layerOptions.$gridScope['allSelected'] = false;
            }
            $scope.totalServerItems = result.data.total;
            $scope.itemsPerPage = opts.paging.pageSize;
            $scope.totalItems = $scope.totalServerItems;
          } else {
            $rootScope.alerts = [{
                type: 'warning',
                message: 'Layers for workspace ' + $scope.workspace + ' could not be loaded.',
                fadeout: true
              }];
          }
        });
      }
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 *
 * layerlist.js, layerlist.less, layerlist.tpl.html
 * Fullscreen styling for layer list is in editor.less
 *
 * A list of layers in a map, that can be shown/hidden, rearanged, and deleted. 
 * Used by editor.map.js 
 */
angular.module('gsApp.editor.layerlist', []).directive('layerList', [
  '$log',
  '$modal',
  '$rootScope',
  '$timeout',
  'GeoServer',
  function ($log, $modal, $rootScope, $timeout, GeoServer) {
    return {
      restrict: 'EA',
      templateUrl: '/components/editor/layerlist/layerlist.tpl.html',
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          /** WARNING: Editor scope variables **/
          /* The $scope of the editor pages is shared between editor.map / editor.layer, 
         * olmap, layerlist, and styleeditor. As such, care must be taken when adding
         * or modifying these scope variables.
         * See app/components/editor/README.md for more details.
         */
          $scope.showLayerList = true;
          $scope.headerStyle = { width: '100%' };
          $scope.isOSX = function () {
            return navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
          };
          $timeout(function () {
            $scope.listElement = angular.element($('ul.layerlist-list'))[0];
            $scope.headerStyle = { width: $scope.listElement.clientWidth };
            $scope.$watch('listElement.clientWidth', function (newVal) {
              if (newVal) {
                $scope.headerStyle = { width: newVal };
              }
            });
          }, 1000);
          $scope.selectLayer = function (layer) {
            var activeLayer = $scope.layer;
            if (!$scope.editor.isClean($scope.generation)) {
              $scope.goToLayer = layer;
              $scope.editorSave('layer');
            } else {
              $scope.layer = layer;
            }
          };
          $scope.zoomToLayer = function (layer) {
            $scope.mapOpts.bounds = {
              bbox: layer.bbox,
              proj: layer.proj
            };
          };
          $scope.removeLayer = function (layer, index) {
            var modalInstance = $modal.open({
                templateUrl: '/components/editor/layerlist/layerremove.tpl.html',
                controller: 'MapRemoveLayerCtrl',
                size: 'md',
                resolve: {
                  map: function () {
                    return $scope.map;
                  },
                  layer: function () {
                    return layer;
                  }
                }
              }).result.then(function (response) {
                if (response === 'remove') {
                  GeoServer.map.layers.delete($scope.workspace, $scope.map.name, layer.name).then(function (result) {
                    if (result.success) {
                      $scope.map.layers.splice(index, 1);
                      $scope.map.layer_count--;
                    } else {
                      var err = result.data;
                      $rootScope.alerts = [{
                          type: 'danger',
                          message: 'Unable to delete layer ' + layer.name + ' from map' + $scope.map.name + ': ' + err.message,
                          details: err
                        }];
                    }
                  });
                }
              });
          };
          $scope.layersReordered = function () {
            if ($scope.map != null) {
              GeoServer.map.layers.put($scope.workspace, $scope.map.name, $scope.map.layers).then(function (result) {
                if (result.success) {
                  $scope.refreshMap();
                } else {
                  $log.log(result);
                }
              });
            }
          };
          $scope.$watch('layer', function (newVal) {
            if ($scope.mapOpts) {
              $scope.mapOpts.activeLayer = newVal;
            }
            if (newVal != null) {
              var l = newVal;
              GeoServer.style.get(l.workspace, l.name).then(function (result) {
                $scope.ysldstyle = result.data;
              });
              $timeout(function () {
                $scope.editor.clearHistory();
                if ($scope.popoverElement) {
                  $scope.popoverElement.remove();
                }
                $scope.editor.clearGutter('markers');
              }, 250);
            }
          });
          $scope.toggleLayers = function () {
            $scope.showLayerList = !$scope.showLayerList;
          };
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.maps.layerremove', []).controller('MapRemoveLayerCtrl', [
  'map',
  'layer',
  '$scope',
  '$modalInstance',
  function (map, layer, $scope, $modalInstance) {
    $scope.layer = layer;
    $scope.map = map;
    $scope.cancel = function () {
      $modalInstance.close('close');
    };
    $scope.remove = function () {
      $modalInstance.close('remove');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 *
 * olmap.js, olmap.less, olmap.tpl.html
 *
 * Composer map viewer. Includes an OL3 Map view with dynamic response to map, layer, and style changes
 */
angular.module('gsApp.editor.olmap', []).factory('MapFactory', [
  '$log',
  '$rootScope',
  '$timeout',
  'AppEvent',
  'GeoServer',
  function ($log, $rootScope, $timeout, AppEvent, GeoServer) {
    function OLMap(mapOpts, element, options) {
      var self = this;
      this.mapOpts = mapOpts;
      // for ol3 request timeout
      var renderTimeout = mapOpts.renderTimeout || 3000;
      // for GeoServer request timeout (partial)
      self.timeout = mapOpts.timeout || 120;
      var progress = mapOpts.progress || function () {
        };
      var error = mapOpts.error || function () {
        };
      var xhr, timer;
      var layerNames = this.visibleLayerNames().reverse().join(',');
      var mapLayer = new ol.layer.Image({
          source: new ol.source.ImageWMS({
            url: GeoServer.baseUrl() + '/' + mapOpts.workspace + '/wms',
            params: {
              'LAYERS': layerNames,
              'VERSION': '1.1.1',
              'EXCEPTIONS': 'application/vnd.gs.wms_partial',
              'FORMAT': 'image/png'
            },
            serverType: 'geoserver',
            imageLoadFunction: function (image, src) {
              //FIXME Instead of this src hack, set FORMAT_OPTIONS:timeout in
              // PARAMS when we upgrade to Openlayers >= 3.5.0
              if (src.indexOf('FORMAT_OPTIONS=') > 0) {
                src = src.replace('FORMAT_OPTIONS=', 'FORMAT_OPTIONS=timeout:' + self.timeout * 1000 + ';');
              } else {
                src += '&FORMAT_OPTIONS=timeout:' + self.timeout * 1000;
              }
              progress('start');
              var img = image.getImage();
              var loaded = false;
              if (timer) {
                window.clearTimeout(timer);
              }
              timer = window.setTimeout(function () {
                if (!loaded) {
                  error('Delays are occuring in rendering the map.\n\n' + 'RECOMMENDATIONS:\n\n- Zoom in\n\n- If there are multiple ' + 'layers, turn off (uncheck) some layers ' + 'to see the map.\n\n- Create a style that limits features ' + 'displayed at this zoom level/resolution.\n\n' + '- If the map still never renders, its projection or ' + 'extent may be incorrect.\n\n' + 'The Composer map rendering timeout for GeoServer can be ' + 'set in Map Settings (gear icon, upper right).');
                }
              }, renderTimeout);
              if (typeof window.btoa == 'function') {
                if (xhr) {
                  xhr.abort();
                }
                xhr = new XMLHttpRequest();
                xhr.open('GET', src, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                  loaded = true;
                  if (this.status == 200) {
                    var uInt8Array = new Uint8Array(this.response);
                    var i = uInt8Array.length;
                    var binaryString = new Array(i);
                    while (i--) {
                      binaryString[i] = String.fromCharCode(uInt8Array[i]);
                    }
                    var data = binaryString.join('');
                    var type = xhr.getResponseHeader('content-type');
                    if (type.indexOf('image') === 0) {
                      //Image or partial image
                      img.src = 'data:' + type + ';base64,' + window.btoa(data);
                    } else {
                      //XML exception; parse out text data
                      var xml = $.parseXML(data);
                      var err = { exceptions: [] };
                      var parseXMLErr = function (element) {
                        for (var i = 0; i < element.childNodes.length; i++) {
                          var child = element.childNodes[i];
                          if (child.nodeName == '#text') {
                            if (child.data.trim() != '') {
                              err.exceptions.push({ text: child.data });
                            }
                          } else {
                            parseXMLErr(child);
                          }
                        }
                      };
                      parseXMLErr(xml);
                      error(err);
                    }
                  } else {
                    error(this.statusText);
                  }
                  progress('end');
                };
                xhr.send();
              } else {
                img.onload = function () {
                  loaded = true;
                  progress('end');
                };
                img.onerror = function () {
                  loaded = true;
                  progress('end');
                  error();
                };
                img.src = src;
              }
            }
          })
        });
      // determine projection from first layer
      var p = mapOpts.proj, prjExt = mapOpts.projectionExtent;
      var proj;
      try {
        proj4.defs(p.srs, p.wkt);
        proj = ol.proj.get(p.srs);
        if (!proj.getExtent() && prjExt) {
          proj.setExtent([
            prjExt.west,
            prjExt.south,
            prjExt.east,
            prjExt.north
          ]);
        }
      } catch (e) {
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Error rendering map with projection: ' + e,
            details: e.message,
            fadeout: true
          }];
      }
      // initial extent
      var bbox = mapOpts.bbox;
      var extent = [
          bbox.west,
          bbox.south,
          bbox.east,
          bbox.north
        ];
      // scale control
      var scaleControl = $('<div>').addClass('ol-scale ol-control ol-unselectable').prop('title', 'Copy scale denominator')[0];
      new ZeroClipboard(scaleControl).on('copy', function (event) {
        var clipboard = event.clipboardData;
        clipboard.setData('text/plain', $(scaleControl).text().split(' : ')[1]);
      });
      // zoom to extent control
      var extentControl = $('<div>').addClass('ol-zoom')[0];
      // copy bounds control
      // tooltip for bounds button
      // OL Tooltips not possible:
      // https://github.com/zeroclipboard/zeroclipboard/issues/369
      var boundsTipTimer = null;
      var tip = $('<span>').addClass('b-tooltip').html('Copy bounds')[0];
      var copiedTip = $('<span>').addClass('b-tooltip').html('Bounds copied to clipboard ')[0];
      var currentTip;
      var boundsTip = function (el, copied) {
        var tipType = copied ? copiedTip : tip;
        if (copied) {
          el.parentNode.removeChild(currentTip);
          boundsTipTimer = null;
        }
        if (boundsTipTimer === null) {
          el.parentNode.appendChild(tipType);
          currentTip = tipType;
          boundsTipTimer = $timeout(function () {
            if (tipType.parentNode == el.parentNode) {
              el.parentNode.removeChild(tipType);
            }
            boundsTipTimer = null;
          }, 900);
        }
      };
      var boundsButton = $('<button>').mouseover(function (e) {
          boundsTip(this);
        }).click(function (e) {
          boundsTip(this, true);
        });
      var boundsControl = $('<div>').addClass('ol-bounds ol-unselectable ol-control').append(boundsButton)[0];
      ol.control.Control.call(this, { element: boundsControl });
      ol.inherits(boundsControl, ol.control.Control);
      new ZeroClipboard(boundsButton).on('copy', function (event) {
        var clipboard = event.clipboardData;
        var extent = self.olMap.getView().calculateExtent(map.getSize());
        clipboard.setData('text/plain', extent.toString());
      }).on('aftercopy', function (event) {
        $(boundsButton).click();
      });
      var ZoomLevelControl = function () {
        ol.control.Control.call(this, { element: $('<div>').addClass('ol-zoomlevel ol-unselectable ol-control').prop('title', 'Current zoom level')[0] });
      };
      ol.inherits(ZoomLevelControl, ol.control.Control);
      ZoomLevelControl.prototype.setMap = function (map) {
        map.on('postrender', function () {
          $(this.element).html('Z' + map.getView().getZoom());
        }, this);
        ol.control.Control.prototype.setMap.call(this, map);
      };
      // Mouse lonlat control
      var mousePositionControl = $('<div>').addClass('ol-mouse-position ol-control ol-unselectable').prop('title', 'Current lonlat of mouse')[0];
      ol.control.Control.call(this, { element: mousePositionControl });
      ol.inherits(mousePositionControl, ol.control.MousePosition);
      var map = new ol.Map(angular.extend({
          target: element[0],
          view: new ol.View({
            center: bbox.center,
            projection: proj
          }),
          layers: [mapLayer],
          controls: new ol.control.defaults({ attribution: false }).extend([
            new ol.control.Control({ element: scaleControl }),
            new ol.control.ZoomToExtent({
              element: extentControl,
              extent: extent
            }),
            new ol.control.Control({ element: boundsControl }),
            new ZoomLevelControl(),
            new ol.control.MousePosition({
              className: 'ol-mouse-position ol-control ol-unselectable',
              projection: proj,
              coordinateFormat: ol.coordinate.createStringXY(6)
            })
          ])
        }, options || {}));
      map.getView().on('change:resolution', function (evt) {
        var res = evt.target.getResolution();
        var units = map.getView().getProjection().getUnits();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var scale = Math.round(res * mpu * 39.37 * dpi);
        scaleControl.innerHTML = '1 : ' + scale;
      });
      map.getView().fit(extent, map.getSize());
      this.olMap = map;
      // Update map 550 ms after sidebar is resized
      var mapsizeTimer = null;
      $rootScope.$on(AppEvent.SidenavResized, function () {
        if (mapsizeTimer === null) {
          mapsizeTimer = $timeout(function () {
            self.olMap.updateSize();
            mapsizeTimer = null;
          }, 450);
        }
      });
      $rootScope.$on(AppEvent.ToggleFullscreen, function () {
        if (mapsizeTimer === null) {
          mapsizeTimer = $timeout(function () {
            self.olMap.updateSize();
            mapsizeTimer = null;
          }, 50);
        }
      });
      if (typeof Storage !== 'undefined') {
        var savedExtent = null;
        try {
          //map
          if (mapOpts.name) {
            savedExtent = JSON.parse('[' + localStorage.getItem('bounds.maps.' + mapOpts.workspace + '.' + mapOpts.name) + ']');  //layer
          } else {
            savedExtent = JSON.parse('[' + localStorage.getItem('bounds.layers.' + mapOpts.workspace + '.' + mapOpts.layers[0].name) + ']');
          }
          if (savedExtent && !isNaN(savedExtent[0]) && !isNaN(savedExtent[1]) && !isNaN(savedExtent[2]) && !isNaN(savedExtent[3])) {
            map.getView().fit(savedExtent, map.getSize());
          }
          //Fix for SUITE-1031 - wait until the map loads before registering this listener
          $timeout(function () {
            map.on('moveend', function (evt) {
              var map = evt.map;
              var extent = map.getView().calculateExtent(map.getSize());
              if (mapOpts.name) {
                localStorage.setItem('bounds.maps.' + mapOpts.workspace + '.' + mapOpts.name, extent);
              } else {
                localStorage.setItem('bounds.layers.' + mapOpts.workspace + '.' + mapOpts.layers[0].name, extent);
              }
            });
          }, 100);
        } catch (e) {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Error saving view bounds',
              details: e.message,
              fadeout: true
            }];
        }
      }
      if (mapOpts.featureInfo) {
        map.on('singleclick', function (evt) {
          if (mapOpts.activeLayer) {
            var view = map.getView();
            var gfi = mapLayer.getSource().getGetFeatureInfoUrl(evt.coordinate, view.getResolution(), view.getProjection(), {
                'INFO_FORMAT': 'application/json',
                'FEATURE_COUNT': 50,
                'QUERY_LAYERS': mapOpts.activeLayer.name
              });
            $.ajax(gfi).then(function (response) {
              if (response && response.features && response.features.length) {
                mapOpts.featureInfo(response.features);
              }
            });
          }
        });
      }
    }
    OLMap.prototype.getNumLayers = function () {
      return this.mapOpts.layers.length;
    };
    OLMap.prototype.visibleLayerNames = function () {
      return this.mapOpts.layers.filter(function (l) {
        return l.visible == true;
      }).map(function (l) {
        return l.name;
      });
    };
    OLMap.prototype.update = function () {
      var visibleLayerNames = this.visibleLayerNames();
      var layerNames = visibleLayerNames.reverse().join(',');
      var numMapLayers = this.olMap.getLayers().getLength();
      var layer;
      if (numMapLayers > 1) {
        // basemap exists at 0
        layer = this.olMap.getLayers().item(1);
      } else {
        layer = this.olMap.getLayers().item(0);
      }
      var visible = visibleLayerNames.length > 0;
      layer.setVisible(visible);
      if (visible) {
        layer.getSource().updateParams({ LAYERS: layerNames });
      }
    };
    OLMap.prototype.updateTimeout = function (val) {
      this.timeout = val;
    };
    OLMap.prototype.hideBasemap = function () {
      // if null, remove any existing basemap
      if (this.mapOpts.basemap == null) {
        var mapLayers = this.olMap.getLayers();
        if (mapLayers.getLength() > 1) {
          mapLayers.removeAt(0);
        }
      }
    };
    OLMap.prototype.addBasemap = function () {
      var basemap = this.mapOpts.basemap;
      var bLayer;
      var mapLayers = this.olMap.getLayers();
      try {
        if (basemap.type == 'tilewms') {
          if (!basemap.url && !basemap.layer) {
            throw new Error('URL and Layer required.' + ' Please enter them.');
          }
          if (!basemap.serverType) {
            throw new Error('ServerType is required. Please enter one.');
          }
          // TiledwMS or ImageWMS?
          if (basemap.tiledwms) {
            bLayer = new ol.layer.Tile({ group: 'background' });
            bLayer.setSource(new ol.source.TileWMS({
              url: basemap.url,
              serverType: basemap.serverType,
              params: {
                'LAYERS': basemap.layer,
                'VERSION': basemap.version,
                'TILED': basemap.tiled,
                'FORMAT': basemap.format
              },
              crossOrigin: 'anonymous'
            }));
          } else {
            //imageWMS
            bLayer = new ol.layer.Image({ group: 'background' });
            bLayer.setSource(new ol.source.ImageWMS({
              url: basemap.url,
              serverType: basemap.serverType,
              params: {
                'LAYERS': basemap.layer,
                'VERSION': basemap.version,
                'FORMAT': basemap.format
              },
              crossOrigin: 'anonymous'
            }));
          }
        } else if (basemap.type == 'osm') {
          bLayer = new ol.layer.Tile({ group: 'background' });
          bLayer.setSource(new ol.source.OSM({
            'projection': 'EPSG:3857',
            crossOrigin: 'anonymous'
          }));
        } else if (basemap.type == 'stamen') {
          bLayer = new ol.layer.Tile({ group: 'background' });
          bLayer.setSource(new ol.source.Stamen({
            'projection': 'EPSG:3857',
            crossOrigin: 'anonymous',
            layer: 'toner-lite'
          }));
        } else if (basemap.type == 'mapbox') {
          if (!basemap.key && !basemap.mapid) {
            throw new Error('Map ID and Access Token required.' + ' Please enter them.');
          }
          bLayer = new ol.layer.Tile({ group: 'background' });
          bLayer.setSource(new ol.source.XYZ({
            'projection': 'EPSG:3857',
            url: basemap.url,
            crossOrigin: 'anonymous'
          }));
        } else if (basemap.type == 'bing') {
          if (!basemap.key) {
            throw new Error('Bing Maps requires an API key.' + ' Please enter one.');
          }
          bLayer = new ol.layer.Tile({ group: 'background' });
          bLayer.setSource(new ol.source.BingMaps({
            key: basemap.key,
            'projection': 'EPSG:3857',
            imagerySet: basemap.style,
            crossOrigin: 'anonymous'
          }));
        } else if (basemap.type == 'esri') {
          if (!basemap.url) {
            throw new Error('URL required. Please enter one.');
          }
          bLayer = new ol.layer.Tile({ group: 'background' });
          bLayer.setSource(new ol.source.XYZ({
            url: basemap.url,
            crossOrigin: 'anonymous'
          }));
        }
      } catch (e) {
        var error = e;
        if (!error) {
          error = new Error('Error loading basemap.');
        }
        $rootScope.alerts = [{
            type: 'danger',
            message: error.message,
            fadeout: true
          }];
        return;
      }
      if (bLayer) {
        // if creating a layer successful then remove
        // any current basemap then add requested one
        if (mapLayers.getLength() > 1) {
          mapLayers.removeAt(0);
        }
        mapLayers.insertAt(0, bLayer);
      } else {
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Basemap not loaded',
            fadeout: true
          }];
      }
    };
    OLMap.prototype.refresh = function () {
      this.olMap.getLayers().getArray().forEach(function (l) {
        var source = l.getSource();
        if (source instanceof ol.source.ImageWMS) {
          source.updateParams({ update: Math.random() });
        }
      });
    };
    return {
      createMap: function (mapOpts, element, options) {
        return new OLMap(mapOpts, element, options);
      }
    };
  }
]).directive('olMap', [
  '$log',
  '$timeout',
  '$window',
  'AppEvent',
  'GeoServer',
  'MapFactory',
  function ($log, $timeout, $window, AppEvent, GeoServer, MapFactory) {
    return {
      restrict: 'EA',
      templateUrl: '/components/editor/olmap/olmap.tpl.html',
      controller: function ($scope, $element) {
        /** WARNING: Editor scope variables **/
        /* The $scope of the editor pages is shared between editor.map / editor.layer, 
           * olmap, layerlist, and styleeditor. As such, care must be taken when adding
           * or modifying these scope variables.
           * See app/components/editor/README.md for more details.
           */
        $scope.olMap = null;
        $scope.hideCtrl = {
          'all': false,
          'lonlat': false
        };
        $scope.mapError = false;
        var timer = null;
        $scope.refreshMap = function () {
          $scope.olMap.refresh();
        };
        $scope.fitToBounds = function (bounds) {
          var map = $scope.olMap.olMap;
          var extent = ol.proj.transformExtent([
              bounds.west,
              bounds.south,
              bounds.east,
              bounds.north
            ], 'EPSG:4326', map.getView().getProjection());
          if (!isNaN(extent[0]) && !isNaN(extent[1]) && !isNaN(extent[2]) && !isNaN(extent[3])) {
            map.getView().fit(extent, map.getSize());
          }
        };
        //Verify map is created correctly and update the ui flag
        $scope.validateMap = function () {
          var map = $scope.olMap.olMap;
          var extent = map.getView().calculateExtent(map.getSize());
          if (!map.getView() || isNaN(map.getView().getResolution()) || isNaN(extent[0]) || isNaN(extent[1]) || isNaN(extent[2]) || isNaN(extent[3])) {
            $scope.mapError = true;
          } else {
            $scope.mapError = false;
            var canvas = $('canvas.ol-unselectable')[0];
            canvas.style.display = '';
            //refresh the canvas
            $timeout(function () {
              map.updateSize();
            }, 100);
          }
          return !$scope.mapError;
        };
        $scope.$watch('mapOpts.layers', function (newVal, oldVal) {
          if (newVal == null) {
            return;
          }
          if (!$scope.olMap) {
            $scope.olMap = MapFactory.createMap($scope.mapOpts, $element);
            $scope.validateMap();
          } else {
            if (timer) {
              $timeout.cancel(timer);
            }
            timer = $timeout(function () {
              $scope.olMap.update();
              timer = null;
            }, 750);
          }
        }, true);
        $scope.$watch('mapOpts.bounds', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            $scope.fitToBounds(newVal.bbox.lonlat);
          }
        });
        $scope.$watch('mapOpts.timeout', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            $scope.olMap.updateTimeout(newVal);
          }
        });
        $scope.$watch('mapOpts.basemap', function (newVal) {
          if (!$scope.olMap) {
            return;
          }
          if (newVal == null) {
            $scope.olMap.hideBasemap();
            return;
          }
          if (timer) {
            $timeout.cancel(timer);
          }
          timer = $timeout(function () {
            $scope.olMap.addBasemap();
            timer = null;
          }, 500);
        }, true);
        $scope.$watch('mapOpts.proj', function (newVal, oldVal) {
          if (newVal && oldVal && newVal != oldVal) {
            //Reset any stored extent
            if (typeof Storage !== 'undefined') {
              if ($scope.mapOpts.name) {
                localStorage.setItem('bounds.maps.' + $scope.mapOpts.workspace + '.' + $scope.mapOpts.name, null);
              } else {
                localStorage.setItem('bounds.layers.' + $scope.mapOpts.workspace + '.' + $scope.mapOpts.layers[0].name, null);
              }
            }
            //Need to re-create the map if the projection changes
            //Delete the current map element, else new one will be appended offscreen
            $scope.olMap.olMap.getViewport().remove();
            $scope.olMap = MapFactory.createMap($scope.mapOpts, $element);
            $scope.olMap.refresh();
            $timeout($scope.validateMap, 100);
            $timeout(function () {
              $scope.fitToBounds($scope.mapOpts.bbox);
            }, 500);
          }
        });
        $scope.$watch('basemap', function (newVal) {
          if (newVal != null && $scope.mapOpts) {
            $scope.mapOpts.basemap = newVal;
          } else if (newVal == null && $scope.mapOpts) {
            $scope.mapOpts.basemap = null;
          }
        });
        $scope.$on(AppEvent.MapControls, function (scope, ctrl) {
          var val = $scope.hideCtrl[ctrl];
          if (ctrl && val !== undefined) {
            $scope.hideCtrl[ctrl] = !val;
          }
        });
        $scope.$on(AppEvent.EditorBackground, function (scope, color) {
          $scope.mapBackground = { 'background': color };
        });
        $scope.$on(AppEvent.BaseMapChanged, function (scope, basemap) {
          if ($scope.mapOpts) {
            $scope.mapOpts.basemap = basemap;
          }
        });
      }
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 *
 * styleeditor.js, styleeditor.less, styleeditor.tpl.html
 * 
 * YSLD editor for composer. Included a complete CodeMirror editor, plus Save/Undo/Discard functions, 
 * error markers, and keyboard shortcuts.
 * YSLD Hinter functionality in ysldhinter.js
 */
/*global CodeMirror */
angular.module('gsApp.editor.styleeditor', [
  'ui.codemirror',
  'gsApp.editor.styleeditor.ysldhinter',
  'gsApp.editor.tools.save',
  'gsApp.editor.tools.undo',
  'gsApp.editor.tools.layers',
  'gsApp.editor.tools.color',
  'gsApp.editor.tools.icons',
  'gsApp.editor.tools.attributes',
  'gsApp.editor.tools.display',
  'gsApp.editor.tools.sld',
  'gsApp.editor.tools.fullscreen'
]).directive('styleEditor', [
  '$compile',
  '$document',
  '$log',
  '$modal',
  '$rootScope',
  '$sanitize',
  '$sce',
  '$state',
  '$timeout',
  'GeoServer',
  'YsldColors',
  'YsldHinter',
  function ($compile, $document, $log, $modal, $rootScope, $sanitize, $sce, $state, $timeout, GeoServer, YsldColors, YsldHinter) {
    return {
      restrict: 'EA',
      templateUrl: '/components/editor/styleeditor/styleeditor.tpl.html',
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          /** WARNING: Editor scope variables **/
          /* The $scope of the editor pages is shared between editor.map / editor.layer, 
           * olmap, layerlist, and styleeditor. As such, care must be taken when adding
           * or modifying these scope variables.
           * See app/components/editor/README.md for more details.
           */
          $scope.editor = null;
          $scope.generation = null;
          $scope.markers = null;
          $scope.popoverElement = null;
          //Make this available to palette.js (external to angular)
          window.YsldColors = YsldColors;
          $scope.saveStyle = function () {
            var content = $scope.editor.getValue();
            var wsName = $scope.workspace;
            var layerName = $scope.layer.name;
            return GeoServer.style.put(wsName, layerName, content).then(function (result) {
              if (result.success == true) {
                $scope.markers = null;
                $rootScope.alerts = [{
                    type: 'success',
                    message: 'Style saved for layer: ' + layerName,
                    fadeout: true
                  }];
                $scope.refreshMap();
                return GeoServer.layer.get(wsName, layerName).then(function (result) {
                  if (result.success) {
                    $scope.layer.style = result.data.style;
                    $scope.generation = $scope.editor.changeGeneration();
                  } else {
                    $rootScope.alerts = [{
                        type: 'warning',
                        message: 'Error getting layer details: ' + $l.name,
                        fadeout: true
                      }];
                  }
                });
              } else if (result.status == 400) {
                // validation error
                $scope.markers = result.data.errors;
                $rootScope.alerts = [{
                    type: 'danger',
                    message: 'Style not saved due to validation error'
                  }];
              } else {
                $rootScope.alerts = [{
                    type: 'danger',
                    message: 'Error occurred saving style: ' + result.data.message,
                    details: result.data.trace
                  }];
              }
            });
          };
          $scope.discardChanges = function () {
            //Undo all of the changes made to the editor.
            //TODO: Make sure this doesn't revert saves
            for (var i = $scope.generation; i >= 0; i--) {
              $scope.editor.undo();
            }
            //If you don't explicitly set the value of the editor to the
            //current value, the content reverts back to the last typed
            //entry rather than discarding all of the changes.
            $scope.editor.setValue($scope.editor.getValue());
            $rootScope.alerts = [{
                type: 'success',
                message: 'Editor changes have been discarded.',
                fadeout: true
              }];
          };
          $scope.editorSave = function (nextWindowType, state, args) {
            $modal.open({
              templateUrl: '/components/editor/editor.modal.save.tpl.html',
              controller: [
                'linterIsvalid',
                '$scope',
                '$modalInstance',
                function (linterIsvalid, $scope, $modalInstance) {
                  $scope.linterIsvalid = linterIsvalid;
                  $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                  };
                  $scope.saveChanges = function () {
                    $modalInstance.close('save');
                  };
                  $scope.discardChanges = function () {
                    $modalInstance.close('discard');
                  };
                }
              ],
              backdrop: 'static',
              size: 'med',
              resolve: {
                linterIsvalid: function () {
                  return !$scope.markers || $scope.markers.length < 0;
                }
              }
            }).result.then(function (result) {
              var nextWindow = function () {
                if (nextWindowType == 'layer') {
                  $scope.selectLayer($scope.goToLayer);
                } else {
                  $state.go(state, args);
                }
              };
              if (result == 'save') {
                $scope.saveStyle().then(nextWindow);
              } else {
                $scope.discardChanges();
                nextWindow();
              }
            });
          };
          $scope.$on('$stateChangeStart', function (event, state, args) {
            if (!$scope.editor.isClean($scope.generation)) {
              event.preventDefault();
              $scope.editorSave('state', state, args);
            }
          });
          $scope.onCodeMirrorLoad = function (editor) {
            $scope.editor = editor;
            editor.on('change', function (cm, change) {
              if (change.origin == 'setValue') {
                $timeout(function () {
                  cm.clearHistory();
                }, 0);
                $scope.generation = cm.changeGeneration();
              }
            });
            //Use custom events for all Cmd/Ctrl key events to override default functionality and enable OS X compatibility
            editor.on('keydown', function (cm, change) {
              if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? change.metaKey : change.ctrlKey) {
                //Hint: Ctrl/Cmd Enter
                if (change.keyCode == 13) {
                  change.preventDefault();
                  cm.showHint({
                    hint: function (cm, options) {
                      return YsldHinter.hints(cm, angular.extend(options, { layer: $scope.layer }));
                    }
                  });  //Fold: Ctrl/Cmd <
                } else if (change.keyCode == 188) {
                  change.preventDefault();
                  var pos = {
                      line: cm.getCursor().line,
                      ch: cm.getLine(cm.getCursor().line).length
                    };
                  //get end of first unfolded line
                  while (pos.line > 0 && cm.isFolded(pos)) {
                    pos = {
                      line: pos.line - 1,
                      ch: cm.getLine(pos.line - 1).length
                    };
                  }
                  cm.foldCode(pos, {
                    rangeFinder: CodeMirror.fold.indent,
                    scanUp: true
                  }, 'fold');  //Unfold: Ctrl/Cmd >
                } else if (change.keyCode == 190) {
                  change.preventDefault();
                  var pos = {
                      line: cm.getCursor().line,
                      ch: 0
                    };
                  //get beginning of first unfolded line
                  while (pos.line > 0 && cm.isFolded(pos)) {
                    pos = {
                      line: pos.line - 1,
                      ch: 0
                    };
                  }
                  cm.foldCode(pos, {
                    rangeFinder: CodeMirror.fold.indent,
                    scanUp: true
                  }, 'unfold');  //Comment: 3/#
                } else if (change.keyCode == 51) {
                  change.preventDefault();
                  var cur = cm.getCursor();
                  var line = cm.getLine(cur.line);
                  //Comment lines; otherwise uncomment lines
                  if (line.search(/^\s*#/) == -1) {
                    var comment = true;
                  }
                  var ranges = cm.listSelections();
                  for (var i = 0; i < ranges.length; i++) {
                    var range = ranges[i];
                    var start = range.head.line > range.anchor.line ? range.anchor.line : range.head.line;
                    var end = range.head.line > range.anchor.line ? range.head.line : range.anchor.line;
                    for (var j = start; j <= end; j++) {
                      line = cm.getLine(j);
                      var length = line.length;
                      line = line.replace(/^(\s*)(#)/, '$1');
                      if (comment) {
                        line = '#' + line;
                      }
                      cm.replaceRange(line, {
                        ch: 0,
                        line: j
                      }, {
                        ch: length,
                        line: j
                      });
                    }
                  }
                }
              }
            });
          };
          $scope.codeMirrorOpts = {
            lineWrapping: true,
            lineNumbers: true,
            styleActiveLine: true,
            mode: 'yaml',
            paletteHints: true,
            foldGutter: true,
            gutters: [
              'markers',
              'CodeMirror-foldgutter'
            ],
            extraKeys: {
              'Tab': function (cm) {
                if (cm.somethingSelected()) {
                  var sel = cm.getSelection('\n');
                  var cur = cm.getCursor();
                  // Indent only if there are multiple lines selected,
                  // or if the selection spans a full line
                  if (sel.length > 0 && (sel.indexOf('\n') > -1 || sel.length === cm.getLine(cur.line).length)) {
                    cm.indentSelection('add');
                    return;
                  }
                }
                if (cm.options.indentWithTabs) {
                  cm.execCommand('insertTab');
                } else {
                  cm.execCommand('insertSoftTab');
                }
              },
              'Shift-Tab': function (cm) {
                cm.indentSelection('subtract');
              }  // 'Tab': function(cm) {
                 //   // replace tabs with spaces
                 //   var spaces =
                 //     new Array(cm.getOption('indentUnit') + 1).join(' ');
                 //   cm.replaceSelection(spaces);
                 // }
            },
            tabMode: 'spaces'
          };
          $scope.setPopup = function () {
            //Wait a little bit before setting the popover element. We need to
            //ensure that it exists so we can remove it later on if necessary.
            //If we don't explicitly remove it then the popover will remain on
            //the new code mirror window.
            $timeout(function () {
              $scope.popoverElement = angular.element($document[0].querySelectorAll('.popover'));
              //Put the popovers below any modals:
              for (var i = 0; i < $scope.popoverElement.length; i++) {
                $scope.popoverElement[i].style['z-index'] = 1040;
              }
            }, 250);
          };
          $scope.$watch('markers', function (newVal) {
            //Clear popovers
            if ($scope.popoverElement) {
              $scope.popoverElement.remove();
            }
            $scope.editor.clearGutter('markers');
            if (newVal != null) {
              newVal.forEach(function (mark) {
                var html = '<a class="icon-warning" ' + 'popover="' + $sce.trustAsHtml($sanitize(mark.problem)) + '" ' + 'popover-placement="left" ' + 'popover-append-to-body="true"' + 'title="Click to toggle the error message on/off." ' + 'alt="Click to toggle the error message on/off."' + 'ng-click="setPopup()"></a>';
                var marker = $compile(html)($scope)[0];
                $scope.editor.setGutterMarker(mark.line, 'markers', marker);
              });
            }
          });
        }
      ]
    };
  }
]).run([
  '$log',
  function ($log) {
    CodeMirror.prototype.insertOrReplace = function (value) {
      if (this.somethingSelected()) {
        // replace the selection
        this.replaceSelection(value, 'around');
      } else {
        // insert
        this.replaceRange(value, this.getCursor());
      }
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.editor.styleeditor.ysldhinter', []).factory('YsldHinter', [
  '$log',
  'YsldColors',
  'GeoServer',
  function ($log, YsldColors, GeoServer) {
    var YsldHinter = function () {
      var self = this;
      //Escape strings in regexes
      var escapeForRegExp = function (s) {
        return s.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
      };
      var completion = function (text, partial) {
        if (partial && partial.length > 0) {
          return text.replace(new RegExp('^' + escapeForRegExp(partial)), '');
        }
        return text;
      };
      var hint = function (display, text, partial) {
        if (partial) {
          text = completion(text, partial);
        }
        return {
          displayText: display,
          text: text
        };
      };
      this.hint = hint;
      var scalar = function (name, state, cm) {
        return hint(name, name + ': ', state.line.key);
      };
      var tuple = scalar;
      var vardef = function (name, state, cm) {
        return hint(name, name + ': &', state.line.key);
      };
      var varval = function (name, state, cm) {
        return hint(name, name + ': *', state.line.key);
      };
      var mapping = function (name, state, cm) {
        var indent = cm.getOption('indentUnit');
        if (state.indent > -1) {
          indent = indent + state.indent;
        } else if (state.parent.indent != 0 || state.parent.line.key != '') {
          indent = indent + state.parent.indent + cm.getOption('indentUnit');
        }
        return hint(name, name + ':\n' + new Array(indent + 1).join(' '), state.line.key);
      };
      var sequence = function (name, state, cm) {
        var pos = cm.getCursor();
        var indent = pos.ch;
        return hint(name, name + ':\n' + new Array(indent + 1).join(' ') + '- ', state.line.key);
      };
      //Constructs a function to display a hint/template for a value
      //Can take any number of hint templates as arguments. Any parts enclosed in <> 
      //are treated as user data. The dialog will display this data in light gray, 
      //and will not insert anything for these parts during autocomplete
      var hintTemplate = function () {
        var hints = [];
        for (var i = 0; i < arguments.length; i++) {
          hints[i] = {
            hint: arguments[i],
            tokens: arguments[i].split(/<[\w\s]*>/g).filter(function (val) {
              return val.length > 0;
            })
          };
        }
        return function (state, cm) {
          var values = [];
          for (var i = 0; i < hints.length; i++) {
            var hint = hints[i]['hint'];
            var tokens = hints[i]['tokens'];
            var display = hint.replace(/</g, '&lt');
            display = display.replace(/>/g, '&gt');
            display = display.replace(/&lt/g, '<font style="color:silver">&lt');
            display = display.replace(/&gt/g, '&gt</font>');
            var text = '';
            if (tokens && tokens.length > 0) {
              text = tokens[0];
              //If there is a partial value, iterate through it 
              //and determine what we should add, if anything
              if (state.line.val.length > 0) {
                text = '';
                if (state.line.val.indexOf(tokens[0] == 0) && state.line.val.length > tokens[0].length) {
                  var index = 0;
                  var lastIndex = 0;
                  for (var j = 1; j < tokens.length; j++) {
                    index = state.line.val.indexOf(tokens[j]);
                    //Current token exists
                    if (index > lastIndex) {
                      //If there is already a token at the end of
                      //val, don't add anything
                      if (index == state.line.val.length - 1) {
                        text = '';
                        break;
                      }
                      //keep looking
                      lastIndex = index;
                    } else {
                      //not found, use the current token
                      text = tokens[j];
                      break;
                    }
                  }
                }
              }
            }
            text = text.replace(/\n/, '\n' + Array(state.indent + 1).join(' '));
            values.push({
              displayText: display,
              text: text,
              render: function (Element, self, data) {
                Element.innerHTML = data.displayText;
                //Hide element selection for hints
                //Element.style.color='black';
                //Element.style.backgroundColor='transparent';
                Element.style['max-width'] = 'none';
              }
            });
          }
          if (values.length == 1) {
            values.push({
              text: values[0]['text'],
              render: function () {
              }
            });
          }
          return values;
        };
      };
      var hintNumber = hintTemplate('<number>');
      var hintText = hintTemplate('<text>');
      this.hintTemplate = hintTemplate;
      //Workaround to allow custom hints for mapping values
      var mappingHintTemplate = function (hint) {
        var hintFunction = hintTemplate(hint);
        return function (name, state, cm) {
          return hintFunction(state, cm);
        };
      };
      //Determines the behavior of key completion
      this.completions = {
        'define': vardef,
        '<<': varval,
        'grid': mapping,
        'name': scalar,
        'title': scalar,
        'abstract': scalar,
        'transform': mapping,
        'input': scalar,
        'feature-styles': sequence,
        'rules': sequence,
        'scale': tuple,
        'zoom': tuple,
        'filter': scalar,
        'else': scalar,
        'symbolizers': sequence,
        'point': mapping,
        'line': mapping,
        'polygon': mapping,
        'text': mapping,
        'raster': mapping,
        'graphic': mapping,
        'geometry': scalar,
        'uom': scalar,
        'symbols': sequence,
        'anchor': tuple,
        'displacement': tuple,
        'opacity': scalar,
        'rotation': scalar,
        'size': scalar,
        'gap': scalar,
        'initial-gap': scalar,
        'options': mapping,
        'offset': scalar,
        'stroke-color': scalar,
        'stroke-width': scalar,
        'stroke-opacity': scalar,
        'stroke-linejoin': scalar,
        'stroke-linecap': scalar,
        'stroke-dasharray': scalar,
        'stroke-dashoffset': scalar,
        'stroke-graphic-fill': mapping,
        'stroke-graphic': mapping,
        'fill-color': scalar,
        'fill-opacity': scalar,
        'fill-graphic': mapping,
        'label': scalar,
        'font-family': scalar,
        'font-size': scalar,
        'font-style': scalar,
        'font-weight': scalar,
        'priority': scalar,
        'placement': scalar,
        'color-map': mapping,
        'channels': mapping,
        'gray': scalar,
        'red': scalar,
        'green': scalar,
        'blue': scalar,
        'entries': sequence,
        'contrast-enhancement': mapping,
        'mode': scalar,
        'gamma': scalar,
        'mark': mapping,
        'shape': scalar,
        'external': mapping,
        'url': scalar,
        'format': scalar,
        'type': scalar,
        'halo': mapping,
        'radius': scalar,
        'params': mapping,
        'data': scalar,
        'radiusPixels': scalar,
        'weightAttr': scalar,
        'cellSize': scalar,
        'valueAttr': scalar,
        'dataLimit': scalar,
        'convergence': scalar,
        'passes': scalar,
        'minObservations': scalar,
        'maxObservationDistance': scalar,
        'noDataValue': scalar,
        'pixelsPerCell': scalar,
        'queryBuffer': scalar,
        'outputBBOX': scalar,
        'outputWidth': scalar,
        'outputHeight': scalar,
        'x-FirstMatch': scalar,
        'x-composite': scalar,
        'x-composite-base': scalar,
        'x-labelObstacle': scalar,
        'x-labelAllGroup': scalar,
        'x-labelPriority': scalar,
        'x-allowOverruns': scalar,
        'x-autoWrap': scalar,
        'x-conflictResolution': scalar,
        'x-followLine': scalar,
        'x-forceLeftToRight': scalar,
        'x-goodnessOfFit': scalar,
        'x-graphic-margin': scalar,
        'x-graphic-resize': scalar,
        'x-group': scalar,
        'x-repeat': scalar,
        'x-maxAngleDelta': scalar,
        'x-maxDisplacement': scalar,
        'x-minGroupDistance': scalar,
        'x-partials': scalar,
        'x-polygonAlign': scalar,
        'x-spaceAround': scalar,
        'x-random': scalar,
        'x-random-tile-size': scalar,
        'x-random-rotation': scalar,
        'x-random-symbol-count': scalar,
        'x-random-seed': scalar
      };
      //Mappings between parent and child keys
      this.mappings = {
        '': [
          'point',
          'line',
          'polygon',
          'raster',
          'symbolizers',
          'rules',
          'define',
          'grid',
          'name',
          'title',
          'abstract',
          'feature-styles'
        ],
        'feature-styles': [
          'name',
          'title',
          'abstract',
          'transform',
          'rules',
          'x-FirstMatch',
          'x-composite',
          'x-composite-base'
        ],
        'rules': [
          'name',
          'title',
          'scale',
          'zoom',
          'filter',
          'else',
          'symbolizers'
        ],
        'symbolizers': [
          'point',
          'line',
          'polygon',
          'text',
          'raster'
        ],
        'point': [
          'symbols',
          'anchor',
          'displacement',
          'opacity',
          'rotation',
          'size',
          'gap',
          'initial-gap',
          'options',
          'geometry',
          'uom',
          'x-composite',
          'x-composite-base',
          'x-labelObstacle'
        ],
        'line': [
          'stroke-color',
          'stroke-width',
          'stroke-opacity',
          'stroke-linejoin',
          'stroke-linecap',
          'stroke-dasharray',
          'stroke-dashoffset',
          'stroke-graphic-fill',
          'stroke-graphic',
          'offset',
          'geometry',
          'uom',
          'x-composite',
          'x-composite-base',
          'x-labelObstacle'
        ],
        'polygon': [
          'fill-color',
          'fill-opacity',
          'fill-graphic',
          'stroke-color',
          'stroke-width',
          'stroke-opacity',
          'stroke-linejoin',
          'stroke-linecap',
          'stroke-dasharray',
          'stroke-dashoffset',
          'stroke-graphic-fill',
          'stroke-graphic',
          'offset',
          'displacement',
          'geometry',
          'uom',
          'x-composite',
          'x-composite-base',
          'x-graphic-margin',
          'x-labelObstacle',
          'x-random',
          'x-random-tile-size',
          'x-random-rotation',
          'x-random-symbol-count',
          'x-random-seed'
        ],
        'text': [
          'label',
          'font-family',
          'font-size',
          'font-style',
          'font-weight',
          'fill-color',
          'fill-opacity',
          'fill-graphic',
          'stroke-graphic-fill',
          'stroke-graphic',
          'halo',
          'priority',
          'placement',
          'offset',
          'anchor',
          'displacement',
          'rotation',
          'graphic',
          'geometry',
          'uom',
          'x-allowOverruns',
          'x-autoWrap',
          'x-composite',
          'x-composite-base',
          'x-conflictResolution',
          'x-followLine',
          'x-forceLeftToRight',
          'x-goodnessOfFit',
          'x-graphic-margin',
          'x-graphic-resize',
          'x-group',
          'x-labelAllGroup',
          'x-labelPriority',
          'x-repeat',
          'x-maxAngleDelta',
          'x-maxDisplacement',
          'x-minGroupDistance',
          'x-partials',
          'x-polygonAlign',
          'x-spaceAround'
        ],
        'raster': [
          'color-map',
          'channels',
          'opacity',
          'contrast-enhancement',
          'options'
        ],
        'color-map': [
          'type',
          'entries'
        ],
        'channels': [
          'gray',
          'red',
          'green',
          'blue'
        ],
        'gray': [
          'name',
          'contrast-enhancement'
        ],
        'red': [
          'name',
          'contrast-enhancement'
        ],
        'green': [
          'name',
          'contrast-enhancement'
        ],
        'blue': [
          'name',
          'contrast-enhancement'
        ],
        'entries': [],
        'stroke-graphic-fill': [
          'symbols',
          'anchor',
          'displacement',
          'opacity',
          'rotation',
          'size',
          'gap',
          'initial-gap',
          'options'
        ],
        'contrast-enhancement': [
          'mode',
          'gamma'
        ],
        'graphic': [
          'symbols',
          'size',
          'opacity',
          'rotation'
        ],
        'stroke-graphic': [
          'symbols',
          'anchor',
          'displacement',
          'opacity',
          'rotation',
          'size',
          'gap',
          'initial-gap',
          'options'
        ],
        'fill-graphic': [
          'symbols',
          'anchor',
          'displacement',
          'opacity',
          'rotation',
          'size',
          'gap',
          'initial-gap',
          'options'
        ],
        'symbols': [
          'mark',
          'external'
        ],
        'mark': [
          'shape',
          'fill-color',
          'fill-opacity',
          'fill-graphic',
          'stroke-color',
          'stroke-width',
          'stroke-opacity',
          'stroke-linejoin',
          'stroke-linecap',
          'stroke-dasharray',
          'stroke-dashoffset',
          'stroke-graphic-fill',
          'stroke-graphic'
        ],
        'external': [
          'url',
          'format'
        ],
        'halo': [
          'fill-color',
          'fill-opacity',
          'fill-graphic',
          'radius'
        ],
        'grid': ['name'],
        'transform': [
          'name',
          'input',
          'params'
        ],
        'data': [
          'name',
          'input',
          'params'
        ],
        'params': [
          'outputBBOX',
          'outputWidth',
          'outputHeight'
        ]
      };
      //Completion function for attribute values
      var completeAttribute = function (state, cm) {
        var atts = state.options.layer.schema.attributes;
        // filter by current value
        var line = state.line;
        if (line.val && line.val.length > 0) {
          atts = atts.filter(function (att) {
            return att.name.indexOf(line.val) == 0;
          });
        }
        return atts.map(function (att) {
          //text = text.replace(new RegExp('^'+escapeForRegExp(state.line.key)), '');
          return {
            displayText: att.name,
            text: '${"' + att.name + '"}'
          };
        });
      };
      var bool = [
          'true',
          'false'
        ];
      var mappingValues = {
          'else': bool,
          'uom': [
            'pixel',
            'metre',
            'foot'
          ],
          'shape': [
            'square',
            'circle',
            'triangle',
            'cross',
            'x',
            'star'
          ],
          'stroke-linejoin': [
            'mitre',
            'round',
            'bevel'
          ],
          'stroke-linecap': [
            'butt',
            'round',
            'square'
          ],
          'format': [
            'image/gif',
            'image/jpeg',
            'image/png',
            'image/bmp',
            'image/svg+xml',
            'image/tiff'
          ],
          'font-style': [
            'normal',
            'italic',
            'oblique'
          ],
          'font-weight': [
            'normal',
            'bold'
          ],
          'placement': [
            'point',
            'line'
          ],
          'type': [
            'ramp',
            'intervals',
            'values'
          ],
          'mode': [
            'normalize',
            'histogram'
          ],
          'x-FirstMatch': bool,
          'x-composite': [
            'copy',
            'destination',
            'source-over',
            'destination-over',
            'source-in',
            'destination-in',
            'source-out',
            'destination-out',
            'source-atop',
            'destination-atop',
            'xor',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion'
          ],
          'x-composite-base': bool,
          'x-labelObstacle': bool,
          'x-allowOverruns': bool,
          'x-conflictResolution': bool,
          'x-followLine': bool,
          'x-forceLeftToRight': bool,
          'x-graphic-resize': [
            'none',
            'proportional',
            'stretch'
          ],
          'x-group': bool,
          'x-labelAllGroup': bool,
          'x-partials': bool,
          'x-polygonAlign': bool,
          'x-random': [
            'free',
            'grid'
          ],
          'x-random-rotation': [
            'none',
            'free'
          ]
        };
      var buildHints = function (state, cm, values) {
        var self = this;
        if (state.line.val.length > 0) {
          // filter out values based on content of line
          values = values.filter(function (value) {
            return value.indexOf(state.line.val) == 0;
          });
        }
        return values.map(function (value) {
          return hint(value, value, state.line.val);
        }).filter(function (value) {
          return value != null;
        });
      };
      this.buildHints = buildHints;
      var mappingValue = function (state, cm) {
        return buildHints(state, cm, mappingValues[state.line.key]);
      };
      var color = function (state, cm) {
        //Try text completion
        if (state.line.val.length > 0) {
          var hints = buildHints(state, cm, YsldColors.names);
          if (hints && hints.length > 0) {
            return hints;
          }
        }
        //If no completions, open the color picker
        var selection = cm.getSelection();
        //If nothing is selected, select val
        if (!selection && state.line.val.length > 0) {
          var cur = cm.getCursor();
          var line = cm.getCursor().line;
          var selstart = state.line.raw.indexOf(state.line.val);
          var selstop = selstart + state.line.val.length;
          cm.setSelection({
            line: line,
            ch: selstart
          }, {
            line: line,
            ch: selstop
          });
        }
        //Show the color dialog
        $('.styleeditor-color').click();
      };
      var icon = function (state, cm) {
        //Show the icon uploader
        //$('.styleeditor-icon').click();
        //Show the list of icons
        var icons = angular.element($('.styleeditor-icon')).scope().icons;
        var self = this;
        return icons.map(function (icon) {
          var text = icon.name;
          if (state.line.val.length > 0) {
            text = text.replace(new RegExp('^' + escapeForRegExp(state.line.val)), '');
          }
          return {
            displayText: icon.name,
            text: text
          };
        }).filter(function (icon) {
          return icon.displayText.indexOf(state.line.val) == 0;
        });
      };
      //TODO, blocked by SUITE-229
      var font = function (state, cm) {
        return hintTemplate('<font_name>')(state, cm);
      };
      //Controls the behaviour of value completions
      this.values = {
        'define': hintTemplate('&<var> <value>', '&<varblock>\n  <mappings>'),
        'name': hintText,
        'title': hintText,
        'abstract': hintText,
        'filter': hintTemplate('${<filter>}'),
        'else': mappingValue,
        'scale': hintTemplate('[<min>,<max>]'),
        'zoom': hintTemplate('[<min>,<max>]'),
        'label': completeAttribute,
        'priority': completeAttribute,
        'geometry': completeAttribute,
        'uom': mappingValue,
        'shape': mappingValue,
        'size': hintNumber,
        'anchor': hintTemplate('[<x>,<y>]'),
        'opacity': hintNumber,
        'rotation': hintNumber,
        'fill-color': color,
        'fill-opacity': hintNumber,
        'stroke-color': color,
        'stroke-width': hintNumber,
        'stroke-opacity': hintNumber,
        'stroke-linejoin': mappingValue,
        'stroke-linecap': mappingValue,
        'stroke-dasharray': hintTemplate('"<length> <gap>"'),
        'stroke-dashoffset': hintNumber,
        'offset': hintNumber,
        'displacement': hintTemplate('[<x>,<y>]'),
        'url': icon,
        'format': mappingValue,
        'font-family': font,
        'font-size': hintNumber,
        'font-style': mappingValue,
        'font-weight': mappingValue,
        'placement': mappingValue,
        'radius': hintNumber,
        'type': mappingValue,
        'mode': mappingValue,
        'gamma': hintNumber,
        'gray': hintTemplate('<channel_index>', '\n  <channel_options>'),
        'red': hintTemplate('<channel_index>', '\n  <channel_options>'),
        'green': hintTemplate('<channel_index>', '\n  <channel_options>'),
        'blue': hintTemplate('<channel_index>', '\n  <channel_options>'),
        'input': hintTemplate('<parameter>'),
        'x-FirstMatch': mappingValue,
        'x-composite': mappingValue,
        'x-composite-base': mappingValue,
        'x-labelObstacle': mappingValue,
        'x-allowOverruns': mappingValue,
        'x-autoWrap': hintNumber,
        'x-conflictResolution': mappingValue,
        'x-followLine': mappingValue,
        'x-forceLeftToRight': mappingValue,
        'x-goodnessOfFit': hintNumber,
        'x-graphic-margin': hintNumber,
        'x-graphic-resize': mappingValue,
        'x-group': mappingValue,
        'x-labelAllGroup': mappingValue,
        'x-labelPriority': hintNumber,
        'x-repeat': hintNumber,
        'x-maxAngleDelta': hintNumber,
        'x-maxDisplacement': hintNumber,
        'x-minGroupDistance': hintNumber,
        'x-partials': mappingValue,
        'x-polygonAlign': mappingValue,
        'x-spaceAround': hintNumber,
        'x-random': mappingValue,
        'x-random-tile-size': hintNumber,
        'x-random-rotation': mappingValue,
        'x-random-symbol-count': hintNumber,
        'x-random-seed': hintNumber,
        'data': completeAttribute,
        'radiusPixels': hintNumber,
        'weightAttr': completeAttribute,
        'cellSize': hintNumber,
        'valueAttr': completeAttribute,
        'dataLimit': hintNumber,
        'convergence': hintNumber,
        'passes': hintNumber,
        'minObservations': hintNumber,
        'maxObservationDistance': hintNumber,
        'noDataValue': hintNumber,
        'pixelsPerCell': hintNumber,
        'queryBuffer': hintNumber,
        'outputBBOX': hintTemplate('${<envelope>}'),
        'outputWidth': hintNumber,
        'outputHeight': hintNumber
      };
      //rendering transform defaults
      this.transform = {};
      this.transform.mappingValues = {
        'name': [
          'vec:Heatmap',
          'vec:PointStacker',
          'vec:BarnesSurface'
        ]
      };
      this.transform.params = {
        'vec:Heatmap': [
          'data',
          'radiusPixels',
          'weightAttr',
          'pixelsPerCell'
        ],
        'vec:PointStacker': [
          'data',
          'cellSize'
        ],
        'vec:BarnesSurface': [
          'valueAttr',
          'dataLimit',
          'scale',
          'convergence',
          'passes',
          'minObservations',
          'maxObservationDistance',
          'noDataValue',
          'pixelsPerCell',
          'queryBuffer'
        ]
      };
      var transformMapping = this.transform;
      var valuesMapping = this.values;
      // get rendering transforms from geoserver:
      var getRenderingTransforms = function () {
        GeoServer.serverInfo.renderingTransforms().then(function (result) {
          var names = [];
          for (var i = 0; i < result.data.length; i++) {
            //put name
            var transform = result.data[i];
            names.push(transform.name);
            var params = [];
            for (var param in transform.params) {
              params.push(param);
              //put to values
              var paramInfo = transform.params[param];
              var type = paramInfo.type;
              if (type.indexOf('com.vividsolutions.jts.geom') >= 0 || type.indexOf('org.geotools.feature') >= 0 || type.indexOf('org.geotools.data') >= 0) {
                mappingValues[param] = completeAttribute;
              } else if (type.indexOf('java.lang.Double') >= 0 || type.indexOf('java.lang.Integer') >= 0) {
                mappingValues[param] = hintNumber;
              } else if (type.indexOf('java.lang.Boolean') >= 0) {
                valuesMapping[param] = mappingValue;
                mappingValues[param] = bool;
              } else if (type.indexOf('java.lang.String') >= 0) {
                mappingValues[param] = hintText;
              } else if (type.indexOf('org.opengis.referencing.crs') >= 0) {
                valuesMapping[param] = hintTemplate('EPSG:<code>');
              } else {
                valuesMapping[param] = hintTemplate('<' + paramInfo.description + '>');
              }
            }
            //put param array
            transformMapping.params[transform.name] = params;
          }
          transformMapping.mappingValues['name'] = names;
        });
      };
      getRenderingTransforms();
      //gridsets
      this.gridsets = [];
      this.getGridsets = function () {
        GeoServer.gridsets.getAll().then(function (result) {
          if (result.success) {
            self.gridsets = result.data.map(function (entry) {
              return entry.name;
            }).filter(function (entry) {
              return entry != 'EPSG:4326' && entry != 'EPSG:3857';
            }).sort();
          }
        });
      };
      this.getGridsets();
    };
    YsldHinter.prototype.parseLine = function (line) {
      // preparse, remove sequence '-'
      var pre = line.replace(/^[ -]*/, '');
      // ignore any comments (but not color strings)
      pre = pre.replace(/ *#.*/g, function (match, offset) {
        if (offset > 0 && pre.indexOf('\'#') == offset - 1) {
          return match;
        }
        return '';
      });
      // split into key / value
      return {
        raw: line,
        key: pre.replace(/:.*/, ''),
        val: pre.replace(/[^:]*:/, '').trim()
      };
    };
    YsldHinter.prototype.indent = function (line) {
      for (var i = 0; i < line.length; i++) {
        if (line[i] != ' ' && line[i] != '-') {
          return i;
        }
      }
      return -1;
    };
    YsldHinter.prototype.findParent = function (cm) {
      var i = cm.getCursor().line;
      // var indent = cm.getCursor().ch;
      var indent = this.indent(cm.getLine(i));
      indent = indent > -1 ? indent : cm.getCursor().ch;
      while (i > 0) {
        i--;
        var line = this.parseLine(cm.getLine(i));
        if (this.indent(line.raw) < indent && line.key != '') {
          return line;
        }
      }
    };
    //Find variable definitions
    YsldHinter.prototype.findVariables = function (cm) {
      //Traverse the editor content for top-level elements
      //Indent should match that of first non-comment line -> just check all lines...
      var variables = [];
      for (var i = 0; i < cm.lineCount(); i++) {
        var line = this.parseLine(cm.getLine(i));
        if (line.key == 'define') {
          if (i + 1 < cm.lineCount() && this.indent(cm.getLine(i)) < this.indent(cm.getLine(i + 1))) {
            line.varblock = true;
          } else {
            //remove the variable definition from the value
            line.val = line.val.split(' ')[0];
          }
          variables.push(line);
        }
      }
      return variables;
    };
    //Find matching parameters for a rendering transform
    YsldHinter.prototype.findParams = function (state, cm) {
      var cur = cm.getCursor();
      if (state.parent.line.key == 'params') {
        var indent = this.indent(state.parent.line.raw);
        var currentIndent;
        //search up
        for (var i = cur.line - 1; i >= 0; i--) {
          currentIndent = this.indent(cm.getLine(i));
          if (currentIndent == indent) {
            var line = this.parseLine(cm.getLine(i));
            if (line.key == 'name') {
              return this.transform.params[line.val];
            }
          } else if (currentIndent < indent) {
            break;
          }
        }
        //search down
        for (var i = cur.line + 1; i < cm.lineCount(); i++) {
          currentIndent = this.indent(cm.getLine(i));
          if (currentIndent == indent) {
            line = this.parseLine(cm.getLine(i));
            if (line.key == 'name') {
              return this.transformParams[line.val];
            }
          } else if (currentIndent < indent) {
            break;
          }
        }
      }
      return [];
    };
    //Mappings that depend on more than just the parent
    YsldHinter.prototype.contextMappings = function (state, cm) {
      var keys = [];
      //varblock
      var varblocks = this.findVariables(cm).filter(function (line) {
          return !!line.varblock;
        });
      if (varblocks.length > 0) {
        keys.push('<<');
      }
      //transform: param (depends on name)
      if (state.parent.line.key == 'params') {
        keys = this.findParams(state, cm).concat(keys);
      }
      return keys;
    };
    //Custom hints for mapping values
    YsldHinter.prototype.contextChildren = function (state, cm, children) {
      var self = this;
      var values = children.map(function (child) {
          var complete = self.completions[child];
          return complete ? complete(child, state, cm) : self.hint(child, child, state.line.key);
        }).filter(function (child) {
          return child != null;
        });
      if (state.parent.line.key == 'entries') {
        var hint = self.hintTemplate('[<color>, <opacity>, <band_value>, <text_label>]');
        return hint(state, cm).concat(values);
      }
      return values;
    };
    //Values that depend on more than just the key
    YsldHinter.prototype.contextValues = function (state, cm, valueFunction) {
      var values = [];
      var hints = [];
      //variables
      var variables = this.findVariables(cm);
      for (var i = 0; i < variables.length; i++) {
        if (state.line.key == '<<' && variables[i].varblock) {
          values.push('*' + variables[i].val.substr(1));
        }
        if (state.line.key != '<<' && !variables[i].varblock) {
          values.push('*' + variables[i].val.substr(1));
        }
      }
      var numVariables = values.length;
      //grid: name - default gridsets
      if (state.line.key == 'name' && state.parent.line.key == 'grid') {
        values = values.concat([
          'EPSG:3857',
          'EPSG:4326'
        ]).concat(this.gridsets);
      }
      //transform: name
      if (state.line.key == 'name' && (state.parent.line.key == 'transform' || state.parent.line.key == 'data')) {
        values = values.concat(this.transform.mappingValues['name']);
      }
      if (values.length > 0) {
        hints = this.buildHints(state, cm, values);
      }
      if (hints.length > 0 && valueFunction) {
        hints = hints.concat(valueFunction(state, cm));
      } else if (valueFunction) {
        hints = valueFunction(state, cm);
      }
      //nested transform
      if (state.line.key == 'data' && state.parent.line.key == 'params') {
        hints = hints.concat(this.hintTemplate('\n  <transform>')(state, cm));
      }
      //If variables are the only suggestion, we are either:
      //  1. At a top-level mapping (such as feature-styles:), in which case we do not suggest anything
      //  2. At a varblock, in which case we return possible varblocks
      if (!hints || hints.length == numVariables && state.line.key != '<<') {
        return [];
      } else {
        return hints;
      }
    };
    YsldHinter.prototype.lookupHints = function (state, cm) {
      var self = this;
      if (state.parent.line.key in this.mappings) {
        var children = this.mappings[state.parent.line.key];
        //add special context-sensitive mappings
        children = this.contextMappings(state, cm).concat(children);
        if (children != null) {
          if (state.line.key.length > 0) {
            // filter out children based on content of line
            children = children.filter(function (child) {
              return child.indexOf(state.line.key) == 0;
            });
          }
          if (children.length == 1 && children[0] == state.line.key || state.line.val.trim() != state.line.key.trim()) {
            // look for a value mapping
            var complete = self.values[state.line.key];
            //also grab any context-sensitive completions
            return this.contextValues(state, cm, complete);  //return complete ? complete(state, cm) : [];
          }
          return this.contextChildren(state, cm, children);
        }
      }
      return [];
    };
    YsldHinter.prototype.hints = function (cm, options) {
      var hints = [];
      var cursor = cm.getCursor();
      var line = cm.getLine(cursor.line);
      var state = {
          line: this.parseLine(line),
          indent: this.indent(line),
          options: options
        };
      var parentLine = this.findParent(cm);
      if (parentLine != null) {
        state.parent = {
          line: parentLine,
          indent: this.indent(parentLine.raw)
        };
        hints = this.lookupHints(state, cm);
      } else {
        state.parent = {
          line: {
            key: '',
            val: ''
          },
          indent: 0
        };
        hints = this.lookupHints(state, cm);
      }
      return {
        list: hints,
        from: cm.getCursor()
      };
    };
    return new YsldHinter();
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/*global window, document, ZeroClipboard, $ */
angular.module('gsApp.editor.tools.attributes', ['gsApp.core.utilities']).directive('styleEditorAttrs', [
  '$modal',
  '$log',
  'GeoServer',
  '$rootScope',
  function ($modal, $log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        editor: '=',
        layer: '='
      },
      template: '<li class="attributes" ng-click="showAttributes();">' + '<i class="icon-table"></i>' + '<span>Attributes</span>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        '$modal',
        function ($scope, $element, $modal) {
          $scope.showAttributes = function () {
            GeoServer.datastores.getAttributes($scope.layer.resource.workspace, $scope.layer.resource.store, $scope.layer.resource.name).then(function (result) {
              if (result.success) {
                $scope.attributes = result.data;
                if (!$scope.attributes || !$scope.attributes.schema || $scope.attributes.schema.attributes.length === 0) {
                  $rootScope.alerts = [{
                      type: 'warning',
                      message: 'No attributes for resource ' + $scope.layer.resource.name,
                      fadeout: true
                    }];
                  return;
                }
                $modal.open({
                  templateUrl: '/components/editor/tools/attributes.modal.tpl.html',
                  controller: 'AttributesModalCtrl',
                  size: 'lg',
                  resolve: {
                    layer: function () {
                      return $scope.layer;
                    },
                    attributes: function () {
                      return $scope.attributes;
                    }
                  }
                });
              }
            });
          };
        }
      ]
    };
  }
]).controller('AttributesModalCtrl', [
  '$scope',
  '$modalInstance',
  'layer',
  'attributes',
  '$timeout',
  function ($scope, $modalInstance, layer, attributes, $timeout) {
    $scope.layer = layer;
    $scope.attributes = attributes;
    $scope.selectedAttrName = null;
    $scope.close = function () {
      $modalInstance.close('close');
    };
    $scope.selectName = function (name) {
      $scope.selectedAttrName = name;
    };
    $timeout(function () {
      new ZeroClipboard($('#copyAttr')).on('copy', function (event) {
        var clipboard = event.clipboardData;
        if ($scope.selectedAttrName) {
          clipboard.setData('text/plain', $scope.selectedAttrName);
          $scope.close();
        }
      });
    }, 500);
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/* globals $ */
angular.module('gsApp.editor.tools.basemap', []).controller('BasemapModalCtrl', [
  '$scope',
  '$modalInstance',
  '$upload',
  '$log',
  'GeoServer',
  '$timeout',
  'workspace',
  'mapOrLayer',
  '$rootScope',
  'AppEvent',
  function ($scope, $modalInstance, $upload, $log, GeoServer, $timeout, workspace, mapOrLayer, $rootScope, AppEvent) {
    $scope.workspace = workspace;
    if (mapOrLayer) {
      $scope.mapOrLayer = mapOrLayer;
    } else {
      $scope.mapOrLayer = {};
      $scope.mapOrLayer.isMercator = true;
      $scope.mapOrLayer.proj = { 'srs': 'EPSG:3857' };
    }
    var srs = $scope.mapOrLayer.proj.srs;
    if (srs.indexOf('900913') > -1) {
      $scope.mapOrLayer.isMercator = true;
    } else if (srs.indexOf('3857') > -1) {
      $scope.mapOrLayer.isMercator = true;
    }
    $scope.basemapExtraOptions = { 'tiled': true };
    // Custom WMS
    $scope.basemapOptions = [
      {
        'type': 'osm',
        'display_type': 'OSM',
        'url_req': false,
        'key_req': false,
        'isMercator': true
      },
      {
        'type': 'stamen',
        'display_type': 'Stamen (Toner Lite)',
        'url_req': false,
        'key_req': false,
        'isMercator': true
      },
      {
        'type': 'bing',
        'display_type': 'Bing',
        'url_req': false,
        'key_req': true,
        'styles': [
          'Road',
          'Aerial',
          'AerialWithLabels',
          'collinsBart',
          'ordnanceSurvey'
        ],
        'isMercator': true
      },
      {
        'type': 'mapbox',
        'display_type': 'MapBox',
        'url_req': false,
        'key_req': true,
        'isMercator': true
      },
      {
        'type': 'esri',
        'display_type': 'ESRI',
        'url_req': true,
        'isMercator': false
      },
      {
        'type': 'tilewms',
        'display_type': 'WMS (Custom)',
        'url_req': true,
        'key_req': false,
        'isMercator': false,
        'url': 'http://demo.boundlessgeo.com/geoserver/ne/wms',
        'serverType': 'geoserver',
        'layer': 'ne:ne_10m_admin_0_countries',
        'tiled': true,
        'format': 'image/png',
        'version': '1.3.0',
        'tiledwms': true
      }
    ];
    $scope.$watch('basemapExtraOptions.tiled', function (newVal) {
      if (newVal != null) {
        $scope.basemapOptions[5].tiledwms = newVal;
      }
    }, true);
    // mapbox-specific
    $scope.$watch('basemap.mapid', function (newVal) {
      if (newVal && $scope.basemap.type == 'mapbox') {
        $scope.basemap.url = 'http://api.tiles.mapbox.com/v4/' + $scope.basemap.mapid + '/{z}/{x}/{y}.png?access_token=' + $scope.basemap.key;
      }
    }, true);
    $scope.$watch('basemap.key', function (newVal) {
      if (newVal && $scope.basemap.type == 'mapbox') {
        $scope.basemap.url = 'http://api.tiles.mapbox.com/v4/' + $scope.basemap.mapid + '/{z}/{x}/{y}.png?access_token=' + $scope.basemap.key;
      }
    }, true);
    $scope.close = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.add = function () {
      $rootScope.$broadcast(AppEvent.BaseMapChanged, $scope.basemap);
      $scope.close();
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/* globals $ */
angular.module('gsApp.editor.tools.bg', []).directive('styleEditorBg', [
  '$log',
  '$rootScope',
  'AppEvent',
  function ($log, $rootScope, AppEvent) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      template: '<li class="dropdown dropdown-toggle">' + '<i class="icon-paint-format"></i>' + '<span>BgColor</span>' + '<ul class="dropdown-menu" style="min-width: 140px;">' + '<li style="margin-left: 3px; color: #777;">' + '<small>(Screen only - not map)</small></li>' + '<li ng-repeat="(b,c) in bgcolors"' + 'ng-class="{active: b == bgcolor}">' + '<a href ng-click="chooseBgcolor(b)">{{b}}</a>' + '</li>' + '</ul>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.bgcolors = {
            'black': 'black',
            'blue': '#28728d',
            'ltblue': 'cornflowerblue',
            'gray': '#333333',
            'ltgray': '#cccccc',
            'white': 'white',
            'sand': 'peru'
          };
          // Set default as white
          $scope.bgcolor = Object.keys($scope.bgcolors)[0];
          $scope.chooseBgcolor = function (color) {
            $scope.bgcolor = $scope.bgcolors[color];
            $rootScope.$broadcast(AppEvent.EditorBackground, $scope.bgcolor);
          };
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/* global $ */
angular.module('gsApp.editor.tools.color', []).directive('styleEditorColor', [
  '$log',
  'YsldColors',
  function ($log, YsldColors) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      template: '<li class="styleeditor-color">' + '<i class="icon-droplet"></i>' + '<span>Color</span>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.colorPicker = $('.styleeditor-color');
          $scope.colorPicker.spectrum({
            showPalette: true,
            showInitial: true,
            hideAfterPaletteSelect: true,
            palette: [],
            beforeShow: function (col) {
              // check selection, if a color initialize the color picker
              var ed = $scope.editor;
              var selection = ed.getSelection();
              if (selection != null) {
                var color = YsldColors.decode(selection);
                if (color != null) {
                  $scope.colorPicker.spectrum('set', color);
                }
              }
              return true;
            },
            change: function (col) {
              $scope.editor.insertOrReplace(('\'#' + col.toHex() + '\'').toUpperCase());
            }
          });
          $scope.$watch('editor', function (newVal) {
            if (newVal != null) {
              var ed = newVal;
              ed.on('keydown', function (cm, change) {
                var container = $scope.colorPicker.spectrum('container')[0];
                if (!container.classList.contains('sp-hidden')) {
                  //Not an autocomplete command, to avoid conflics
                  if (!(change.keyCode == 13 && navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? change.metaKey : change.ctrlKey)) {
                    if (change.keyCode == 13) {
                      $scope.editor.insertOrReplace(('\'#' + $scope.colorPicker.spectrum('get').toHex() + '\'').toUpperCase());
                    }
                    change.preventDefault();
                    $scope.colorPicker.spectrum('hide');
                  }
                }
              });
            }
          });
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/* globals $ */
angular.module('gsApp.editor.tools.display', ['gsApp.editor.tools.basemap']).directive('styleEditorDisplay', [
  '$log',
  '$rootScope',
  'AppEvent',
  '$modal',
  function ($log, $rootScope, AppEvent, $modal) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      templateUrl: '/components/editor/tools/display.tpl.html',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          /* BgColor */
          $scope.bgcolors = {
            'black': 'black',
            'ltblue': 'cornflowerblue',
            'gray': '#333333',
            'ltgray': '#cccccc',
            'white': 'white',
            'sand': 'peru'
          };
          // Set default as white
          $scope.bgcolor = Object.keys($scope.bgcolors)[4];
          $scope.chooseBgcolor = function (color) {
            $scope.bgcolor = $scope.bgcolors[color];
            $rootScope.$broadcast(AppEvent.EditorBackground, $scope.bgcolor);
          };
          /* Font */
          $scope.fonts = {
            'Monospace': 'monospace',
            'Sans Serif': 'sans-serif',
            'Serif': 'serif',
            'Inconsolata': 'Inconsolata',
            'Source Code Pro': 'Source Code Pro'
          };
          // Set default as Inconsolata
          $scope.font = Object.keys($scope.fonts)[3];
          $scope.chooseFont = function (font) {
            var css = $scope.fonts[font];
            $scope.font = css;
            // hack!
            $('.CodeMirror').css('font-family', css);
          };
          /* Font Size */
          $scope.sizes = [
            [
              'Small',
              '10px'
            ],
            [
              'Smaller',
              '12px'
            ],
            [
              'Normal',
              '14px'
            ],
            [
              'Larger',
              '16px'
            ],
            [
              'Large',
              '18px'
            ]
          ];
          $scope.size = 2;
          $scope.chooseSize = function (i) {
            $scope.size = i;
            // hack!
            $('.CodeMirror').css('font-size', $scope.sizes[i][1]);
          };
          /* Map Controls */
          $scope.mapcontrols = {
            'Toggle All': 'all',
            'Toggle LonLat': 'lonlat'
          };
          $scope.chooseControl = function (ctrl) {
            $scope.$emit(AppEvent.MapControls, ctrl);
          };
          $scope.basemapControls = {
            'Add Basemap': 'add',
            'Hide Basemap': 'hide'
          };
          $scope.addBasemap = function () {
            $modal.open({
              templateUrl: '/components/editor/tools/basemap.modal.tpl.html',
              controller: 'BasemapModalCtrl',
              size: 'md',
              resolve: {
                workspace: function () {
                  return $scope.$parent.workspace;
                },
                mapOrLayer: function () {
                  if ($scope.$parent.map) {
                    return $scope.$parent.map;
                  }
                  return $scope.$parent.layer;
                }
              }
            });
          };
          $scope.hideBasemap = function () {
            $rootScope.$broadcast(AppEvent.BaseMapChanged, null);
          };
          $scope.chooseBasemapControl = function (ctrl) {
            if (ctrl == 'add') {
              $scope.addBasemap();
            } else if (ctrl == 'hide') {
              $scope.hideBasemap();
            }
          };
        }
      ]
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
/* globals $ */
angular.module('gsApp.editor.tools.font', []).directive('styleEditorFont', [
  '$log',
  function ($log) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      template: '<li class="dropdown dropdown-toggle">' + '<i class="icon-font"></i>' + '<span>Font</span>' + '<ul class="dropdown-menu">' + '<li ng-repeat="(f,v) in fonts" ng-class="{active: f == font}">' + '<a href ng-click="chooseFont(f)">{{f}}</a>' + '</li>' + '</ul>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.fonts = {
            'Monospace': 'monospace',
            'Sans Serif': 'sans-serif',
            'Serif': 'serif',
            'Inconsolata': 'Inconsolata',
            'Source Code Pro': 'Source Code Pro'
          };
          // Set default as Inconsolata
          $scope.font = Object.keys($scope.fonts)[3];
          $scope.chooseFont = function (font) {
            var css = $scope.fonts[font];
            // hack!
            $('.CodeMirror').css('font-family', css);
          };
        }
      ]
    };
  }
]);angular.module('gsApp.editor.tools.fullscreen', []).directive('styleEditorFullscreen', [
  'AppEvent',
  function (AppEvent) {
    return {
      restrict: 'EA',
      template: '<li ng-click="toggleFullscreen()">' + '<i ng-class="fullscreen? \'icon-contract\' : \'icon-expand\'"></i>' + '<span>Fullscreen</span>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.toggleFullscreen = function () {
            $scope.$emit(AppEvent.ToggleFullscreen);
          };
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
/*global window, document, ZeroClipboard, $ */
angular.module('gsApp.editor.tools.icons', [
  'angularFileUpload',
  'gsApp.core.utilities'
]).directive('styleEditorIcons', [
  '$modal',
  '$log',
  'GeoServer',
  '$rootScope',
  function ($modal, $log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      template: '<li class="styleeditor-icon"' + 'ng-click="selectIcon();">' + '<i class="icon-flag"></i>' + '<span>Icons</span>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        '$modal',
        function ($scope, $element, $modal) {
          $scope.icons = [];
          var workspace = $scope.$parent.workspace;
          GeoServer.icons.get(workspace).then(function (result) {
            if (result.success) {
              $scope.icons = result.data;
              //propagate data upstream for easier access by other components
              $scope.$parent.icons = $scope.icons;
            } else {
              $rootScope.alerts = [{
                  type: 'warning',
                  message: 'Cannot load icons.',
                  fadeout: true
                }];
            }
          });
          $scope.selectIcon = function () {
            if ($scope.icons.length === -1) {
              $rootScope.alerts = [{
                  type: 'warning',
                  message: 'Cannot load icons.',
                  fadeout: true
                }];
              return;
            }
            $modal.open({
              templateUrl: '/components/editor/tools/icons.modal.tpl.html',
              controller: 'IconsModalCtrl',
              size: 'lg',
              resolve: {
                workspace: function () {
                  return workspace;
                },
                icons: function () {
                  return $scope.icons;
                }
              }
            });
          };
        }
      ]
    };
  }
]).controller('IconsModalCtrl', [
  '$scope',
  '$modalInstance',
  '$upload',
  '$log',
  'GeoServer',
  'workspace',
  'icons',
  '$timeout',
  function ($scope, $modalInstance, $upload, $log, GeoServer, workspace, icons, $timeout) {
    $scope.workspace = workspace;
    $scope.icons = icons;
    $scope.close = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.chooseIcon = function (icon) {
      $scope.selectedIconName = icon.name;
      $scope.selectedIconPath = '- external:\n' + '    url: ' + icon.name + '\n' + '    format: ' + icon.mime;
    };
    $scope.uploadIcons = function (files) {
      $scope.uploadRunning = true;
      $upload.upload({
        url: GeoServer.icon.url($scope.workspace),
        method: 'POST',
        file: files[0]
      }).success(function (result) {
        result.forEach(function (icon) {
          icons.push(icon);
        });
        $scope.uploadRunning = false;
      });
    };
    $scope.hasFlash = false;
    $timeout(function () {
      try {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
          $scope.hasFlash = true;
        }
      } catch (e) {
        if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] != undefined && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
          $scope.hasFlash = true;
        }
      }
      if ($scope.hasFlash) {
        new ZeroClipboard($('#copyIcon')).on('copy', function (event) {
          var clipboard = event.clipboardData;
          if ($scope.selectedIconName) {
            clipboard.setData('text/plain', $scope.selectedIconPath);
            $scope.close();
          }
        });
      }
    }, 500);
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.editor.tools.layers', []).directive('styleEditorLayers', [
  '$log',
  function ($log) {
    return {
      restrict: 'EA',
      scope: { click: '=' },
      template: '<li ng-click="click()">' + '<i class="icon-stack"></i>' + '<span>Layers</span>' + '</li>',
      replace: true
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.editor.tools.save', []).directive('styleEditorSave', [
  '$log',
  function ($log) {
    return {
      restrict: 'EA',
      scope: {
        editor: '=',
        click: '='
      },
      template: '<li ng-click="click()">' + '<i class="icon-disk"></i>' + '<span>Save</span>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.$watch('editor', function (newVal) {
            if (newVal != null) {
              var ed = newVal;
              ed.on('change', function (cm, change) {
              });
              ed.on('keydown', function (cm, change) {
                if (change.keyCode == 83 && (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? change.metaKey : change.ctrlKey)) {
                  change.preventDefault();
                  $scope.click();
                }
              });
            }
          });
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.editor.tools.shortcuts', []).directive('styleEditorShortcuts', [
  '$log',
  '$rootScope',
  'AppEvent',
  '$modal',
  function ($log, $rootScope, AppEvent, $modal) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      template: '<a ng-click="showShortcuts()">' + '<i class="icon-keyboard icon-lg"></i>' + '</a>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.showShortcuts = function () {
            var modalInstance = $modal.open({
                templateUrl: '/components/editor/tools/shortcuts.modal.tpl.html',
                controller: 'ShortcutsCtrl',
                backdrop: 'false',
                size: 'md'
              });
          };
        }
      ]
    };
  }
]).controller('ShortcutsCtrl', [
  '$scope',
  '$modalInstance',
  function ($scope, $modalInstance) {
    $scope.close = function () {
      $modalInstance.close();
    };
    $scope.chooseIcon = function (iconname) {
      $scope.selectedIconName = iconname;
    };
    var cmdKey = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? 'Cmd' : 'Ctrl';
    $scope.shortcuts = [
      {
        'name': 'Save',
        'keys': [
          {
            'key': cmdKey,
            'delim': '+'
          },
          { 'key': 'S' }
        ]
      },
      {
        'name': 'Autocomplete',
        'keys': [
          {
            'key': cmdKey,
            'delim': '+'
          },
          { 'key': 'Enter' }
        ]
      },
      {
        'name': 'Code fold/unfold',
        'keys': [
          {
            'key': cmdKey,
            'delim': '+'
          },
          {
            'key': ',',
            'delim': '/'
          },
          { 'key': '.' }
        ]
      },
      {
        'name': 'Comment/uncomment selection',
        'keys': [
          {
            'key': cmdKey,
            'delim': '+'
          },
          { 'key': '3' }
        ]
      },
      {
        'name': 'Select line',
        'keys': [
          {
            'key': 'Shift',
            'delim': '+'
          },
          {
            'key': 'Up',
            'delim': '/'
          },
          { 'key': 'Down' }
        ]
      },
      {
        'name': 'Increase/reduce indent',
        'keys': [
          {
            'key': 'Tab',
            'delim': '/'
          },
          {
            'key': 'Shift',
            'delim': '+'
          },
          { 'key': 'Tab' }
        ]
      }
    ];
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
/* globals $ */
angular.module('gsApp.editor.tools.size', []).directive('styleEditorSize', [
  '$log',
  function ($log) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      template: '<li class="dropdown dropdown-toggle">' + '<i class="icon-text-height"></i>' + '<span>Size</span>' + '<ul class="dropdown-menu">' + '<li ng-repeat="s in sizes" ng-class="{active: $index == size}">' + '<a href ng-click="chooseSize($index)">{{s[0]}}</a>' + '</li>' + '</ul>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.sizes = [
            [
              'Small',
              '10px'
            ],
            [
              'Smaller',
              '12px'
            ],
            [
              'Normal',
              '14px'
            ],
            [
              'Larger',
              '16px'
            ],
            [
              'Large',
              '18px'
            ]
          ];
          $scope.size = 2;
          $scope.chooseSize = function (i) {
            $scope.size = i;
            // hack!
            $('.CodeMirror').css('font-size', $scope.sizes[i][1]);
          };
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/*global window, document, ZeroClipboard, $ */
angular.module('gsApp.editor.tools.sld', ['gsApp.core.utilities']).directive('styleEditorSld', [
  '$modal',
  '$log',
  'GeoServer',
  '$rootScope',
  function ($modal, $log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        editor: '=',
        layer: '='
      },
      template: '<li class="sld" ng-click="showAttributes();">' + '<i class="icon-code"></i>' + '<span>SLD</span>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        '$modal',
        function ($scope, $element, $modal) {
          $scope.showAttributes = function () {
            $scope.attributes = $scope.layer.schema.attributes;
            if ($scope.attributes.length === 0) {
              $rootScope.alerts = [{
                  type: 'warning',
                  message: 'No attributes.',
                  fadeout: true
                }];
              return;
            }
            $modal.open({
              templateUrl: '/components/editor/tools/sld.modal.tpl.html',
              controller: 'SldModalCtrl',
              size: 'lg',
              resolve: {
                layer: function () {
                  return $scope.layer;
                }
              }
            });
          };
        }
      ]
    };
  }
]).controller('SldModalCtrl', [
  '$scope',
  '$modalInstance',
  'layer',
  'GeoServer',
  '$timeout',
  function ($scope, $modalInstance, layer, GeoServer, $timeout) {
    $scope.layer = layer;
    $scope.close = function () {
      $modalInstance.close('close');
    };
    $scope.codeMirrorOpts = {
      mode: 'xml',
      htmlMode: true,
      lineWrapping: true,
      lineNumbers: true
    };
    $scope.onCodeMirrorLoad = function (editor) {
      $scope.editor = editor;
    };
    GeoServer.style.getSLD(layer.style.workspace, layer.style.name, true).then(function (result) {
      if (result.success) {
        $scope.sld = result.data;
      } else {
        $scope.sld = 'Could not load SLD';
      }
    });
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.editor.tools.undo', []).directive('styleEditorUndo', [
  '$timeout',
  '$log',
  function ($timeout, $log) {
    return {
      restrict: 'EA',
      scope: { editor: '=' },
      template: '<li ng-click="undo()">' + '<i class="icon-undo"></i>' + '<span>Undo</span>' + '</li>',
      replace: true,
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.undo = function () {
            // use time out to run on next digest
            $timeout(function () {
              $scope.editor.execCommand('undo');
            }, 0);
          };
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.errorPanel', ['ui.bootstrap']).factory('$exceptionHandler', [
  '$injector',
  '$log',
  '$window',
  function ($injector, $log, $window) {
    return function (exception, cause) {
      if (exception) {
        var rScope = $injector.get('$rootScope');
        var errors = [{
              exception: exception.message,
              message: exception.cause,
              fadeout: true,
              allErrors: exception.trace,
              stack: exception.stack
            }];
        if (rScope) {
          //rScope.errors = this.errors;
          if (errors) {
            $log.log(errors);
          }
        }
      }
    };
  }
]).directive('errorPanel', [
  '$modal',
  '$interval',
  '$log',
  '$window',
  function ($modal, $interval, $log, $window) {
    return {
      restrict: 'EA',
      scope: { errors: '=?' },
      templateUrl: '/components/errorpanel/errorpanel.tpl.html',
      controller: function ($scope, $element, $window) {
        $scope.$watch('errors', function (newVal) {
          if (newVal != null && angular.isArray(newVal)) {
            $scope.messages = newVal.map(function (val) {
              $scope.msg = angular.extend({ show: true }, val);
              $scope.exception = $scope.msg.exception;
              $scope.message = $scope.msg.message;
              $scope.fadeout = $scope.msg.fadeout;
              if ($scope.msg.allErrors) {
                $scope.details = true;
              } else {
                $scope.details = false;
              }
              if ($scope.fadeout == true) {
                $interval(function () {
                  $scope.msg.show = false;
                }, 5000, 1);
              }
              return $scope.msg;
            });
          }
        });
        $scope.close = function (i) {
          $scope.messages.splice(i, 1);
        };
        $scope.showDetails = function (message) {
          var modal = $modal.open({
              templateUrl: 'error-modal',
              size: 'lg',
              resolve: {
                message: function () {
                  return message;
                }
              },
              controller: function ($scope, $modalInstance, message, $window) {
                $scope.message = message;
                $scope.fullMessage = message.message;
                $scope.message = message.message;
                $scope.allErrors = message.allErrors;
                $scope.entireMessage = message;
                $scope.copy = function () {
                  $scope.copied = true;
                  return $scope.entireMessage;
                };
                $scope.close = function () {
                  $modalInstance.close();
                };
              }
            });
        };
      }
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.inlineErrors', ['ui.bootstrap']).directive('inlineErrors', [
  '$modal',
  '$interval',
  '$log',
  '$window',
  '_',
  function ($modal, $interval, $log, $window, _) {
    return {
      restrict: 'EA',
      scope: { errors: '=?' },
      templateUrl: '/components/errorpanel/inlineErrors.tpl.html',
      controller: [
        '$scope',
        '$element',
        '$window',
        function ($scope, $element, $window) {
          $scope.$watch('errors', function (newVal) {
            if (newVal != null) {
              if (_.isArray(newVal)) {
                $scope.inlineErrors = newVal.map(function (val) {
                  return {
                    type: 'danger',
                    msg: val.message
                  };
                });
              } else {
                $scope.inlineErrors = [{
                    type: 'danger',
                    msg: newVal.message
                  }];
              }
            }
          });
        }
      ]
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.featureinfopanel', ['ui.bootstrap']).directive('featureinfoPanel', [
  '$modal',
  function ($modal) {
    return {
      restrict: 'EA',
      scope: {
        featureinfo: '=?',
        activeLayer: '='
      },
      templateUrl: '/components/featureinfopanel/featureinfopanel.tpl.html',
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          $scope.$on('featureinfo', function (evt, featureInfo) {
            var modal = $modal.open({
                templateUrl: 'featureinfo-modal',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                  features: function () {
                    return featureInfo;
                  },
                  layer: function () {
                    return $scope.activeLayer;
                  }
                },
                controller: [
                  '$scope',
                  '$modalInstance',
                  'features',
                  'layer',
                  function ($scope, $modalInstance, features, layer) {
                    $scope.features = features;
                    $scope.layer = layer;
                    $scope.close = function () {
                      $modalInstance.close();
                    };
                  }
                ]
              });
          });
        }
      ]
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.import', [
  'ngGrid',
  'angularFileUpload',
  'ui.bootstrap',
  'gsApp.core.utilities',
  'gsApp.projfield',
  'gsApp.inlineErrors'
]).directive('importFile', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: '/components/import/import.file.tpl.html',
      replace: true,
      controller: 'DataImportFileCtrl'
    };
  }
]).directive('importDb', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: '/components/import/import.db.tpl.html',
      replace: true,
      controller: 'DataImportDbCtrl'
    };
  }
]).directive('importDetails', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: '/components/import/import.details.tpl.html',
      replace: true,
      controller: 'DataImportDetailsCtrl'
    };
  }
]).controller('DataImportCtrl', [
  '$scope',
  'GeoServer',
  '$modal',
  '$modalInstance',
  'workspace',
  'contextInfo',
  'mapInfo',
  '$rootScope',
  'mapsListModel',
  'storesListModel',
  '_',
  function ($scope, GeoServer, $modal, $modalInstance, workspace, contextInfo, mapInfo, $rootScope, mapsListModel, storesListModel, _) {
    var wsName = workspace;
    $scope.mapInfo = mapInfo;
    $scope.contextInfo = contextInfo;
    $scope.childScope = {};
    $scope.layers = [];
    $scope.selectedLayers = [];
    $scope.imported = [];
    if (contextInfo && contextInfo.title) {
      $scope.title = contextInfo.title;
    } else {
      $scope.title = 'Import Data to <i class="icon-folder-open"></i> <strong>' + wsName + '</strong>';
    }
    $scope.showImportFile = true;
    $scope.showImportDB = false;
    $scope.showImportDetails = false;
    $scope.selectedStore = null;
    /*
       * If import was opened from an import layers into map dialog (details in contextInfo)
       * then return the list of imported, selected, layers (Note/TODO: All imported layers default to selected)
       * else return the imported store
       */
    $scope.close = function (layerlist) {
      if (contextInfo) {
        if (layerlist) {
          $modalInstance.close(layerlist);
        } else {
          $modalInstance.close();
        }
      } else {
        $modalInstance.close($scope.selectedStore);
      }
    };
    /* Get layer list and exit*/
    $scope.returnSelectedLayers = function (selectedTasks) {
      var layers = [];
      selectedTasks.forEach(function (task) {
        if (task.layer) {
          layers.push(task.layer);
        }  //else warn user?
      });
      $scope.close(layers);
    };
    $scope.next = function (imp) {
      $scope.showImportDetails = true;
      $scope.importId = imp.id;
    };
    $scope.db_home = false;
    $scope.importResult = null;
    $scope.setImportResult = function (result) {
      $scope.importResult = result;
    };
    $scope.addStore = function () {
      storesListModel.addEmptyStore(wsName, $scope.format.name, $scope.content);
      $scope.close();
    };
    $scope.connectParams = null;
    $scope.setConnectionParamsAndFormat = function (params, format) {
      $scope.connectParams = params;
      $scope.format = format;
      $scope.setStoreConnectionContent();
    };
    // for adding store after attempting import from empty store
    $scope.content = null;
    $scope.setStoreConnectionContent = function () {
      var params = $scope.connectParams;
      $scope.content = $scope.format;
      $scope.content.connection = {};
      for (var obj in params) {
        if (params[obj].value) {
          $scope.content.connection[obj] = params[obj].value.toString();  // geoserver doesn't recognize without toString + need to remove
                                                                          // any undefined optional parameters
        }
      }
      delete $scope.content.params;
    };
    // Expects store object not just store name
    $scope.storeSelected = function (store) {
      $scope.selectedStore = { 'name': store.store };
    };
    GeoServer.workspace.get(wsName).then(function (result) {
      if (result.success) {
        $scope.workspace = result.data;
      }
    });
  }
]).controller('DataImportFileCtrl', [
  '$scope',
  '$upload',
  '$log',
  'GeoServer',
  'AppEvent',
  '$rootScope',
  'storesListModel',
  '_',
  function ($scope, $upload, $log, GeoServer, AppEvent, $rootScope, storesListModel, _) {
    var wsName = $scope.workspace.name;
    $scope.existingStores = [];
    GeoServer.datastores.get(wsName, 0, null, null, null).then(function (result) {
      if (result.success) {
        result.data.stores.forEach(function (store) {
          if (store.type.toLowerCase() === 'database' || store.type.toLowerCase() === 'generic' || store.format.indexOf('directory of spatial files') !== -1) {
            $scope.existingStores.push(store);
          }
        });
        if ($scope.existingStores.length > 0) {
          $scope.chosenImportStore = $scope.existingStores[0];
        }
      }
    });
    $scope.diskSize = 0;
    GeoServer.import.wsInfo(wsName).then(function (result) {
      if (result.success) {
        $scope.diskSize = result.data.spaceAvailable;
      }
    });
    $scope.initProgress = function () {
      $scope.progress = { percent: 0 };
    };
    $scope.calcFileSize = function (files) {
      var size = 0;
      for (var i = 0; i < files.length; i++) {
        size += files[i].size;
      }
      return size;
    };
    $scope.onFileSelect = function (files) {
      if (!$scope.files) {
        $scope.files = [];
      }
      //Add unique files
      files.forEach(function (file) {
        for (var i = 0; i < $scope.files.length; i++) {
          if (angular.equals($scope.files[i], file)) {
            return;
          }
        }
        $scope.files.push(file);
      });
      $scope.fileSize = $scope.calcFileSize($scope.files);
      $scope.setImportResult(null);
      $scope.initProgress();
    };
    $scope.onFileRemove = function (file) {
      if ($scope.files) {
        while ($scope.files.indexOf(file) >= 0) {
          $scope.files.splice($scope.files.indexOf(file), 1);
        }
        $scope.fileSize = $scope.calcFileSize($scope.files);
      }
    };
    $scope.uploadInProgress = false;
    $scope.upload = function () {
      var postURL;
      $scope.uploadInProgress = true;
      if ($scope.addToStore) {
        postURL = GeoServer.import.urlToStore(wsName, $scope.chosenImportStore.name);
      } else {
        postURL = GeoServer.import.url(wsName);
      }
      $upload.upload({
        url: postURL,
        method: 'POST',
        file: $scope.files
      }).progress(function (e) {
        $scope.progress.percent = parseInt(100 * e.loaded / e.total);
      }).success(function (e) {
        $scope.setImportResult(e);
      }).then(function (result) {
        GeoServer.import.wsInfo(wsName).then(function (result) {
          if (result.success) {
            $scope.diskSize = result.data.spaceAvailable;
          }
        });
        if (result.status > 201) {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Could not import ' + ($scope.files.length == 1 ? 'file: ' + $scope.files[0].name : +$scope.files.length + ' files'),
              fadeout: true
            }];
          $scope.close();
        }
        $scope.uploadInProgress = false;
      });
    };
    $scope.initProgress();
    GeoServer.formats.get().then(function (result) {
      var fileTooltip = '<div class=\'data-import-file-tooltip\'>' + '<h5>Spatial Files</h5>' + '<p>Supported file types:</p>';
      if (result.success) {
        result.data.forEach(function (f) {
          if (f.type == 'file') {
            fileTooltip += '<div class=\'file-type\'><div><strong>' + f.title + '</strong></div>' + '<div>' + f.description + '</div></div>';
          }
        });
      }
      fileTooltip += '</div>';
      $scope.fileTooltip = fileTooltip;
    });
  }
]).controller('DataImportDbCtrl', [
  '$scope',
  '$log',
  'GeoServer',
  '_',
  '$sce',
  function ($scope, $log, GeoServer, _, $sce) {
    var wsName = $scope.workspace.name;
    $scope.chooseTables = false;
    $scope.geoserverDatabaseLink = GeoServer.baseUrl() + '/web/?wicket:bookmarkablePage=:org.geoserver.importer.web.' + 'ImportDataPage';
    $scope.chooseFormat = function (f) {
      GeoServer.format.get(f.name).then(function (result) {
        if (result.success) {
          $scope.format = result.data;
          $scope.params = _.mapValues($scope.format.params, function (param) {
            return angular.extend(param, { value: param.default });
          });
        }
      });
    };
    $scope.connect = function () {
      $scope.connecting = true;
      var content = _.mapValues($scope.params, function (p) {
          return p.value;
        });
      $scope.setConnectionParamsAndFormat($scope.params, $scope.format);
      GeoServer.import.post(wsName, content).then(function (result) {
        if (result.success) {
          $scope.error = null;
          if (typeof result.data.id !== 'undefined') {
            $scope.setImportResult(result.data);
          } else if (result.data.store) {
            $scope.alert = result.data;
            $scope.selectStore = result.data.store;
          }
        } else {
          $scope.error = result.data;
        }
        $scope.connecting = false;
      });
    };
    $scope.showStore = function () {
      $scope.close($scope.selectStore);
    };
    GeoServer.formats.get().then(function (result) {
      if (result.success) {
        $scope.formats = result.data.filter(function (f) {
          return f.type == 'database' || f.type == 'generic';
        });
      }
    });
  }
]).controller('DataImportDetailsCtrl', [
  '$scope',
  '$log',
  'GeoServer',
  '$rootScope',
  'AppEvent',
  'storesListModel',
  'importPollingService',
  '$timeout',
  function ($scope, $log, GeoServer, $rootScope, AppEvent, storesListModel, importPollingService, $timeout) {
    // Initialize scope
    var wsName = $scope.workspace.name;
    $scope.layers.length = 0;
    $scope.selectedLayers.length = 0;
    $scope.detailsLoading = true;
    //dynamic ngGrid fields
    $scope.showStatus = false;
    $scope.showProjection = false;
    var stopUpdateTimer, stopGetTimer;
    // ng-grid configuration
    var baseGridOpts = {
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: false,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: false,
        multiSelect: true,
        selectedItems: $scope.selectedLayers
      };
    $scope.gridOpts = angular.extend({
      data: 'layers',
      checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox"' + 'ng-model="allSelected" ' + 'ng-change="toggleSelectAll(allSelected)"/>',
      sortInfo: {
        fields: ['name'],
        directions: ['asc']
      },
      columnDefs: [
        {
          field: 'name',
          displayName: 'Name',
          cellTemplate: '<div class="grid-text-padding"' + 'title="{{row.entity.name}}">' + '{{row.entity.name}}' + '</div>',
          width: '30%'
        },
        {
          field: 'geometry',
          displayName: 'Geometry',
          cellTemplate: '<div class="grid-cell" ng-switch ' + 'on="row.entity.geometry==\'none\'">' + '<div ng-switch-when="false"><div get-type geometry="{{row.entity.geometry}}"></div></div>' + '<div ng-switch-when="true">None *</div>' + '</div>',
          width: '20%'
        },
        {
          field: 'projection',
          displayName: 'Projection',
          cellTemplate: '<div ng-switch on="row.entity.status==\'NO_CRS\'">' + '<proj-field ng-switch-when="true" proj="row.entity.proj">' + '</proj-field>' + '<div ng-switch-when="false" ng-show="!!row.entity.proj.srs" class="ngCellText">' + ' {{ row.entity.proj.srs }}' + '<div>' + '</div>',
          width: '30%',
          visible: false
        },
        {
          field: 'status',
          displayName: 'Status',
          cellTemplate: '<div ng-switch on="row.entity.status">' + '<span ng-switch-when="RUNNING" class="grid-cell import-loading">' + '<i class="fa fa-spinner fa-spin"></i> Importing</span>' + '<span ng-switch-when="NO_CRS" class="grid-cell import-warning">' + '<i class="fa fa-exclamation-triangle"></i> No CRS</span>' + '<span ng-switch-when="NO_BOUNDS" class="grid-cell import-warning">' + '<i class="fa fa-exclamation-triangle"></i> No Bounds</span>' + '<span ng-switch-when="ERROR" class="grid-cell import-error">' + '<i class="fa fa-x"></i> Error: {{row.entity.error.message}}</span>' + '<span ng-switch-when="COMPLETE" class="grid-cell import-success">' + '<i class="fa fa-check"></i> Imported</span>',
          width: '20%',
          visible: false
        }
      ],
      checkboxCellTemplate: '<div class="ngSelectionCell">' + '<input tabindex="-1" class="ngSelectionCheckbox" ' + 'type="checkbox" ng-checked="row.selected" ' + 'ng-disabled="row.entity.imported" />' + '</div>',
      enablePaging: false,
      enableColumnResize: false,
      showFooter: false,
      totalServerItems: 'layers.length',
      pagingOptions: {
        pageSize: 50,
        currentPage: 1
      }
    }, baseGridOpts);
    //Override ng-grid toggleSelectAll
    var gridScopeInit = $scope.$watch('gridOpts.$gridScope', function () {
        if ($scope.gridOpts.$gridScope && $scope.gridOpts.$gridScope.toggleSelectAll) {
          $scope.gridOpts.$gridScope.toggleSelectAll = function (state) {
            $scope.selectedLayers.length = 0;
            $scope.layers.forEach(function (task) {
              if (state) {
                $scope.selectedLayers.push(task);
              }
            });
            $scope.gridOpts.$gridScope.renderedRows.forEach(function (row) {
              if (state) {
                row.selected = true;
              } else {
                row.selected = false;
              }
            });
          };
          //unregister watch
          gridScopeInit();
        }
      });
    //Function definitions
    $scope.setStoreFromLayername = function (importedLayerName) {
      if (!$scope.selectedStore) {
        GeoServer.layer.get(wsName, importedLayerName).then(function (result) {
          if (result.success) {
            $scope.storeSelected(result.data.resource);
          }
        });
      }
    };
    $scope.pollingGetCallback = function (result) {
      if (result.success) {
        var data = result.data;
        var running = 0;
        if (data.tasks) {
          $scope.ignored = [];
          data.tasks.forEach(function (t) {
            //hide the projection and status columns until relevant
            if (!$scope.showProjection && t.status == 'NO_CRS') {
              $scope.showProjection = true;
              if ($scope.gridOpts.$gridScope) {
                $scope.gridOpts.$gridScope.columns[3].toggleVisible();
              } else {
                $scope.gridOpts.columnDefs[2].visible = true;
              }
            }
            if (!$scope.showStatus && t.status != 'READY' && t.status != 'PENDING' && t.status != 'IGNORED') {
              $scope.showStatus = true;
              if ($scope.gridOpts.$gridScope) {
                $scope.gridOpts.$gridScope.columns[4].toggleVisible();
              } else {
                $scope.gridOpts.columnDefs[3].visible = true;
              }
            }
            if (t.status == 'RUNNING') {
              running++;
            }
            if (t.status == 'IGNORED') {
              $scope.ignored.push(t);
            }
            //Do an in-place manual copy. Existing local properties (ie. proj) are preserved.
            //(If this is the first import, length will be zero, so we skip this step)
            for (var i = 0; i < $scope.layers.length; i++) {
              var l = $scope.layers[i];
              if (t.task == l.task) {
                Object.keys(t).forEach(function (key) {
                  l[key] = t[key];
                });
                break;
              }
            }
          });
          //set global import data
          $scope.import = data;
          //initialize layers list
          if ($scope.layers.length == 0) {
            $scope.layers = data.tasks.filter(function (t) {
              return t.status != 'IGNORED';
            });
          }
        }
        // Completed
        if (data.tasks && running == 0 && data.state != 'running') {
          // cleanup/reset
          $timeout.cancel(stopGetTimer);
          $scope.pollRetries = 1000;
          $scope.detailsLoading = false;
          $scope.importInProgress = false;
          $scope.imported.length = 0;
          data.tasks.forEach(function (t) {
            if (t.status == 'COMPLETE') {
              $scope.setStoreFromLayername(t.name);
              t.layer.source = t.name;
              $scope.imported.push(t);
            }
          });
          //TODO: Compare pre ($scope.import) and post (data) "COMPLETED" to get imported layer count
          if ($scope.layers.length == $scope.ignored.length) {
            $scope.noImportData = true;
          }
          if ($scope.imported.length > 0) {
            $rootScope.$broadcast(AppEvent.StoreAdded);
          }
        } else {
          // continue polling
          if (stopGetTimer) {
            $timeout.cancel(stopGetTimer);
          }
          if ($scope.pollRetries > 0) {
            $scope.pollRetries--;
            stopGetTimer = $timeout(function () {
              importPollingService.pollGetOnce(wsName, $scope.importId, $scope.pollingGetCallback);
            }, 2000);
          } else {
            $scope.pollRetries = 1000;
            $rootScope.alerts = [{
                type: 'danger',
                message: 'Could not import store: Import took too long',
                fadeout: true
              }];
          }
        }
      } else {
        //import failed
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Error importing store: ' + result.data.message,
            details: result.data.trace,
            fadeout: true
          }];
      }
    };
    $scope.applyProjToAll = function (proj) {
      $scope.layers.forEach(function (task) {
        if (task.status == 'NO_CRS') {
          task.proj = angular.copy(proj);
        }
      });
    };
    $scope.doImport = function () {
      $scope.importInProgress = true;
      var toImport = { 'tasks': [] };
      $scope.selectedLayers.filter(function (item) {
        return item.status != 'COMPLETE';
      }).forEach(function (task) {
        if (task.status == 'NO_CRS') {
          toImport.tasks.push({
            'task': task.task,
            'proj': task.proj
          });
        } else {
          toImport.tasks.push({ 'task': task.task });
        }
      });
      $scope.pollRetries = 500;
      if (toImport.tasks.length > 0) {
        importPollingService.pollUpdateOnce(wsName, $scope.importId, angular.toJson(toImport), $scope.pollingGetCallback);
      }
    };
    //make visible to parent
    $scope.childScope.doImport = $scope.doImport;
    $scope.setMap = function (map) {
      $scope.selectedMap = map;
    };
    //Poll for import results
    $scope.pollRetries = 1000;
    importPollingService.pollGetOnce(wsName, $scope.importId, $scope.pollingGetCallback);
    $scope.$on('destroy', function (event) {
      $timeout.cancel(stopGetTimer);
      $timeout.cancel(stopUpdateTimer);
    });
  }
]).factory('importPollingService', [
  'GeoServer',
  function (GeoServer) {
    return {
      pollGetOnce: function (workspace, importId, callback) {
        GeoServer.import.get(workspace, importId).then(callback);
      },
      pollUpdateOnce: function (workspace, importId, tables, callback) {
        GeoServer.import.update(workspace, importId, tables).then(callback);
      }
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.layers.duplicate', []).controller('DuplicateLayerCtrl', [
  'layer',
  'workspace',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  function (layer, workspace, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent) {
    $scope.fromLayer = layer;
    $scope.workspace = workspace;
    $scope.layer = {
      'layer': {
        'name': $scope.fromLayer.name,
        'workspace': $scope.workspace
      },
      'title': $scope.fromLayer.title,
      'workspace': $scope.workspace,
      'proj': $scope.fromLayer.proj,
      'description': $scope.fromLayer.description,
      'type': $scope.fromLayer.type
    };
    $scope.importAsLayer = function () {
      var layerInfo = $scope.layer;
      $scope.form.layerSettings.alerts = null;
      GeoServer.layer.create($scope.workspace, layerInfo).then(function (result) {
        if (result.success) {
          var layer = result.data;
          $rootScope.$broadcast(AppEvent.LayerAdded, layer);
          $rootScope.alerts = [{
              type: 'success',
              message: 'New layer ' + layer.name + ' successfully created.',
              fadeout: true
            }];
          $modalInstance.close(layer);
        } else {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Could not copy layer ' + $scope.layer.name + ': ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
          $scope.form.layerSettings.alerts = 'Copy Failed: ' + result.data.message;
        }
      });
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.layers.import', ['gsApp.modal']).controller('PublishLayerCtrl', [
  'resource',
  'workspace',
  'store',
  '$controller',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  'layersListModel',
  function (resource, workspace, store, $controller, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent, layersListModel) {
    angular.extend(this, $controller('ModalCtrl', { $scope: $scope }));
    $scope.resource = resource;
    $scope.workspace = workspace;
    $scope.store = store;
    GeoServer.datastores.getResource($scope.workspace, store.name, resource.name).then(function (result) {
      if (result.success) {
        $scope.resource = result.data;
        var schema = result.data.schema;
        $scope.resourceProj = findProj(schema.attributes, schema.defaultGeometry);
        var keywords = $scope.resource.keywords ? $scope.resource.keywords.toString() : 'none';
        $scope.layer = {
          'name': $scope.resource.name,
          'title': $scope.resource.title,
          'workspace': $scope.workspace,
          'proj': $scope.resourceProj,
          'keywords': keywords,
          'resource': {
            'store': $scope.resource.store.name,
            'url': $scope.resource.store.url,
            'workspace': $scope.workspace,
            'name': $scope.resource.name
          }
        };
      } else {
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Could not get resource details for ' + $scope.resource.name + ': ' + result.data.message,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
    // Iterate through resource attributes to find the_geom or geom or
    // any geometry attribute to find the projection
    var findProj = function (attributes, defaultGeomPropName) {
      var proj;
      for (var k = 0; k < attributes.length; k++) {
        var attr = attributes[k];
        if (attr.name === defaultGeomPropName && attr.proj) {
          return attr.proj;
        }
      }
      return null;
    };
    $scope.importAsLayer = function () {
      var layerInfo = $scope.layer;
      $scope.layerAdded = false;
      GeoServer.layer.create($scope.workspace, layerInfo).then(function (result) {
        if (result.success) {
          $scope.form.alerts = null;
          $scope.resource = result.data.resource;
          if ($scope.resource.layers) {
            $scope.resource.layers.push(result.data);
          } else {
            $scope.resource.layers = result.data;
          }
          $rootScope.$broadcast(AppEvent.LayerAdded, result.data);
          $rootScope.alerts = [{
              type: 'success',
              message: 'Imported resource ' + $scope.resource.name + ' as layer ' + layerInfo.title + '.',
              fadeout: true
            }];
          $scope.layerAdded = true;
          $modalInstance.close($scope.layerAdded);
        } else {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Could not create layer from resource ' + $scope.resource.name + ': ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
          $scope.form.alerts = 'Error: ' + result.data.message;
        }
      });
    };
    $scope.cancel = function () {
      $modalInstance.dismiss(false);
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.layers.settings', []).controller('EditLayerSettingsCtrl', [
  'workspace',
  'layer',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  'layersListModel',
  '$sce',
  function (workspace, layer, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent, layersListModel, $sce) {
    $scope.workspace = workspace;
    $scope.layer = angular.copy(layer);
    $scope.layername = {};
    $scope.layername = layer.name;
    $scope.form = {};
    $scope.form.mapSettings = {};
    var originalLayer = angular.copy($scope.layer);
    $scope.crsTooltip = '<h5>Add a projection in EPSG</h5>' + '<p>Coordinate Reference System (CRS) info is available at ' + '<a href="http://prj2epsg.org/search" target="_blank">' + 'http://prj2epsg.org' + '</a>' + '</p>';
    $scope.getGeoServerLink = function () {
      var url = GeoServer.baseUrl() + '/web/?wicket:bookmarkablePage=:org.' + 'geoserver.web.data.resource.ResourceConfigurationPage&name=' + layer.name + '&wsName=' + $scope.workspace;
      $scope.layer.link = url;
    };
    $scope.getGeoServerLink();
    $scope.saveChanges = function () {
      // clear any error state
      $scope.errorSaving = '';
      $scope.form.layerSettings.alerts = null;
      if ($scope.form.layerSettings.$dirty) {
        var patch = {};
        if (originalLayer.name !== $scope.layer.name) {
          patch.name = $scope.layer.name;
        }
        if (originalLayer.title !== $scope.layer.title) {
          patch.title = $scope.layer.title;
        }
        if (originalLayer.proj.srs !== $scope.layer.proj.srs) {
          patch.proj = $scope.layer.proj.srs;
        }
        if (originalLayer.description !== $scope.layer.description) {
          patch.description = $scope.layer.description;
        }
        GeoServer.layer.update($scope.workspace, originalLayer.name, patch).then(function (result) {
          if (result.success) {
            $scope.form.layerSettings.saved = true;
            $scope.form.layerSettings.$setPristine();
            $rootScope.$broadcast(AppEvent.LayerUpdated, {
              'original': originalLayer,
              'new': $scope.layer
            });
            originalLayer = angular.copy($scope.layer);
            $modalInstance.close($scope.layer);
          } else {
            $scope.form.layerSettings.saved = false;
            $scope.form.layerSettings.alerts = 'Layer update failed: ' + result.data.message;
            $scope.errorSaving = 'Update failed.';
            $rootScope.alerts = [{
                type: 'warning',
                message: 'Layer update failed: ' + result.data.message,
                details: result.data.trace,
                fadeout: true
              }];
          }
        });
      }
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.modals.maps.new', [
  'ngSanitize',
  'gsApp.alertpanel',
  'gsApp.import',
  'gsApp.modal',
  'gsApp.projfield',
  'gsApp.core.utilities',
  'ui.select',
  'ngGrid',
  'gsApp.inlineErrors'
]).directive('newMapForm', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: '/components/modalform/map/map.new.form.tpl.html',
      replace: true,
      controller: 'NewMapFormCtrl'
    };
  }
]).directive('newMapImport', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: '/components/modalform/map/map.new.import.tpl.html',
      replace: true
    };
  }
]).directive('newMapLayers', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: '/components/modalform/map/map.new.layers.tpl.html',
      replace: true,
      controller: 'NewMapLayersCtrl'
    };
  }
]).controller('NewMapCtrl', [
  '$controller',
  '$modalInstance',
  '$scope',
  '$state',
  '$rootScope',
  '$log',
  'GeoServer',
  '$window',
  'AppEvent',
  '_',
  'workspace',
  'mapInfo',
  '$modal',
  function ($controller, $modalInstance, $scope, $state, $rootScope, $log, GeoServer, $window, AppEvent, _, workspace, mapInfo, $modal) {
    angular.extend(this, $controller('ModalCtrl', { $scope: $scope }));
    $scope.workspace = workspace;
    $scope.proj = null;
    $scope.step = 0;
    $scope.opts = {
      paging: {
        pageSize: 25,
        currentPage: 1
      },
      sort: {
        fields: ['name'],
        directions: ['asc']
      },
      filter: { filterText: '' }
    };
    //TODO: Setup layers
    $scope.title = 'New Map';
    $scope.nextButton = 'Add Layers &rarr;';
    //move to html
    if (mapInfo) {
      $scope.mapInfo = mapInfo;
      if ($scope.mapInfo.layers && Array.isArray($scope.mapInfo.layers) && $scope.mapInfo.layers.length > 0) {
        $scope.title = 'New Map from Selected Layers';
        $scope.nextButton = 'Create New Map';
      }
    } else {
      $scope.mapInfo = { layers: [] };
    }
    $scope.next = function () {
      if ($scope.step < 3) {
        $scope.step++;
      }
    };
    $scope.back = function () {
      if ($scope.step == 2) {
        $scope.step = 1;
      }
      if ($scope.step == 3) {
        $scope.step = 2;
        $scope.selectLayers = true;
      }
    };
    //return null on cancel, map on success.
    $scope.close = function (result) {
      $modalInstance.close(result);
    };
    $scope.importNewLayers = function () {
      $modal.open({
        templateUrl: '/components/import/import.tpl.html',
        controller: 'DataImportCtrl',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          workspace: function () {
            return $scope.workspace;
          },
          mapInfo: function () {
            return $scope.mapInfo;
          },
          contextInfo: function () {
            return {
              title: 'Import Layers into New Map: <i class="icon-map"></i> <strong>' + $scope.mapInfo.name + '</strong>',
              hint: 'Create new map from selected layers',
              button: 'Create new map'
            };
          }
        }
      }).result.then(function (param) {
        if (param) {
          $scope.mapInfo.layers = param;
          $scope.step = 1;
        }
      });
    };
    $scope.createMap = function () {
      GeoServer.map.create($scope.workspace, $scope.mapInfo).then(function (result) {
        if (result.success) {
          var map = result.data;
          $rootScope.alerts = [{
              type: 'success',
              message: 'Map ' + $scope.mapInfo.name + ' created  with ' + $scope.mapInfo.layers.length + ' layer(s).',
              fadeout: true
            }];
          $rootScope.$broadcast(AppEvent.MapAdded, map);
          $scope.close(map);
          $state.go('editmap', {
            workspace: $scope.workspace,
            name: map.name
          });
        } else {
          var message = 'Could not create map: ' + result.data.message;
          if (result.data.trace.indexOf('too close to a pole') > -1) {
            message = 'Cannot create map in Mercator: the layer bounds touch the poles';
          }
          $rootScope.alerts = [{
              type: 'danger',
              message: message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
    };
    $scope.step = 1;
  }
]).controller('NewMapFormCtrl', [
  '$scope',
  '$rootScope',
  '$log',
  'GeoServer',
  '$window',
  'AppEvent',
  '_',
  'projectionModel',
  function ($scope, $rootScope, $log, GeoServer, $window, AppEvent, _, projectionModel, workspace, mapInfo) {
    $scope.proj = null;
    $scope.projEnabled = false;
    $scope.$watch('proj', function (newValue, oldValue) {
      if (newValue === 'latlon') {
        $scope.mapInfo.proj = _.find($scope.projs, function (proj) {
          return proj.srs === 'EPSG:4326';
        });
      } else if (newValue === 'mercator') {
        $scope.mapInfo.proj = _.find($scope.projs, function (proj) {
          return proj.srs === 'EPSG:3857';
        });
      } else if (newValue === 'other') {
        $scope.mapInfo.proj = $scope.customproj;
      }
    });
    $rootScope.$on(AppEvent.ProjSet, function (scope, proj) {
      $scope.mapInfo.proj = proj;
    });
    projectionModel.fetchProjections().then(function () {
      $scope.projs = projectionModel.getDefaults();
      $scope.projEnabled = true;
      $scope.proj = 'latlon';  // default
    });
  }
]).controller('NewMapLayersCtrl', [
  '$scope',
  '$rootScope',
  '$log',
  'GeoServer',
  '$window',
  'AppEvent',
  '_',
  '$modal',
  function ($scope, $rootScope, $log, GeoServer, $window, AppEvent, _, $modal) {
    var modalWidth = 800;
    $scope.loadLayers = function () {
      var opts = $scope.opts;
      GeoServer.layers.get($scope.workspace, opts.paging.currentPage - 1, opts.paging.pageSize, opts.sort.fields[0] + ':' + opts.sort.directions[0], opts.filter.filterText).then(function (result) {
        if (result.success) {
          $scope.layers = result.data.layers;
          $scope.totalServerItems = result.data.total;
          if ($scope.layerOptions) {
            $scope.layerOptions.$gridScope.selectedItems.length = 0;
            $scope.layerOptions.$gridScope['allSelected'] = false;
            $scope.mapInfo.layers = $scope.layerOptions.$gridScope.selectedItems;
          }
          if ($scope.hasLayers === undefined) {
            $scope.hasLayers = result.data.total !== 0;
          }
        } else {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Layers for workspace ' + $scope.workspace.name + ' could not be loaded: ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
    };
    $scope.loadLayers();
    // Refresh if scope updated
    $scope.$watch('opts', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        $scope.loadLayers();
      }
    }, true);
    // Available Layers Table
    $scope.gridWidth = { 'width': modalWidth };
    $scope.selectAll = false;
    $scope.layerOptions = {
      data: 'layers',
      enableCellSelection: false,
      enableRowSelection: true,
      enableCellEdit: false,
      enableRowReordering: false,
      jqueryUIDraggable: false,
      checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox"' + 'ng-model="$parent.allSelected" ng-change="toggleSelectAll($parent.allSelected)"/>',
      int: function () {
        $log('done');
      },
      showSelectionCheckbox: true,
      selectedItems: [],
      selectWithCheckboxOnly: false,
      multiSelect: true,
      columnDefs: [
        {
          field: 'name',
          displayName: 'Layer',
          cellTemplate: '<div class="grid-text-padding"' + 'title="{{row.entity.name}}">' + '{{row.entity.name}}' + '</div>',
          width: '40%'
        },
        {
          field: 'title',
          displayName: 'Title',
          enableCellEdit: false,
          cellTemplate: '<div class="grid-text-padding"' + 'alt="{{row.entity.description}}"' + 'title="{{row.entity.description}}">' + '{{row.entity.title}}' + '</div>',
          width: '50%'
        },
        {
          field: 'geometry',
          displayName: 'Type',
          cellClass: 'text-center',
          cellTemplate: '<div get-type ' + 'geometry="{{row.entity.geometry}}">' + '</div>',
          width: '10%',
          sortable: false
        }
      ],
      enableColumnResize: false,
      useExernalSorting: true,
      sortInfo: $scope.opts.sort
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.maps.settings', []).controller('EditMapSettingsCtrl', [
  '$controller',
  '$log',
  '$modalInstance',
  '$rootScope',
  '$scope',
  '$state',
  'AppEvent',
  'GeoServer',
  'map',
  'workspace',
  function ($controller, $log, $modalInstance, $rootScope, $scope, $state, AppEvent, GeoServer, map, workspace) {
    angular.extend(this, $controller('ModalCtrl', { $scope: $scope }));
    $scope.workspace = workspace;
    $scope.map = angular.copy(map);
    $scope.mapname = map.name;
    $scope.form = {};
    $scope.form.mapSettings = {};
    var originalMap = angular.copy($scope.map);
    $scope.saveChanges = function () {
      if ($scope.form.mapSettings.$dirty) {
        var patch = {
            'bbox': {},
            'center': [2]
          };
        if (originalMap.name !== $scope.map.name) {
          patch.name = $scope.map.name;
        }
        if (originalMap.title !== $scope.map.title) {
          patch.title = $scope.map.title;
        }
        //bbox and proj are interdependant for maps
        if (originalMap.bbox !== $scope.map.bbox || originalMap.proj.srs !== $scope.map.proj.srs) {
          patch.proj = $scope.map.proj.srs;
          patch.bbox.south = $scope.map.bbox.south;
          patch.bbox.west = $scope.map.bbox.west;
          patch.bbox.north = $scope.map.bbox.north;
          patch.bbox.east = $scope.map.bbox.east;
        }
        if (originalMap.description !== $scope.map.description) {
          patch.description = $scope.map.description;
        }
        if (originalMap.timeout !== $scope.map.timeout) {
          patch.timeout = $scope.map.timeout;
        }
        GeoServer.map.update($scope.workspace, originalMap.name, patch).then(function (result) {
          if (result.success) {
            $scope.form.mapSettings.alerts = null;
            $scope.form.mapSettings.saved = true;
            $scope.form.mapSettings.$setPristine();
            $rootScope.$broadcast(AppEvent.MapUpdated, {
              'original': originalMap,
              'new': result.data
            });
            $scope.map = result.data;
            originalMap = angular.copy($scope.map);
            $scope.form.mapSettings.alerts = null;
            $modalInstance.close($scope.map);
          } else {
            $rootScope.alerts = [{
                type: 'danger',
                message: 'Map update failed: ' + result.data.message,
                details: result.data.trace,
                fadeout: true
              }];
            $scope.form.mapSettings.saved = false;
            $scope.form.mapSettings.alerts = 'Error: ' + result.data.message;
          }
        });
      }
    };
    $scope.calculateBounds = function () {
      GeoServer.map.bounds($scope.workspace, originalMap.name, { 'proj': $scope.map.proj.srs }).then(function (result) {
        if (result.success) {
          if ($scope.form.mapSettings && $scope.map.bbox != result.data.bbox.native) {
            $scope.form.mapSettings.$dirty = true;
          }
          $scope.map.bbox = result.data.bbox.native;
          $scope.form.mapSettings.alerts = null;
        } else {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Error calculating bounds: ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
          $scope.form.mapSettings.alerts = 'Error calculating bounds: ' + result.data.message;
        }
      });
    };
    $scope.close = function () {
      $modalInstance.dismiss();
    };
  }
]);/*
 * (c) 2015 Boundless, http://boundlessgeo.com
 *
 * Modal Utilities
 */
angular.module('gsApp.modal', []).controller('ModalCtrl', [
  '$scope',
  function ($scope) {
    //Global for consistincy
    $scope.crsTooltip = '<p>Add a projection in EPSG</p>' + '<p><small>Coordinate Reference System (CRS) info is available at ' + '<a href="http://prj2epsg.org/search" target="_blank">' + 'http://prj2epsg.org' + '</a>' + '</small></p>';
    $scope.extentTooltip = '<p>Map Extent</p>' + '<small class="hint"> The default region visible when rendering ' + 'the map.<br/>The map extent should be provided in the same units ' + 'as the projection: degrees for EPSG:4326 or meters for most ' + 'other EPSG codes.<br/><br/>"Generate Bounds" will calculate the ' + 'net layer bounds in the current projection.</small>';
    $scope.renderTooltip = '<p>Render Timeout</p>' + '<small class="hint">Max time to wait for map to render in ' + 'Composer before the request is cancelled.<br/>A lower number prevents ' + 'overloading GeoServer with resource-monopolizing rendering ' + 'requests.<br/><br/>Minimum is 3 seconds.<br/><br/>Default is ' + '120 seconds.<br/>(This is set high so you can still render ' + 'large datasets, but we recommend reducing this for a more ' + 'performant or shared GeoServer).</small>';
  }
]).directive('formNameLayer', [
  '$controller',
  '$log',
  'GeoServer',
  '$rootScope',
  function ($controller, $log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        label: '=',
        form: '=',
        model: '='
      },
      templateUrl: '/components/modalform/modal.form.name.layer.tpl.html',
      replace: true,
      controller: function ($scope, $element) {
        angular.extend(this, $controller('ModalCtrl', { $scope: $scope }));
        $scope.setInvalid = function (invalid) {
          $scope.form.layerName.invalid = invalid;
        };
        $scope.$watch('form.layerName', function (newVal) {
          if (newVal != null && $scope.form.layerName) {
            $scope.setInvalid($scope.form.layerName.$dirty && ($scope.form.layerName.$error.required || $scope.$scope.form.layerName.$error.pattern || $scope.form.layerName.$error.maxlength));
          }
        });
      }
    };
  }
]).directive('formNameMap', [
  '$controller',
  '$log',
  'GeoServer',
  '$rootScope',
  function ($controller, $log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        label: '=',
        form: '=',
        model: '='
      },
      templateUrl: '/components/modalform/modal.form.name.map.tpl.html',
      replace: true,
      controller: function ($scope, $element) {
        angular.extend(this, $controller('ModalCtrl', { $scope: $scope }));
        $scope.setInvalid = function (invalid) {
          $scope.form.mapName.invalid = invalid;
        };
        $scope.$watch('form.mapName', function (newVal) {
          if (newVal != null && $scope.form.mapName) {
            $scope.setInvalid($scope.form.mapName.$dirty && ($scope.form.mapName.$error.required || $scope.$scope.form.mapName.$error.pattern || $scope.form.mapName.$error.maxlength));
          }
        });
      }
    };
  }
]).directive('formNameWorkspace', [
  '$controller',
  '$log',
  'GeoServer',
  '$rootScope',
  function ($controller, $log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        label: '=',
        form: '=',
        model: '='
      },
      templateUrl: '/components/modalform/modal.form.name.ws.tpl.html',
      replace: true,
      controller: function ($scope, $element) {
        angular.extend(this, $controller('ModalCtrl', { $scope: $scope }));
        $scope.setInvalid = function (invalid) {
          $scope.form.workspaceName.invalid = invalid;
        };
        $scope.$watch('form.workspaceName', function (newVal) {
          if (newVal != null && $scope.form.workspaceName) {
            $scope.setInvalid($scope.form.workspaceName.$dirty && ($scope.form.workspaceName.$error.required || $scope.$scope.form.workspaceName.$error.pattern || $scope.form.workspaceName.$error.maxlength));
          }
        });
      }
    };
  }
]).directive('formCrs', [
  '$controller',
  '$log',
  'GeoServer',
  '$rootScope',
  function ($controller, $log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        label: '=',
        form: '=',
        model: '='
      },
      templateUrl: '/components/modalform/modal.form.crs.tpl.html',
      replace: true,
      controller: function ($scope, $element) {
        angular.extend(this, $controller('ModalCtrl', { $scope: $scope }));
        $scope.setInvalid = function (invalid) {
          $scope.form.crs.invalid = invalid;
        };
        $scope.$watch('form.crs', function (newVal) {
          if (newVal != null && $scope.form.proj && $scope.form.crs) {
            $scope.setInvalid($scope.form.crs.$dirty && ($scope.form.proj.srs.$error.required || $scope.form.crs.$error.pattern || $scope.form.crs.$error.required));
          }
        });
      }
    };
  }
]).directive('formTitle', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        label: '=',
        form: '=',
        model: '='
      },
      templateUrl: '/components/modalform/modal.form.title.tpl.html',
      replace: true
    };
  }
]).directive('formDescription', [
  '$log',
  'GeoServer',
  '$rootScope',
  function ($log, GeoServer, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        label: '=',
        form: '=',
        model: '='
      },
      templateUrl: '/components/modalform/modal.form.description.tpl.html',
      replace: true
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.new', []).controller('WorkspaceNewCtrl', [
  '$modalInstance',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$log',
  'GeoServer',
  'workspacesListModel',
  '$timeout',
  'AppEvent',
  '_',
  function ($modalInstance, $scope, $rootScope, $state, $stateParams, $log, GeoServer, workspacesListModel, $timeout, AppEvent, _) {
    $scope.title = 'New Project';
    $scope.workspace = { default: false };
    $scope.workspaceCreated = false;
    $scope.defaultDesc = 'If a project is not specified ' + 'in a GeoServer request, the DEFAULT project is used.';
    $scope.showDefaultDesc = false;
    $scope.cancel = function () {
      $modalInstance.dismiss();
    };
    $scope.updateUri = function () {
      $scope.workspace.uri = 'http://' + $scope.workspace.name;
    };
    $scope.create = function () {
      var workspace = $scope.workspace;
      GeoServer.workspace.create(workspace).then(function (result) {
        if (result.success || result.status === 201) {
          $scope.workspace = result.data;
          $scope.workspaceCreated = true;
          workspacesListModel.addWorkspace($scope.workspace);
          $rootScope.alerts = [{
              type: 'success',
              message: 'Workspace ' + $scope.workspace.name + ' created.',
              fadeout: true
            }];
          $timeout(function () {
            $rootScope.$broadcast(AppEvent.WorkspaceTab, 'layers');
          }, 250);
          $modalInstance.close();
          $state.go('workspace', { workspace: $scope.workspace.name });
        } else {
          var msg = result.data.message ? result.data.message : result.data;
          $rootScope.alerts = [{
              type: 'warning',
              message: msg,
              fadeout: true
            }];
        }
      });
    };
    $scope.viewWorkspace = function () {
      $state.go('workspace', { workspace: $scope.workspace });
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.settings', [
  'gsApp.alertpanel',
  'ngSanitize'
]).controller('WorkspaceSettingsCtrl', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  '$modal',
  '$log',
  'workspace',
  'GeoServer',
  'AppEvent',
  function ($scope, $rootScope, $modalInstance, $modal, $log, workspace, GeoServer, AppEvent) {
    //Workspace name
    $scope.workspace = workspace;
    //workspace details
    $scope.wsSettings = {};
    $scope.form = {};
    var originalForm;
    $scope.defaultDesc = 'If a project workspace is not specified ' + 'in a GeoServer request, the DEFAULT project is used.';
    $scope.showDefaultDesc = false;
    GeoServer.workspace.get(workspace).then(function (result) {
      if (result.success) {
        var ws = result.data;
        $scope.wsSettings.name = ws.name;
        $scope.wsSettings.uri = ws.uri;
        $scope.wsSettings.default = ws.default;
        originalForm = angular.copy($scope.wsSettings);
      } else {
        $scope.alerts = [{
            type: 'warning',
            message: 'Workspace could not be loaded.',
            fadeout: true
          }];
      }
    });
    $scope.close = function () {
      $modalInstance.dismiss();
    };
    $scope.saveChanges = function () {
      if ($scope.form.settings.$dirty) {
        var patch = {};
        if (originalForm.name !== $scope.wsSettings.name) {
          patch.name = $scope.wsSettings.name;
        }
        if (originalForm.uri !== $scope.wsSettings.uri) {
          patch.uri = $scope.wsSettings.uri;
        }
        if (originalForm.default !== $scope.wsSettings.default) {
          patch.default = $scope.wsSettings.default;
        }
        GeoServer.workspace.update($scope.workspace, patch).then(function (result) {
          if (result.success) {
            if (patch.name) {
              // Update everything
              $rootScope.$broadcast(AppEvent.WorkspaceNameChanged, {
                'original': originalForm.name,
                'new': $scope.wsSettings.name
              });
              $scope.workspace = $scope.wsSettings.name;
            }
            $scope.wsSettings.saved = true;
            originalForm = angular.copy($scope.wsSettings);
            $modalInstance.close();
          } else {
            // TODO move alerts to top of header nav
            $scope.alerts = [{
                type: 'warning',
                message: 'Workspace update failed.',
                fadeout: true
              }];
          }
        });
      }
    };
  }
]);/*global mapcfg */
angular.module('gsApp.olexport', []).service('OlExport', [
  '$window',
  '$http',
  '$templateCache',
  'GeoServer',
  function ($window, $http, $templateCache, GeoServer) {
    /**
     * Wraps javascript in ol3 html template
     * @param {String} js A javascript string
     * @return {String} Html with embedded javascript
     */
    this.wrapHtml = function (js) {
      return $http.get('/components/olexport/ol.tpl.html', { cache: $templateCache }).then(function (res) {
        var html = res.data.replace(/\{\{js\}\}/, js);
        return html;
      });
    };
    /**
     * Given a map object outputs the js for an ol3 map
     * @param {Object} map A geoserver map object
     * @return {String} Generated js code.
     */
    this.fromMapObj = function (mapObj) {
      var workspace = mapObj.workspace, layer = mapObj.name, bbox = mapObj.bbox, extent = [
          bbox.west,
          bbox.south,
          bbox.east,
          bbox.north
        ], proj = mapObj.proj;
      var location = $window.location;
      var baseUrl = location.protocol + '//' + location.host + GeoServer.baseUrl();
      var cfg = {
          target: 'map',
          view: {
            center: bbox.center,
            zoom: 1
          },
          layers: [{
              type: 'Tile',
              opts: {
                source: {
                  type: 'TileWMS',
                  opts: {
                    url: baseUrl + '/' + workspace + '/wms',
                    serverType: 'geoserver',
                    params: {
                      'LAYERS': layer,
                      'TILED': true
                    }
                  }
                }
              }
            }]
        };
      if (proj && proj.srs) {
        cfg.view.projection = {
          srs: proj.srs,
          def: proj.wkt.replace(/[\r\n]/g, '')
        };
        if (mapObj.projectionExtent) {
          cfg.view.projection.extent = [
            mapObj.projectionExtent.west,
            mapObj.projectionExtent.south,
            mapObj.projectionExtent.east,
            mapObj.projectionExtent.north
          ];
        }
      }
      var js = mapcfg(cfg);
      //TODO: Move to mapcfg lib?
      if (extent) {
        js += '\n  var extent = [' + extent.join(',') + '];\n';
        js += '\n  map.getView().fitExtent(extent, map.getSize());\n';
      }
      return js;
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.projfield', [
  'ui.bootstrap',
  'gsApp.core.backend'
]).directive('projField', [
  '$log',
  '$timeout',
  '$modal',
  'GeoServer',
  '_',
  'projectionModel',
  'AppEvent',
  '$rootScope',
  function ($log, $timeout, $modal, GeoServer, _, projectionModel, AppEvent, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        proj: '=',
        defaultProj: '=',
        placeholder: '='
      },
      templateUrl: '/components/projfield/projfield.tpl.html',
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          projectionModel.fetchProjections().then(function () {
            $scope.projList = projectionModel.getProjections();
          });
          $scope.validateProj = function () {
            if ($scope.proj) {
              GeoServer.proj.get($scope.proj.srs).then(function (result) {
                $scope.valid = result.success;
                if (result.success) {
                  $scope.proj.wkt = result.data.wkt;
                }
              });
            }
          };
          $scope.showProjWKT = function () {
            $scope.popup = $modal.open({
              templateUrl: 'projfield.modal.html',
              controller: [
                '$scope',
                '$modalInstance',
                'proj',
                function ($scope, $modalInstance, proj) {
                  $scope.wkt = proj.wkt;
                  $scope.ok = function () {
                    $modalInstance.close();
                  };
                }
              ],
              resolve: {
                proj: function () {
                  return $scope.proj;
                },
                placeholder: function () {
                  return $scope.placeholder;
                }
              }
            });
          };
          $scope.ok = function () {
          };
          $scope.$watch('proj.srs', function (newVal) {
            if (newVal != null) {
              if ($scope.t != null) {
                $timeout.cancel($scope.t);
              }
              $scope.t = $timeout(function () {
                $scope.validateProj();
                $rootScope.$broadcast(AppEvent.ProjSet, $scope.proj);
              }, 1000);
            }
          });
        }
      ]
    };
  }
]).service('projectionModel', function (GeoServer, _) {
  var _this = this;
  this.projections = [];
  this.defaultProjections = [];
  this.getProjections = function () {
    return _this.projections.concat(_this.defaultProjections);
  };
  this.getDefaults = function () {
    return _this.defaultProjections;
  };
  this.fetchProjections = function () {
    _this.defaultProjections = [];
    return GeoServer.proj.get('EPSG:4326').then(function (result) {
      _this.defaultProjections.push(result.data);
    }).then(function () {
      GeoServer.proj.get('EPSG:3857').then(function (result) {
        _this.defaultProjections.push(result.data);
      }).then(function () {
        // non-default recently used projections
        return GeoServer.proj.recent().then(function (result) {
          _this.projections = _.remove(result.data, function (prj) {
            return prj.srs.toLowerCase() != 'epsg:4326' && prj.srs.toLowerCase() != 'epsg:3857';
          });
        });
      });
    });
  };
}).directive('focusMe', function ($timeout) {
  return {
    scope: { trigger: '=focusMe' },
    link: function (scope, element) {
      scope.$watch('trigger', function (value) {
        if (value === true) {
          $timeout(function () {
            element[0].focus();
            scope.trigger = false;
          });
        }
      });
    }
  };
});/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
/*global $, window*/
angular.module('gsApp.sidenav', [
  'gsApp.workspaces.home',
  'gsApp.workspaces.delete',
  'ui.bootstrap'
]).directive('sidenav', function () {
  return {
    restrict: 'EA',
    templateUrl: '/components/sidenav/sidenav.tpl.html',
    controller: 'SideNavCtrl',
    replace: true
  };
}).controller('SideNavCtrl', [
  '$scope',
  '$rootScope',
  'GeoServer',
  'AppEvent',
  '$state',
  '$log',
  '$modal',
  '$timeout',
  '$window',
  'AppSession',
  '$location',
  '_',
  'workspacesListModel',
  function ($scope, $rootScope, GeoServer, AppEvent, $state, $log, $modal, $timeout, $window, AppSession, $location, _, workspacesListModel) {
    $scope.toggleWkspc = {};
    // workspaces in wide sidenav
    $scope.toggleWkspc2 = {};
    // workspaces in collapse sidenav
    GeoServer.serverInfo.get().then(function (serverInfo) {
      $scope.serverInfo = serverInfo;
      if ($scope.serverInfo.status == 200) {
        $scope.status = 'ok';
      }
    });
    // Hug partial menu to sidebar bottom if height's enough
    $scope.onWindowResize = function () {
      var windowHeight = $window.innerHeight - 160;
      if (windowHeight < 300) {
        $scope.sideStyle = { 'position': 'relative' };
        $scope.sideBottom = { 'position': 'relative' };
      } else {
        $scope.sideStyle = { 'position': 'absolute' };
        if ($scope.toggleSide) {
          $scope.sideBottom = { 'top': windowHeight - 50 + 'px' };
        } else {
          $scope.sideBottom = { 'top': windowHeight - 30 + 'px' };
        }
      }
      $scope.numWorkspaces = Math.floor((windowHeight - 230) / 30);
    };
    $scope.onWindowResize();
    var timer = null;
    $(window).resize(function () {
      // angular $window checked too often
      if (timer === null) {
        timer = $timeout(function () {
          $scope.onWindowResize();
          timer = null;
        }, 700);
      }
    });
    // open any open workspace folders on refresh
    function checkPath() {
      $scope.alreadyOpen_ws = null;
      var loc = $location.path();
      var index = loc.indexOf('workspace/');
      if (index > -1) {
        var workspaceSubstr = loc.substring(index + 10);
        var lastindex = workspaceSubstr.indexOf('/');
        if (lastindex > -1) {
          $scope.alreadyOpen_ws = workspaceSubstr.substring(0, lastindex);
          if ($scope.workspaces) {
            // only open if workspaces already fetched
            reopenWorkspaceFolder();
          }
        }
      }
    }
    function reopenWorkspaceFolder() {
      if ($scope.alreadyOpen_ws !== null) {
        // reopen sidenav ws folder
        $scope.closeOthers($scope.alreadyOpen_ws);
      }
    }
    $scope.openWorkspaces = function () {
      $scope.workspaces = workspacesListModel.getWorkspaces();
      if (!$scope.workspaces) {
        workspacesListModel.fetchWorkspaces().then(function () {
          $scope.workspaces = workspacesListModel.getWorkspaces();
          $rootScope.$broadcast(AppEvent.WorkspacesFetched, $scope.workspaces);
        });
      }
      reopenWorkspaceFolder();
    };
    $scope.onResize = function () {
      $rootScope.$broadcast(AppEvent.SidenavResized);
      var windowHeight = $window.innerHeight - 160;
      if (windowHeight > 300) {
        if ($scope.toggleSide) {
          $scope.sideBottom = { 'top': windowHeight - 50 + 'px' };
        } else {
          $scope.sideBottom = { 'top': windowHeight - 30 + 'px' };
        }
      }
    };
    // re-open when sidebar toggled
    $scope.openWorkspace = function () {
      // find the open workspace and re-open
      var ws = $scope.workspaces;
      var open_ws, ws_inview, ws_notinview;
      if ($scope.toggleSide) {
        ws_inview = $scope.toggleWkspc2;
        ws_notinview = $scope.toggleWkspc;
      } else {
        ws_inview = $scope.toggleWkspc;
        ws_notinview = $scope.toggleWkspc2;
      }
      for (var t = 0; t < ws.length; t++) {
        if (ws_inview[ws[t].name]) {
          open_ws = ws[t].name;
        }
        ws_notinview[ws[t].name] = false;
      }
      ws_notinview[open_ws] = true;
    };
    $scope.closeAll = function () {
      if (!$scope.workspaces) {
        return;
      }
      var ws = $scope.workspaces;
      for (var t = 0; t < ws.length; t++) {
        $scope.toggleWkspc[ws[t].name] = false;
      }
    };
    $scope.closeOthers = function (workspacename) {
      $scope.closeAll();
      if (workspacename) {
        $scope.toggleWkspc[workspacename] = true;
      }
    };
    $scope.onWorkspaceClick = function (workspace) {
      if (!$scope.toggleWkspc[workspace.name]) {
        // open it
        $scope.closeOthers(workspace.name);
        var params = { workspace: workspace.name };
        var state = 'workspace';
        $state.go(state, params);
      } else {
        $scope.toggleWkspc[workspace.name] = !$scope.toggleWkspc[workspace.name];  // close it
      }
    };
    $scope.onWorkspaceTabClick = function (workspace, detail) {
      var params = { workspace: workspace.name };
      var state = 'workspace';
      if (detail) {
        state += '.' + detail;
      }
      $state.go(state, params);
    };
    // When collapsed
    $scope.onWorkspaceClick2 = function (workspace, detail) {
      if (!$scope.toggleWkspc2[workspace.name]) {
        // open it
        $scope.closeOthers2(workspace.name);
        var params = { workspace: workspace.name };
        var state = 'workspace';
        if (detail) {
          state += '.' + detail;
        }
        $state.go(state, params);
      } else {
        $scope.toggleWkspc2[workspace.name] = !$scope.toggleWkspc2[workspace.name];  // close it
      }
    };
    $scope.closeOthers2 = function (workspacename) {
      var workspaces = $scope.workspaces;
      for (var t = 0; t < workspaces.length; t++) {
        $scope.toggleWkspc2[workspaces[t].name] = false;
      }
      if (workspacename) {
        $scope.toggleWkspc2[workspacename] = true;
      }
    };
    $scope.newWorkspace = function () {
      var modalInstance = $modal.open({
          templateUrl: '/components/modalform/workspace/workspace.new.tpl.html',
          controller: 'WorkspaceNewCtrl',
          backdrop: 'static',
          size: 'md'
        });
    };
    $scope.deleteWorkspace = function (workspace) {
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/workspace.modal.delete.tpl.html',
          controller: 'WorkspaceDeleteCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return workspace.name;
            }
          }
        });
    };
    $rootScope.$on(AppEvent.Login, function (e, login) {
      $scope.openWorkspaces();
    });
    $rootScope.$on(AppEvent.WorkspacesFetched, function (scope, workspaces) {
      $scope.workspaces = workspaces;
      checkPath();
    });
    $rootScope.$on(AppEvent.WorkspaceSelected, function (scope, workspaceName) {
      $scope.closeOthers(workspaceName);
    });
    $rootScope.$on(AppEvent.WorkspaceNameChanged, function (scope, names) {
      $scope.workspaces.forEach(function (workspace) {
        if (workspace.name === names.original) {
          workspace.name = names.new;
          return;
        }
      });
    });
    $rootScope.$on(AppEvent.WorkspaceDeleted, function (scope, deletedSpaceName) {
      for (var p = 0; p < $scope.workspaces.length; p++) {
        if ($scope.workspaces[p].name === deletedSpaceName) {
          $scope.workspaces.splice(p, 1);
        }
      }
    });
    $rootScope.$on(AppEvent.ToggleSidenav, function (scope) {
      if (!$scope.toggleSide) {
        $scope.toggleSide = true;
        $timeout(function () {
          $scope.onResize();
        }, 450);
      }
    });
    $rootScope.$on(AppEvent.ServerError, function (scope, error) {
      $scope.alerts.push({
        type: 'danger',
        message: 'Server not responding ' + error.status + ': ' + error.data,
        fadeout: true
      });
    });
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 * License: BSD
 */
angular.module('gsApp.topnav', ['gsApp.alertlist']).directive('topNav', function () {
  return {
    restrict: 'EA',
    templateUrl: '/components/topnav/topnav.tpl.html'
  };
}).controller('TopNavCtrl', [
  '$scope',
  '$rootScope',
  'GeoServer',
  'AppEvent',
  '$modal',
  function ($scope, $rootScope, GeoServer, AppEvent, $modal) {
    $scope.logout = function () {
      GeoServer.logout().then(function () {
        $rootScope.$broadcast(AppEvent.Logout);
      });
    };
    $scope.errors = function () {
      //Show errors modal.
      $modal.open({
        templateUrl: '/components/alertpanel/alertlist.tpl.html',
        controller: 'AlertListCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          workspace: function () {
            return $scope.workspace;
          },
          maps: function () {
            return $scope.maps;
          }
        }
      });
    };
    $scope.adminLink = GeoServer.baseUrl();
    $scope.docUrl = '/suite-docs/';
    GeoServer.docUrl().then(function (result) {
      if (result.success && result.data.url) {
        $scope.docUrl = result.data.url;
      }
    });
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/**
 * Module for app authentication.
 */
angular.module('gsApp.core.auth', []).factory('AppSession', function () {
  var Session = function () {
  };
  Session.prototype.update = function (id, user) {
    this.active = true;
    this.id = id;
    this.user = user;
  };
  Session.prototype.clear = function () {
    this.active = false;
    this.id = null;
    this.user = null;
  };
  var session = new Session();
  session.clear();
  return session;
}).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('GeoServerAuth');
      }
    ]);
  }
]).factory('GeoServerAuth', [
  '$rootScope',
  '$q',
  'AppEvent',
  '$log',
  function ($rootScope, $q, AppEvent, $log) {
    return {
      request: function (config) {
        return config;
      },
      responseError: function (response) {
        if (response.status == 401) {
          if (!response.data) {
            //No message from the server; fill in our own
            response.data = { message: '401 Unauthorized' };
          }
          // don't broadcast if already trying to login
          if (response.config.url.indexOf('/login') == -1) {
            $rootScope.$broadcast(AppEvent.Unauthorized);
          }
        }
        return response;
      }
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/*global $:false */
/**
 * Module for backend api service.
 */
angular.module('gsApp.core.backend', ['gsApp.config']).factory('GeoServer', [
  '$http',
  '$resource',
  '$q',
  '$log',
  'AppEvent',
  'AppConfig',
  '$rootScope',
  function ($http, $resource, $q, $log, AppEvent, AppConfig, $rootScope) {
    var gsRoot = '/geoserver';
    var apiRoot = gsRoot + '/app/api';
    var importRoot = apiRoot + '/imports/';
    var restRoot = gsRoot + '/rest/';
    /*
       * simple wrapper around $http to set up defer/promise, etc...
       */
    var http = function (config) {
      var d = $q.defer();
      $http(config).success(function (data, status, headers, config) {
        d.resolve({
          success: status >= 200 && status < 300,
          status: status,
          data: data
        });
      }).error(function (data, status, headers, config) {
        $rootScope.$broadcast(AppEvent.ServerError, {
          status: status,
          data: data
        });
        d.reject({
          status: status,
          data: data
        });
      });
      return d.promise;
    };
    var getRemote = function (url) {
      return $q(function (resolve, reject) {
        var result = {
            success: false,
            status: 0,
            data: {}
          };
        $.ajax({
          type: 'HEAD',
          url: url,
          timeout: 3000,
          dataType: 'jsonp',
          jsonp: 'jsonp',
          success: function (response, message, xhr) {
            result.status = xhr.status;
            result.success = xhr.status >= 200 && xhr.status < 304;
            result.data.message = message;
            resolve(result);
          },
          error: function (xhr, message, errorThrown) {
            result.status = xhr.status;
            result.success = xhr.status >= 200 && xhr.status < 304;
            result.data.message = message;
            result.data.trace = errorThrown;
            resolve(result);
          }
        });
      });
    };
    return {
      baseUrl: function () {
        return gsRoot;
      },
      docUrl: function () {
        var url = '/suite-docs/';
        return getRemote(url).then(function (result) {
          if (result.success) {
            result.data.url = url;
            return result;
          } else {
            url = 'http://suite.opengeo.org/docs/' + AppConfig.SuiteVersion + '/';
            return getRemote(url);
          }
        }).then(function (result) {
          if (result.success) {
            result.data.url = url;
            return result;
          } else {
            url = 'http://suite.opengeo.org/docs/latest/';
            return getRemote(url);
          }
        }).then(function (result) {
          if (result.success) {
            result.data.url = url;
          }
          return result;
        });
      },
      serverInfo: {
        get: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/serverInfo'
          });
        },
        renderingTransforms: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/serverInfo/renderingTransforms'
          });
        }
      },
      import: {
        url: function (workspace) {
          return importRoot + workspace;
        },
        urlToStore: function (workspace, store) {
          return importRoot + workspace + '/' + store;
        },
        post: function (workspace, content) {
          return http({
            method: 'POST',
            url: importRoot + workspace,
            data: content
          });
        },
        wsInfo: function (workspace) {
          return http({
            method: 'GET',
            url: importRoot + workspace
          });
        },
        get: function (workspace, id) {
          return http({
            method: 'GET',
            url: importRoot + workspace + '/' + id
          });
        },
        update: function (workspace, id, content) {
          return http({
            method: 'PUT',
            url: importRoot + workspace + '/' + id,
            data: content
          });
        }
      },
      session: function () {
        return http({
          method: 'GET',
          url: apiRoot + '/login',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
      },
      login: function (username, password) {
        return http({
          method: 'POST',
          url: apiRoot + '/login',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: $.param({
            username: username,
            password: password
          })
        });
      },
      logout: function () {
        return http({
          method: 'GET',
          url: apiRoot + '/logout'
        });
      },
      workspaces: {
        get: function (cacheBool) {
          return http({
            cache: cacheBool,
            method: 'GET',
            url: apiRoot + '/workspaces'
          });
        },
        recent: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/workspaces/recent'
          });
        }
      },
      workspace: {
        get: function (workspace) {
          return http({
            method: 'GET',
            url: apiRoot + '/workspaces/' + workspace
          });
        },
        create: function (content) {
          return http({
            method: 'POST',
            url: apiRoot + '/workspaces',
            data: content
          });
        },
        update: function (workspace, patch) {
          return http({
            method: 'PUT',
            url: apiRoot + '/workspaces/' + workspace,
            data: patch
          });
        },
        delete: function (workspace) {
          return http({
            method: 'DELETE',
            url: apiRoot + '/workspaces/' + workspace
          });
        }
      },
      datastores: {
        get: function (workspace, page, count, sort, filter) {
          if (workspace) {
            if (workspace.name) {
              workspace = workspace.name;
            }
          } else {
            workspace = 'default';
          }
          page = page ? page : 0;
          count = count ? count : 25;
          sort = sort ? '&sort=' + sort : '';
          filter = filter ? '&filter=' + filter.replace(/#/g, '%23') : '';
          return http({
            method: 'GET',
            url: apiRoot + '/stores/' + workspace + '?page=' + page + '&count=' + count + sort + filter
          });
        },
        getDetails: function (workspace, store) {
          return http({
            method: 'GET',
            url: apiRoot + '/stores/' + workspace + '/' + store
          });
        },
        create: function (workspace, format, content) {
          return http({
            method: 'POST',
            url: apiRoot + '/stores/' + workspace + '/' + format,
            data: content
          });
        },
        update: function (workspace, store, patch) {
          return http({
            method: 'PATCH',
            url: apiRoot + '/stores/' + workspace + '/' + store,
            data: patch
          });
        },
        delete: function (workspace, store) {
          return http({
            method: 'DELETE',
            url: apiRoot + '/stores/' + workspace + '/' + store + '?recurse=true'
          });
        },
        getResource: function (workspace, store, resource) {
          return http({
            method: 'GET',
            url: apiRoot + '/stores/' + workspace + '/' + store + '/' + resource
          });
        },
        getAttributes: function (workspace, store, resource, count) {
          count = count ? count : 10;
          return http({
            method: 'GET',
            url: apiRoot + '/stores/' + workspace + '/' + store + '/' + resource + '/attributes?count=' + count
          });
        }
      },
      layers: {
        get: function (workspace, page, count, sort, filter) {
          if (workspace) {
            if (workspace.name) {
              workspace = workspace.name;
            }
          } else {
            workspace = 'default';
          }
          page = page ? page : 0;
          count = count ? count : 25;
          sort = sort ? '&sort=' + sort : '';
          filter = filter ? '&filter=' + filter.replace(/#/g, '%23') : '';
          return http({
            method: 'GET',
            url: apiRoot + '/layers/' + workspace + '?page=' + page + '&count=' + count + sort + filter
          });
        },
        getAll: function (workspace) {
          workspace = workspace ? workspace : 'default';
          return http({
            method: 'GET',
            url: apiRoot + '/layers/' + workspace
          });
        },
        recent: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/layers/recent'
          });
        },
        thumbnail: {
          get: function (workspace, layer, width, height) {
            var url = apiRoot + '/thumbnails/layers/' + workspace + '/' + layer;
            return url;
          }
        }
      },
      layer: {
        get: function (workspace, layer) {
          return http({
            method: 'GET',
            url: apiRoot + '/layers/' + workspace + '/' + layer
          });
        },
        create: function (workspace, layerInfo) {
          return http({
            method: 'POST',
            url: apiRoot + '/layers/' + workspace,
            data: layerInfo
          });
        },
        update: function (workspace, layer, patch) {
          return http({
            method: 'PATCH',
            url: apiRoot + '/layers/' + workspace + '/' + layer,
            data: patch
          });
        },
        delete: function (workspace, layer) {
          return http({
            method: 'DELETE',
            url: apiRoot + '/layers/' + workspace + '/' + layer
          });
        }
      },
      style: {
        get: function (workspace, layer) {
          return http({
            method: 'GET',
            url: apiRoot + '/layers/' + workspace + '/' + layer + '/style'
          });
        },
        put: function (workspace, layer, content, map) {
          var url = apiRoot + '/layers/' + workspace + '/' + layer + '/style';
          if (map) {
            url += '?map=' + map.name;
          }
          return http({
            method: 'PUT',
            url: url,
            data: content,
            headers: { 'Content-Type': 'application/vnd.geoserver.ysld+yaml' }
          });
        },
        getSLD: function (workspace, style, pretty) {
          var url;
          if (workspace != null) {
            url = restRoot + 'workspaces/' + workspace + '/styles/' + style + '.sld';
          } else {
            url = restRoot + 'styles/' + style + '.sld';
          }
          if (pretty) {
            url += '?pretty=' + pretty;
          }
          return http({
            method: 'GET',
            url: url,
            data: '',
            dataType: 'xml',
            headers: {
              'Content-Type': 'application/xml',
              'Accept': 'application/xml'
            }
          });
        }
      },
      maps: {
        get: function (workspace, page, count, sort, filter) {
          if (workspace) {
            if (workspace.name) {
              workspace = workspace.name;
            }
          } else {
            workspace = 'default';
          }
          page = page ? page : 0;
          count = count ? count : 25;
          sort = sort ? '&sort=' + sort : '';
          filter = filter ? '&filter=' + filter.replace(/#/g, '%23') : '';
          return http({
            method: 'GET',
            url: apiRoot + '/maps/' + workspace + '?page=' + page + '&count=' + count + sort + filter
          });
        },
        getAll: function (workspace) {
          return http({
            method: 'GET',
            url: apiRoot + '/maps/' + workspace
          });
        },
        post: function (workspace, name) {
          return http({
            method: 'GET',
            url: apiRoot + '/maps/' + workspace + '/' + name
          });
        },
        recent: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/maps/recent'
          });
        }
      },
      map: {
        get: function (workspace, name) {
          return http({
            method: 'GET',
            url: apiRoot + '/maps/' + workspace + '/' + name
          });
        },
        create: function (workspace, mapData) {
          return http({
            method: 'POST',
            url: apiRoot + '/maps/' + workspace,
            data: mapData
          });
        },
        update: function (workspace, name, patch) {
          return http({
            method: 'PATCH',
            url: apiRoot + '/maps/' + workspace + '/' + name,
            data: patch
          });
        },
        delete: function (workspace, name) {
          return http({
            method: 'DELETE',
            url: apiRoot + '/maps/' + workspace + '/' + name
          });
        },
        bounds: function (workspace, name, proj) {
          return http({
            method: 'PUT',
            url: apiRoot + '/maps/' + workspace + '/' + name + '/bounds',
            data: proj
          });
        },
        thumbnail: {
          get: function (workspace, map, width, height) {
            var url = apiRoot + '/thumbnails/maps/' + workspace + '/' + map;
            return url;
          }
        },
        openlayers: {
          get: function (workspace, layergroup, width, height) {
            var url = gsRoot + '/' + workspace + '/wms/reflect?layers=' + layergroup + '&width=' + width + '&height=' + height + '&format=application/openlayers';
            return url;
          }
        },
        layers: {
          get: function (workspace, map, layer) {
            return http({
              method: 'GET',
              url: apiRoot + '/maps/' + workspace + '/' + map + '/layers'
            });
          },
          add: function (workspace, map, layerData) {
            // adds to top
            return http({
              method: 'POST',
              url: apiRoot + '/maps/' + workspace + '/' + map + '/layers',
              data: layerData
            });
          },
          delete: function (workspace, map, layerName) {
            return http({
              method: 'DELETE',
              url: apiRoot + '/maps/' + workspace + '/' + map + '/layers/' + layerName
            });
          },
          put: function (workspace, map, layers) {
            return http({
              method: 'PUT',
              url: apiRoot + '/maps/' + workspace + '/' + map + '/layers',
              data: JSON.stringify(layers)
            });
          }
        }
      },
      icons: {
        get: function (workspace) {
          return http({
            method: 'GET',
            url: apiRoot + '/icons/list/' + workspace
          });
        }
      },
      icon: {
        get: function (workspace, name) {
          return http({
            method: 'GET',
            url: apiRoot + '/icons/' + workspace + '/' + name
          });
        },
        url: function (workspace) {
          return apiRoot + '/icons/' + workspace;
        }
      },
      proj: {
        recent: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/projections/recent'
          });
        },
        get: function (srs) {
          return http({
            method: 'GET',
            url: apiRoot + '/projections/' + srs
          });
        }
      },
      formats: {
        get: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/formats/'
          });
        },
        getFormat: function (format) {
          return http({
            method: 'GET',
            url: apiRoot + '/formats/' + format
          });
        }
      },
      format: {
        get: function (name) {
          return http({
            method: 'GET',
            url: apiRoot + '/formats/' + name
          });
        }
      },
      gridsets: {
        getAll: function () {
          return http({
            method: 'GET',
            url: apiRoot + '/gwc/gridsets'
          });
        }
      }
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.core', [
  'gsApp.core.event',
  'gsApp.core.auth',
  'gsApp.core.backend',
  'gsApp.core.utilities'
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/**
 * Module containing global constants for the app.
 */
angular.module('gsApp.core.event', []).constant('AppEvent', {
  BaseMapChanged: 'basemap-changed',
  CreateNewMap: 'create-new-map',
  CreateNewWorkspace: 'create-new-workspace',
  EditorBackground: 'editor-background',
  ImportData: 'import-data',
  LayerAdded: 'layers-added',
  LayersAllUpdated: 'layers-all-updated',
  LayerUpdated: 'layer-updated',
  Login: 'app-login',
  Logout: 'app-logout',
  MapAdded: 'map-added',
  MapsAllUpdated: 'maps-all-updated',
  MapControls: 'map-controls',
  MapEdited: 'map-edited',
  MapRenderTimeoutUpdated: 'map-rendertimeout-updated',
  MapSettingsUpdated: 'map-settings-updated',
  MapUpdated: 'map-updated',
  ProjSet: 'projection-set',
  ServerError: 'server-error',
  SidenavResized: 'app-sidenav-resized',
  StoreAdded: 'store-added',
  StoreUpdated: 'store-updated',
  ToggleFullscreen: 'toggle-fullscreen',
  ToggleSidenav: 'toggle-sidenav',
  Unauthorized: 'app-auth-unauthorized',
  WorkspaceCreated: 'workspace-created',
  WorkspaceDeleted: 'workspace-deleted',
  WorkspacesFetched: 'workspaces-fetched',
  WorkspaceNameChanged: 'workspace-name-changed',
  WorkspaceSelected: 'workspaces-selected',
  WorkspaceTab: 'workspace-tab'
});/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.login', []).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/core/login/login.tpl.html',
      controller: 'LoginCtrl'
    });
  }
]).controller('LoginCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  'GeoServer',
  'AppEvent',
  function ($scope, $rootScope, $state, GeoServer, AppEvent) {
    $scope.title = 'Login';
    $scope.creds = {};
    $scope.loginFailed = false;
    $rootScope.enableAlerts = true;
    $scope.alertsOff = function () {
      $rootScope.enableAlerts = false;
    };
    $scope.login = function () {
      GeoServer.login($scope.creds.username, $scope.creds.password).then(function (result) {
        // update form failed flag
        $scope.loginFailed = !result.success;
        return result;
      }).then(function (result) {
        // broadcast login info
        if (result.success) {
          $rootScope.enableAlerts = true;
          $rootScope.$broadcast(AppEvent.Login, result.data);
        }
        return result;
      }).then(function (result) {
        if (result.success) {
          // redirect to the previous state
          var prev = $scope.state.prev;
          if (!prev || !prev.name || prev.name.url.indexOf('/login') != -1 || prev.name.name === '') {
            $state.go('home');
          } else {
            $state.go(prev.name, prev.params);
          }
        }
        return result;
      }).catch(function (result) {
      });
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.login.modal', []).controller('LoginModalCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$modalInstance',
  '$interval',
  'GeoServer',
  'AppEvent',
  'countdown',
  function ($scope, $rootScope, $state, $modalInstance, $interval, GeoServer, AppEvent, countdown) {
    $scope.title = 'Login';
    $scope.creds = {};
    $scope.loginFailed = false;
    $rootScope.enableAlerts = true;
    var interval;
    if (countdown) {
      $scope.countdown = countdown;
      var countdownMessage = function () {
        $scope.countdown--;
        if ($scope.countdown > 0) {
          $scope.message = 'Your session will expire in ' + $scope.countdown + ' second' + ($scope.countdown != 1 ? 's' : '') + ', please login again.';
        } else {
          $interval.cancel(interval);
          $scope.message = 'Your session has expired due to inactivity. Please login again.';
        }
      };
      countdownMessage();
      interval = $interval(countdownMessage, 1000);
    } else {
      //Default message if no countdown
      $scope.message = 'You are not logged in. Please login.';
    }
    $scope.alertsOff = function () {
      $rootScope.enableAlerts = false;
    };
    $scope.login = function () {
      GeoServer.login($scope.creds.username, $scope.creds.password).then(function (result) {
        // update form failed flag
        $scope.loginFailed = !result.success;
        if ($scope.loginFailed) {
          $scope.message = null;
          if (interval) {
            $interval.cancel(interval);
          }
        }
        return result;
      }).then(function (result) {
        // Dismis the modal and go back to whatever we were doing
        if (result.success) {
          $modalInstance.close('login');
          $rootScope.enableAlerts = true;
          $scope.$parent.modal = false;
          $rootScope.$broadcast(AppEvent.Login, result.data);
        }
        return result;
      }).catch(function (result) {
      });
    };
    $scope.cancel = function () {
      //Stay logged out; go to the logout page.
      $modalInstance.dismiss('logout');
      $scope.$parent.modal = false;
      $rootScope.$broadcast(AppEvent.Logout);
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
/**
 * Module for reusable utitlies.
 */
// http://goo.gl/huaMt1
angular.module('gsApp.core.utilities', []).directive('httpPrefix', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, controller) {
      function ensureHttpPrefix(value) {
        // Need to add prefix if we don't have http:// prefix already
        if (value && !/^(https?):\/\//i.test(value) && 'http://'.indexOf(value) === -1) {
          controller.$setViewValue('http://' + value);
          controller.$render();
          return 'http://' + value;
        } else {
          return value;
        }
      }
      controller.$formatters.push(ensureHttpPrefix);
      controller.$parsers.splice(0, 0, ensureHttpPrefix);
    }
  };
}).directive('popoverHtmlUnsafePopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      title: '@',
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: '/core/modals/popover-html-unsafe.tpl.html'
  };
}).directive('popoverHtmlUnsafe', [
  '$tooltip',
  function ($tooltip) {
    return $tooltip('popoverHtmlUnsafe', 'popover', 'click');
  }
]).filter('partition', function () {
  var cache = {};
  var filter = function (arr, size) {
    if (!arr) {
      return;
    }
    var newArr = [];
    for (var i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    var arrString = JSON.stringify(arr);
    var fromCache = cache[arrString + size];
    if (JSON.stringify(fromCache) === JSON.stringify(newArr)) {
      return fromCache;
    }
    cache[arrString + size] = newArr;
    return newArr;
  };
  return filter;
}).filter('truncate', function () {
  return function (value, byword, max, tailEnd, tail) {
    if (!value) {
      return '';
    }
    max = parseInt(max, 10);
    if (!max) {
      return value;
    }
    if (value.length <= max) {
      return value;
    }
    var newValue = value.substr(0, max);
    if (byword) {
      var lastspace = newValue.lastIndexOf(' ');
      if (lastspace != -1) {
        newValue = newValue.substr(0, lastspace);
      }
    }
    if (tailEnd) {
      // include tail end of string
      var lastSlash = value.lastIndexOf('/');
      if (lastSlash != -1) {
        tail = value.substring(lastSlash);
      }
    }
    if (!tail) {
      tail = '';
    }
    return newValue + ' \u2026 ' + tail;
  };
}).directive('popPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      title: '@',
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'template/popover/popover.html'
  };
}).directive('pop', function ($tooltip, $timeout) {
  var tooltip = $tooltip('pop', 'pop', 'event');
  var compile = angular.copy(tooltip.compile);
  tooltip.compile = function (element, attrs) {
    var parentCompile = compile(element, attrs);
    return function (scope, element, attrs) {
      var first = true;
      attrs.$observe('popShow', function (val) {
        if (JSON.parse(!first || val || false)) {
          $timeout(function () {
            element.triggerHandler('event');
          });
        }
        first = false;
      });
      parentCompile(scope, element, attrs);
    };
  };
  return tooltip;
}).filter('bytesize', function () {
  return function (bytes) {
    if (bytes == null || bytes == 0) {
      return '0 Byte';
    }
    var k = 1000;
    var sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB',
        'EB',
        'ZB',
        'YB'
      ];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  };
}).filter('firstCaps', function () {
  return function (str) {
    if (str == null) {
      return null;
    }
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
}).directive('focusInit', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      $timeout(function () {
        element[0].focus();
      }, 100);
    }
  };
}).directive('resizer', function ($document, $window) {
  return function ($scope, $element, $attrs) {
    var screenWidth, sideWidth, panelsWidth, lastMapWidth, lastEditorWidth, rightMin = 0, leftMin = 0;
    $element.on('mousedown', function (event) {
      event.preventDefault();
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
      sideWidth = angular.element('#sidebar-wrapper').width();
      screenWidth = $window.innerWidth;
      panelsWidth = screenWidth - sideWidth;
      if ($attrs.rightMin) {
        rightMin = screenWidth - parseInt($attrs.rightMin);
      }
      if ($attrs.leftMin) {
        leftMin = parseInt($attrs.leftMin);
      }
      $element.addClass('active');
    });
    $scope.$watch('fullscreen', function (newVal) {
      if (newVal) {
        var left = $('.resizable-left');
        var right = $('.resizable-right');
        //lastMapWidth = left[0].width();
        //lastEditorWidth = right[0].width();
        left.each(function (i, element) {
          element.style.width = '';
        });
        right.each(function (i, element) {
          element.style.width = '';
        });
      }
    });
    function mousemove(event) {
      event.preventDefault();
      var xPos = event.pageX;
      if (xPos < leftMin) {
        xPos = leftMin;
      }
      if (xPos > rightMin) {
        xPos = rightMin;
      }
      var mapWidth = xPos - sideWidth;
      var editorWidth = screenWidth - xPos;
      var left = $('.resizable-left');
      var right = $('.resizable-right');
      left.each(function (i, element) {
        element.style.width = 100 * mapWidth / panelsWidth + '%';
      });
      right.each(function (i, element) {
        element.style.width = 100 * editorWidth / panelsWidth + '%';
      });
      var listHeader = $('.reorder-info');
      if (listHeader[0]) {
        listHeader[0].style.width = $('ul.layerlist-list').width() + 'px';
      }
    }
    function mouseup() {
      $element.removeClass('active');
      $document.off('mousemove', mousemove);
      $document.off('mouseup', mouseup);
      $scope.onUpdatePanels();
    }
  };
}).factory('YsldColors', function () {
  //YSLD uses the X11 spec: http://en.wikipedia.org/wiki/X11_color_names
  //Values taken from org.geotools.ysld.Colors
  var namedColors = {
      'aliceblue': 'rgb(240,248,255)',
      'yellowgreen': 'rgb(154,205,50)',
      'antiquewhite': 'rgb(250,235,215)',
      'aqua': 'rgb(0,255,255)',
      'aquamarine': 'rgb(127,255,212)',
      'azure': 'rgb(240,255,255)',
      'beige': 'rgb(245,245,220)',
      'bisque': 'rgb(255,228,196)',
      'black': 'rgb(0,0,0)',
      'blanchedalmond': 'rgb(255,235,205)',
      'blue': 'rgb(0,0,255)',
      'blueviolet': 'rgb(138,43,226)',
      'brown': 'rgb(165,42,42)',
      'burlywood': 'rgb(222,184,135)',
      'cadetblue': 'rgb(95,158,160)',
      'chartreuse': 'rgb(127,255,0)',
      'chocolate': 'rgb(210,105,30)',
      'coral': 'rgb(255,127,80)',
      'cornflowerblue': 'rgb(100,149,237)',
      'cornsilk': 'rgb(255,248,220)',
      'crimson': 'rgb(220,20,60)',
      'cyan': 'rgb(0,255,255)',
      'darkblue': 'rgb(0,0,139)',
      'darkcyan': 'rgb(0,139,139)',
      'darkgoldenrod': 'rgb(184,134,11)',
      'darkgray': 'rgb(169,169,169)',
      'darkgreen': 'rgb(0,100,0)',
      'darkkhaki': 'rgb(189,183,107)',
      'darkmagenta': 'rgb(139,0,139)',
      'darkolivegreen': 'rgb(85,107,47)',
      'darkorange': 'rgb(255,140,0)',
      'darkorchid': 'rgb(153,50,204)',
      'darkred': 'rgb(139,0,0)',
      'darksalmon': 'rgb(233,150,122)',
      'darkseagreen': 'rgb(143,188,143)',
      'darkslateblue': 'rgb(72,61,139)',
      'darkslategray': 'rgb(47,79,79)',
      'darkturquoise': 'rgb(0,206,209)',
      'darkviolet': 'rgb(148,0,211)',
      'deeppink': 'rgb(255,20,147)',
      'deepskyblue': 'rgb(0,191,255)',
      'dimgray': 'rgb(105,105,105)',
      'dodgerblue': 'rgb(30,144,255)',
      'firebrick': 'rgb(178,34,34)',
      'floralwhite': 'rgb(255,250,240)',
      'forestgreen': 'rgb(34,139,34)',
      'fuchsia': 'rgb(255,0,255)',
      'gainsboro': 'rgb(220,220,220)',
      'ghostwhite': 'rgb(248,248,255)',
      'gold': 'rgb(255,215,0)',
      'goldenrod': 'rgb(218,165,32)',
      'gray': 'rgb(128,128,128)',
      'green': 'rgb(0,128,0)',
      'greenyellow': 'rgb(173,255,47)',
      'honeydew': 'rgb(240,255,240)',
      'hotpink': 'rgb(255,105,180)',
      'indianred': 'rgb(205,92,92)',
      'indigo': 'rgb(75,0,130)',
      'ivory': 'rgb(255,255,240)',
      'khaki': 'rgb(240,230,140)',
      'lavender': 'rgb(230,230,250)',
      'lavenderblush': 'rgb(255,240,245)',
      'lawngreen': 'rgb(124,252,0)',
      'lemonchiffon': 'rgb(255,250,205)',
      'lightblue': 'rgb(173,216,230)',
      'lightcoral': 'rgb(240,128,128)',
      'lightcyan': 'rgb(224,255,255)',
      'lightgoldenrodyellow': 'rgb(250,250,210)',
      'lightgreen': 'rgb(144,238,144)',
      'lightgrey': 'rgb(211,211,211)',
      'lightpink': 'rgb(255,182,193)',
      'lightsalmon': 'rgb(255,160,122)',
      'lightseagreen': 'rgb(32,178,170)',
      'lightskyblue': 'rgb(135,206,250)',
      'lightslategray': 'rgb(119,136,153)',
      'lightsteelblue': 'rgb(176,196,222)',
      'lightyellow': 'rgb(255,255,224)',
      'lime': 'rgb(0,255,0)',
      'limegreen': 'rgb(50,205,50)',
      'linen': 'rgb(250,240,230)',
      'magenta': 'rgb(255,0,255)',
      'maroon': 'rgb(128,0,0)',
      'mediumaquamarine': 'rgb(102,205,170)',
      'mediumblue': 'rgb(0,0,205)',
      'mediumorchid': 'rgb(186,85,211)',
      'mediumpurple': 'rgb(147,112,219)',
      'mediumseagreen': 'rgb(60,179,113)',
      'mediumslateblue': 'rgb(123,104,238)',
      'mediumspringgreen': 'rgb(0,250,154)',
      'mediumturquoise': 'rgb(72,209,204)',
      'mediumvioletred': 'rgb(199,21,133)',
      'midnightblue': 'rgb(25,25,112)',
      'mintcream': 'rgb(245,255,250)',
      'mistyrose': 'rgb(255,228,225)',
      'moccasin': 'rgb(255,228,181)',
      'navajowhite': 'rgb(255,222,173)',
      'navy': 'rgb(0,0,128)',
      'oldlace': 'rgb(253,245,230)',
      'olive': 'rgb(128,128,0)',
      'olivedrab': 'rgb(107,142,35)',
      'orange': 'rgb(255,165,0)',
      'orangered': 'rgb(255,69,0)',
      'orchid': 'rgb(218,112,214)',
      'palegoldenrod': 'rgb(238,232,170)',
      'palegreen': 'rgb(152,251,152)',
      'paleturquoise': 'rgb(175,238,238)',
      'palevioletred': 'rgb(219,112,147)',
      'papayawhip': 'rgb(255,239,213)',
      'peachpuff': 'rgb(255,218,185)',
      'peru': 'rgb(205,133,63)',
      'pink': 'rgb(255,192,203)',
      'plum': 'rgb(221,160,221)',
      'powderblue': 'rgb(176,224,230)',
      'purple': 'rgb(128,0,128)',
      'red': 'rgb(255,0,0)',
      'rosybrown': 'rgb(188,143,143)',
      'royalblue': 'rgb(65,105,225)',
      'saddlebrown': 'rgb(139,69,19)',
      'salmon': 'rgb(250,128,114)',
      'sandybrown': 'rgb(244,164,96)',
      'seagreen': 'rgb(46,139,87)',
      'seashell': 'rgb(255,245,238)',
      'sienna': 'rgb(160,82,45)',
      'silver': 'rgb(192,192,192)',
      'skyblue': 'rgb(135,206,235)',
      'slateblue': 'rgb(106,90,205)',
      'slategray': 'rgb(112,128,144)',
      'snow': 'rgb(255,250,250)',
      'springgreen': 'rgb(0,255,127)',
      'steelblue': 'rgb(70,130,180)',
      'tan': 'rgb(210,180,140)',
      'teal': 'rgb(0,128,128)',
      'thistle': 'rgb(216,191,216)',
      'tomato': 'rgb(255,99,71)',
      'turquoise': 'rgb(64,224,208)',
      'violet': 'rgb(238,130,238)',
      'wheat': 'rgb(245,222,179)',
      'white': 'rgb(255,255,255)',
      'whitesmoke': 'rgb(245,245,245)',
      'yellow': 'rgb(255,255,0)'
    };
  //Values
  var VALUE_PATTERN = /0x([a-f0-9]{6})\b|'\s*#([a-f0-9]{6})\s*'|"\s*#([a-f0-9]{6})\s*"|'\s*([a-f0-9]{6})\s*'|"\s*([a-f0-9]{6})\s*"|'\s*#([a-f0-9]{3})\s*'|"\s*#([a-f0-9]{3})\s*"|'\s*([a-f0-9]{3})\s*'|"\s*([a-f0-9]{3})\s*"|\brgb\(\s*(?:[0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b\s*,\s*(?:[0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b\s*,\s*(?:[0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b\s*\)/i;
  //Values + Names, matches anything that can be decoded
  var COLOR_PATTERN = /0x[a-f0-9]{6}\b|'\s*#[a-f0-9]{6}\s*'|"\s*#[a-f0-9]{6}\s*"|'\s*[a-f0-9]{6}\s*'|"\s*[a-f0-9]{6}\s*"|'\s*#[a-f0-9]{3}\s*'|"\s*#[a-f0-9]{3}\s*"|'\s*[a-f0-9]{3}\s*'|"\s*[a-f0-9]{3}\s*"|\brgb\(\s*(?:[0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b\s*,\s*(?:[0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b\s*,\s*(?:[0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b\s*\)|aliceblue|yellowgreen|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow/i;
  return {
    decode: function (color) {
      color = color.trim();
      var val = null;
      var match = color.match(VALUE_PATTERN);
      if (match) {
        val = match[0];
        for (var i = 1; i < match.length; i++) {
          if (match[i]) {
            val = '#' + match[i];
            break;
          }
        }
        return val;
      }
      return namedColors[color];
    },
    COLOR_PATTERN: COLOR_PATTERN,
    names: Object.keys(namedColors)
  };
});/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.home', ['gsApp.editor.map']).config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
      url: '/',
      templateUrl: '/home/home.tpl.html',
      controller: 'HomeCtrl'
    });
  }
]).controller('HomeCtrl', [
  '$scope',
  '$rootScope',
  'GeoServer',
  '$state',
  function ($scope, $rootScope, GeoServer, $state) {
    $scope.title = 'Recent';
    GeoServer.workspaces.get(true).then(function (result) {
      $scope.workspaces = result.data;
    });
    GeoServer.workspaces.recent().then(function (result) {
      if (result.success) {
        $scope.recentWorkspaces = result.data;
        if ($scope.recentWorkspaces.length > 0) {
          $scope.isCollapsed = true;
        }
      } else {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Could not get recent workspaces',
            fadeout: true
          }];
      }
    });
    GeoServer.maps.recent().then(function (result) {
      if (result.success) {
        $scope.recentMaps = result.data;
        if ($scope.recentMaps.length > 0) {
          $scope.isCollapsed = true;
        }
      } else {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Could not get recent maps',
            fadeout: true
          }];
      }
    });
    GeoServer.layers.recent().then(function (result) {
      if (result.success) {
        $scope.recentLayers = result.data;
        if ($scope.recentLayers.length > 0) {
          $scope.isCollapsed = true;
        }
      } else {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Could not get recent layers',
            fadeout: true
          }];
      }
    });
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.layers', [
  'ngGrid',
  'ui.select',
  'ngSanitize',
  'gsApp.alertpanel',
  'gsApp.editor.layer',
  'gsApp.core.utilities',
  'gsApp.workspaces.data',
  'gsApp.workspaces.layers.delete',
  'gsApp.errorPanel'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('layers', {
      url: '/layers',
      templateUrl: '/layers/layers.tpl.html',
      controller: 'LayersCtrl'
    }).state('layer', {
      abstract: true,
      url: '/layers/:workspace/:name',
      templateUrl: '/layers/detail/layer.tpl.html'
    });
  }
]).controller('LayersCtrl', [
  '$scope',
  'GeoServer',
  '$state',
  'AppEvent',
  '$log',
  '$window',
  '$rootScope',
  '$modal',
  '$sce',
  '$timeout',
  '_',
  function ($scope, GeoServer, $state, AppEvent, $log, $window, $rootScope, $modal, $sce, $timeout, _) {
    $scope.title = 'All Layers';
    $scope.thumbnail = '';
    $scope.dropdownBoxSelected = '';
    $scope.onStyleEdit = function (layer) {
      $state.go('editlayer', {
        workspace: layer.workspace,
        name: layer.name
      });
    };
    $scope.$on('ngGridEventEndCellEdit', function (evt) {
      var target = evt.targetScope;
      var field = target.col.field;
      var layer = target.row.entity;
      var patch = {};
      patch[field] = layer[field];
      GeoServer.layer.update(layer.workspace, layer.name, { title: patch[field] });
    });
    $scope.workspace = {};
    $scope.workspaces = [];
    var selectedWorkspace;
    $scope.go = function (route, workspace) {
      $state.go(route, { workspace: workspace });
    };
    $scope.addSelectedToMap = function () {
      var map = $scope.selectedMap;
      var mapInfo = {
          'name': map.name,
          'proj': map.proj,
          'description': map.description
        };
      mapInfo.layers = [];
      _.forEach($scope.layerSelections, function (layer) {
        mapInfo.layers.push({
          'name': layer.name,
          'workspace': selectedWorkspace
        });
      });
      // 1. Create New map from Layers tab - selected layers
      if (map.name === 'Create New Map') {
        mapInfo.name = null;
        if (mapInfo.layers.length == 0) {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Please select a layer or import data and ' + 'create a new layer. A map requires at least one layer.',
              fadeout: true
            }];
        } else {
          var createNewMapModal = $modal.open({
              templateUrl: '/workspaces/detail/maps/createnew/map.new.fromselected.tpl.html',
              controller: 'NewMapFromSelectedCtrl',
              backdrop: 'static',
              size: 'lg',
              resolve: {
                workspace: function () {
                  return selectedWorkspace;
                },
                mapInfo: function () {
                  return mapInfo;
                }
              }
            });
        }
        return;
      }
      if (mapInfo.layers.length == 0) {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Select layers to add to the map below.',
            fadeout: true
          }];
        return;
      }
      GeoServer.map.layers.add(selectedWorkspace, mapInfo.name, mapInfo.layers).then(function (result) {
        if (result.success) {
          $rootScope.alerts = [{
              type: 'success',
              message: mapInfo.layers.length + ' layer(s) added to ' + mapInfo.name + ', now with ' + result.data.length + ' total.',
              fadeout: true
            }];
          $state.go('editmap', {
            workspace: selectedWorkspace,
            name: mapInfo.name
          });
        } else {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Layer(s) could not be added to map ' + mapInfo.name + '.',
              fadeout: true
            }];
        }
      });
    };
    $scope.setMap = function (map) {
      $scope.selectedMap = map;
    };
    $scope.editLayerSettings = function (layer) {
      var modalInstance = $modal.open({
          templateUrl: '/components/modalform/layer/layer.settings.tpl.html',
          controller: 'EditLayerSettingsCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return selectedWorkspace;
            },
            layer: function () {
              return layer;
            }
          }
        }).result.then(function (response) {
          $scope.refreshLayers();
        });
    };
    $scope.addDataSource = function () {
      $state.go('workspaces.data.import', { workspace: selectedWorkspace });
    };
    // See utilities.js pop directive - 1 popover open at a time
    var openPopoverDownload;
    $scope.closePopovers = function (popo) {
      if (openPopoverDownload || openPopoverDownload === popo) {
        openPopoverDownload.showSourcePopover = false;
        openPopoverDownload = null;
      } else {
        popo.showSourcePopover = true;
        openPopoverDownload = popo;
      }
    };
    $scope.linkDownloads = function (layer) {
      if (layer.type === 'vector') {
        var vector_baseurl = GeoServer.baseUrl() + '/' + layer.workspace + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + layer.workspace + ':' + layer.name + '&outputformat=';
        var shape = vector_baseurl + 'SHAPE-ZIP';
        var geojson = vector_baseurl + 'application/json';
        var kml = vector_baseurl + 'application/vnd.google-earth.kml%2Bxml';
        var gml3 = vector_baseurl + 'application/gml%2Bxml; version=3.2';
        layer.download_urls = '';
        layer.download_urls += '<a target="_blank" href="' + shape + '">Shapfile</a> <br/>';
        layer.download_urls += '<a target="_blank" href="' + geojson + '">GeoJSON</a> <br/>';
        layer.download_urls += '<a target="_blank" href="' + kml + '">KML</a> <br />';
        layer.download_urls += '<a target="_blank" href="' + gml3 + '">GML 3.2</a>';
      } else if (layer.type === 'raster') {
        var bbox = [
            layer.bbox.native.west,
            layer.bbox.native.south,
            layer.bbox.native.east,
            layer.bbox.native.north
          ];
        bbox = bbox.join();
        var baseurl = GeoServer.baseUrl() + '/' + layer.workspace + '/wms?service=WMS&amp;version=1.1.0&request=GetMap&layers=' + layer.workspace + ':' + layer.name + '&width=600&height=600&srs=' + layer.proj.srs + '&bbox=' + bbox + '&format=';
        var ol2 = baseurl + 'application/openlayers';
        var geotiff = baseurl + 'image/geotiff';
        var png = baseurl + 'image/png';
        var jpeg = baseurl + 'image/jpeg';
        var kml_raster = baseurl + 'application/vnd.google-earth.kml%2Bxml';
        layer.download_urls = '';
        layer.download_urls += '<a target="_blank" href="' + ol2 + '">OpenLayers</a> <br />';
        layer.download_urls += '<a target="_blank" href="' + geotiff + '">GeoTIFF</a> <br />';
        layer.download_urls += '<a target="_blank" href="' + png + '">PNG</a> <br />';
        layer.download_urls += '<a target="_blank" href="' + jpeg + '">JPEG</a> <br />';
        layer.download_urls += '<a target="_blank" href="' + kml_raster + '">KML</a> <br />';
      }
      layer.urls_ready = true;
      layer.download_urls = $sce.trustAsHtml(layer.download_urls);
    };
    $scope.opts = {
      paging: {
        pageSizes: [
          15,
          50,
          100
        ],
        pageSize: 15,
        currentPage: 1
      },
      sort: {
        fields: ['name'],
        directions: ['asc']
      },
      filter: { filterText: '' }
    };
    $scope.layerSelections = [];
    $scope.gridOptions = {
      data: 'layerData',
      primaryKey: 'name',
      enableCellSelection: false,
      enableRowSelection: true,
      enableCellEdit: false,
      checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox"' + 'ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
      int: function () {
        $log('done');
      },
      sortInfo: $scope.opts.sort,
      showSelectionCheckbox: true,
      selectWithCheckboxOnly: true,
      selectedItems: $scope.layerSelections,
      multiSelect: true,
      columnDefs: [
        {
          field: 'name',
          displayName: 'Layer',
          cellTemplate: '<div class="grid-text-padding"' + 'title="{{row.entity.name}}">' + '{{row.entity.name}}' + '</div>',
          width: '14%'
        },
        {
          field: 'title',
          displayName: 'Title',
          enableCellEdit: true,
          cellTemplate: '<div class="grid-text-padding"' + 'alt="{{row.entity.description}}"' + 'title="{{row.entity.description}}">' + '{{row.entity.title}}' + '</div>',
          width: '18%'
        },
        {
          field: 'geometry',
          displayName: 'Type',
          cellClass: 'text-center',
          cellTemplate: '<div get-type ' + 'geometry="{{row.entity.geometry}}">' + '</div>',
          width: '5%',
          sortable: false
        },
        {
          field: 'srs',
          displayName: 'SRS',
          cellClass: 'text-center',
          cellTemplate: '<div class="grid-text-padding">' + '{{row.entity.proj.srs}}' + '</div>',
          width: '8%',
          sortable: false
        },
        {
          field: 'settings',
          displayName: 'Settings',
          cellClass: 'text-center',
          sortable: false,
          cellTemplate: '<div ng-class="col.colIndex()">' + '<a ng-click="editLayerSettings(row.entity)">' + '<i class="fa fa-gear grid-icons" ' + 'alt="Edit Layer Settings" ' + 'title="Edit Layer Settings"></i>' + '</a>' + '</div>',
          width: '6%'
        },
        {
          field: 'style',
          displayName: 'Styles',
          cellClass: 'text-center',
          sortable: false,
          cellTemplate: '<div class="grid-text-padding" ng-class="col.colIndex()">' + '<a ng-click="onStyleEdit(row.entity)">Edit</a>' + '</div>',
          width: '6%'
        },
        {
          field: 'download',
          displayName: 'Download',
          cellClass: 'text-center',
          sortable: false,
          cellTemplate: '<a popover-placement="bottom" popover-append-to-body="true"' + 'popover-html-unsafe="{{ row.entity.download_urls }}" pop-show=' + '"{{ row.entity.showSourcePopover && row.entity.urls_ready }}"' + 'ng-click="closePopovers(row.entity);' + 'linkDownloads(row.entity)">' + '<div class="fa fa-download grid-icons" ' + 'alt="Download Layer" title="Download Layer"></div></a>',
          width: '7%'
        },
        {
          field: 'modified.timestamp',
          displayName: 'Modified',
          cellTemplate: '<div class="grid-text-padding" style="font-size: .9em">' + '{{row.entity.modified.timestamp|amDateFormat:"MMM D, h:mm a"}}' + '</div>',
          width: '11%',
          sortable: false
        },
        {
          field: '',
          displayName: '',
          cellClass: 'text-center',
          sortable: false,
          cellTemplate: '<div ng-class="col.colIndex()">' + '<a ng-click="deleteLayer(row.entity)" class="pull-left">' + '<img ng-src="images/delete.png" alt="Remove Layer"' + 'title="Remove Layer" />' + '</a>' + '</div>',
          width: '*'
        }
      ],
      enablePaging: true,
      enableColumnResize: false,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.opts.paging,
      filterOptions: $scope.opts.filter,
      useExternalSorting: true
    };
    $scope.$watch('opts', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        $scope.refreshLayers();
      }
    }, true);
    $scope.refreshLayers = function () {
      var opts = $scope.opts;
      if (selectedWorkspace) {
        GeoServer.layers.get(selectedWorkspace, opts.paging.currentPage - 1, opts.paging.pageSize, opts.sort.fields[0] + ':' + opts.sort.directions[0], opts.filter.filterText).then(function (result) {
          if (result.success) {
            $scope.layerData = _.map(result.data.layers, function (layer) {
              if (layer.modified) {
                // convert time strings to Dates
                return _.assign(layer, {
                  'modified': {
                    'timestamp': new Date(layer.modified.timestamp),
                    'pretty': layer.modified.pretty
                  }
                });
              } else {
                return layer;
              }
            });
            $scope.totalServerItems = result.data.total;
            $scope.itemsPerPage = opts.paging.pageSize;
          } else {
            $rootScope.alerts = [{
                type: 'warning',
                message: 'Layers for workspace ' + selectedWorkspace + ' could not be loaded.',
                fadeout: true
              }];
          }
        });
      }
    };
    $scope.refreshMaps = function (ws) {
      GeoServer.maps.getAll(ws).then(function (result) {
        if (result.success) {
          var maps = result.data.maps;
          maps = maps.concat([{ 'name': 'Create New Map' }]);
          $scope.maps = maps;
        } else {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Failed to get map list.',
              fadeout: true
            }];
        }
      });
    };
    $scope.deleteLayer = function (layer) {
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/layers/layers.modal.delete.tpl.html',
          controller: 'LayerDeleteCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return $scope.workspace.selected.name;
            },
            layer: function () {
              return layer;
            }
          }
        }).result.then(function () {
          $scope.refreshLayers();
        });
    };
    $scope.$watch('workspace.selected', function (newVal) {
      if (newVal != null) {
        selectedWorkspace = $scope.workspace.selected.name;
        $scope.refreshLayers();
        $scope.layerSelections.length = 0;
        $scope.refreshMaps(selectedWorkspace);
        $scope.$broadcast(AppEvent.WorkspaceSelected, newVal.name);
      }
    });
    $scope.layersLoading = true;
    GeoServer.workspaces.get().then(function (result) {
      $scope.layersLoading = false;
      if (result.success) {
        var workspaces = result.data;
        $scope.workspaces = workspaces;
        var ws = _.find(workspaces, function (workspace) {
            return workspace.default;
          });
        $scope.workspace.selected = ws;
      } else {
        $scope.alerts = [{
            type: 'warning',
            message: 'Failed to get workspace list.',
            fadeout: true
          }];
      }
    });
  }
]).controller('AllLayersNewLayerCtrl', [
  '$scope',
  'GeoServer',
  '$modalInstance',
  '$window',
  'ws',
  '$rootScope',
  function ($scope, GeoServer, $modalInstance, $window, ws, $rootScope) {
    $scope.datastores = GeoServer.datastores.get('ws');
    $scope.types = [
      { name: 'line' },
      { name: 'multi-line' },
      { name: 'multi-point' },
      { name: 'multi-polygon' },
      { name: 'point' },
      { name: 'polygon' },
      { name: 'raster' },
      { name: 'geometry' }
    ];
    $scope.extents = [
      { name: 'Autocalc' },
      { name: 'Custom' }
    ];
    $scope.crsTooltip = '<h5>Add a projection in EPSG</h5>' + '<p>Coordinate Reference System (CRS) info is available at ' + '<a href="http://prj2epsg.org/search" target="_blank">' + 'http://prj2epsg.org' + '</a>' + '</p>';
    $scope.ws = ws;
    $scope.mapInfo = { 'abstract': '' };
    $scope.layerInfo = { 'abstract': '' };
    // Get all of the data stores
    GeoServer.datastores.get(ws).then(function (result) {
      if (result.success) {
        $scope.datastores = result.data;
      } else {
        $scope.alerts = [{
            type: 'warning',
            message: 'Workspace could not be loaded.',
            fadeout: true
          }];
      }
    });
    $scope.createLayer = function (layer, data, proj, types, extents) {
      $scope.layerInfo.layers = [];
      $scope.layerInfo.layers.push({
        'name': layer.name,
        'workspace': $scope.ws,
        'datastore': data,
        'title': layer.title,
        'crs': proj,
        'type': types,
        'extentType': extents,
        'extent': layer.extent
      });
      GeoServer.layer.create($scope.ws, $scope.layerInfo).then(function (result) {
        if (result.success) {
          $rootScope.alerts = [{
              type: 'success',
              message: 'Layer ' + result.data.name + ' created.',
              fadeout: true
            }];
          $scope.layerData.push(result.data);
        } else {
          $modalInstance.dismiss('cancel');
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Could not create layer ' + layer.name + ': ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
        $modalInstance.dismiss('cancel');  //$window.location.reload();
      });
    };
    // end createLayer
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.checkName = function (layerName) {
      $scope.layerNameCheck = GeoServer.layer.get($scope.ws, layerName);
      //Check to see if the incoming layerName already exists for this
      //  workspace. If it does, show the error, if not, keep going.
      GeoServer.layer.get($scope.ws, layerName).then(function (result) {
        if (result.success) {
          $scope.layerNameCheck = result.data;
        } else {
          $scope.alerts = [{
              type: 'warning',
              message: 'Layers could not be loaded.',
              fadeout: true
            }];
        }
        if ($scope.layerNameCheck.name) {
          $scope.layerNameError = true;
        } else {
          $scope.layerNameError = false;
        }
      });
    };
  }
]).directive('getType', function () {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    scope: { geometry: '@geometry' },
    template: '<div ng-switch on="geometry">' + '<div ng-switch-when="Point">' + '<img ng-src="images/layer-point.png"' + 'alt="Layer Type: Point"' + 'title="Layer Type: Point" /></div>' + '<div ng-switch-when="MultiPoint">' + '<img ng-src="images/layer-point.png"' + 'alt="Layer Type: MultiPoint"' + 'title="Layer Type: MultiPoint"/></div>' + '<div ng-switch-when="LineString">' + '<img  ng-src="images/layer-line.png"' + 'alt="Layer Type: LineString"' + 'title="Layer Type: LineString"/></div>' + '<div ng-switch-when="MultiLineString">' + '<img  ng-src="images/layer-line.png"' + 'alt="Layer Type: MultiLineString"' + 'title="Layer Type: MultiLineString" /></div>' + '<div ng-switch-when="Polygon">' + '<img  ng-src="images/layer-polygon.png"' + 'alt="Layer Type: Polygon"' + 'title="Layer Type: Polygon" /></div>' + '<div ng-switch-when="MultiPolygon">' + '<img  ng-src="images/layer-polygon.png"' + 'alt="Layer Type: MultiPolygon"' + 'title="Layer Type: MultiPolygon" /></div>' + '<div ng-switch-when="Geometry">' + '<img  ng-src="images/layer-vector.png"' + 'alt="Layer Type: Geometry"' + 'title="Layer Type: Geometry" /></div>' + '<div ng-switch-default class="grid">' + '<img ng-src="images/layer-raster.png" alt="Layer Type: Raster"' + 'title="Layer Type: Raster" /></div>' + '</div>'
  };
});/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.maps', [
  'ngGrid',
  'ui.select',
  'ngSanitize',
  'gsApp.alertpanel',
  'gsApp.editor.map',
  'gsApp.projfield',
  'gsApp.core.utilities',
  'gsApp.workspaces.maps.delete',
  'angularMoment'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('maps', {
      url: '/maps',
      templateUrl: '/maps/maps.tpl.html',
      controller: 'MapsCtrl'
    }).state('map', {
      abstract: true,
      url: '/maps/:workspace/:name',
      templateUrl: '/maps/detail/map.tpl.html'
    });
  }
]).controller('MapsCtrl', [
  '$scope',
  'GeoServer',
  '$state',
  '$log',
  '$rootScope',
  '$modal',
  '$window',
  '$stateParams',
  'AppEvent',
  '$timeout',
  '$sce',
  '_',
  function ($scope, GeoServer, $state, $log, $rootScope, $modal, $window, $stateParams, AppEvent, $timeout, $sce, _) {
    $scope.title = 'All Maps';
    $scope.workspace = $stateParams.workspace;
    $scope.$watch('workspace.selected', function (newVal) {
      if (newVal != null) {
        var ws = newVal;
        $rootScope.$broadcast(AppEvent.WorkspaceSelected, ws.name);
        $scope.refreshMaps();
      }
    });
    $scope.opts = {
      paging: {
        pageSizes: [
          15,
          50,
          100
        ],
        pageSize: 15,
        currentPage: 1
      },
      sort: {
        fields: ['name'],
        directions: ['asc']
      },
      filter: { filterText: '' }
    };
    $scope.newOLWindow = function (map) {
      var baseUrl = GeoServer.map.openlayers.get(map.workspace, map.name, 800, 500);
      $window.open(baseUrl);
    };
    $scope.go = function (route, workspace) {
      $state.go(route, { workspace: workspace });
    };
    $scope.refreshMaps = function () {
      var opts = $scope.opts;
      $scope.ws = $scope.workspace.selected;
      if ($scope.ws) {
        GeoServer.maps.get($scope.ws.name, opts.paging.currentPage - 1, opts.paging.pageSize, opts.sort.fields[0] + ':' + opts.sort.directions[0], opts.filter.filterText).then(function (result) {
          if (result.success) {
            $scope.mapData = result.data.maps;
            $scope.totalServerItems = result.data.total;
            $scope.itemsPerPage = opts.paging.pageSize;
          } else {
            $rootScope.alerts = [{
                type: 'warning',
                message: 'Maps for workspace ' + $scope.ws.name + ' could not be loaded.',
                details: result.data.trace,
                fadeout: true
              }];
          }
        });
      }
    };
    $scope.setPage = function (page) {
      $scope.opts.paging.currentPage = page;
    };
    $scope.editMapSettings = function (map) {
      var modalInstance = $modal.open({
          templateUrl: '/components/modalform/map/map.settings.tpl.html',
          controller: 'EditMapSettingsCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return $scope.workspace.selected.name;
            },
            map: function () {
              return map;
            }
          }
        }).result.then(function (response) {
          $scope.refreshMaps();
        });
    };
    $scope.deleteMap = function (map) {
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/maps/maps.modal.delete.tpl.html',
          controller: 'MapDeleteCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return $scope.workspace.selected.name;
            },
            map: function () {
              return map;
            }
          }
        }).result.then(function () {
          $scope.refreshMaps();
        });
    };
    // See utilities.js pop directive - 1 popover open at a time
    var openPopoverDownload;
    $scope.closePopovers = function (popo) {
      if (openPopoverDownload || openPopoverDownload === popo) {
        openPopoverDownload.showSourcePopover = false;
        openPopoverDownload = null;
      } else {
        popo.showSourcePopover = true;
        openPopoverDownload = popo;
      }
    };
    $scope.linkDownloads = function (map) {
      var bbox = [
          map.bbox.west,
          map.bbox.south,
          map.bbox.east,
          map.bbox.north
        ];
      bbox = bbox.join();
      var baseurl = GeoServer.baseUrl() + '/' + map.workspace + '/wms?service=WMS&amp;version=1.1.0&request=GetMap&layers=' + map.name + '&bbox=' + bbox + '&width=700&height=700' + '&srs=' + map.proj.srs + '&format=';
      var kml = baseurl + 'application/vnd.google-earth.kml%2Bxml';
      var ol2 = baseurl + 'application/openlayers';
      map.download_urls = '';
      map.download_urls += '<a target="_blank" href="' + ol2 + '">OpenLayers</a> <br />';
      map.download_urls += '<a target="_blank" href="' + kml + '">KML</a> <br />';
      map.urls_ready = true;
      map.download_urls = $sce.trustAsHtml(map.download_urls);
    };
    $scope.onCompose = function (map) {
      $state.go('editmap', {
        workspace: map.workspace,
        name: map.name
      });
    };
    $scope.$on('ngGridEventEndCellEdit', function (evt) {
      var target = evt.targetScope;
      var field = target.col.field;
      var map = target.row.entity;
      var patch = {};
      patch[field] = map[field];
      GeoServer.map.update(map.workspace, map.name, { title: patch[field] });
    });
    $scope.gridSelections = [];
    $scope.gridOptions = {
      data: 'mapData',
      enableCellSelection: false,
      enableRowSelection: false,
      enableCellEdit: false,
      checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox"' + 'ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
      sortInfo: $scope.opts.sort,
      showSelectionCheckbox: false,
      selectWithCheckboxOnly: false,
      selectedItems: $scope.gridSelections,
      multiSelect: false,
      columnDefs: [
        {
          field: 'name',
          displayName: 'Map Name',
          cellTemplate: '<div class="grid-text-padding"' + 'title="{{row.entity.name}}">' + '{{row.entity.name}}' + '</div>',
          width: '15%'
        },
        {
          field: 'title',
          displayName: 'Title',
          enableCellEdit: true,
          cellTemplate: '<div class="grid-text-padding"' + 'alt="{{row.entity.description}}"' + 'title="{{row.entity.description}}">' + '{{row.entity.title}}' + '</div>',
          width: '20%'
        },
        {
          field: 'compose',
          displayName: 'Compose',
          cellClass: 'text-center',
          sortable: false,
          cellTemplate: '<div class="grid-text-padding" ng-class="col.colIndex()">' + '<a ng-click="onCompose(row.entity)">Compose</a>' + '</div>',
          width: '8%'
        },
        {
          field: 'preview',
          displayName: 'Preview',
          cellClass: 'text-center',
          sortable: false,
          cellTemplate: '<div ng-class="col.colIndex()">' + '<a ng-click="newOLWindow(row.entity)">' + '<img ng-src="images/preview.png" alt="Preview Map"' + 'title="Preview Map" />' + '</a>' + '</div>',
          width: '6%'
        },
        {
          field: 'settings',
          displayName: 'Settings',
          sortable: false,
          cellClass: 'text-center',
          cellTemplate: '<div ng-class="col.colIndex()">' + '<a ng-click="editMapSettings(row.entity)">' + '<img ng-src="images/settings.png"' + 'alt="Edit Map Settings" title="Edit Map Settings" />' + '</a>' + '</div>',
          width: '6%'
        },
        {
          field: 'download',
          displayName: 'Download',
          cellClass: 'text-center',
          sortable: false,
          cellTemplate: '<a popover-placement="bottom" popover-append-to-body="true"' + 'popover-html-unsafe="{{ row.entity.download_urls }}" pop-show=' + '"{{ row.entity.showSourcePopover && row.entity.urls_ready }}"' + 'ng-click="closePopovers(row.entity);' + 'linkDownloads(row.entity);">' + '<div class="fa fa-download grid-icons" ' + 'alt="Download Map" title="Download Map"></div></a>',
          width: '8%'
        },
        {
          field: 'modified.timestamp',
          displayName: 'Modified',
          cellTemplate: '<div class="grid-text-padding" style="font-size: .9em">' + '{{row.entity.modified.timestamp|amDateFormat:"MMM D, h:mm a"}}' + '</div>',
          width: '11%',
          sortable: false
        },
        {
          field: '',
          displayName: '',
          cellClass: 'pull-left',
          sortable: false,
          cellTemplate: '<div ng-class="col.colIndex()">' + '<a ng-click="deleteMap(row.entity)">' + '<img ng-src="images/delete.png" alt="Remove Map"' + 'title="Remove Map" />' + '</a>' + '</div>',
          width: '*'
        }
      ],
      enablePaging: true,
      enableColumnResize: false,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.opts.paging,
      filterOptions: $scope.opts.filter,
      useExternalSorting: true
    };
    $scope.workspace = {};
    $scope.workspaces = [];
    $scope.setPage = function (page) {
      $scope.opts.paging.currentPage = page;
    };
    $scope.$watch('opts', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        $scope.refreshMaps();
      }
    }, true);
    $scope.mapsLoading = true;
    GeoServer.workspaces.get().then(function (result) {
      $scope.mapsLoading = false;
      if (result.success) {
        var workspaces = result.data;
        $scope.workspaces = workspaces;
        var ws = _.find(workspaces, function (workspace) {
            return workspace.default;
          });
        $scope.workspace.selected = ws;
      } else {
        $scope.alerts = [{
            type: 'warning',
            message: 'Could not get workspaces: ' + result.data.message,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.data', [
  'gsApp.workspaces.data.delete',
  'gsApp.workspaces.data.update',
  'gsApp.import',
  'gsApp.workspaces.formats.type',
  'gsApp.workspaces.data.attributes',
  'gsApp.workspaces.layers.import',
  'gsApp.core.utilities',
  'gsApp.alertpanel',
  'ngSanitize'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('workspace.data', {
      url: '/data',
      templateUrl: '/workspaces/detail/data/data.tpl.html',
      controller: 'WorkspaceDataCtrl',
      abstract: true
    });
    $stateProvider.state('workspace.data.main', {
      url: '/',
      views: {
        'data': {
          templateUrl: '/workspaces/detail/data/data.main.tpl.html',
          controller: 'DataMainCtrl'
        }
      }
    });
  }
]).controller('WorkspaceDataCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$modal',
  '$window',
  '$log',
  'GeoServer',
  '_',
  'AppEvent',
  '$timeout',
  'storesListModel',
  'resourcesListModel',
  function ($scope, $rootScope, $state, $stateParams, $modal, $log, $window, GeoServer, _, AppEvent, $timeout, storesListModel, resourcesListModel) {
    var workspace;
    if ($scope.workspace) {
      workspace = $scope.workspace;
    } else if ($stateParams.workspace) {
      workspace = $stateParams.workspace;
    }
    $scope.opts = {
      paging: {
        pageSize: 10,
        currentPage: 1
      },
      sort: {
        predicate: 'name',
        order: 'asc'
      },
      filter: { filterText: '' }
    };
    $scope.resourceOpts = {
      paging: {
        pageSize: 10,
        currentPage: 1
      },
      sort: {
        predicate: 'name',
        order: 'asc'
      },
      filter: { filterText: '' }
    };
    // Set stores list to window height
    $scope.storesListHeight = { 'height': $window.innerHeight - 250 };
    $timeout(function () {
      if ($scope.$parent && $scope.$parent.tabs) {
        $scope.$parent.tabs[2].active = true;
      }
    }, 300);
    $scope.storesHome = function () {
      if (!$state.is('workspace.data.main')) {
        $state.go('workspace.data.main', { workspace: $scope.workspace });
      }
    };
    $scope.selectStore = function (store) {
      if (store.name == null) {
        return;
      }
      if ($scope.selectedStore && $scope.selectedStore.name === store.name) {
        return;
      }
      $scope.selectedStore = store;
      $scope.pagedResources = null;
      GeoServer.datastores.getDetails($scope.workspace, store.name).then(function (result) {
        if (result.success) {
          var storeData = result.data;
          resourcesListModel.setResources(result.data.resources);
          var opts = $scope.resourceOpts;
          $scope.pagedResources = resourcesListModel.getResourcesPage(opts.paging.currentPage, opts.paging.pageSize, opts.sort.predicate + ':' + opts.sort.order, opts.filter.filterText);
          $scope.totalResources = resourcesListModel.getTotalServerItems();
          $scope.selectedStore = storeData;
        } else {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Details for store ' + $scope.selectedStore.name + ' could not be loaded.',
              fadeout: true
            }];
        }
      });
    };
    $scope.sortBy = function (sort, pred) {
      if (pred === sort.predicate) {
        // flip order if selected same
        sort.order = sort.order === 'asc' ? 'desc' : 'asc';
      } else {
        // default to 'asc' order when switching
        sort.predicate = pred;
        sort.order = 'asc';
      }
    };
    $scope.serverRefresh = function () {
      var opts = $scope.opts;
      return storesListModel.fetchStores($scope.workspace, opts.paging.currentPage, opts.paging.pageSize, opts.sort.predicate + ':' + opts.sort.order, opts.filter.filterText).then(function () {
        $scope.datastores = storesListModel.getStores();
        $scope.totalStores = storesListModel.getTotalServerItems();
        //refresh selected store
        if ($scope.selectedStore && $scope.selectedStore.enabled) {
          var store = $scope.selectedStore;
          $scope.selectedStore = null;
          $scope.selectStore(store);
        } else {
          resourcesListModel.setResources(null);
          $scope.pagedResources = null;
          $scope.totalResources = null;
        }
      });
    };
    //Change store name
    $scope.storeEdit = function (store, editing) {
      if (editing) {
        store.editing = true;
        $timeout(function () {
          $('.store-edit').focus();
        }, 10);
      } else {
        var newName = $('.store-edit').val();
        if (newName.match(/^[a-zA-Z\d][a-zA-Z\d\-_]*$/)) {
          store.refresh = true;
          GeoServer.datastores.update($scope.workspace, store.name, { name: newName }).then(function (result) {
            store.refresh = false;
            if (result.success) {
              store.name = result.data.name;
              $scope.selectStore(store);
            } else {
              $rootScope.alerts = [{
                  type: 'warning',
                  message: 'Could not change store name from ' + store.name + ' to ' + newName,
                  details: result.data.trace,
                  fadeout: true
                }];
            }
          });
        } else {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Could not change store name to ' + newName + ': Invalid characters in store name',
              fadeout: true
            }];
        }
        store.editing = false;
      }
    };
    $scope.dataLoading = true;
    $scope.serverRefresh().then(function () {
      $scope.dataLoading = false;
      if ($scope.datastores && $scope.datastores.length > 0) {
        $scope.selectStore($scope.datastores[0]);
      }
    });
    $scope.$watch('opts', function (newVal, oldVal) {
      if (newVal != null && newVal !== oldVal) {
        $scope.serverRefresh();
      }
    }, true);
    $scope.$watch('resourceOpts', function (newVal, oldVal) {
      if (newVal != null && newVal !== oldVal) {
        var opts = $scope.resourceOpts;
        $scope.pagedResources = resourcesListModel.getResourcesPage(opts.paging.currentPage, opts.paging.pageSize, opts.sort.predicate + ':' + opts.sort.order, opts.filter.filterText);
        $scope.totalResources = resourcesListModel.getTotalServerItems();
      }
    }, true);
    $scope.importNewData = function (info) {
      var workspace = info.workspace;
      var mapInfo = info.mapInfo;
      var importModalInstance = $modal.open({
          templateUrl: '/components/import/import.tpl.html',
          controller: 'DataImportCtrl',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            workspace: function () {
              return workspace;
            },
            mapInfo: function () {
              return mapInfo;
            },
            contextInfo: function () {
              return null;
            }
          }
        }).result.then(function (param) {
          //TODO: Add store select (implement as state param)
          $state.go('workspace.data.main');
        });
    };
    $rootScope.$on(AppEvent.StoreAdded, function (scope, workspace) {
      $scope.serverRefresh();
    });
    $rootScope.$on(AppEvent.StoreUpdated, function (scope, info) {
      for (var i = 0; i < $scope.datastores.length; i++) {
        if ($scope.datastores[i].name == info.original.name) {
          $scope.datastores[i] = info.updated;
          if ($scope.selectedStore.name == info.original.name) {
            $scope.selectedStore = info.updated;
            if ($scope.selectedStore.enabled) {
              $scope.selectedStore = null;
              $scope.selectStore(info.updated);
            } else {
              resourcesListModel.setResources(null);
              $scope.pagedResources = null;
              $scope.totalResources = null;
            }
          }
          break;
        }
      }
    });
    $scope.addNewStore = function () {
      $modal.open({
        templateUrl: '/components/import/import.tpl.html',
        controller: 'DataImportCtrl',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          workspace: function () {
            return $scope.workspace;
          },
          mapInfo: function () {
            return $scope.mapInfo;
          },
          contextInfo: function () {
            return null;
          }
        }
      }).result.then(function (param) {
      });
    };
    $scope.storeRemoved = function (storeToRemove) {
      var index = _.findIndex($scope.datastores, function (ds) {
          return ds.name === storeToRemove.name;
        });
      if (index > -1) {
        $scope.datastores.splice(index, 1);
      }
      $scope.selectedStore = null;
      $scope.serverRefresh();
    };
    $scope.deleteStore = function () {
      if (!$state.is('workspace.data.main')) {
        $state.go('workspace.data.main', { workspace: $scope.workspace });
      }
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/data/data.modal.delete.tpl.html',
          controller: 'WorkspaceDeleteDataCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return $scope.workspace;
            },
            store: function () {
              return $scope.selectedStore;
            },
            storeRemoved: function () {
              return $scope.storeRemoved;
            }
          }
        });
    };
  }
]).controller('DataMainCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$modal',
  '$window',
  '$log',
  'GeoServer',
  function ($scope, $rootScope, $state, $stateParams, $modal, $log, $window, GeoServer) {
    if ($stateParams.workspace) {
      $scope.workspace = $stateParams.workspace;
    }
    // See utilities.js pop directive - 1 popover open at a time
    var openPopoverStore;
    $scope.closePopovers = function (store) {
      if (openPopoverStore || openPopoverStore === store) {
        openPopoverStore.showSourcePopover = false;
        openPopoverStore = null;
      } else {
        store.showSourcePopover = true;
        openPopoverStore = store;
      }
    };
    var openPopoverPublished;
    $scope.closeResourcePopovers = function (resource) {
      if (openPopoverPublished || openPopoverPublished === resource) {
        openPopoverPublished.publishedPopover = false;
        openPopoverPublished = null;
      } else {
        resource.publishedPopover = true;
        openPopoverPublished = resource;
      }
    };
    $scope.getLayersForResource = function (resource) {
      var layers = resource.layers;
      var returnString = '';
      for (var t = 0; t < layers.length; t++) {
        returnString += layers[t].name + ' ';
      }
      return returnString;
    };
    $scope.showLayer = function (layer) {
      $state.go('workspace.layers', { 'layer': layer });
    };
    $scope.showAttrs = function (layerOrResource, storename) {
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/data/data.modal.attributes.tpl.html',
          controller: 'WorkspaceAttributesCtrl',
          size: 'md',
          resolve: {
            layerOrResource: function () {
              return layerOrResource;
            },
            workspace: function () {
              return $scope.workspace;
            },
            storename: function () {
              return storename;
            }
          }
        });
    };
    $scope.enableDisableStore = function (store) {
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/data/data.modal.update.tpl.html',
          controller: 'UpdateStoreCtrl',
          size: 'md',
          resolve: {
            store: function () {
              return store;
            },
            workspace: function () {
              return $scope.workspace;
            }
          }
        });
    };
    $scope.publishLayer = function (resource, store) {
      $scope.resourceToUpdate = resource;
      var modalInstance = $modal.open({
          templateUrl: '/components/modalform/layer/layer.publish.tpl.html',
          controller: 'PublishLayerCtrl',
          size: 'md',
          resolve: {
            resource: function () {
              return $scope.resourceToUpdate;
            },
            workspace: function () {
              return $scope.workspace;
            },
            store: function () {
              return store;
            }
          }
        }).result.then(function (added) {
          if (added) {
            $scope.resourceToUpdate.layers.push(added);
          }
        });
    };
    // Get Formats Info
    $scope.formats = {
      'vector': [],
      'raster': [],
      'service': []
    };
    GeoServer.formats.get().then(function (result) {
      if (result.success) {
        var formats = result.data;
        for (var i = 0; i < formats.length; i++) {
          $scope.formats[formats[i].kind.toLowerCase()].push(formats[i]);
        }
      }
    });
    $scope.getTypeDetails = function (resource) {
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/data/format.type.tpl.html',
          controller: 'FormatTypeInfoCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            formats: function () {
              return $scope.formats;
            },
            resource: function () {
              return resource;
            }
          }
        });
    };
  }
]).service('storesListModel', function (GeoServer, _, $rootScope) {
  var _this = this;
  this.stores = null;
  this.totalServerItems = 0;
  this.getTotalServerItems = function () {
    return _this.totalServerItems;
  };
  this.getStores = function () {
    return _this.stores;
  };
  this.setStores = function (stores) {
    _this.stores = stores;
  };
  this.addStore = function (store) {
    _this.stores.unshift(store);  // add to front of array
  };
  this.removeStore = function (store) {
    _.remove(_this.stores, function (_store) {
      return _store.name === store.name;
    });
  };
  this.tagStore = function (store) {
    var format = store.format.toLowerCase();
    if (format === 'shapefile') {
      store.sourcetype = 'shp';
      store.displayName = store.name + ' (shapefile)';
    } else if (store.kind.toLowerCase() === 'raster') {
      store.sourcetype = 'raster';
      store.displayName = store.name + ' (raster)';
    } else if (store.type.toLowerCase() === 'database' || store.type.toLowerCase() === 'generic') {
      store.sourcetype = 'database';
      store.displayName = store.name + ' (database)';
    } else if (format.indexOf('directory of spatial files') !== -1) {
      store.sourcetype = 'shp_dir';
      store.displayName = store.name + ' (directory of shapefiles)';
    } else if (store.type.toLowerCase() === 'web') {
      store.sourcetype = 'web';
    }
    return store;
  };
  this.tagStores = function (stores) {
    for (var i = 0; i < stores.length; i++) {
      stores[i] = _this.tagStore(stores[i]);
    }
    return stores;
  };
  this.fetchStores = function (workspace, currentPage, pageSize, sort, filterText) {
    if (currentPage) {
      currentPage = currentPage - 1;
    }
    return GeoServer.datastores.get(workspace, currentPage, pageSize, sort, filterText).then(function (result) {
      if (result.success) {
        var stores = result.data.stores;
        // tag for display
        _this.totalServerItems = result.data.total;
        _this.setStores(_this.tagStores(stores));
      } else {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Unable to load data stores for workspace ' + workspace,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
  };
  this.addEmptyStore = function (workspace, format, content) {
    return GeoServer.datastores.create(workspace, format, content).then(function (result) {
      if (result.success) {
        var store = result.data;
        // tag for display
        _this.addStore(_this.tagStore(store));
      } else {
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Unable to add data store in workspace ' + workspace,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
  };
}).service('resourcesListModel', function (_, $rootScope) {
  var _this = this;
  this.resources = null;
  this.totalServerItems = 0;
  this.currentPage = null;
  this.pageSize = null;
  this.sort = null;
  this.filterText = null;
  this.filteredResources = null;
  this.getTotalServerItems = function () {
    return _this.totalServerItems;
  };
  this.getResources = function () {
    return _this.resources;
  };
  this.setResources = function (resources) {
    _this.resources = resources;
    _this.filteredResources = null;
    if (resources) {
      _this.totalServerItems = resources.length;
    } else {
      _this.totalServerItems = null;
    }
  };
  this.getResourcesPage = function (currentPage, pageSize, sort, filterText) {
    var changed = false;
    if (_this.resources == null) {
      return null;
    }
    if (this.filteredResources == null) {
      changed = true;
      this.filteredResources = _this.resources;
    }
    //filter
    if (changed || _this.filterText != filterText) {
      changed = true;
      _this.filterText = filterText;
      _this.filteredResources = _this.resources.filter(function (value) {
        return value.name && value.name.indexOf(filterText) >= 0;
      });
      _this.totalServerItems = _this.filteredResources.length;
    }
    //sort
    if (changed || _this.sort != sort) {
      changed = true;
      _this.sort = sort;
      var parsedSort = sort.split(':');
      var reverse = 1;
      if (parsedSort[1] && parsedSort[1] == 'desc') {
        reverse = -1;
      }
      _this.filteredResources = _this.filteredResources.sort(function (o1, o2) {
        if (parsedSort[0] == 'name') {
          return ((o1.name > o2.name) - (o1.name < o2.name)) * reverse;
        }
        if (parsedSort[0] == 'published') {
          return ((o1.layers.length > o2.layers.length) - (o1.layers.length < o2.layers.length)) * reverse;
        }
        return 0;
      });
    }
    //page
    _this.currentPage = currentPage;
    _this.pageSize = pageSize;
    return _this.filteredResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  };
});/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.data.attributes', []).controller('WorkspaceAttributesCtrl', [
  'layerOrResource',
  '$scope',
  '$rootScope',
  'workspace',
  '$log',
  '$modalInstance',
  'GeoServer',
  'storename',
  function (layerOrResource, $scope, $rootScope, workspace, $log, $modalInstance, GeoServer, storename) {
    if (layerOrResource.layers.length > 0 && layerOrResource.layers[0].schema) {
      $scope.attributes = layerOrResource.layers[0].schema.attributes;
    } else {
      GeoServer.datastores.getResource(workspace, storename, layerOrResource.name).then(function (result) {
        if (result.success) {
          $scope.attributes = result.data.schema.attributes;
        } else {
          if (result.data) {
            $scope.error = result.data.message;
          } else {
            $scope.error = 'Unable to load attributes.';
          }
        }
      });
    }
    $scope.layerOrResource = layerOrResource;
    $scope.title = layerOrResource.name;
    $scope.close = function () {
      $modalInstance.dismiss('close');
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.data.delete', []).controller('WorkspaceDeleteDataCtrl', [
  'workspace',
  'store',
  'storeRemoved',
  '$scope',
  '$rootScope',
  '$modalInstance',
  'GeoServer',
  function (workspace, store, storeRemoved, $scope, $rootScope, $modalInstance, GeoServer) {
    $scope.title = 'Delete Data Store';
    $scope.storeUndefined = false;
    $scope.workspace = workspace;
    $scope.store = store;
    $scope.storeRemoved = storeRemoved;
    if (!store) {
      $scope.storeUndefined = true;
    }
    $scope.cancel = function () {
      $modalInstance.dismiss('close');
    };
    $scope.delete = function () {
      GeoServer.datastores.delete($scope.workspace, $scope.store.name).then(function (result) {
        if (result && result.success) {
          $scope.storeRemoved($scope.store);
          $rootScope.alerts = [{
              type: 'success',
              message: 'Store ' + $scope.store.name + ' successfully deleted.',
              fadeout: true
            }];
        } else {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Store deletion failed: ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
      $modalInstance.dismiss('delete');
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.data.update', []).controller('UpdateStoreCtrl', [
  'store',
  'workspace',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  function (store, workspace, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent) {
    $scope.store = store;
    $scope.workspace = workspace;
    $scope.storeDisabled = false;
    var enabled = !$scope.store.enabled;
    $scope.desiredState = enabled ? ' enabled' : ' disabled';
    $scope.desiredStateTitle = enabled ? 'Enable ' : 'Disable ';
    $scope.toggleStore = function () {
      GeoServer.datastores.update($scope.workspace, store.name, { 'enabled': enabled }).then(function (result) {
        if (result.success && result.data.enabled === enabled) {
          $scope.store.enabled = !$scope.store.enabled;
          $scope.store.resource = {};
          $rootScope.$broadcast(AppEvent.StoreUpdated, {
            original: $scope.store,
            updated: result.data
          });
          $rootScope.alerts = [{
              type: 'success',
              message: 'Store ' + $scope.store.name + $scope.desiredState,
              fadeout: true
            }];
        } else {
          $rootScope.alerts = [{
              type: 'danger',
              message: 'Store ' + $scope.store.name + ' could not be' + $scope.desiredState + ': ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
      $modalInstance.close($scope.store);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.formats.type', []).controller('FormatTypeInfoCtrl', [
  'formats',
  'resource',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  '_',
  function (formats, resource, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent, _) {
    $scope.formats = formats;
    $scope.resource = resource;
    var formatsByType = $scope.formats[resource.kind.toLowerCase()];
    $scope.format = _.find(formatsByType, function (format) {
      // 'directory' vs. 'directory of shapefiles'
      if (format.name.indexOf('directory') > -1) {
        return resource.format.toLowerCase().indexOf('directory') > -1;
      }
      return resource.format.toLowerCase() === format.name;
    });
    $scope.close = function () {
      $modalInstance.dismiss('close');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.layers', [
  'gsApp.workspaces.layers.settings',
  'gsApp.workspaces.layers.import',
  'gsApp.workspaces.layers.delete',
  'gsApp.workspaces.layers.duplicate',
  'gsApp.workspaces.layers.addtomap',
  'gsApp.alertpanel',
  'gsApp.editor.layer',
  'gsApp.core.utilities',
  'gsApp.import',
  'ngSanitize',
  'ui.scrollfix'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('workspace.layers', {
      url: '/layers',
      templateUrl: '/workspaces/detail/layers/layers.tpl.html',
      controller: 'WorkspaceLayersCtrl',
      abstract: true
    });
    $stateProvider.state('workspace.layers.main', {
      url: '/',
      templateUrl: '/workspaces/detail/layers/layers.main.tpl.html',
      controller: 'LayersMainCtrl'
    });
  }
]).controller('WorkspaceLayersCtrl', function ($scope, $state, $stateParams, $anchorScroll, AppEvent, layersListModel, $timeout) {
  $scope.workspace = $stateParams.workspace;
  $timeout(function () {
    if ($scope.$parent && $scope.$parent.tabs) {
      $scope.$parent.tabs[1].active = true;
    }
  }, 300);
  $scope.lyrThumbsWidth = 112;
  $scope.lyrThumbsHeight = 112;
  $scope.opts = {
    paging: {
      pageSize: 25,
      currentPage: 1
    },
    sort: {
      predicate: 'name',
      order: 'asc'
    },
    filter: { filterText: '' }
  };
  $scope.sortBy = function (pred) {
    var sort = $scope.opts.sort;
    if (pred === sort.predicate) {
      // flip order if selected same
      sort.order = sort.order === 'asc' ? 'desc' : 'asc';
    } else {
      // default to 'asc' order when switching
      sort.predicate = pred;
      sort.order = 'asc';
    }
  };
  $scope.serverRefresh = function () {
    var opts = $scope.opts;
    return layersListModel.fetchLayers($scope.workspace, opts.paging.currentPage, opts.paging.pageSize, opts.sort.predicate + ':' + opts.sort.order, opts.filter.filterText).then(function () {
      $scope.layers = layersListModel.getLayers();
      $scope.totalItems = layersListModel.getTotalServerItems();
    });
  };
  $scope.layersLoading = true;
  $scope.serverRefresh().then(function () {
    $scope.layersLoading = false;
  });
  $scope.mapsHome = function () {
    if (!$state.is('workspace.maps.main')) {
      $state.go('workspace.maps.main', { workspace: $scope.workspace });
    }
  };
  $scope.$on(AppEvent.CreateNewMap, function () {
    $scope.createMap();
  });
  $scope.$on(AppEvent.LayerUpdated, function (scope, layer) {
    // Update thumbnail if name changed
    if (layer && layer.new) {
      for (var i = 0; i < $scope.layers.length; i++) {
        if (angular.equals($scope.layers[i].name, layer.original.name)) {
          $scope.layers[i] = angular.copy(layer.new);
        }
      }
    }
  });
  $scope.$watch('opts', function (newVal, oldVal) {
    if (newVal != null && newVal !== oldVal) {
      $scope.serverRefresh();
    }
  }, true);
}).controller('LayersMainCtrl', function ($scope, $state, $stateParams, GeoServer, $modal, $rootScope, AppEvent, _, mapsListModel, layersListModel, $timeout, $location, $anchorScroll) {
  $scope.layerSelections = [];
  mapsListModel.fetchMaps($scope.workspace).then(function () {
    $scope.maps = mapsListModel.getMaps();
    $scope.mapOptions = $scope.maps.concat([{ 'name': 'Create New Map' }]);
  });
  $scope.showAttrs = function (layerOrResource, attributes) {
    var modalInstance = $modal.open({
        templateUrl: '/workspaces/detail/data/data.modal.attributes.tpl.html',
        controller: 'WorkspaceAttributesCtrl',
        size: 'md',
        resolve: {
          layerOrResource: function () {
            return layerOrResource;
          },
          attributes: function () {
            return attributes;
          }
        }
      });
  };
  $scope.editLayerSettings = function (layer) {
    var modalInstance = $modal.open({
        templateUrl: '/components/modalform/layer/layer.settings.tpl.html',
        controller: 'EditLayerSettingsCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          workspace: function () {
            return $scope.workspace;
          },
          layer: function () {
            return layer;
          }
        }
      });
  };
  $scope.createLayer = function () {
    $modal.open({
      templateUrl: '/components/import/import.tpl.html',
      controller: 'DataImportCtrl',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        workspace: function () {
          return $scope.workspace;
        },
        mapInfo: function () {
          return null;
        },
        contextInfo: function () {
          return null;
        }
      }
    }).result.then(function (param) {
      $state.go('workspace.layers.main');
    });
  };
  $scope.setMap = function (map) {
    $scope.selectedMap = map;
  };
  $scope.toggleSelected = function (layer) {
    if (layer != null) {
      var found = false;
      for (var i = 0; i < $scope.layerSelections.length; i++) {
        if ($scope.layerSelections[i].name === layer.name) {
          $scope.layerSelections.splice(i, 1);
          found = true;
        }
      }
      if (!found) {
        $scope.layerSelections.push(layer);
      }
    }
  };
  $scope.addSelectedToMap = function () {
    var map = $scope.selectedMap;
    var mapInfo = {
        'name': map.name,
        'proj': map.proj,
        'description': map.description
      };
    mapInfo.layers = [];
    _.forEach($scope.layerSelections, function (layer) {
      mapInfo.layers.push({
        'name': layer.name,
        'workspace': $scope.workspace
      });
    });
    // 1. Create New map from Layers tab - selected layers
    if (map.name === 'Create New Map') {
      mapInfo.name = null;
      if (mapInfo.layers.length == 0) {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Please select a layer or import data and ' + 'create a new layer. A map requires at least one layer.',
            fadeout: true
          }];
      } else {
        var createNewMapModal = $modal.open({
            templateUrl: '/components/modalform/map/map.new.tpl.html',
            controller: 'NewMapCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              workspace: function () {
                return $scope.workspace;
              },
              mapInfo: function () {
                return mapInfo;
              }
            }
          }).result.then(function (result) {
            if (!result) {
              $state.go('workspace.layers.main');
            }
          });
      }
      return;
    }
    if (mapInfo.layers.length == 0) {
      $rootScope.alerts = [{
          type: 'warning',
          message: 'Select layers to add to a map below.',
          fadeout: true
        }];
      return;
    }
    // 2. Create New map - possible fr. other states - no selected layers
    GeoServer.map.layers.add($scope.workspace, mapInfo.name, mapInfo.layers).then(function (result) {
      if (result.success) {
        $rootScope.alerts = [{
            type: 'success',
            message: mapInfo.layers.length + ' layer(s) added to ' + mapInfo.name + ', now with ' + result.data.length + ' total.',
            fadeout: true
          }];
        mapsListModel.addMap(result.data);
        $state.go('editmap', {
          workspace: map.workspace,
          name: mapInfo.name
        });
      } else {
        $rootScope.alerts = [{
            type: 'danger',
            message: 'Layer(s) could not be added to map ' + mapInfo.name + ': ' + result.data.message,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
  };
  $scope.deleteLayer = function (layer) {
    var modalInstance = $modal.open({
        templateUrl: '/workspaces/detail/layers/layers.modal.delete.tpl.html',
        controller: 'LayerDeleteCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          workspace: function () {
            return $scope.workspace;
          },
          layer: function () {
            return layer;
          }
        }
      });
  };
  $rootScope.$on(AppEvent.LayersAllUpdated, function (scope, layers) {
    if (layers) {
      $scope.layers = layers;
      $scope.totalItems = layers.length;
    }
  });
  $rootScope.$on(AppEvent.LayerAdded, function (scope, layer) {
    if (layer) {
      if (layersListModel.getLayers()) {
        layersListModel.addLayer(layer);
        $scope.layers = layersListModel.sortByTime(layersListModel.getLayers());
      } else {
        layersListModel.fetchLayers($scope.workspace).then(function () {
          layersListModel.add(layer);
          $scope.layers = layersListModel.sortByTime(layersListModel.getLayers());
        });
      }
      $scope.totalItems = $scope.layers.length;
    }
  });
  var openPopoverLayer;
  $scope.closeLayerTPopovers = function (layer) {
    if (layer.title.length < 33) {
      return;
    }
    if (openPopoverLayer || openPopoverLayer === layer) {
      openPopoverLayer.layerTitle = false;
      openPopoverLayer = null;
    } else {
      layer.layerTitle = true;
      openPopoverLayer = layer;
    }
  };
  $scope.closeLayerNPopovers = function (layer) {
    if (layer.name.length < 33) {
      return;
    }
    if (openPopoverLayer || openPopoverLayer === layer) {
      openPopoverLayer.layerName = false;
      openPopoverLayer = null;
    } else {
      layer.layerName = true;
      openPopoverLayer = layer;
    }
  };
  $scope.copyToNewLayer = function (layer) {
    var modalInstance = $modal.open({
        templateUrl: '/components/modalform/layer/layer.duplicate.tpl.html',
        controller: 'DuplicateLayerCtrl',
        size: 'md',
        resolve: {
          layer: function () {
            return layer;
          },
          workspace: function () {
            return $scope.workspace;
          }
        }
      });
  };
}).service('layersListModel', function (GeoServer, _, $rootScope, $window) {
  var _this = this;
  this.layers = null;
  this.totalServerItems = 0;
  this.thumbnailize = function (layer) {
    var retina = $window.devicePixelRatio > 1;
    var url = GeoServer.layers.thumbnail.get(layer.workspace, layer.name) + '?t=' + new Date().getTime();
    if (retina) {
      url = url + '&hiRes=true';
    }
    layer.thumbnail = url;
  };
  this.getTotalServerItems = function () {
    return _this.totalServerItems;
  };
  this.getLayers = function () {
    return _this.layers;
  };
  this.setLayers = function (layers) {
    _this.layers = layers;
  };
  this.addLayer = function (layer) {
    _this.layers.push(layer);
  };
  this.removeLayer = function (layer) {
    _.remove(_this.layers, function (_layer) {
      return _layer.name === layer.name;
    });
  };
  this.sortByTime = function (layers) {
    // sort by timestamp
    var sorted = _.sortBy(layers, function (lyr) {
        if (lyr.modified) {
          return lyr.modified.timestamp;
        }
      });
    return sorted.reverse();
  };
  this.fetchLayers = function (workspace, currentPage, pageSize, sort, filterText) {
    if (currentPage) {
      currentPage = currentPage - 1;
    }
    return GeoServer.layers.get(workspace, currentPage, pageSize, sort, filterText).then(function (result) {
      if (result.success) {
        var layers = _.map(result.data.layers, function (layer) {
            _this.thumbnailize(layer);
            if (layer.modified) {
              // convert time strings to Dates
              return _.assign(layer, {
                'modified': {
                  'timestamp': new Date(layer.modified.timestamp),
                  'pretty': layer.modified.pretty
                }
              });
            } else {
              return layer;
            }
          });
        _this.totalServerItems = result.data.total;
        _this.setLayers(layers);
      } else {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Unable to load paged workspace layers: ' + result.data.message,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
  };
});/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.layers.delete', []).controller('LayerDeleteCtrl', [
  'workspace',
  'layer',
  'layersListModel',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  function (workspace, layer, layersListModel, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent) {
    $scope.workspace = workspace;
    $scope.layer = layer;
    $scope.layerDeleted = false;
    $scope.deleteForever = function () {
      GeoServer.layer.delete($scope.workspace, $scope.layer.name).then(function (result) {
        if (result && result.success) {
          $scope.layerDeleted = true;
          $rootScope.alerts = [{
              type: 'success',
              message: 'Layer ' + layer.name + ' deleted.',
              fadeout: true
            }];
          layersListModel.removeLayer(layer);
          $rootScope.$broadcast(AppEvent.LayersAllUpdated, layersListModel.getLayers());
        } else {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Layer deletion failed: ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
      $modalInstance.close($scope.map);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.maps', [
  'gsApp.modals.maps.new',
  'gsApp.workspaces.maps.settings',
  'gsApp.workspaces.maps.delete',
  'gsApp.alertpanel',
  'gsApp.editor.map',
  'gsApp.core.utilities',
  'gsApp.olexport',
  'ngSanitize'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('workspace.maps', {
      url: '/maps',
      templateUrl: '/workspaces/detail/maps/maps.tpl.html',
      controller: 'WorkspaceMapsCtrl',
      abstract: true
    });
    $stateProvider.state('workspace.maps.main', {
      url: '/',
      views: {
        'maps': {
          templateUrl: '/workspaces/detail/maps/maps.main.tpl.html',
          controller: 'MapsMainCtrl'
        }
      }
    });
  }
]).controller('WorkspaceMapsCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  '$sce',
  '$window',
  '$log',
  'GeoServer',
  'AppEvent',
  'mapsListModel',
  '$timeout',
  '$modal',
  '$rootScope',
  'storesListModel',
  'layersListModel',
  function ($scope, $state, $stateParams, $sce, $window, $log, GeoServer, AppEvent, mapsListModel, $timeout, $modal, $rootScope, storesListModel, layersListModel) {
    $scope.workspace = $stateParams.workspace;
    $scope.thumbnails = {};
    $scope.olmaps = {};
    $timeout(function () {
      if ($scope.$parent && $scope.$parent.tabs) {
        $scope.$parent.tabs[0].active = true;
      }
    }, 300);
    $scope.mapThumbsWidth = 175;
    $scope.mapThumbsHeight = 175;
    function thumbnailize() {
      // load all map thumbnails & metadata
      var retina = $window.devicePixelRatio > 1;
      for (var i = 0; i < $scope.maps.length; i++) {
        var map = $scope.maps[i];
        $scope.maps[i].workspace = $scope.workspace;
        var url = GeoServer.map.thumbnail.get(map.workspace, map.name) + '?t=' + new Date().getTime();
        if (retina) {
          url = url + '&hiRes=true';
        }
        $scope.thumbnails[map.name] = url;
      }
    }
    $scope.opts = {
      paging: {
        pageSizes: [
          25,
          50,
          100
        ],
        pageSize: 25,
        currentPage: 1
      },
      sort: {
        predicate: 'name',
        order: 'asc'
      },
      filter: { filterText: '' }
    };
    $scope.serverRefresh = function () {
      var opts = $scope.opts;
      return mapsListModel.fetchMaps($scope.workspace, opts.paging.currentPage, opts.paging.pageSize, opts.sort.predicate + ':' + opts.sort.order, opts.filter.filterText).then(function () {
        $scope.maps = mapsListModel.getMaps();
        $scope.totalItems = mapsListModel.getTotalServerItems();
        if (!$scope.maps) {
          return;
        }
        thumbnailize();
      });
    };
    $scope.mapsLoading = true;
    $scope.serverRefresh().then(function () {
      $scope.mapsLoading = false;
    });
    var refreshTimer = null;
    $scope.refreshMaps = function () {
      if (refreshTimer) {
        $timeout.cancel(refreshTimer);
      }
      refreshTimer = $timeout(function () {
        $scope.serverRefresh();
      }, 800);
    };
    $scope.mapsHome = function () {
      if (!$state.is('workspace.maps.main')) {
        $state.go('workspace.maps.main', { workspace: $scope.workspace });
      }
    };
    // Get stores and layers to see what modal to provide
    // when user attempts to create a map
    storesListModel.fetchStores($scope.workspace).then(function () {
      $scope.datastores = storesListModel.getStores();
    });
    layersListModel.fetchLayers($scope.workspace).then(function () {
      $scope.layers = layersListModel.getLayers();
    });
    $scope.createMap = function () {
      if ($scope.layers && $scope.layers.length === 0) {
        if (!$scope.datastores.length) {
          var nostores_modal = $modal.open({
              templateUrl: '/components/modalform/map/nostores.tpl.html',
              controller: function ($scope, $modalInstance) {
                $scope.close = function () {
                  $modalInstance.close('close');
                };
              },
              backdrop: 'static',
              size: 'md'
            });
        } else {
          var nolayer_modal = $modal.open({
              templateUrl: '/components/modalform/map/nolayers.tpl.html',
              controller: function ($scope, $modalInstance) {
                $scope.close = function () {
                  $modalInstance.close('close');
                };
              },
              backdrop: 'static',
              size: 'md'
            });
        }
        return;
      }
      var createModalInstance = $modal.open({
          templateUrl: '/components/modalform/map/map.new.tpl.html',
          controller: 'NewMapCtrl',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            workspace: function () {
              return $scope.workspace;
            },
            mapInfo: function () {
              return null;
            }
          }
        }).result.then(function (result) {
          if (!result) {
            $state.go('workspace.maps.main');
          }
        });
    };
    $scope.$on(AppEvent.CreateNewMap, function () {
      $scope.createMap();
    });
    $scope.$on(AppEvent.MapUpdated, function (scope, map) {
      // Update thumbnail if name changed
      if (map && map.new) {
        var _new = map.new;
        var _original = map.original;
        for (var i = 0; i < $scope.maps.length; i++) {
          if (angular.equals($scope.maps[i], _original)) {
            $scope.maps[i] = angular.copy(_new);
          }
        }
      }
    });
    $scope.$watch('opts', function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        $scope.serverRefresh();
      }
    }, true);
  }
]).controller('MapsMainCtrl', function ($scope, $state, $stateParams, $sce, $window, $log, GeoServer, $modal, $rootScope, AppEvent, _, mapsListModel, OlExport) {
  $scope.workspace = $stateParams.workspace;
  $scope.sortBy = function (pred) {
    var sort = $scope.opts.sort;
    if (pred === sort.predicate) {
      // flip order if selected same
      sort.order = sort.order === 'asc' ? 'desc' : 'asc';
    } else {
      // default to 'asc' order when switching
      sort.predicate = pred;
      sort.order = 'asc';
    }
    $scope.refreshMaps();
  };
  $scope.sanitizeHTML = function (description) {
    return $sce.trustAsHtml(description);
  };
  $scope.newOLWindow = function (map) {
    var baseUrl = GeoServer.map.openlayers.get(map.workspace, map.name, 800, 500);
    $window.open(baseUrl);
  };
  $scope.editMapSettings = function (map) {
    var modalInstance = $modal.open({
        templateUrl: '/components/modalform/map/map.settings.tpl.html',
        controller: 'EditMapSettingsCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          workspace: function () {
            return $scope.workspace;
          },
          map: function () {
            return map;
          }
        }
      });
  };
  //TODO: Push modal to own controller/scope? 
  $scope.generateMapSrc = function (map) {
    OlExport.wrapHtml(OlExport.fromMapObj(map)).then(function (src) {
      $scope.ol3src = src;
      $modal.open({
        templateUrl: '/workspaces/detail/maps/maps.modal.export.tpl.html',
        scope: $scope
      });
    });
  };
  $scope.preview = function () {
    $window.open().document.write($scope.ol3src);
  };
  $scope.deleteMap = function (map) {
    var modalInstance = $modal.open({
        templateUrl: '/workspaces/detail/maps/maps.modal.delete.tpl.html',
        controller: 'MapDeleteCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          workspace: function () {
            return $scope.workspace;
          },
          map: function () {
            return map;
          }
        }
      });
  };
  $rootScope.$on(AppEvent.MapsAllUpdated, function (scope, maps) {
    if (maps) {
      $scope.maps = maps;
      $scope.totalItems = maps.length;
      mapsListModel.setMaps(maps);
    }
  });
  $rootScope.$on(AppEvent.MapAdded, function (scope, map) {
    if (map) {
      mapsListModel.addMap(map);
      $scope.maps = mapsListModel.getMaps();
    }
  });
  $rootScope.$on(AppEvent.MapRemoved, function (scope, map) {
    if (map) {
      mapsListModel.removeMap(map);
      $scope.maps = mapsListModel.getMaps();
    }
  });
  $rootScope.$on(AppEvent.MapUpdated, function (scope, map) {
    // Update thumbnail if name changed
    if (map && map.new) {
      var _new = map.new;
      var _original = map.original;
      if (!_original || _new.name !== _original.name) {
        var retina = $window.devicePixelRatio > 1;
        var url = GeoServer.map.thumbnail.get(_new.workspace, _new.name) + '?t=' + new Date().getTime();
        if (retina) {
          url = url + '&hiRes=true';
        }
        $scope.thumbnails[_new.name] = url;
        // remove old thumbnail
        if (_original) {
          $scope.thumbnails[_original.name] = null;
        }
      }
    }
  });
}).service('mapsListModel', function (GeoServer, _, $rootScope) {
  var _this = this;
  this.maps = null;
  this.totalServerItems = 0;
  this.getTotalServerItems = function () {
    return _this.totalServerItems;
  };
  this.getMaps = function () {
    return _this.maps;
  };
  this.setMaps = function (maps) {
    _this.maps = maps;
  };
  this.addMap = function (map) {
    if (!_this.maps) {
      _this.maps = [];
    }
    _this.maps.push(map);
  };
  this.removeMap = function (map) {
    if (!_this.maps) {
      _this.maps = [];
    }
    _.remove(this.maps, function (_map) {
      return _map.name == map.name;
    });
  };
  this.sortByTime = function (maps) {
    // sort by timestamp
    var sorted = _.sortBy(maps, function (map) {
        if (map.modified) {
          return map.modified.timestamp;
        }
      });
    return sorted.reverse();
  };
  this.fetchMaps = function (workspace, currentPage, pageSize, sort, filterText) {
    return GeoServer.maps.get(workspace, currentPage - 1, pageSize, sort, filterText).then(function (result) {
      if (result.success) {
        var maps = _.map(result.data.maps, function (map) {
            if (map.modified) {
              // convert time strings to Dates
              return _.assign(map, {
                'modified': {
                  'timestamp': new Date(map.modified.timestamp),
                  'pretty': map.modified.pretty
                }
              });
            } else {
              return map;
            }
          });
        _this.totalServerItems = result.data.total;
        // sort by timestamp
        _this.setMaps(maps);
      } else {
        $rootScope.alerts = [{
            type: 'warning',
            message: 'Unable to load paged workspace maps: ' + result.data.message,
            details: result.data.trace,
            fadeout: true
          }];
      }
    });
  };
});/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.maps.delete', []).controller('MapDeleteCtrl', [
  'workspace',
  'map',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  function (workspace, map, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent) {
    $scope.workspace = workspace;
    $scope.map = map;
    $scope.mapDeleted = false;
    $scope.deleteForever = function () {
      GeoServer.map.delete($scope.workspace, $scope.map.name).then(function (result) {
        if (result && result.success) {
          $scope.mapDeleted = true;
          $rootScope.alerts = [{
              type: 'success',
              message: 'Map ' + map.name + ' deleted.',
              fadeout: true
            }];
          $rootScope.$broadcast(AppEvent.MapRemoved, $scope.map);
          mapsListModel.removeMap(map);
          $rootScope.$broadcast(AppEvent.MapsAllUpdated, mapsListModel.getMaps());
        } else {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Map deletion failed: ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
      $modalInstance.close($scope.map);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.home', [
  'gsApp.editor.map',
  'gsApp.workspaces.maps',
  'gsApp.workspaces.layers',
  'gsApp.workspaces.data',
  'gsApp.workspaces.settings',
  'gsApp.alertpanel',
  'gsApp.import',
  'ngSanitize'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('workspace', {
      url: '/workspace/:workspace',
      templateUrl: '/workspaces/detail/workspace.tpl.html',
      controller: 'WorkspaceHomeCtrl'
    });
  }
]).controller('WorkspaceHomeCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  '$log',
  '$modal',
  'GeoServer',
  'AppEvent',
  '$timeout',
  '$location',
  '$rootScope',
  '_',
  function ($scope, $state, $stateParams, $log, $modal, GeoServer, AppEvent, $timeout, $location, $rootScope, _) {
    var wsName = $stateParams.workspace;
    $scope.workspace = wsName;
    var loc = $location.path();
    function isActive(tab) {
      if (loc.indexOf(tab) > -1) {
        return true;
      }
      return false;
    }
    GeoServer.workspace.get(wsName).then(function (result) {
      if (!result.success) {
        $rootScope.alerts = [{
            type: 'danger',
            message: result.data.message + '. Please create it first.',
            fadeout: true
          }];
        $state.go('workspaces.list');
        return;
      }
      $scope.tabs = [
        {
          heading: 'Maps',
          icon: 'icon-map',
          routeCategory: 'workspace.maps',
          route: 'workspace.maps.main',
          active: isActive('maps')
        },
        {
          heading: 'Layers',
          icon: 'icon-stack',
          routeCategory: 'workspace.layers',
          route: 'workspace.layers.main',
          active: isActive('layers')
        },
        {
          heading: 'Data',
          icon: 'fa fa-database',
          routeCategory: 'workspace.data',
          route: 'workspace.data.main',
          active: isActive('data')
        }
      ];
      $scope.go = function (route) {
        $state.go(route, { workspace: wsName });
      };
      $scope.workspaceSettings = function () {
        $modal.open({
          templateUrl: '/components/modalform/workspace/workspace.settings.tpl.html',
          controller: 'WorkspaceSettingsCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return $scope.workspace;
            }
          }
        });
      };
      // hack to deal with strange issue with tabs being selected
      // when they are destroyed
      // https://github.com/angular-ui/bootstrap/issues/2155
      var destroying = false;
      $scope.$on('$destroy', function () {
        destroying = true;
      });
      $scope.selectTab = function (t) {
        if (!destroying) {
          $scope.go(t.route);
        }
      };
      $scope.workspaceHome = function () {
        $scope.selectTab($scope.tabs[0]);
        $scope.tabs[0].active = true;
      };
      $scope.createMap = function () {
        $scope.selectTab($scope.tabs[0]);
        $scope.tabs[0].active = true;
        $timeout(function () {
          $rootScope.$broadcast(AppEvent.CreateNewMap);
        }, 100);
      };
      $scope.importData = function () {
        $scope.selectTab($scope.tabs[2]);
        $scope.tabs[2].active = true;
        $timeout(function () {
          $modal.open({
            templateUrl: '/components/import/import.tpl.html',
            controller: 'DataImportCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              workspace: function () {
                return $scope.workspace;
              },
              mapInfo: function () {
                return null;
              },
              contextInfo: function () {
                return null;
              }
            }
          }).result.then(function (param) {
            //TODO: Add store select (implement as state param)
            $state.go('workspace.data.main');
          });
        }, 100);
      };
      $scope.$on('$stateChangeSuccess', function (e, to, toParams, from, fromParams) {
        $scope.tabs.forEach(function (tab) {
          if ($state.is(tab.routeCategory)) {
            tab.active = $state.is(tab.routeCategory);
          }
        });
        if (to.name == 'workspace') {
          $state.go($scope.tabs[0].route, toParams);
        }
      });
    });
    $rootScope.$on(AppEvent.WorkspaceTab, function (scope, tabname) {
      if (tabname) {
        var tab = _.find($scope.tabs, function (t) {
            return t.heading.toLowerCase() === tabname.toLowerCase();
          });
        if (tab) {
          $scope.selectTab(tab);
        }
      }
    });
    $rootScope.$on(AppEvent.WorkspaceNameChanged, function (scope, names) {
      if ($scope.workspace == names.original) {
        $scope.workspace = names.new;
        wsName = names.new;
      }
    });
    // if no tab is active go to maps tab
    if (!isActive('maps') && !isActive('layers') && !isActive('data') && !isActive('settings')) {
      $state.go('workspace.maps.main');
    }
  }
]);/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.delete', []).controller('WorkspaceDeleteCtrl', [
  'workspace',
  '$scope',
  '$rootScope',
  '$state',
  '$log',
  '$modalInstance',
  'GeoServer',
  'AppEvent',
  function (workspace, $scope, $rootScope, $state, $log, $modalInstance, GeoServer, AppEvent) {
    $scope.workspace = workspace;
    $scope.workspaceDeleted = false;
    $scope.deleteForever = function () {
      GeoServer.workspace.delete($scope.workspace).then(function (result) {
        if (result && result.success) {
          $scope.workspaceDeleted = true;
          $rootScope.alerts = [{
              type: 'success',
              message: 'Workspace ' + workspace + ' deleted.',
              fadeout: true
            }];
          $rootScope.$broadcast(AppEvent.WorkspaceDeleted, $scope.workspace);
          $state.go('workspaces.list');
        } else {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Workspace deletion failed: ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      });
      $modalInstance.close($scope.workspace);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);/*
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces.list', [
  'ngGrid',
  'gsApp.core.utilities',
  'ngAnimate'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('workspaces.list', {
      url: '/list',
      templateUrl: '/workspaces/list.tpl.html',
      controller: 'WorkspacesListCtrl'
    });
  }
]).controller('WorkspacesListCtrl', [
  '$scope',
  'GeoServer',
  '$state',
  '$log',
  '$modal',
  '$rootScope',
  'AppEvent',
  '_',
  'workspacesListModel',
  '$timeout',
  function ($scope, GeoServer, $state, $log, $modal, $rootScope, AppEvent, _, workspacesListModel, $timeout) {
    $scope.title = 'All Project Workspaces';
    $scope.onWorkspaceClick = function (workspace) {
      var params = { workspace: workspace.name };
      var state = 'workspace';
      $state.go(state, params);
      $rootScope.$broadcast(AppEvent.WorkspaceSelected, workspace.name);
    };
    $scope.defaultDesc = 'If a project workspace is not specified ' + 'in a GeoServer request, the DEFAULT one is used.';
    $scope.showDefaultDesc = false;
    $scope.workspaces = workspacesListModel.getWorkspaces();
    if (!$scope.workspaces) {
      workspacesListModel.fetchWorkspaces().then(function (result) {
        $scope.workspaces = workspacesListModel.getWorkspaces();
        $rootScope.$broadcast(AppEvent.WorkspacesFetched, $scope.workspaces);
      });
    }
    $scope.onWorkspaceInfo = function (workspace) {
      $scope.selected = workspace;
      GeoServer.workspace.get(workspace.name).then(function (result) {
        if (result.success) {
          $scope.selected.workspaceInfo = result.data;
          $scope.selected.showInfo = true;
          $timeout(function () {
            $scope.selected.showInfo = false;
          }, 4000);
        } else {
          $scope.alerts = [{
              type: 'warning',
              message: 'Could not get workspace ' + workspace.name + '.',
              fadeout: true
            }];
        }
      });
    };
    $scope.go = function (route, workspace) {
      $state.go(route, { workspace: workspace.name });
    };
    $scope.workspaceSettings = function (workspace) {
      $modal.open({
        templateUrl: '/components/modalform/workspace/workspace.settings.tpl.html',
        controller: 'WorkspaceSettingsCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          workspace: function () {
            return workspace.name;
          }
        }
      });
    };
    $scope.deleteWorkspace = function (workspace) {
      var modalInstance = $modal.open({
          templateUrl: '/workspaces/detail/workspace.modal.delete.tpl.html',
          controller: 'WorkspaceDeleteCtrl',
          backdrop: 'static',
          size: 'md',
          resolve: {
            workspace: function () {
              return workspace.name;
            }
          }
        });
    };
  }
]).service('workspacesListModel', function (GeoServer, _, $rootScope) {
  var _this = this;
  this.workspaces = null;
  this.getWorkspaces = function () {
    return this.workspaces;
  };
  this.setWorkspaces = function (workspaces) {
    this.workspaces = workspaces;
  };
  this.addWorkspace = function (workspace) {
    this.workspaces.push(workspace);
  };
  this.removeWorkspace = function (workspace) {
    _.remove(_this.workspaces, function (_workspace) {
      return _workspace.name === workspace.name;
    });
  };
  this.fetchWorkspaces = function () {
    return GeoServer.workspaces.get(true).then(function (result) {
      if (result.success) {
        var workspaces = _.map(result.data, function (ws) {
            if (ws.modified) {
              // convert time strings to Dates
              return _.assign(ws, {
                'modified': {
                  'timestamp': new Date(ws.modified.timestamp),
                  'pretty': ws.modified.pretty
                }
              });
            } else {
              return ws;
            }
          });
        // sort by timestamp
        workspaces = _.sortBy(workspaces, function (ws) {
          if (ws.modified) {
            return ws.modified.timestamp;
          }
        });
        _this.setWorkspaces(workspaces.reverse());
      } else {
        // special case, check for 401 Unauthorized, if so be quiet
        if (result.status != 401) {
          $rootScope.alerts = [{
              type: 'warning',
              message: 'Could not get workspaces: ' + result.data.message,
              details: result.data.trace,
              fadeout: true
            }];
        }
      }
    });
  };
});/* 
 * (c) 2014 Boundless, http://boundlessgeo.com
 */
angular.module('gsApp.workspaces', [
  'ngGrid',
  'gsApp.core.utilities',
  'gsApp.workspaces.list',
  'gsApp.workspaces.new',
  'gsApp.workspaces.delete',
  'gsApp.workspaces.home'
]).config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('workspaces', {
      abstract: true,
      url: '/workspaces',
      templateUrl: '/workspaces/workspaces.tpl.html'
    });
  }
]);