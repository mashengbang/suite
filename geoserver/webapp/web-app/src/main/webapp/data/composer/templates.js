angular.module('gsApp.templates', ['/components/alertpanel/alertlist.tpl.html', '/components/alertpanel/alertpanel.tpl.html', '/components/editor/editor.layer.tpl.html', '/components/editor/editor.map.modal.addlayer.tpl.html', '/components/editor/editor.map.tpl.html', '/components/editor/editor.modal.save.tpl.html', '/components/editor/layerlist/layerlist.tpl.html', '/components/editor/layerlist/layerremove.tpl.html', '/components/editor/olmap/olmap.tpl.html', '/components/editor/styleeditor/styleeditor.tpl.html', '/components/editor/tools/attributes.modal.tpl.html', '/components/editor/tools/basemap.modal.tpl.html', '/components/editor/tools/display.tpl.html', '/components/editor/tools/icons.modal.tpl.html', '/components/editor/tools/shortcuts.modal.tpl.html', '/components/editor/tools/sld.modal.tpl.html', '/components/errorpanel/errorpanel.tpl.html', '/components/errorpanel/inlineErrors.tpl.html', '/components/featureinfopanel/featureinfopanel.tpl.html', '/components/grid/footer.tpl.html', '/components/import/import.db.tpl.html', '/components/import/import.details.tpl.html', '/components/import/import.file.tpl.html', '/components/import/import.newmap.tpl.html', '/components/import/import.tpl.html', '/components/modalform/layer/layer.duplicate.tpl.html', '/components/modalform/layer/layer.publish.tpl.html', '/components/modalform/layer/layer.settings.tpl.html', '/components/modalform/map/map.new.form.tpl.html', '/components/modalform/map/map.new.import.tpl.html', '/components/modalform/map/map.new.layers.tpl.html', '/components/modalform/map/map.new.tpl.html', '/components/modalform/map/map.settings.tpl.html', '/components/modalform/map/nolayers.tpl.html', '/components/modalform/map/nostores.tpl.html', '/components/modalform/modal.form.crs.tpl.html', '/components/modalform/modal.form.description.tpl.html', '/components/modalform/modal.form.name.layer.tpl.html', '/components/modalform/modal.form.name.map.tpl.html', '/components/modalform/modal.form.name.ws.tpl.html', '/components/modalform/modal.form.title.tpl.html', '/components/modalform/workspace/workspace.new.tpl.html', '/components/modalform/workspace/workspace.settings.tpl.html', '/components/olexport/ol.tpl.html', '/components/projfield/projfield.tpl.html', '/components/sidenav/sidenav.tpl.html', '/components/topnav/topnav.tpl.html', '/core/login/login.modal.tpl.html', '/core/login/login.tpl.html', '/core/modals/popover-html-unsafe.tpl.html', '/home/home.tpl.html', '/layers/addnewlayer-modal.tpl.html', '/layers/deletelayer-modal.tpl.html', '/layers/detail/layer.tpl.html', '/layers/layers.tpl.html', '/layers/layers.type.tpl.html', '/maps/deletemap-modal.tpl.html', '/maps/detail/map.tpl.html', '/maps/maps.tpl.html', '/workspaces/detail/data/data.main.tpl.html', '/workspaces/detail/data/data.modal.attributes.tpl.html', '/workspaces/detail/data/data.modal.delete.tpl.html', '/workspaces/detail/data/data.modal.update.tpl.html', '/workspaces/detail/data/data.tpl.html', '/workspaces/detail/data/format.type.tpl.html', '/workspaces/detail/layers/layers.main.tpl.html', '/workspaces/detail/layers/layers.modal.delete.tpl.html', '/workspaces/detail/layers/layers.tpl.html', '/workspaces/detail/maps/maps.main.tpl.html', '/workspaces/detail/maps/maps.modal.delete.tpl.html', '/workspaces/detail/maps/maps.modal.export.tpl.html', '/workspaces/detail/maps/maps.tpl.html', '/workspaces/detail/workspace.modal.delete.tpl.html', '/workspaces/detail/workspace.tpl.html', '/workspaces/list.tpl.html', '/workspaces/workspaces.tpl.html']);

angular.module("/components/alertpanel/alertlist.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/alertpanel/alertlist.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Recent Alerts</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"alert-filter\" ng-init=\"filter={}\">\n" +
    "      Filter alerts:\n" +
    "      <span><input type=\"checkbox\" ng-model=\"filter.danger\" ng-init=\"filter.danger=true\" ng-click=\"scrollToBottom()\"></input>Danger</span>\n" +
    "      <span class=\"left-border\"><input type=\"checkbox\" ng-model=\"filter.warning\" ng-init=\"filter.warning=true\" ng-click=\"scrollToBottom()\"></input>Warning</span>\n" +
    "      <span class=\"left-border\"><input type=\"checkbox\" ng-model=\"filter.success\" ng-init=\"filter.success=true\" ng-click=\"scrollToBottom()\"></input>Success</span>\n" +
    "    </div>\n" +
    "    <ul id=\"alert-list\" class=\"alert-list list-unstyled\">\n" +
    "      <div class=\"no-alert\" ng-if=\"alertList.length == 0\">(No alerts)</div>\n" +
    "      <li ng-repeat=\"alert in alertList\">\n" +
    "        <alert type=\"{{alert.type}}\" ng-show=\"(alert.type=='danger' && filter.danger) || (alert.type=='success' && filter.success) || ((!alert.type || alert.type=='warning') && filter.warning)\">\n" +
    "          <div class=\"alert-content\">\n" +
    "            <div ng-class=\"alert.details? 'alert-message-details' : 'alert-message'\">{{ alert.message }}</div>\n" +
    "            <div><a ng-if=\"alert.details\" ng-click=\"alert.showDetails = !alert.showDetails\" ng-init=\"alert.showDetails = false\" class=\"alert-details\">{{ alert.showDetails ? 'Hide details' : 'Details' }} </a></div>\n" +
    "          </div>\n" +
    "          <div class=\"alert-text horizontal-divider\" collapse=\"!alert.showDetails\">\n" +
    "          {{ alert.details }}\n" +
    "          </div>\n" +
    "        </alert>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"close()\">Close</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/alertpanel/alertpanel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/alertpanel/alertpanel.tpl.html",
    "<div class=\"alert-panel\" ng-show=\"showMessages\">\n" +
    "  <script type=\"text/ng-template\" id=\"alert-modal\">\n" +
    "    <div class=\"modal-header\">\n" +
    "      <h5><strong>{{ message.message }}</strong></h5>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "      <div class=\"alert-modal-details\">{{ message.details }}</div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary\" clip-copy=\"message.details\"\n" +
    "          clip-click=\"copy()\">Copy</button>\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"close()\">Close</button>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "  <alert ng-repeat=\"msg in messages\" ng-show=\"msg.show\" type=\"{{msg.type}}\"\n" +
    "    close=\"closeAlert($index)\">\n" +
    "    <div class=\"alert-content\">\n" +
    "      <div ng-class=\"msg.details? 'alert-message-details' : 'alert-message'\">{{msg.message}}</div>\n" +
    "      <div><a ng-if=\"msg.details\" ng-click=\"showDetails(msg)\" class=\"alert-details\">Details</a></div>\n" +
    "    </div>\n" +
    "  </alert>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/editor.layer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/editor.layer.tpl.html",
    "<div class=\"editor editor-layer\">\n" +
    "  <div class=\"row row-editor-navbar\">\n" +
    "    <div class=\"col-xs-12 layer-name-row\">\n" +
    "      <nav class=\"navbar navbar-default layer-name\" role=\"navigation\">\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-xs-6 col-lg-7 resizable-left\">\n" +
    "            <div class=\"navbar-brand\">\n" +
    "              <a ng-click=\"viewWorkspace(workspace);\" title=\"{{ workspace }}\"><i class=\"icon-lg icon-folder-open\"></i> {{ workspace }}</a>\n" +
    "              <a ng-click=\"editLayerSettings(layer);\" title=\"{{ layer.name }}\"><i class=\"fa fa-angle-right\" style=\"padding: 0 5px;\"></i> <span class=\"icon-wonky\"><i class=\"icon-stack\"></i></span> <span class=\"map-name-span\">{{ layer.name }}</span></a>\n" +
    "            </div>\n" +
    "            <div class=\"render-progress-container\">\n" +
    "              <span ng-show=\"isRendering\" class=\"render-progress\">\n" +
    "                <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                Rendering map\n" +
    "              </span>\n" +
    "              <featureinfo-panel featureinfo=\"featureinfo\" active-layer=\"layer\"></featureinfo-panel>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"col-xs-6 col-lg-5 info resizable-right\">\n" +
    "            <div class=\"top\">\n" +
    "              <div class=\"shortcuts\">\n" +
    "                <style-editor-shortcuts></style-editor-shortcuts>\n" +
    "                <a ng-click=\"editLayerSettings(layer);\" style=\"margin-left: 10px;\">\n" +
    "                  <i class=\"icon-cog icon-lg\"></i>\n" +
    "                </a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </nav>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row row-editor-content\">\n" +
    "    <div id=\"mapPanel\" class=\"col-xs-6 col-lg-7 resizable-left map-panel\" ng-style=\"mapBackground\">\n" +
    "      <div ol-map class=\"map\" map-opts=\"mapOpts\" ng-show=\"!mapError\"\n" +
    "        ng-class=\"{'hide-all': hideCtrl.all, 'hide-lonlat': hideCtrl.lonlat}\">\n" +
    "      </div>\n" +
    "      <div class=\"map-error\" ng-show=\"mapError\"> \n" +
    "        Error creating the OL3 Map.<br/><div class=\"hint\">Verify the projection and view bounds are valid.</div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div id=\"editingPanel\" class=\"col-xs-6 col-lg-5 resizable-right editing-panel\">\n" +
    "      <div class=\"editor-background\">\n" +
    "        <div id=\"resizer\" resizer=\"vertical\" alt=\"Drag to resize\" title=\"Drag to resize\" left-min=\"300\" right-min=\"300\"></div>\n" +
    "        <div class=\"map-editor\">\n" +
    "          <div class=\"style-toolbar\">\n" +
    "            <ul class=\"list-unstyled list-inline\">\n" +
    "              <style-editor-fullscreen click=\"toggleFullscreen\"></style-editor-fullscreen>\n" +
    "              <style-editor-save editor=\"editor\" click=\"saveStyle\"></style-editor-save>\n" +
    "              <style-editor-undo editor=\"editor\"></style-editor-undo>\n" +
    "              <style-editor-display editor=\"editor\"></style-editor-display>\n" +
    "              <style-editor-color editor=\"editor\"></style-editor-color>\n" +
    "              <style-editor-icons editor=\"editor\"></style-editor-icons>\n" +
    "              <style-editor-attrs editor=\"editor\" layer=\"layer\"></style-editor-attrs>\n" +
    "              <style-editor-sld editor=\"editor\" layer=\"layer\"></style-editor-sld>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "          <style-editor></style-editor>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/editor.map.modal.addlayer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/editor.map.modal.addlayer.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" style=\"display: inline-block;\">Add to Map <strong>{{ map.name }}</strong></h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <div class=\"available-layers\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <div class=\"layers-count-sort\">\n" +
    "            <div class=\"layers-count\">\n" +
    "              <strong>{{ totalItems }} layer<span ng-if=\"layers.length==0 || layers.length>1\">s</span></strong> in current project.\n" +
    "            </div>\n" +
    "            <div class=\"pull-right\">\n" +
    "              <div class=\"filter-box\">\n" +
    "                <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"opts.filter.filterText\" placeholder=\"Filter layers by...\" size=\"25\" ng-change=\"refreshLayers()\" />\n" +
    "                <i class=\"fa fa-search\"></i>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div name=\"lyrs\" ng-grid=\"layerOptions\" id=\"avail-layers-grid\" ng-style=\"gridWidth\"></div>\n" +
    "      <br/>\n" +
    "      <div class=\"layers-paging\">\n" +
    "        <pagination total-items=\"totalItems\" items-per-page =\"opts.paging.pageSize\" ng-model=\"opts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <div class=\"pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"close()\">Close</button>\n" +
    "    </div>\n" +
    "    <div class=\"pull-right\" style=\"display: inline-block;\">\n" +
    "      <button class=\"btn btn-success btn-sm\" ng-disabled=\"layerSelections.length==0\" ng-click=\"addSelectedToMap();\" style=\"margin-right:20px;\">Add Selected to Map</button>\n" +
    "      <button class=\"btn btn-warning btn-sm\" ng-click=\"importDataToNewLayers();\" style=\"margin-right:20px;\">Import Data to New Layers &rarr;</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/editor.map.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/editor.map.tpl.html",
    "<div tracking></div>\n" +
    "<div class=\"editor editor-map\">\n" +
    "  <div class=\"row row-editor-navbar\">\n" +
    "    <div class=\"col-xs-12 map-name-row\">\n" +
    "      <nav class=\"navbar navbar-default map-name\" role=\"navigation\">\n" +
    "        <div class=\"row map-detail-compose-nav\">\n" +
    "          <div class=\"col-xs-6 col-lg-7 resizable-left\">\n" +
    "            <div class=\"navbar-brand\">\n" +
    "              <a ng-click=\"viewWorkspace(workspace);\" title=\"{{ workspace }}\"><i class=\"icon-lg icon-folder-open\"></i>{{ workspace }}</a>\n" +
    "              <a ng-click=\"editMapSettings(map);\" title=\"{{ map.name }}\"><i class=\"fa fa-angle-right\" style=\"padding: 0 5px;\"></i> <span class=\"icon-wonky\"><i class=\"icon-map\"></i></span> <span class=\"map-name-span\">{{ map.name }}</span></a>\n" +
    "              <a ng-click=\"editLayerSettings(layer);\" title=\"{{ layer.name }}\"><i class=\"fa fa-angle-right\" style=\"padding: 0 5px;\"></i> <span class=\"icon-wonky\"><i class=\"icon-stack\"></i></span> <span class=\"map-name-span\">{{ layer.name }}</span></a>\n" +
    "            </div>\n" +
    "            <span ng-show=\"isRendering\" class=\"render-progress pull-right\">\n" +
    "              <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "              Rendering map\n" +
    "            </span>\n" +
    "            <featureinfo-panel featureinfo=\"featureinfo\" active-layer=\"layer\"></featureinfo-panel>\n" +
    "          </div>\n" +
    "          <div class=\"col-xs-6 col-lg-5 info resizable-right\">\n" +
    "            <div class=\"top\">\n" +
    "              <a class=\"layers-toggle\" ng-click=\"toggleLayers()\">{{ map.layers.length }} Layer<span ng-if=\"map.layers.length > 1\">s</span></a>\n" +
    "              <button class=\"btn btn-default btn-sm add-layer\" ng-click=\"addMapLayer()\"><i class=\"fa fa-plus\"></i> Add Layer</button>\n" +
    "              <div class=\"shortcuts\">\n" +
    "                <style-editor-shortcuts></style-editor-shortcuts>\n" +
    "                <a ng-click=\"editMapSettings(map);\" style=\"margin-left: 10px;\">\n" +
    "                  <i class=\"icon-cog icon-lg\"></i>\n" +
    "                </a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </nav>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row row-editor-content\">\n" +
    "    <div id=\"mapPanel\" class=\"col-xs-6 col-lg-7 resizable-left map-panel\" ng-style=\"mapBackground\">\n" +
    "      <div ol-map class=\"map\" map-opts=\"mapOpts\" ng-show=\"!mapError\"\n" +
    "        ng-class=\"{'hide-all': hideCtrl.all, 'hide-lonlat': hideCtrl.lonlat}\">\n" +
    "      </div>\n" +
    "      <div class=\"map-error\" ng-show=\"mapError\"> \n" +
    "        Error creating the OL3 Map.<br/><div class=\"hint\">Verify the projection and view bounds are valid.</div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div id=\"editingPanel\" class=\"col-xs-6 col-lg-5 resizable-right editing-panel\">\n" +
    "      <div class=\"editor-background\">\n" +
    "        <div id=\"resizer\" resizer=\"vertical\" alt=\"Drag to resize\" title=\"Drag to resize\" left-min=\"300\" right-min=\"300\"></div>\n" +
    "        <layer-list></layer-list>\n" +
    "        <div class=\"map-editor\">\n" +
    "          <div class=\"style-toolbar\">\n" +
    "            <ul class=\"list-unstyled list-inline\">\n" +
    "              <style-editor-fullscreen click=\"toggleFullscreen\"></style-editor-fullscreen>\n" +
    "              <style-editor-layers click=\"toggleLayers\"></style-editor-layers>\n" +
    "              <style-editor-save editor=\"editor\" click=\"saveStyle\"></style-editor-save>\n" +
    "              <style-editor-undo editor=\"editor\"></style-editor-undo>\n" +
    "              <style-editor-display editor=\"editor\"></style-editor-display>\n" +
    "              <style-editor-color editor=\"editor\"></style-editor-color>\n" +
    "              <style-editor-icons editor=\"editor\"></style-editor-icons>\n" +
    "              <style-editor-attrs editor=\"editor\" layer=\"layer\"></style-editor-attrs>\n" +
    "              <style-editor-sld editor=\"editor\" layer=\"layer\"></style-editor-sld>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "          <style-editor></style-editor>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/editor.modal.save.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/editor.modal.save.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Editor: Unsaved Changes</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        The editor contains unsaved changes; would you like to save or discard those changes?\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button ng-show=\"linterIsvalid\" class=\"btn btn-success btn-sm\" ng-click=\"saveChanges()\">Save</button>\n" +
    "    <button class=\"btn btn-danger btn-sm\" ng-click=\"discardChanges()\">Discard</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/layerlist/layerlist.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/layerlist/layerlist.tpl.html",
    "<div class=\"editor-layerlist\" ng-class=\"{show: showLayerList == true, osx: isOSX()}\">\n" +
    "  <div class=\"layerlist-scroll\">\n" +
    "  <ul ui-sortable=\"{stop:layersReordered}\" ng-model=\"map.layers\"\n" +
    "      class=\"layerlist-list list-unstyled\">\n" +
    "    <li ng-repeat=\"l in map.layers\" ng-click=\"selectLayer(l)\"\n" +
    "      ng-class=\"{active: layer == l}\" >\n" +
    "      <div class=\"map-layer\">\n" +
    "        <input type=\"checkbox\" ng-model=\"l.visible\" ng-click=\"toggleVisibility(l, $index)\" />\n" +
    "      {{ l.name }}\n" +
    "      </div>\n" +
    "      <div class=\"map-layer-overlay text-right\">\n" +
    "        <span class=\"icons\">\n" +
    "          <i class=\"fa fa-arrow-circle-o-left\" title=\"Zoom To Layer\"\n" +
    "            ng-click=\"zoomToLayer(l)\"></i>\n" +
    "          <i class=\"fa fa-trash\" title=\"Remove Layer\"\n" +
    "            ng-click=\"removeLayer(l, $index)\"></i>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <div class=\"reorder-info\" ng-style=\"headerStyle\" ng-init=\"updateHeaderStyle()\">Drag to Reorder</div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("/components/editor/layerlist/layerremove.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/layerlist/layerremove.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Remove Layer from Map?</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <div ng-if=\"map.layer_count > 1\">\n" +
    "      <p>Remove layer <strong>{{ layer.name }}</strong> from map {{ map.name }}?</p>\n" +
    "      <p>The layer will still be available in the project workspace.</p>\n" +
    "    </div>\n" +
    "    <div ng-if=\"map.layer_count == 1\">\n" +
    "      <p>Maps must contain at least 1 layer. This final layer cannot be deleted.\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\" ng-if=\"map.layer_count > 1\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button class=\"btn btn-danger btn-sm\" ng-click=\"remove()\">Yes, Remove it</button>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\" ng-if=\"map.layer_count == 1\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Close</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/olmap/olmap.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/olmap/olmap.tpl.html",
    "<div></div>\n" +
    "");
}]);

angular.module("/components/editor/styleeditor/styleeditor.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/styleeditor/styleeditor.tpl.html",
    "<div class=\"style-editor\" ui-codemirror=\"{ onLoad : onCodeMirrorLoad }\"\n" +
    "    ui-codemirror-opts=\"codeMirrorOpts\" ng-model=\"ysldstyle\"></div>\n" +
    "");
}]);

angular.module("/components/editor/tools/attributes.modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/tools/attributes.modal.tpl.html",
    "<div class=\"attr-modal\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    <div class=\"inline\">\n" +
    "      <h4 class=\"modal-title\"><strong>{{ layer.name }}</strong></h4>\n" +
    "      <small>{{ attributes.schema.attributes.length }} Attributes - Click to Select</small>\n" +
    "    </div>\n" +
    "    <div class=\"pull-right inline top-buttons\">\n" +
    "      <button class=\"btn btn-warning btn-sm\" id=\"copyAttr\">Copy to Clipboard</button>\n" +
    "      <button class=\"btn btn-default btn-sm cancel\" ng-click=\"close()\">Cancel</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"attr-table\">\n" +
    "      <table>\n" +
    "        <thead><tr class=\"attr-header\">\n" +
    "          <th ng-repeat=\"attr in attributes.schema.attributes\">\n" +
    "            <a class=\"attr-name\" ng-class=\"{selectedAttr: selectedAttrName==attr.name}\" ng-click=\"selectName(attr.name);\">\n" +
    "              {{ attr.name }}\n" +
    "            </a>\n" +
    "            <div class=\"attr-type\">{{ attr.type }}</div>\n" +
    "          </th>\n" +
    "        </tr></thead>\n" +
    "        <tbody>\n" +
    "          <tr ng-repeat=\"values in attributes.values track by $index\">\n" +
    "            <td ng-repeat=\"value in values track by $index\">\n" +
    "            {{ value }}\n" +
    "            </td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "    <div class=\"text-center hint\">(Only the first 10 rows of attribute data are shown)</div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/tools/basemap.modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/tools/basemap.modal.tpl.html",
    "<div>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <h4 class=\"modal-title\">Add Basemap</h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6\">\n" +
    "              <button class=\"btn btn-default btn-sm cancel pull-right\" ng-click=\"close()\">Close</button>\n" +
    "              <button id=\"copyIcon\" class=\"btn btn-warning btn-sm pull-right\" ng-click=\"add()\"> Add </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body basemap-modal\">\n" +
    "      <div>\n" +
    "        <form>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"basemap_url\">Basemap Source:</label>\n" +
    "            <select ng-model=\"basemap\" ng-options=\"basemap.display_type for basemap in basemapOptions\" ng-init=\"basemap=basemapOptions[0]\">\n" +
    "            </select>\n" +
    "          </div>\n" +
    "          <div class=\"form-group\" ng-show=\"basemap.url_req\">\n" +
    "            <div class=\"input-group\">\n" +
    "              <span class=\"input-group-addon input-sm\">URL</span>\n" +
    "              <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.url\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <!-- MAPBOX-SPECIFIC -->\n" +
    "          <div class=\"form-group\" ng-show=\"basemap.type=='mapbox'\">\n" +
    "            <div class=\"input-group\">\n" +
    "              <span class=\"input-group-addon input-sm\">MAP ID</span>\n" +
    "              <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.mapid\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"form-group\" ng-show=\"basemap.key_req\">\n" +
    "            <div class=\"input-group\">\n" +
    "              <span class=\"input-group-addon input-sm\">KEY</span>\n" +
    "              <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.key\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"form-group\" ng-show=\"basemap.type=='mapbox'\">\n" +
    "            <p><small>Generated:</small></p>\n" +
    "            <div class=\"input-group\">\n" +
    "              <span class=\"input-group-addon input-sm\">URL</span>\n" +
    "              <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.url\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <!-- ESRI-SPECIFIC -->\n" +
    "          <div class=\"form-group\" ng-show=\"basemap.type=='esri'\">\n" +
    "            <p><small>E.g. http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}</small></p>\n" +
    "          </div>\n" +
    "          <!-- BING-SPECIFIC -->\n" +
    "          <div class=\"form-group\" ng-show=\"basemap.styles\">\n" +
    "            <div class=\"input-group\">\n" +
    "              <span class=\"input-sm\">STYLE:</span>\n" +
    "              <select ng-model=\"basemap.style\" ng-options=\"style for style in basemap.styles\"></select>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "           <!-- TILEWMS-SPECIFIC -->\n" +
    "          <div ng-show=\"basemap.type=='tilewms'\">\n" +
    "            <div class=\"form-group\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon input-sm\">LAYER</span>\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.layer\">\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon input-sm\">SERVERTYPE</span>\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.serverType\">\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon input-sm\">TILED</span>\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.tiled\">\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon input-sm\">FORMAT</span>\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.format\">\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon input-sm\">VERSION</span>\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" ng-model=\"basemap.version\">\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" style=\"width:140px;\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon input-sm\">TiledWMS?</span>\n" +
    "                <span class=\"input-group-addon\" style=\"background-color: #fff; border-left: 1px solid #ccc;\">\n" +
    "                  <input type=\"checkbox\" ng-model=\"basemapOptions[5].tiledwms\">\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </form>\n" +
    "        <hr/>\n" +
    "        <div>\n" +
    "          <small>\n" +
    "            <ul>\n" +
    "              <li ng-show=\"basemap.isMercator && !map.isMercator\">NOTE: Basemap may not display correctly unless your map or layer's projection is changed to EPSG:3857.</li>\n" +
    "              <li ng-show=\"!basemap.isMercator\">NOTE: Basemap may not display correctly unless it is in your map or layer's projection: {{map.proj.srs}}.</li>\n" +
    "            </ul>\n" +
    "          </small>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/tools/display.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/tools/display.tpl.html",
    "<li class=\"dropdown dropdown-toggle\" dropdown dropdown-toggle>\n" +
    "  <i class=\"icon-screen\"></i>\n" +
    "  <span>Display</span>\n" +
    "  <ul class=\"dropdown-menu display-menu\">\n" +
    "    <li class=\"dropdown-submenu\">\n" +
    "      BgColor\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li class=\"bg-submenu\">\n" +
    "          <small>(Screen only)</small></li>\n" +
    "        <li ng-repeat=\"(b,c) in bgcolors\"\n" +
    "          ng-class=\"{active: b == bgcolor}\">\n" +
    "          <a href ng-click=\"chooseBgcolor(b)\">{{b}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li class=\"dropdown-submenu\">\n" +
    "      Font\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li ng-repeat=\"(f,v) in fonts\"\n" +
    "          ng-class=\"{active: f == font}\">\n" +
    "          <a href ng-click=\"chooseFont(f)\">{{f}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li class=\"dropdown-submenu\">\n" +
    "      Font Size\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li ng-repeat=\"s in sizes\"\n" +
    "          ng-class=\"{active: $index == size}\">\n" +
    "          <a href ng-click=\"chooseSize($index)\">\n" +
    "            {{s[0]}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li class=\"dropdown-submenu\">\n" +
    "      Controls\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li ng-repeat=\"(mc,v) in mapcontrols\">\n" +
    "          <a href ng-click=\"chooseControl(v)\">\n" +
    "            {{mc}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li class=\"dropdown-submenu\">\n" +
    "      Basemap\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li ng-repeat=\"(bc,v) in basemapControls\">\n" +
    "          <a href ng-click=\"chooseBasemapControl(v)\">\n" +
    "            {{bc}}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</li>\n" +
    "");
}]);

angular.module("/components/editor/tools/icons.modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/tools/icons.modal.tpl.html",
    "<div>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <h4 class=\"modal-title\">Icons in workspace {{workspace}}</h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6\">\n" +
    "              <button class=\"btn btn-default btn-sm cancel pull-right\" ng-click=\"close()\">Cancel</button>\n" +
    "              <button ng-show=\"hasFlash\" id=\"copyIcon\" class=\"btn btn-warning btn-sm pull-right\" ng-click=\"copy()\">Copy Selected to Clipboard</button>\n" +
    "			  <button ng-show=\"!hasFlash\" id=\"copyDisabled\" class=\"btn btn-warning btn-sm pull-right\" \n" +
    "			    popover-trigger=\"mouseenter\" popover-placement=\"bottom\"\n" +
    "                popover-append-to-body=\"true\" popover-popup-delay=\"400\"\n" +
    "                popover=\"Install or enable Adobe Flash to support clipboard integration.\"\n" +
    "				>\n" +
    "				  Copy Selected to Clipboard\n" +
    "				</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body icon-modal\">\n" +
    "        <div>\n" +
    "          <div class=\"row icon-row\" ng-repeat=\"row in icons | orderBy: 'name' | partition:3 \">\n" +
    "            <div class=\"col-xs-4\" ng-repeat=\"item in row\">\n" +
    "              <span ng-click=\"chooseIcon(item);\"\n" +
    "                popover-trigger=\"mouseenter\" popover-placement=\"bottom\"\n" +
    "                popover-append-to-body=\"true\"\n" +
    "                popover-popup-delay=\"400\"\n" +
    "                popover-html-unsafe=\"\n" +
    "                  <ul class='list-unstyled'>\n" +
    "                    <li><img src='{{item.url}}'></img></li>\n" +
    "                    <li><small>Modified {{item.modified.pretty}}</small></li>\n" +
    "                  \"\n" +
    "                >\n" +
    "                  <span class=\"icon-img\">\n" +
    "                    <img ng-src=\"{{ item.url }}\"/>\n" +
    "                  </span>\n" +
    "                  <a class=\"icon-title\"\n" +
    "                    ng-class=\"{selectedIcon: item.name==selectedIconName}\">\n" +
    "                      {{item.name}}\n" +
    "                  </a>\n" +
    "              </span>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-6 text-left\">\n" +
    "          <button class=\"btn btn-primary btn-sm\" type=\"button\"\n" +
    "            ng-file-select=\"uploadIcons($files)\">Upload Icon</button>\n" +
    "          <span ng-show=\"uploadRunning == true\">\n" +
    "            <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "            Uploading icon ...\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/tools/shortcuts.modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/tools/shortcuts.modal.tpl.html",
    "<div class=\"attr-modal\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    <div class=\"inline\">\n" +
    "      <h4 class=\"modal-title\"><strong>Keyboard Shortcuts</strong></h4>\n" +
    "    </div>\n" +
    "    <div class=\"pull-right inline top-buttons\">\n" +
    "      <button class=\"btn btn-default btn-sm cancel\" ng-click=\"close()\">Close</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <ul class=\"list-unstyled\" style=\"line-height: 2.4em;\">\n" +
    "      <li ng-repeat=\"shortcut in shortcuts\">{{ shortcut.name }}\n" +
    "        <span class=\"pull-right\">\n" +
    "          <span ng-repeat=\"key in shortcut.keys\">\n" +
    "            <span class=\"key\">{{ key.key }}</span><span class=\"delim\">{{ key.delim }}</span>\n" +
    "          </span>\n" +
    "        </span>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/editor/tools/sld.modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/editor/tools/sld.modal.tpl.html",
    "<div class=\"sld-modal\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    <div class=\"inline\">\n" +
    "      <h4 class=\"modal-title\">SLD for selected layer: <strong>{{ layer.name }}</strong></h4>\n" +
    "      <small>Export only</small>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"sld-view\" ui-codemirror=\"{ onLoad : onCodeMirrorLoad }\"\n" +
    "      ui-codemirror-opts=\"codeMirrorOpts\" ng-model=\"sld\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <div class=\"pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm cancel\" ng-click=\"close()\">Close</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/errorpanel/errorpanel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/errorpanel/errorpanel.tpl.html",
    "<div class=\"error-panel\">\n" +
    "  <script type=\"text/ng-template\" id=\"error-modal\">\n" +
    "    <div class=\"modal-body\">\n" +
    "      <div class=\"error-modal-details\">\n" +
    "        <div class=\"alert-danger\">{{fullMessage}}</div>\n" +
    "        <div>\n" +
    "          <accordion>\n" +
    "            <accordion-group heading=\"{{error.name}}\" ng-repeat=\"error in allErrors\">\n" +
    "              {{error.error}}\n" +
    "            </accordion-group>\n" +
    "          </accordion>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "      <div class=\"pull-right alert-success\" ng-show=\"copied\" class=\"alert-success\"> <i class=\"fa fa-check\"></i> Copied to clipboard.</div>\n" +
    "      <button class=\"btn btn-primary\" clip-copy=\"copy()\">Copy</button>\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"close()\">Close</button>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "  <error ng-repeat=\"msg in messages\" type=\"{{type}}\" close=\"close($index)\">{{exception}}<span ng-if=\"message.length > 0\">: {{message}}</span>\n" +
    "    <a ng-if=\"details\" ng-click=\"showDetails(msg)\" class=\"error-details\">More details...</a>\n" +
    "  </error>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/errorpanel/inlineErrors.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/errorpanel/inlineErrors.tpl.html",
    "<alert style=\"margin: 5px auto;\" ng-repeat=\"error in inlineErrors\" type=\"{{error.type}}\">\n" +
    "  {{ error.msg }}\n" +
    "</alert>\n" +
    "");
}]);

angular.module("/components/featureinfopanel/featureinfopanel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/featureinfopanel/featureinfopanel.tpl.html",
    "<div class=\"featureinfo-panel\">\n" +
    "  <script type=\"text/ng-template\" id=\"featureinfo-modal\">\n" +
    "    <div class=\"modal-header\">\n" +
    "      <div class=\"modal-title\">Selected feature<span ng-if=\"features.length>1\">s</span> in layer <strong>{{ layer.name }}</strong></div>\n" +
    "    </div>\n" +
    "    <div class=\"featureinfo-modal-content modal-body\">\n" +
    "      <div ng-repeat=\"row in features | orderBy: 'id' | partition:2\">\n" +
    "        <div class=\"col-xs-5 feature\" ng-repeat=\"feature in row\">\n" +
    "          <div class=\"feature-id\"><strong>Feature ID:</strong> {{ feature.id }}</div>\n" +
    "          <table>\n" +
    "            <tr ng-repeat=\"(key, value) in feature.properties\">\n" +
    "              <th>{{ key }}: </th>\n" +
    "              <td>{{ value }}</td>\n" +
    "            </tr>\n" +
    "          </table>\n" +
    "          <div class=\"geometry\"><strong>Geometry Type:</strong> {{ feature.geometry.type }}</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "      <button class=\"btn btn-default\" ng-click=\"close()\">Close</button>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/grid/footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/grid/footer.tpl.html",
    "<div ng-show=\"showFooter\">\n" +
    "  <div class=\"ngTotalSelectContainer\" >\n" +
    "    <div class=\"ngFooterTotalItems\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\" >\n" +
    "      <span class=\"ngLabel\">{{i18n.ngTotalItemsLabel}} {{maxRows()}}</span><span ng-show=\"filterText.length > 0\" class=\"ngLabel\">({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span>\n" +
    "    </div>\n" +
    "    <!--<div class=\"ngFooterSelectedItems\" ng-show=\"multiSelect\">\n" +
    "      <span class=\"ngLabel\">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span>\n" +
    "    </div>-->\n" +
    "  </div>\n" +
    "  <div class=\"ngPagerContainer nggrid-pager\" ng-show=\"enablePaging\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\">\n" +
    "    <div class=\"ngRowCountPicker nggrid-row\">\n" +
    "      <pagination boundary-links=\"true\" total-items=\"totalItems\" ng-model=\"currentPage\" ng-change=\"setPage(currentPage)\" class=\"pagination-sm pull-right\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\" items-per-page=\"itemsPerPage\" total-items=\"totalItems\"></pagination>\n" +
    "      <!--<br /><div class=\"selectedItems\">Current Page: {{currentPage}}</div>-->\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/import/import.db.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/import/import.db.tpl.html",
    "<div class=\"data-import-db\">\n" +
    "  <div class=\"text-center\">\n" +
    "    <p class=\"lead\">\n" +
    "      Import data from a spatial database\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div ng-show=\"format == null || db_home\" class=\"text-center\">\n" +
    "    <div class=\"db-list\">\n" +
    "      <div class=\"row\" ng-repeat=\"row in formats | partition:3\">\n" +
    "        <div class=\"col-sm-4\" ng-repeat=\"f in row\">\n" +
    "          <div class=\"db-logo\">\n" +
    "            <i class=\"fa fa-database fa-2x\"></i>\n" +
    "          </div>\n" +
    "          <a href ng-click=\"chooseFormat(f)\">{{ f.title }}</a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-if=\"params\" class=\"db-details\">\n" +
    "    <h3>{{format.title}}</h3>\n" +
    "    <small>{{format.description}}</small>\n" +
    "    <form>\n" +
    "      <div class=\"db-format-db\" ng-if=\"format.type.toLowerCase()=='database'\">\n" +
    "        <div class=\"form-group\" ng-if=\"params.host\">\n" +
    "          <div class=\"col-sm-10\">\n" +
    "            <label for=\"host\">Host</label>\n" +
    "            <input ng-model=\"params.host.value\" name=\"host\" type=\"text\" class=\"form-control\" focus-init>\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-2\">\n" +
    "            <label for=\"port\">Port</label>\n" +
    "            <input ng-model=\"params.port.value\" name=\"port\" type=\"text\" class=\"form-control\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-if=\"params.database\">\n" +
    "          <div class=\"col-sm-6\">\n" +
    "            <label for=\"database\">Database</label>\n" +
    "            <input ng-model=\"params.database.value\" name=\"database\" type=\"text\" class=\"form-control\">\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-6\" ng-if=\"params.schema\">\n" +
    "            <label for=\"schema\">Schema</label>\n" +
    "            <input ng-model=\"params.schema.value\" name=\"schema\" type=\"text\" class=\"form-control\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-if=\"params.user\">\n" +
    "          <div class=\"col-sm-6\">\n" +
    "            <label for=\"user\">Username</label>\n" +
    "            <input ng-model=\"params.user.value\" name=\"user\" type=\"text\" class=\"form-control\">\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-6\">\n" +
    "            <label for=\"passwd\">Password</label>\n" +
    "            <input ng-model=\"params.passwd.value\" name=\"passwd\" type=\"password\" class=\"form-control\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"db-format-generic\" ng-if=\"format.type && format.type.toLowerCase()!='database'\">\n" +
    "        <div class=\"col-sm-12\" ng-repeat=\"param in params\">\n" +
    "          <div class=\"form-group row\" ng-if=\"param.required || (param.level.toLowerCase()=='user' && param.title.toLowerCase()!='namespace')\" ng-switch on=\"param.isPassword? 'password' : param.type.toLowerCase()\">\n" +
    "            <label ng-attr-title=\"{{param.description ? param.description:''}}\" for=\"{param.title}\">\n" +
    "              {{ param.title }}\n" +
    "            </label>\n" +
    "            <span ng-if=\"param.required\" style=\"color:red\">*</span>\n" +
    "            <input ng-switch-when=\"password\" ng-model=\"param.value\" name=\"{param.title}\" class=\"form-control\" type=\"password\">\n" +
    "            <input ng-switch-when=\"boolean\" ng-model=\"param.value\" name=\"{param.title}\" class=\"form-control\" type=\"checkbox\" checked=\"{!!param.default}\">\n" +
    "            <input ng-switch-default ng-model=\"param.value\" name=\"{param.title}\" class=\"form-control\" type=\"text\" value=\"{param.default}\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"hint-required col-sm-12\"><span style=\"color:red\">*</span> Required</div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group row\">\n" +
    "        <div class=\"col-sm-12 text-center\" style=\"margin-top: 20px;\">\n" +
    "          <button ng-click=\"connect()\" ng-hide=\"format == null\" ng-disabled=\"connecting || importResult != null\"\n" +
    "            class=\"btn btn-primary btn-sm\">\n" +
    "              <span ng-hide=\"connecting || importResult != null\">\n" +
    "                Connect\n" +
    "              </span>\n" +
    "              <span ng-show=\"connecting\">\n" +
    "                <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                Connecting... please wait.\n" +
    "              </span>\n" +
    "              <span ng-show=\"importResult != null\">\n" +
    "                <i class=\"fa fa-check\"></i> Connected\n" +
    "              </span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-if=\"error != null\">\n" +
    "    <alert type=\"danger\">{{ error.message }}</alert>\n" +
    "  </div>\n" +
    "  <div ng-if=\"alert != null\">\n" +
    "    <alert type=\"warning\">\n" +
    "      Store <strong>{{ alert.store.name }}</strong> already exists in workspace <strong>{{ alert.store.workspace }}</strong> at <strong>{{ alert.store.source }}</strong>.\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"showStore();\" style=\"margin-left: 20px;\"><i class=\"fa fa-angle-double-right\"></i> View Store</button>\n" +
    "    </alert>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/import/import.details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/import/import.details.tpl.html",
    "<div class=\"data-import-details\">\n" +
    "  <div ng-show=\"detailsLoading\" class=\"text-center\"><i class=\"fa fa-spinner fa-spin\"></i> Loading...<br/><br/>(Large datasets may take some time to import.)</div>\n" +
    "  <div ng-show=\"noImportData\" class=\"text-center\"><i class=\"fa fa-warning\"></i> No data to import from this database.<br/><br/>Store will not be added.</div>\n" +
    "  <div ng-if=\"layers.length > 0\">\n" +
    "    <div style=\"display: inline-block; width: 100%;\">\n" +
    "      <div class=\"pull-left\">\n" +
    "        <h3>Available Layers</h3>\n" +
    "        <p>\n" +
    "          Please specify which dataset{{import.preimport.length > 1 ? 's' : ''}} to import.\n" +
    "          <br/>(At least 1 layer must be imported for the Store to be added.)\n" +
    "        </p>\n" +
    "      </div>\n" +
    "      <!-- TODO: re-implement -->\n" +
    "      <div class=\"pull-right next-import-button\">\n" +
    "        <div ng-if=\"imported.length > 0\" class=\"bg-success imported-msg\">\n" +
    "          {{ imported.length }}\n" +
    "           {{ imported.length == 1 ? 'layer' : 'layers' }} imported.\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div ng-grid=\"gridOpts\" class=\"pending-layers\"></div>\n" +
    "    <div class=\"pending-footnote\">* May not contain spatial data.</div>\n" +
    "  </div>\n" +
    "  \n" +
    "  <div ng-if=\"ignored.length > 0\">\n" +
    "    <h3>Ignored File{{ignored.length > 1 ? 's' : ''}}</h3>\n" +
    "\n" +
    "    <div ng-click=\"showIgnored = !showIgnored\">\n" +
    "      {{ignored.length}} file{{ignored.length==1 ? ' was' : 's were'}} not recognized. <a>{{showIgnored ? 'Hide...' : 'Show...'}}</a>\n" +
    "    </div>\n" +
    "    <div class=\"horizontal-divider\" collapse=\"!showIgnored\" ng-init=\"showIgnored = ignored.length < 10\">\n" +
    "      <ul class=\"list-unstyled\">\n" +
    "        <li class=\"col-sm-4\" ng-repeat=\"file in ignored\">{{ file.name }}</li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <inline-errors errors=\"errors\"></inline-errors>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/import/import.file.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/import/import.file.tpl.html",
    "<div class=\"data-import-file\" ng-file-drop=\"onFileSelect($files)\" ng-file-drag-over-class=\"file-over\">\n" +
    "  <div class=\"text-center\">\n" +
    "    <p class=\"lead\">\n" +
    "      Upload one or more spatial files or .zip files<br/>containing any number of spatial files. \n" +
    "      <span popover-html-unsafe=\"{{fileTooltip}}\" popover-trigger=\"click\" popover-placement=\"bottom\">\n" +
    "        <i class=\"icon-ln fa fa-info-circle\"></i>\n" +
    "      </span>\n" +
    "      <small>When uploading .shp files, remember to include .prj, .dbx, and .shx files.</small>\n" +
    "    </p>\n" +
    "\n" +
    "    <button class=\"btn btn-primary btn-sm browse-button\" type=\"button\"\n" +
    "      ng-file-select=\"onFileSelect($files)\" data-multiple=\"true\">\n" +
    "      Browse\n" +
    "    </button>\n" +
    "\n" +
    "    <p>or</p>\n" +
    "    <p>\n" +
    "      <div class=\"drop-box\" ng-file-drop=\"onFileSelect($files)\"  \n" +
    "      ng-file-drop-available=\"dropSupported=true\" ng-show=\"dropSupported\">\n" +
    "        Drop files here\n" +
    "      </div>\n" +
    "      <div ng-show=\"!dropSupported\">HTML5 Drop File is not supported</div>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div class=\"file-list\" ng-show=\"files != null && files.length > 0\">\n" +
    "    <div class=\"file-name\" ng-repeat=\"file in files\">\n" +
    "      <span class=\"file-remove\" ng-click=\"onFileRemove(file)\"><i class=\"icon icon-ln icon-cancel-circle\"></i></span>\n" +
    "      <strong> {{ file.name }}</strong>\n" +
    "      <span class=\"file-info\">{{ file.size | bytesize }}</span>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "    <div class=\"file-space\">\n" +
    "    <table>\n" +
    "      <tr>\n" +
    "        <td class=\"file-space-heading\">Space required:</td>\n" +
    "        <td class=\"file-space-value\">{{ fileSize | bytesize }}</td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td class=\"file-space-heading\">Space available:</td>\n" +
    "        <td class=\"file-space-value\" ng-class=\"fileSize >= diskSize ? 'file-space-warning' : ''\">{{ diskSize | bytesize }}</td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <span>\n" +
    "          <button class=\"btn btn-primary btn-sm\" type=\"button\"\n" +
    "          ng-click=\"upload()\" ng-disabled=\"files == null  || files.length == 0 || uploadInProgress\">Upload</button>\n" +
    "          <button class=\"btn btn-sm\" type=\"button\"\n" +
    "          ng-click=\"cancel()\" ng-disabled=\"progress.percent == 0\">Cancel</button>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <progressbar class=\"progress-stripped\" type=\"info\" value=\"progress.percent\">\n" +
    "        {{ progress.percent }} %\n" +
    "        </progressbar>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\" ng-show=\"existingStores.length > 0\">\n" +
    "      <div class=\"col-sm-12\" style=\"margin-bottom:10px;\">\n" +
    "        <input type=\"checkbox\" id=\"uploadToStore\" ng-model=\"addToStore\" /> Add to Existing Store\n" +
    "        <div style=\"display:inline-block; margin-left: 10px;\" ng-show=\"addToStore\">\n" +
    "          <select ng-model=\"chosenImportStore\" ng-options=\"es.name for es in existingStores\">\n" +
    "          </select>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"progress.percent == 100 && importResult == null\">\n" +
    "      <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "      Processing upload... please wait.\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/import/import.newmap.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/import/import.newmap.tpl.html",
    "<div class=\"import-newmap\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "    <h5 class=\"title\">Create New Map with\n" +
    "      <span ng-if=\"selectedLayers.length > 1\"><strong>{{ selectedLayers.length }} Selected Layers</strong></span>\n" +
    "      <span ng-if=\"selectedLayers.length==1\"><strong>Selected Layer</strong></span>\n" +
    "      :\n" +
    "    </h5>\n" +
    "      <span class=\"layers-list\" ng-repeat=\"layer in selectedLayers\">{{ layer.name }}{{$last ? '' : ', '}}</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <form name=\"newMap\" role=\"form\" class=\"new-map-form\">\n" +
    "        <div class=\"form-group\" name=\"newMapName\">\n" +
    "          <label for=\"name\">Map Name *</label>\n" +
    "          <input type=\"text\" class=\"form-control input-sm\" name=\"name\" ng-model=\"mapInfo.name\" maxlength=\"10\" required ng-pattern=\"/^[a-zA-Z][a-zA-Z\\d\\-_]*$/\" ng-model-options=\"{updateOn: 'blur'}\" focus-init>\n" +
    "          <span ng-show=\"newMap.name.$error.pattern\" class=\"error\">Invalid characters in map name.</span>\n" +
    "          <span ng-show=\"newMap.name.$error.maxlength\" class=\"error\">Max 10 characters allowed.</span>\n" +
    "          <span ng-show=\"newMap.name.$dirty && newMap.name.$error.required\" class=\"error\">Required</span>\n" +
    "          <small>(No spaces, max 10 characters, for web URLs.)</small>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" name=\"newMapTitle\">\n" +
    "          <label for=\"title\">Title</label>\n" +
    "          <input type=\"text\" class=\"form-control input-sm\" name=\"title\" ng-model=\"mapInfo.title\" ng-model-options=\"{updateOn: 'blur'}\" />\n" +
    "          <small>(Spaces ok, for humans.)</small>\n" +
    "        </div>\n" +
    "         <div class=\"form-group\" name=\"newMapCrs\">\n" +
    "          <label for=\"map.crs\">\n" +
    "            Projection * <div class=\"crs-warning\" popover-html-unsafe=\"{{crsTooltip}}\" popover-trigger=\"click\"><i class=\"icon-ln fa fa-info-circle\"></i></div>\n" +
    "            <span ng-hide=\"projEnabled\"> Fetching projections...</span>\n" +
    "          </label>\n" +
    "          <div class=\"projection-options\">\n" +
    "            <div class=\"proj-check\">\n" +
    "              <input type=\"radio\" ng-model=\"proj\" value=\"latlon\">\n" +
    "              Lat/Lon (WGS)\n" +
    "            </div>\n" +
    "            <div class=\"proj-check\">\n" +
    "              <input type=\"radio\" ng-model=\"proj\" value=\"mercator\"> Web Mercator\n" +
    "            </div>\n" +
    "            <div class=\"proj-check other\">\n" +
    "              <input type=\"radio\" ng-model=\"proj\" value=\"other\" ng-click=\"custom.proj = true\"> Other\n" +
    "              <proj-field name=\"crs\" id=\"otherproj\" proj=\"customproj\" ng-class=\"{'hide-proj-msg': proj != 'other'}\" ng-model-options=\"{updateOn: 'default blur', 'allowInvalid': true}\"></proj-field>\n" +
    "              <span ng-show=\"newMap.crs.$dirty && !newMap.crs.$error.pattern && !newMap.crs.$error.required\" class=\"success\"><i class=\"fa fa-check\"></i> Valid CRS.</span>\n" +
    "              <span ng-show=\"!newMap.crs.$error.pattern && newMap.crs.$error.required\" class=\"error\">Required</span>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" name=\"newMapAbstract\">\n" +
    "          <label for=\"description\">Description</label>\n" +
    "          <textarea rows=\"4\" cols=\"40\" class=\"form-control abstract\" name=\"description\" ng-model=\"mapInfo.description\">Description for map</textarea>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "      <div ng-hide=\"mapCreated\" style=\"margin-top:15px;\"></div>\n" +
    "      <div ng-show=\"mapCreated\" class=\"saved\" style=\"text-align: left;color:#4cae4c;\"><i class=\"fa fa-check\"></i> Map Created.</div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <inline-errors errors=\"errors\"></inline-errors>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/import/import.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/import/import.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <div class=\"create-title\" ng-bind-html=\"title\"></div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"container-fluid form-container\">\n" +
    "      <div class=\"upload-options btn-group btn-group-justified\" ng-show=\"!showImportDetails\">\n" +
    "        <div class=\"btn-group\">\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"showImportFile=true; showImportDB=false; importResult = null;\" ng-class=\"{active: showImportFile}\">\n" +
    "            Add Files\n" +
    "          </button>\n" +
    "        </div>\n" +
    "        <div class=\"btn-group\">\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-sm\"\n" +
    "          ng-click=\"showImportFile=false; showImportDB=true; importResult = null;\" ng-class=\"{active: showImportDB}\">\n" +
    "            Add Database\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <import-file ng-if=\"workspace && workspace.name\" ng-show=\"showImportFile && !showImportDetails\"></import-file>\n" +
    "      <import-db ng-if=\"workspace && workspace.name\" ng-show=\"showImportDB && !showImportDetails\"></import-db>\n" +
    "      <import-details ng-if=\"workspace && workspace.name && showImportDetails\"></import-details>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <div class=\"submit-buttons pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"close()\">Close</button>\n" +
    "    </div>\n" +
    "    <div class=\"submit-buttons pull-right\">\n" +
    "      <button class=\"btn btn-default btn-sm\" style=\"display:none;\" ng-click=\"back()\" ng-show=\"!showImportFile && format!==null\">&larr; Back</button>\n" +
    "      <button ng-if=\"importResult!==null && !showImportDetails\" class=\"btn btn-success btn-sm\" type=\"button\" ng-click=\"next(importResult)\">\n" +
    "        Next: Load &rarr;\n" +
    "      </button>\n" +
    "      <button class=\"btn btn-success btn-sm pull-left\" ng-show=\"showImportDetails\" ng-click=\"childScope.doImport()\" ng-disabled=\"!selectedLayers || selectedLayers.length==0\">Import Selected Layers</button>\n" +
    "      <button class=\"btn btn-success btn-sm\" ng-show=\"contextInfo && mapInfo && showImportDetails\" ng-disabled=\"!selectedLayers || selectedLayers.length==0 || !imported || imported.length==0\" ng-click=\"returnSelectedLayers(selectedLayers)\">{{contextInfo.button}} &rarr;</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/layer/layer.duplicate.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/layer/layer.duplicate.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Copy <i class=\"icon-stack\"></i> <strong>{{ fromLayer.name }}</strong> to New Layer</h4>\n" +
    "    <small class=\"pull-right required-star\">* Required</small>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <form name=\"form.layerSettings\" role=\"form\" class=\"layer-settings\">\n" +
    "      <form-name-layer form=\"form.layerSettings\" model=\"layer.name\" label=\"'New Layer Name'\"></form-name-layer>\n" +
    "      <form-title form=\"form.layerSettings\" model=\"layer.title\" label=\"'New Layer Title'\"></form-title>\n" +
    "      <form-crs form=\"form.layerSettings\" model=\"layer.proj\" label=\"'Projection'\"></form-crs>\n" +
    "      <form-description form=\"form.layerSettings\" model=\"layer.description\" label=\"'Description'\"></form-description>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"type\">Type:</label> {{ layer.type | firstCaps}}\n" +
    "      </div>\n" +
    "    </form>\n" +
    "    <alert ng-show=\"form.layerSettings.alerts\" type=\"danger\" style=\"margin-left: 0;\">\n" +
    "      {{ form.layerSettings.alerts }}\n" +
    "    </alert>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <div class=\"submit-buttons pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    </div>\n" +
    "    <div class=\"submit-buttons pull-right\">\n" +
    "      <button class=\"btn btn-success btn-sm\" ng-click=\"importAsLayer();\" ng-disabled=\"!form.layerSettings.$dirty || !form.layerSettings.$valid || !layer.proj\" style=\"margin-left:20px; margin-right:20px;\">Copy to New Layer</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/layer/layer.publish.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/layer/layer.publish.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Publish <i class=\"fa fa-database\"></i> <strong>{{ resource.name }}</strong> to New Layer</h4>\n" +
    "    <small class=\"pull-right required-star\">* Required</small>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <form name=\"form.layerSettings\" role=\"form\" class=\"layerSettings\">\n" +
    "      <form-name-layer form=\"form.layerSettings\" model=\"layer.name\" label=\"'Layer Name'\"></form-name-layer>\n" +
    "      <form-title form=\"form.layerSettings\" model=\"layer.title\" label=\"'Title'\"></form-title>\n" +
    "      <form-crs form=\"form.layerSettings\" model=\"layer.proj\" label=\"'Projection'\"></form-crs>\n" +
    "      <form-description form=\"form.layerSettings\" model=\"layer.description\" label=\"'Description'\"></form-description>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"keywords\">Keywords:</label> {{ layer.keywords }}\n" +
    "      </div>\n" +
    "    </form>\n" +
    "    <alert ng-show=\"form.alerts\" type=\"danger\" style=\"margin-left: 0;\">\n" +
    "      {{ form.alerts }}\n" +
    "    </alert>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <div class=\"submit-buttons pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    </div>\n" +
    "    <div class=\"submit-buttons pull-right\">\n" +
    "      <button class=\"btn btn-success btn-sm\" ng-click=\"importAsLayer();\" ng-disabled=\"!form.layerSettings.$valid || !layer.proj\" style=\"margin-left:20px; margin-right:20px;\">Import to Layer</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/layer/layer.settings.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/layer/layer.settings.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"><i class=\"icon-stack\"></i> <strong>{{ layername }}</strong></h4>\n" +
    "    <small class=\"pull-right required-star\">* Required</small>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body layer-settings\">\n" +
    "    <form name=\"form.layerSettings\" role=\"form\" class=\"layerSettings\">\n" +
    "      <form-name-layer form=\"form.layerSettings\" model=\"layer.name\" label=\"'Layer Name'\"></form-name-layer>\n" +
    "      <form-title form=\"form.layerSettings\" model=\"layer.title\" label=\"'Title'\"></form-title>\n" +
    "      <form-crs form=\"form.layerSettings\" model=\"layer.proj\" label=\"'Projection'\"></form-crs>\n" +
    "      <form-description form=\"form.layerSettings\" model=\"layer.description\" label=\"'Description'\"></form-description>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"more-settings\">Advanced Settings</label>\n" +
    "        <div><a type=\"button\" class=\"btn btn-default btn-sm\" ng-href=\"{{ layer.link }}\" target=\"_blank\">GeoServer Admin Layer Settings</a></div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "    <alert ng-show=\"form.layerSettings.alerts\" type=\"danger\" style=\"margin-left: 0;\">\n" +
    "      {{ form.layerSettings.alerts }}\n" +
    "    </alert>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer layer-settings-footer\">\n" +
    "    <div class=\"submit-buttons pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    </div>\n" +
    "    <div class=\"submit-buttons pull-right\">\n" +
    "      <div ng-show=\"form.layerSettings.saved\" class=\"saved\"><i class=\"fa fa-check\"></i> Changes Saved.</div>\n" +
    "      <div ng-show=\"errorSaving\" class=\"errorSaving\"><i class=\"fa fa-remove\"></i> Error saving.</div>\n" +
    "      <button ng-click=\"saveChanges()\" class=\"btn btn-success btn-sm save\" ng-disabled=\"!form.layerSettings.$dirty || !form.layerSettings.$valid || !layer.proj\">Update Layer Settings</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/map/map.new.form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/map/map.new.form.tpl.html",
    "<div class=\"new-map\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <form name=\"newMap\" role=\"form\" class=\"new-map-form form-1\">\n" +
    "        <form-name-map form=\"newMap\" model=\"mapInfo.name\" label=\"'Map Name'\"></form-name-map>\n" +
    "        <form-title form=\"newMap\" model=\"mapInfo.title\" label=\"'Title'\"></form-title>\n" +
    "        <div class=\"form-group\" name=\"newMapCrs\">\n" +
    "          <label for=\"map.crs\">\n" +
    "            Projection * <div class=\"crs-warning\" popover-placement=\"right\" popover-html-unsafe=\"{{crsTooltip}}\" popover-trigger=\"click\"><i class=\"icon-ln fa fa-info-circle\"></i></div>\n" +
    "            <span ng-hide=\"projEnabled\"> Fetching projections...</span>\n" +
    "          </label>\n" +
    "          <div class=\"projection-options\">\n" +
    "            <div class=\"proj-check\">\n" +
    "              <input type=\"radio\" ng-model=\"proj\" value=\"latlon\">\n" +
    "              Lat/Lon (WGS)\n" +
    "            </div>\n" +
    "            <div class=\"proj-check\">\n" +
    "              <input type=\"radio\" ng-model=\"proj\" value=\"mercator\"> Web Mercator\n" +
    "            </div>\n" +
    "            <div class=\"proj-check other\">\n" +
    "              <input type=\"radio\" ng-model=\"proj\" value=\"other\" ng-click=\"custom.proj = true\"> Other\n" +
    "              <proj-field name=\"crs\" id=\"otherproj\" proj=\"customproj\" ng-class=\"{'hide-proj-msg': proj != 'other'}\" ng-model-options=\"{updateOn: 'default blur', 'allowInvalid': true}\"></proj-field>\n" +
    "              <span ng-show=\"newMap.crs.$dirty && !newMap.crs.$error.pattern && !newMap.crs.$error.required\" class=\"validProj\"><i class=\"fa fa-check\"></i> Valid CRS.</span>\n" +
    "              <span ng-show=\"!newMap.crs.$error.pattern && newMap.crs.$error.required\" class=\"error\">Required</span>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <form-description form=\"newMap\" model=\"mapInfo.description\" label=\"'Description'\"></form-description>\n" +
    "      </form>\n" +
    "      <div ng-show=\"mapInfo.layers.length > 0\">\n" +
    "        <label>Layers</label>\n" +
    "        <div ng-click=\"showLayers = !showLayers\">\n" +
    "          {{mapInfo.layers.length + (mapInfo.layers.length==1 ? ' layer' : ' layers')}} selected. <a>{{showLayers ? 'Hide...' : 'Show...'}}</a>\n" +
    "        </div>\n" +
    "        <div class=\"horizontal-divider\" collapse=\"!showLayers\" ng-init=\"showLayers = mapInfo.layers.length < 10\">\n" +
    "          <ul class=\"list-unstyled\">\n" +
    "            <li class=\"col-sm-4\" ng-repeat=\"layer in mapInfo.layers\">{{ layer.name }}</li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/map/map.new.import.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/map/map.new.import.tpl.html",
    "<div class=\"new-map\">\n" +
    "  <div class=\"row options text-center\">\n" +
    "    \n" +
    "    <div class=\"text-center\">\n" +
    "      <p class=\"lead\">{{totalServerItems}} Layers are available for workspace <i class=\"icon-folder-open\"></i> <strong>{{workspace}}</strong>. Continue to create a map with these layers.</p>\n" +
    "    </div>\n" +
    "    <div class=\"divider\">\n" +
    "      <div class=\"text-center or\">OR</div>\n" +
    "    </div>\n" +
    "    <div class=\"text-center\">\n" +
    "      <p class=\"lead\"><i class=\"fa fa-share gray\"></i> Import data to create new layers:</p>\n" +
    "      <button class=\"btn btn-primary btn-sm\" ng-click=\"importNewLayers();\">Import New Data &rarr;</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/map/map.new.layers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/map/map.new.layers.tpl.html",
    "<div class=\"new-map\">\n" +
    "  <form ng-show=\"step==3\" name=\"newMapLayers\" role=\"form\" class=\"new-map-form form-2\">\n" +
    "    <div class=\"form-group new-layers-group\" name=\"create-new-layers\" ng-show=\"hasLayers == false\">\n" +
    "      <p>No published layers in this workspace.</p>\n" +
    "      <button class=\"btn btn-primary btn-sm\" ng-click=\"importNewLayers();\">Import Data to New Layers &rarr;</button>\n" +
    "    </div>\n" +
    "    <div class=\"available-layers\" ng-show=\"hasLayers\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <div class=\"layers-count-sort\">\n" +
    "            <div class=\"layers-count\">\n" +
    "              <strong>{{ totalServerItems }} layer<span ng-if=\"totalServerItems==0 || totalServerItems>1\">s</span></strong> in current workspace.\n" +
    "            </div>\n" +
    "            <div class=\"pull-right\">\n" +
    "              <div class=\"filter-box\">\n" +
    "                <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"opts.filter.filterText\" placeholder=\"Filter layers by...\" size=\"25\" ng-change=\"refreshLayers()\" />\n" +
    "                <i class=\"fa fa-search\"></i>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div>\n" +
    "        <div name=\"lyrs\" ng-grid=\"layerOptions\" id=\"avail-layers-grid\" ng-style=\"gridWidth\"></div>\n" +
    "        <br/>\n" +
    "        <div class=\"layers-paging\">\n" +
    "          <pagination total-items=\"totalServerItems\" items-per-page =\"opts.paging.pageSize\" ng-model=\"opts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <inline-errors errors=\"errors\"></inline-errors>\n" +
    "  </form>\n" +
    "  <div ng-hide=\"mapCreated\" style=\"margin-top:15px;\"></div>\n" +
    "  <div ng-show=\"mapCreated\" class=\"saved\" style=\"text-align: left;color:#4cae4c;\"><i class=\"fa fa-check\"></i> Map Created.</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/map/map.new.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/map/map.new.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "      Create Map\n" +
    "      <span ng-show=\"step==2\">: <i class=\"icon-map\"></i> <strong>{{ mapInfo.name }}</strong></span>\n" +
    "      in <i class=\"icon-folder-open\"></i> <strong>{{ workspace }}</strong>\n" +
    "    </h4>\n" +
    "    <small class=\"pull-right required-star\">* Required</small>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "\n" +
    "    <new-map-form ng-show=\"step==1\"></new-map-form>\n" +
    "    <new-map-import ng-show=\"step==2\"></new-map-import>\n" +
    "    <new-map-layers ng-show=\"step==3\"></new-map-layers>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <div class=\"submit-buttons pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"close()\">Cancel</button>\n" +
    "    </div>\n" +
    "    <div class=\"submit-buttons pull-right\">\n" +
    "      <button ng-show=\"step>1\" class=\"btn btn-default btn-sm\" ng-click=\"back();\">&larr; Back</button>\n" +
    "      <button ng-show=\"step==1 && selectLayers || mapInfo.layers.length==0\" ng-disabled=\"!(mapInfo.proj && mapInfo.name)\" class=\"btn btn-success btn-sm\" ng-click=\"next()\">Add Layers &rarr;</button>\n" +
    "      <button ng-show=\"step==1 && mapInfo && mapInfo.layers && mapInfo.layers.length>0\" ng-disabled=\"!(mapInfo.proj && mapInfo.name && mapInfo.layers.length > 0)\" class=\"btn btn-primary btn-sm\" ng-click=\"createMap()\">Create Map</button>\n" +
    "      <button ng-show=\"step==2 && selectLayers\" ng-disabled=\"!(mapInfo.proj && mapInfo.name)\" class=\"btn btn-success btn-sm\" ng-click=\"next()\">Add Existing Layers &rarr;</button>\n" +
    "      <button ng-show=\"step==3\" ng-disabled=\"!(mapInfo.proj && mapInfo.name && mapInfo.layers.length > 0)\" class=\"btn btn-primary btn-sm\" ng-click=\"createMap()\">Create Map with Selected</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("/components/modalform/map/map.settings.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/map/map.settings.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"><i class=\"icon-map\"></i> <strong>{{ mapname }}</strong></h4>\n" +
    "    <small class=\"pull-right required-star\">* Required</small>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body map-settings\">\n" +
    "    <form name=\"form.mapSettings\" role=\"form\" class=\"mapSettings\">\n" +
    "      <form-name-map form=\"form.mapSettings\" model=\"map.name\" label=\"'Map Name'\"></form-name-map>\n" +
    "      <form-title form=\"form.mapSettings\" model=\"map.title\" label=\"'Title'\"></form-title>\n" +
    "      <form-crs form=\"form.mapSettings\" model=\"map.proj\" label=\"'Projection'\"></form-crs>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"mapExtent\">\n" +
    "          Extent <div class=\"crs-warning\" popover-html-unsafe=\"{{extentTooltip}}\" popover-trigger=\"click\" popover-placement=\"right\"><i class=\"icon-ln fa fa-info-circle\"></i></div>\n" +
    "        </label>\n" +
    "        <ul class=\"list-unstyled extent-list\">\n" +
    "          <li>\n" +
    "            <small>South</small>\n" +
    "            <input name=\"bbox.south\" type=\"text\" class=\"form-control input-sm mapExtent\" ng-model=\"map.bbox.south\">\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <small>West</small>\n" +
    "            <input name=\"bbox.west\" type=\"text\" class=\"form-control input-sm mapExtent\" ng-model=\"map.bbox.west\">\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <small>North</small>\n" +
    "            <input name=\"bbox.north\" type=\"text\" class=\"form-control input-sm mapExtent\" ng-model=\"map.bbox.north\">\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <small>East</small>\n" +
    "            <input name=\"bbox.east\" type=\"text\" class=\"form-control input-sm mapExtent\" ng-model=\"map.bbox.east\">\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "        <button ng-click=\"calculateBounds()\" class=\"btn btn-sm boundsButton\">Generate Extent</button>\n" +
    "      </div>\n" +
    "      <form-description form=\"form.mapSettings\" model=\"map.description\" label=\"'Description'\"></form-description>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"renderTimeout\">\n" +
    "          Render Timeout\n" +
    "          <div class=\"crs-warning\" popover-html-unsafe=\"{{renderTooltip}}\" popover-trigger=\"click\" popover-append-to-body=\"true\" popover-placement=\"right\"><i class=\"icon-ln fa fa-info-circle\"></i></div>\n" +
    "        </label>\n" +
    "        <input name=\"title\" type=\"number\" class=\"form-control input-sm\" id=\"mapRenderTimeout\" ng-model=\"map.timeout\" min=\"3\"><small class=\"units\"> seconds</small>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "    <alert ng-show=\"form.mapSettings.alerts\" type=\"danger\" style=\"margin-left: 0;\">\n" +
    "      {{ form.mapSettings.alerts }}\n" +
    "    </alert>\n" +
    "</div>\n" +
    "  <div class=\"modal-footer map-settings-footer\">\n" +
    "    <div class=\"submit-buttons pull-left\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"close()\">Cancel</button>\n" +
    "    </div>\n" +
    "    <div class=\"submit-buttons pull-right\">\n" +
    "      <div ng-show=\"form.mapSettings.saved\" class=\"saved\"><i class=\"fa fa-check\"></i> Changes Saved.</div>\n" +
    "      <button ng-click=\"saveChanges()\" class=\"btn btn-success btn-sm save\" ng-disabled=\"!form.mapSettings.$dirty || !form.mapSettings.$valid\">Update Map Settings</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/map/nolayers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/map/nolayers.tpl.html",
    "<div>\n" +
    "	<div class=\"modal-header\">\n" +
    "		<h4 class=\"modal-title\">Create Layers First</h4>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "		<div class=\"instruction-header\">Publish Existing Data to Layers</div>\n" +
    "    <div class=\"step-content\">\n" +
    "      <img class=\"screen\" src=\"images/screens/publish-resource.png\" />\n" +
    "      <p class=\"instruction\">In the Data tab, Publish existing data to layers.</p>\n" +
    "    </div>\n" +
    "    <div class=\"instruction-header\">or</div>\n" +
    "    <div class=\"instruction-header\">Import New Data to Layers</div>\n" +
    "    <div class=\"step-content\">\n" +
    "      <img class=\"screen\" src=\"images/screens/import-data.png\" />\n" +
    "      <p class=\"instruction\">Import data to new layers before creating a map.</p>\n" +
    "    </div>\n" +
    "	</div>\n" +
    "	 <div class=\"modal-footer\">\n" +
    "	 	<button class=\"btn btn-sm btn-default ok-btn\" ng-click=\"close()\">OK</button>\n" +
    "	 </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/map/nostores.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/map/nostores.tpl.html",
    "<div>\n" +
    "	<div class=\"modal-header\">\n" +
    "		<h4 class=\"modal-title\">Create Layers First</h4>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <div class=\"instruction-header\">Import New Data to Layers</div>\n" +
    "    <div class=\"step-content\">\n" +
    "      <img class=\"screen\" src=\"images/screens/import-data.png\" />\n" +
    "      <p class=\"instruction\">Import data to new layers before creating a map.</p>\n" +
    "    </div>\n" +
    "	</div>\n" +
    "	 <div class=\"modal-footer\">\n" +
    "	 	<button class=\"btn btn-sm btn-default ok-btn\" ng-click=\"close()\">OK</button>\n" +
    "	 </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/modal.form.crs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/modal.form.crs.tpl.html",
    "<div class=\"form-group\">\n" +
    "    <label for=\"form.layerSettings.crs\">\n" +
    "      {{label}} * <div class=\"crs-warning\" popover-html-unsafe=\"{{crsTooltip}}\" popover-trigger=\"click\" popover-placement=\"right\"><i class=\"icon-ln fa fa-info-circle\"></i></div>\n" +
    "    </label>\n" +
    "    <proj-field name=\"crs\" proj=\"model\" ng-model-options=\"{updateOn: 'default blur', 'allowInvalid': true}\" ></proj-field>\n" +
    "    <span ng-show=\"form.crs.$dirty && !form.crs.$error.pattern && !form.proj.srs.$error.required\" class=\"success\"><i class=\"fa fa-check\"></i> Valid CRS.</span>\n" +
    "    <span ng-show=\"form.crs.$dirty && !form.crs.$error.pattern && form.crs.$error.required\" class=\"error\">Required</span>\n" +
    "    <small>(e.g. EPSG:4326)</small>\n" +
    "  </div>");
}]);

angular.module("/components/modalform/modal.form.description.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/modal.form.description.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label for=\"description\">{{label}}</label>\n" +
    "  <textarea rows=\"4\" cols=\"40\" class=\"form-control abstract\" name=\"description\" ng-model=\"model\"></textarea>\n" +
    "</div>");
}]);

angular.module("/components/modalform/modal.form.name.layer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/modal.form.name.layer.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label for=\"layerName\">{{label}} *</label>\n" +
    "  <input name=\"layerName\" type=\"text\" class=\"form-control input-sm\" ng-model=\"model\" value=\"{{model}}\" focus-init maxlength=\"10\" ng-pattern=\"/^[a-zA-Z][a-zA-Z\\d\\-_]*$/\" required ng-model-options=\"{updateOn: 'default blur'}\" />\n" +
    "  <span ng-show=\"form.layerName.$error.pattern\" class=\"errorInput\">Invalid characters in layer name.</span>\n" +
    "  <span ng-show=\"!form.layerName.$error.pattern && form.layerName.$error.maxlength\" class=\"errorInput\">Max 10 characters allowed.</span>\n" +
    "  <span ng-show=\"form.layerName.$dirty && !form.layerName.$error.pattern && !form.layerName.$error.maxlength && form.layerName.$error.required\" class=\"errorInput\">Required</span>\n" +
    "  <span ng-show=\"form.layerName.$dirty && !form.layerName.$error.pattern && !form.layerName.$error.maxlength && !form.layerName.$error.required && form.layerName.$error.alreadyExists\" class=\"error\">Name already exists</span>\n" +
    "  <small class=\"hint\">(No spaces, max 10 characters, for web URLs.)</small>\n" +
    "</div>");
}]);

angular.module("/components/modalform/modal.form.name.map.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/modal.form.name.map.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label for=\"mapName\">{{label}} *</label>\n" +
    "  <input name=\"mapName\" type=\"text\" class=\"form-control input-sm\" ng-model=\"model\" value=\"{{model}}\" maxlength=\"10\" required ng-pattern=\"/^[a-zA-Z][a-zA-Z\\d\\-_]*$/\" ng-model-options=\"{updateOn: 'default blur'}\" focus-init />\n" +
    "  <span ng-show=\"form.mapName.$error.pattern\" class=\"errorInput\">Invalid characters in map name.</span>\n" +
    "  <span ng-show=\"!form.mapName.$error.pattern && form.mapName.$error.maxlength\" class=\"errorInput\">Max 10 characters allowed.</span>\n" +
    "  <span ng-show=\"form.mapName.$dirty && !form.mapName.$error.pattern && !form.mapName.$error.maxlength && form.mapName.$error.required\" class=\"errorInput\">Required</span>\n" +
    "  <span ng-show=\"form.mapName.$dirty && !form.mapName.$error.pattern && !form.mapName.$error.maxlength && !form.mapName.$error.required && form.mapName.$error.alreadyExists\" class=\"error\">Name already exists</span>\n" +
    "  <small class=\"hint\">(No spaces, max 10 characters, for web URLs.)</small>\n" +
    "</div>");
}]);

angular.module("/components/modalform/modal.form.name.ws.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/modal.form.name.ws.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label for=\"workspaceName\">{{label}} *</label>\n" +
    "  <input name=\"workspaceName\" type=\"text\" class=\"form-control input-sm\" ng-model=\"model\" placeholder=\"Workspace Name\" maxlength=\"10\" required ng-pattern=\"/^[a-zA-Z][a-zA-Z\\d\\-_]*$/\" ng-model-options=\"{updateOn: 'default blur'}\" focus-init />\n" +
    "  <span ng-show=\"form.workspaceName.$error.pattern\" class=\"errorInput\">Invalid characters in workspace name.</span>\n" +
    "  <span ng-show=\"!form.workspaceName.$error.pattern && form.workspaceName.$error.maxlength\" class=\"errorInput\">Max 10 characters allowed.</span>\n" +
    "  <span ng-show=\"form.workspaceName.$dirty && !form.workspaceName.$error.pattern && !form.workspaceName.$error.maxlength && form.workspaceName.$error.required\" class=\"errorInput\">Required</span>\n" +
    "  <span ng-show=\"form.workspaceName.$dirty && !form.workspaceName.$error.pattern && !form.workspaceName.$error.maxlength && !form.workspaceName.$error.required && form.workspaceName.$error.alreadyExists\" class=\"error\">Name already exists</span>\n" +
    "  <small class=\"hint\">(No spaces, max 10 characters, for web URLs.)</small>\n" +
    "</div>");
}]);

angular.module("/components/modalform/modal.form.title.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/modal.form.title.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label for=\"title\">{{label}}</label>\n" +
    "  <input name=\"title\" type=\"text\" class=\"form-control input-sm\" ng-model=\"model\">\n" +
    "  <small>(Spaces ok, for humans.)</small>\n" +
    "</div>");
}]);

angular.module("/components/modalform/workspace/workspace.new.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/workspace/workspace.new.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"><i class=\"icon-folder-open\"></i> <strong>New Project Workspace</strong></h4>\n" +
    "    <small class=\"pull-right required-star\">* Required</small>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"modal-body new-workspace\"> \n" +
    "  <div>A workspace is a container for organizing your maps, layers and data together.</div>\n" +
    "  <form name=\"createform.settings\" role=\"form\" class=\"settings\">\n" +
    "    <form-name-workspace form=\"createform.settings\" model=\"workspace.name\" label=\"'Name'\"></form-name-workspace>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "      <input type=\"checkbox\" ng-model=\"workspace.default\" name=\"default\"> Default?\n" +
    "      </label>\n" +
    "      <span pop=\"{{ defaultDesc }}\" pop-show=\"{{ showDefaultDesc }}\" pop-placement=\"right\" ng-click=\"showDefaultDesc=!showDefaultDesc;\"><i class=\"icon-ln fa fa-info-circle\"></i></span>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer ws-settings-footer\">\n" +
    "  <div class=\"form-group pull-left\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  </div>\n" +
    "  <div class=\"form-group pull-right\">\n" +
    "    <div ng-show=\"workspaceCreated\" class=\"saved\" style=\"text-align: left;color:#4cae4c;\"><i class=\"fa fa-check\"></i> Workspace Created.</div>\n" +
    "    <button class=\"btn btn-primary btn-sm\" ng-click=\"create()\" style=\"margin-left:20px;\" ng-disabled=\"!createform.settings.$valid\">Create Workspace</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/modalform/workspace/workspace.settings.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/modalform/workspace/workspace.settings.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"><i class=\"icon-folder-open\"></i> <strong>{{workspace}}</strong></h4>\n" +
    "    <small class=\"pull-right required-star\">* Required</small>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form name=\"form.settings\" role=\"form\" class=\"settings\">\n" +
    "    <form-name-workspace form=\"form.settings\" model=\"wsSettings.name\" label=\"'Name'\"></form-name-workspace>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"workspaceUri\">Namespace URI</label>\n" +
    "      <input type=\"url\" class=\"form-control input-sm\" id=\"workspaceURI\" placeholder=\"Workspace URI\" ng-model=\"wsSettings.uri\" ng-bind-html/>\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" ng-model=\"wsSettings.default\"/> Default?\n" +
    "      </label>\n" +
    "      <span pop=\"{{ defaultDesc }}\" pop-show=\"{{ showDefaultDesc }}\" pop-placement=\"right\" ng-click=\"showDefaultDesc=!showDefaultDesc;\"><i class=\"icon-ln fa fa-info-circle\"></i></span>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer ws-settings-footer\">\n" +
    "  <div class=\"form-group pull-left\">\n" +
    "    <button ng-click=\"close()\" class=\"btn btn-sm btn-default\">Cancel</button>\n" +
    "  </div>\n" +
    "  <div class=\"form-group pull-right\">\n" +
    "    <button ng-click=\"saveChanges()\" class=\"btn btn-success btn-sm save\" ng-disabled=\"!form.settings.$dirty || !form.settings.$valid\">Update Workspace Settings</button>\n" +
    "    <div ng-show=\"wsSettings.saved\" class=\"saved\"><i class=\"fa fa-check\"></i> Changes Saved.</div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/olexport/ol.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/olexport/ol.tpl.html",
    "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "  <meta charset=\"UTF-8\">\n" +
    "  <title></title>\n" +
    "  <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/ol3/3.5.0/ol.min.css\">\n" +
    "  <script src=\"https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js\"></script>\n" +
    "  <script src=\"https://cdnjs.cloudflare.com/ajax/libs/ol3/3.5.0/ol.min.js\" type=\"text/javascript\"></script>\n" +
    "  <style type=\"text/css\" media=\"screen\">\n" +
    "    html, body, #map {\n" +
    "      height: 100%;\n" +
    "      margin: 0;\n" +
    "    }\n" +
    "  </style>\n" +
    "</head>\n" +
    "<body>\n" +
    "  <div id=\"map\" class=\"map\"></div>\n" +
    "  <script>\n" +
    "  {{js}}\n" +
    "  </script>\n" +
    "</body>\n" +
    "</html>");
}]);

angular.module("/components/projfield/projfield.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/projfield/projfield.tpl.html",
    "<div class=\"proj-field\">\n" +
    "    <script type=\"text/ng-template\" id=\"projfield.modal.html\">\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\"></h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "        <pre>{{wkt}}</pre>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "        </div>\n" +
    "    </script>\n" +
    "        <input type=\"text\" ng-model=\"proj.srs\" class=\"form-control input-sm\" size=\"10\"\n" +
    "          required ng-pattern=\"/^(epsg|EPSG):[0-9]+$/\"\n" +
    "          typeahead=\"p.srs for p in projList | filter:$viewValue\"\n" +
    "          placeholder=\"{{placeholder? placeholder : 'e.g. EPSG:2263'}}\"\n" +
    "          ng-focus=\"$parent.proj = 'other'\"\n" +
    "          focus-me=\"$parent.custom.proj\"\n" +
    "          />\n" +
    "          <span class=\"proj-success\" ng-show=\"valid === true && proj.srs\">\n" +
    "            <i class=\"fa fa-check-circle\"></i>\n" +
    "            <a ng-click=\"showProjWKT()\">Valid CRS</a>\n" +
    "          </span>\n" +
    "          <span class=\"proj-warning\" ng-show=\"valid === false || !proj.srs\">\n" +
    "            <i class=\"fa fa-warning\"></i>\n" +
    "            Invalid CRS\n" +
    "          </span>\n" +
    "  </div>\n" +
    "");
}]);

angular.module("/components/sidenav/sidenav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/sidenav/sidenav.tpl.html",
    "<div id=\"sidebar-wrapper\" ng-show=\"session.active\">\n" +
    "  <ul class=\"sidebar-nav\" ng-style=\"sideStyle\">\n" +
    "    <li class=\"sidebar-toggle\">\n" +
    "      <a ng-click=\"openWorkspace(); toggleSide=!toggleSide; onResize();\" id=\"menu-toggle\" ng-class=\"{'f-right': !toggleSide}\"\n" +
    "        alt=\"{{toggleSide ? 'Open' : 'Close'}} sidebar\"\n" +
    "        title=\"{{toggleSide ? 'Open' : 'Close'}} sidebar\">\n" +
    "        <i class=\"toggleIcon fa fa-2x\"\n" +
    "          ng-class=\"{'fa-arrow-circle-o-left': !toggleSide,\n" +
    "          'fa-arrow-circle-o-right': toggleSide}\"></i>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"dropdown\" dropdown>\n" +
    "      <a class=\"dropdown-toggle list-entry\" dropdown-toggle title=\"New Project Workspace\" data-toggle=\"dropdown-new\">\n" +
    "        <i class=\"icon-plus\" ng-show=\"toggleSide\"></i>\n" +
    "        <span class=\"txt\">New <span class=\"caret\"></span></span>\n" +
    "      </a>\n" +
    "      <ul id=\"dropdown-new\" class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li><a ng-click=\"newWorkspace();\">New Project Workspace</a></li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li role=\"presentation\" class=\"divider\"></li>\n" +
    "    <li id=\"projects_t\" ng-show=\"!toggleSide\">\n" +
    "      <div class=\"all-workspaces\" ng-init=\"openWorkspaces();\" ui-sref=\"workspaces.list\"\n" +
    "        alt=\"Project Workspaces\" title=\"Project Workspaces\">\n" +
    "        <span class=\"projects-header\">Project Workspaces</span>\n" +
    "      </div>\n" +
    "      <ul class=\"workspaces\" role=\"menu\">\n" +
    "        <li class=\"single-workspace\" ng-repeat=\"workspace in workspaces |\n" +
    "          limitTo:numWorkspaces\" ng-class=\"{'open': toggleWkspc[workspace.name]}\">\n" +
    "          <div class=\"list-entry\">\n" +
    "            <a class=\"delete-workspace\" href=\"\" ng-click=\"deleteWorkspace(workspace);\">\n" +
    "              <i class=\"icon-remove\"></i>\n" +
    "            </a>\n" +
    "            <a class=\"show-workspace\" href=\"\" ng-click=\"onWorkspaceClick(workspace);\" alt=\"{{ workspace.name }}\">\n" +
    "              <i ng-class=\"{'icon-folder': !toggleWkspc[workspace.name], 'icon-folder-open': toggleWkspc[workspace.name]}\"></i> <span class=\"txt\">{{ workspace.name }}</span>\n" +
    "            </a>\n" +
    "          </div>\n" +
    "          \n" +
    "          <ul class=\"workspace-items\" collapse=\"!toggleWkspc[workspace.name]\" role=\"menu\">\n" +
    "            <li class=\"in-workspace\">\n" +
    "              <a class=\"list-entry\" ng-click=\"onWorkspaceTabClick(workspace,'maps.main');\"\n" +
    "                alt=\"Maps\">\n" +
    "                <i class=\"icon-map\"></i> <span class=\"txt\">Maps</span>\n" +
    "              </a>\n" +
    "            </li>\n" +
    "            <li class=\"in-workspace\">\n" +
    "              <a class=\"list-entry\" ng-click=\"onWorkspaceTabClick(workspace,'layers.main');\"\n" +
    "                alt=\"Layers\">\n" +
    "                <i class=\"icon-stack\"></i> <span class=\"txt\">Layers\n" +
    "                </span>\n" +
    "              </a>\n" +
    "            </li>\n" +
    "            <li class=\"in-workspace\">\n" +
    "              <a class=\"list-entry\" ng-click=\"onWorkspaceTabClick(workspace,'data.main');\"\n" +
    "                alt=\"Data\">\n" +
    "                <i class=\"fa fa-database fa-md\"></i> <span class=\"txt\" style=\"margin-left: 1px;\"> Data\n" +
    "                </span>\n" +
    "              </a>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </li>\n" +
    "        <li ng-show=\"workspaces.length > 2\" class=\"more\">\n" +
    "          <a  class=\"list-entry\" ui-sref=\"workspaces.list\" alt=\"More...\" title=\"More...\">\n" +
    "            <span class=\"txt\">More...</span>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li id=\"projects\" ng-show=\"toggleSide\" class=\"dropdown\" dropdown>\n" +
    "      <a class=\"list-entry\" ng-click=\"openWorkspaces();\" class=\"dropdown-toggle\"\n" +
    "        data-toggle=\"tgdropdown\" alt=\"Project Workspaces\"\n" +
    "        title=\"Project Workspaces\" dropdown-toggle>\n" +
    "        <i class=\"icon-folder-open\"></i> <span class=\"txt\">Project Workspaces</span>\n" +
    "      </a>\n" +
    "      <ul id=\"tgdropdown\" class=\"dropdown-menu\"\n" +
    "        role=\"menu\">\n" +
    "        <li class=\"single-workspace\" ng-repeat=\"workspace in workspaces |\n" +
    "          limitTo: 5\" ng-class=\"{'open': toggleWkspc2[workspace.name]}\">\n" +
    "          <div class=\"list-entry\">\n" +
    "            <a class=\"delete-workspace\" href=\"\" ng-click=\"deleteWorkspace(workspace);\">\n" +
    "              <i class=\"icon-remove\"></i>\n" +
    "            </a>\n" +
    "            <a class=\"list-entry\" href=\"\" ng-click=\"onWorkspaceClick2(workspace);\" alt=\"{{ workspace.name }}\"\n" +
    "            title=\"{{ workspace.name }}\">\n" +
    "              <i ng-class=\"{'icon-folder': !toggleWkspc2[workspace.name], 'icon-folder-open': toggleWkspc2[workspace.name]}\"></i> {{ workspace.name }}\n" +
    "            </a>\n" +
    "          </div>\n" +
    "        </li>\n" +
    "        <li ng-show=\"workspaces.length > 2\" class=\"more\">\n" +
    "          <a class=\"list-entry\" ui-sref=\"workspaces.list\" alt=\"More...\" title=\"More...\"> More...</a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"workspaces.length == 0\" class=\"single-workspace\">\n" +
    "          No Project Workspaces\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <ul class=\"sidebar-nav\" ng-style=\"sideBottom\">\n" +
    "    <li role=\"presentation\" class=\"divider top-divider\"></li>\n" +
    "    <li><a class=\"list-entry\" ui-sref=\"maps\" alt=\"All Maps\" title=\"All Maps\">\n" +
    "      <i class=\"icon-map\"></i> <span class=\"txt\">All Maps</span></a>\n" +
    "    </li>\n" +
    "    <li><a class=\"list-entry\" ui-sref=\"layers\" alt=\"All Layers\" title=\"All Layers\">\n" +
    "      <i class=\"icon-stack\"></i> <span class=\"txt\">All Layers</span></a>\n" +
    "    </li>\n" +
    "    <li role=\"presentation\" class=\"divider\"></li>\n" +
    "    <li>\n" +
    "      <a class=\"list-entry\" ui-sref=\"home\" alt=\"Recent\" title=\"Recent\">\n" +
    "        <i class=\"icon-clock\"></i> <span class=\"txt\">Recent</span>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"text-center copyright-item\">\n" +
    "      <span class=\"copyright\">&copy; 2015 <a href=\"http://boundlessgeo.com/site-map/legal/composer-license/\">Boundless</a></span>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/components/topnav/topnav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/components/topnav/topnav.tpl.html",
    "<nav class=\"navbar navbar-inverse navbar-fixed-top main-nav\" role=\"navigation\" ng-controller=\"TopNavCtrl\">\n" +
    "  <div class=\"container-fluid\">\n" +
    "    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button type=\"button\" class=\"navbar-toggle\" data-target=\"#collapse-items\"\n" +
    "        ng-init=\"navCollapsed = true\" ng-click=\"navCollapsed = !navCollapsed\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "      <a class=\"navbar-brand\" ui-sref=\"home\">\n" +
    "	<object data=\"images/composer-header.png\">\n" +
    "          <span class=\"brand-strong\">Suite</span>\n" +
    "          <span class=\"brand-light\">Composer</span>\n" +
    "	</object>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "    <alert-panel alerts=\"alerts\"></alert-panel>\n" +
    "    <error-panel errors=\"errors\"></error-panel>\n" +
    "    <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "    <div class=\"collapse navbar-collapse\" collapse=\"navCollapsed\" id=\"collapse-items\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li><a href=\"{{docUrl}}webmaps/composer/\" target=\"_blank\">Help</a></li>\n" +
    "        <li><a ng-click=\"errors()\">Recent Alerts</a></li>\n" +
    "        <li ng-if=\"session.active\" class=\"user dropdown\" dropdown>\n" +
    "          <a class=\"dropdown-toggle\" data-toggle=\"dropdown-user\" dropdown-toggle>\n" +
    "            <span>{{ session.user }}</span> <span class=\"caret\"></span>\n" +
    "          </a>\n" +
    "          <ul id=\"dropdown-user\" class=\"dropdown-menu\" role=\"menu\">\n" +
    "            <li><a href=\"{{adminLink}}/web/\" target=\"_blank\">GeoServer Admin</a></li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li ng-if=\"session.active\"><a ui-sref=\"#\" ng-click=\"logout()\">Logout</a></li>\n" +
    "          </ul>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div><!-- /.navbar-collapse -->\n" +
    "  </div><!-- /.container-fluid -->\n" +
    "</nav>\n" +
    "");
}]);

angular.module("/core/login/login.modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/core/login/login.modal.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Login</h4>\n" +
    "  </div>\n" +
    "  <div ng-show=\"message\" class=\"alert alert-danger\" role=\"alert\">\n" +
    "    {{ message }}\n" +
    "  </div>\n" +
    "  <div ng-if=\"loginFailed\" class=\"alert alert-danger\" role=\"alert\">\n" +
    "    Login failed. Please try again.\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <form class=\"login-form\" ng-init=\"alertsOff();\">\n" +
    "      <div class=\"form-group row\">\n" +
    "        <div class=\"col-xs-2\"><label for=\"username\" class=\"control-label\">Username:</label></div>\n" +
    "        <div class=\"col-xs-8 col-xs-offset-1\"><input ng-model=\"creds.username\" type=\"text\" class=\"form-control\" focus-init/></div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group row\">\n" +
    "        <div class=\"col-xs-2\"><label for=\"password\" class=\"control-label\">Password:</label></div>\n" +
    "        <div class=\"col-xs-8 col-xs-offset-1\"><input ng-model=\"creds.password\" type=\"password\" class=\"form-control\"/></div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group row\">\n" +
    "        <div class=\"col-xs-11\">\n" +
    "          <button class=\"btn btn-default btn-sm pull-right\" ng-click=\"login()\">Login</button>\n" +
    "          <button class=\"btn btn-default btn-sm pull-right\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("/core/login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/core/login/login.tpl.html",
    "<div class=\"login-page\">\n" +
    "  <div class=\"container-fluid login-container\">\n" +
    "    <p class=\"description\">Composer helps you style layers and create maps in GeoServer.</p>\n" +
    "    <div ng-if=\"loginFailed\" class=\"alert alert-danger\" role=\"alert\">\n" +
    "      Login failed. Please try again.\n" +
    "    </div>\n" +
    "    <form class=\"login-form\" ng-init=\"alertsOff();\">\n" +
    "      <div class=\"form-group row\">\n" +
    "        <div class=\"col-xs-2\"><label for=\"username\" class=\"control-label\">Username:</label></div>\n" +
    "        <div class=\"col-xs-8 col-xs-offset-1\"><input ng-model=\"creds.username\" type=\"text\" class=\"form-control\" focus-init/></div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group row\">\n" +
    "        <div class=\"col-xs-2\"><label for=\"password\" class=\"control-label\">Password:</label></div>\n" +
    "        <div class=\"col-xs-8 col-xs-offset-1\"><input ng-model=\"creds.password\" type=\"password\" class=\"form-control\"/></div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group row\">\n" +
    "        <div class=\"col-xs-11\">\n" +
    "          <button class=\"btn btn-default btn-sm pull-right\" ng-click=\"login()\">Login</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "    <div class=\"login-help text-center\">\n" +
    "      <small>Not registered? Contact your GeoServer Administrator for access.</small>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/core/modals/popover-html-unsafe.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/core/modals/popover-html-unsafe.tpl.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" bind-html-unsafe=\"content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/home/home.tpl.html",
    "<div class=\"container-fluid home\">\n" +
    "  <h3 class=\"page-title\"><i class=\"icon-lg icon-clock\"></i> {{title}}</h3>\n" +
    "  <div class=\"page-content\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <div class=\"get-started\">\n" +
    "          <div class=\"get-started-header\" ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "          Getting Started with Composer <span class=\"icon\"><i class=\"fa\" ng-class=\"{ 'fa-chevron-right': isCollapsed, 'fa-chevron-down': !isCollapsed }\"></i></span>\n" +
    "          </div>\n" +
    "          <div class=\"steps\" collapse=\"isCollapsed\" ng-init=\"isCollapsed=false\">\n" +
    "            <div class=\"row\">\n" +
    "              <div class=\"col-sm-4\">\n" +
    "                <div class=\"icon-round\">1</div> Create a Project Workspace\n" +
    "                <div class=\"step-content\">\n" +
    "                  <img class=\"screen\" src=\"images/screens/new-project.png\" />\n" +
    "                  <p class=\"instruction\">A Project Workspace holds related data, layers and maps.</p>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "              <div class=\"col-sm-4\">\n" +
    "                <div class=\"icon-round\">2</div> Import Data to Layers\n" +
    "                <div class=\"step-content\">\n" +
    "                  <img class=\"screen\" src=\"images/screens/import-data.png\" />\n" +
    "                  <p class=\"instruction\">Import data into your Project Workspace to create layers.</p>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "              <div class=\"col-sm-4\">\n" +
    "                <div class=\"icon-round\">3</div> Create a Map and Add Layers\n" +
    "                <div class=\"step-content\">\n" +
    "                  <img class=\"screen\" src=\"images/screens/create-map.png\" />\n" +
    "                  <p class=\"instruction\">Create a new Map, add layers to it, and style them in Composer.</p>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <hr>\n" +
    "            <div class=\"row\">\n" +
    "              <div class=\"col-sm-12 text-center\">\n" +
    "              <div class=\"composer-title\" style=\"text-transform: uppercase; padding-left: 40px;\"> Suite Composer</div>\n" +
    "                <div class=\"step-content\">\n" +
    "                  <p class=\"instruction\" style=\"max-width: 50%; margin: 5px auto 10px; line-height: 24px;\">Style multiple layers as maps in Composer's editor for YSLD,<br />a compact version of GeoServer's SLD markup language.</p>\n" +
    "                  <img class=\"screen composer-screen\" src=\"images/screens/composer.png\" />\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-11\" ng-if=\"recentWorkspaces.length\">\n" +
    "        <div class=\"workspaces\" ng-if=\"recentWorkspaces.length\">\n" +
    "          <h4 class=\"underline\">Recent Project Workspaces: {{ recentWorkspaces.length }}</h4>\n" +
    "          <ul class=\"list-unstyled\">\n" +
    "            <div ng-repeat=\"row in recentWorkspaces | partition:2\" class=\"row workspace-row\">\n" +
    "              <li ng-repeat=\"recentWorkspace in row\" class=\"workspace\" ng-class=\"{'workspace-center-offset': $index%2 != 0}\" ui-sref=\"workspace({workspace: recentWorkspace.name})\">\n" +
    "                <div class=\"icon-marker\"><i class=\"icon-folder\"></i></div>\n" +
    "                <p class=\"info\">\n" +
    "                  <a ui-sref=\"workspace({workspace: recentWorkspace.name})\">{{ recentWorkspace.name }}</a><br />\n" +
    "                </p>\n" +
    "                <p class=\"footer\">\n" +
    "                  <small class=\"time\">Modified {{ recentWorkspace.modified.pretty }}</small>\n" +
    "                </p>\n" +
    "              </li>\n" +
    "            </div>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-5\" ng-if=\"recentMaps.length\">\n" +
    "        <div class=\"maps\">\n" +
    "          <h4 class=\"underline\">Recent Maps</h4>\n" +
    "          <ul class=\"list-unstyled\">\n" +
    "            <li ng-repeat=\"map in recentMaps\" class=\"map\" ui-sref=\"editmap({workspace: map.workspace, name: map.name})\">\n" +
    "              <div class=\"icon-marker\"><i class=\"icon-map\"></i></div>\n" +
    "              <p class=\"info\">\n" +
    "                <a ui-sref=\"editmap({workspace: map.workspace, name: map.name})\" ng-click=\"$event.stopPropagation()\">{{ map.name }}</a><br />\n" +
    "                Title: {{ map.title }}<br />\n" +
    "              </p>\n" +
    "              <p class=\"footer\">\n" +
    "                <small class=\"time\">Modified {{ map.modified.pretty }}</small> <small class=\"project\">Project Workspace: <a ui-sref=\"workspace({workspace: map.workspace})\" ng-click=\"$event.stopPropagation()\">{{ map.workspace }}</a></small>\n" +
    "              </p>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-1\" ng-if=\"recentMaps.length && recentLayers.length\">\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-5\" ng-if=\"recentLayers.length\">\n" +
    "        <div class=\"layers\">\n" +
    "          <h4 class=\"underline\">Recent Layers</h4>\n" +
    "          <ul class=\"list-unstyled\">\n" +
    "            <li ng-repeat=\"layer in recentLayers\" class=\"layer\" ui-sref=\"editlayer({workspace: layer.workspace, name: layer.name})\">\n" +
    "              <div class=\"icon-marker\"><i class=\"icon-stack\"></i></div>\n" +
    "              <p class=\"info\">\n" +
    "                <a ui-sref=\"editlayer({workspace: layer.workspace, name: layer.name})\" ng-click=\"$event.stopPropagation()\">{{ layer.name }}</a><br />\n" +
    "                Title: {{ layer.title }}<br />\n" +
    "              </p>\n" +
    "              <p class=\"footer\">\n" +
    "                <small class=\"time\">Modified {{ layer.modified.pretty }}</small>  <small class=\"project\">Project Workspace: <a ui-sref=\"workspace({workspace: layer.workspace})\" ng-click=\"$event.stopPropagation()\">{{ layer.workspace }}</a></small>\n" +
    "              </p>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/layers/addnewlayer-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/layers/addnewlayer-modal.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Layers > New Layer</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <form name=\"newLayer\" role=\"form\" class=\"new-map-form form-1\">\n" +
    "          <div class=\"container\">\n" +
    "            <div class=\"col-xs-1\"><label for=\"layerName\">Layer Name: </label></div>\n" +
    "            <div class=\"col-xs-3\">\n" +
    "              <input type=\"text\" class=\"form-control input-sm\" name=\"name\" placeholder=\"Layer Name\" ng-model=\"layerInfo.name\" maxlength=\"10\" required ng-change=\"checkName(layerInfo.name);\" ng-pattern=\"/^[a-zA-Z][a-zA-Z\\d\\-_]*$/\" ng-model-options=\"{updateOn: 'defualt blur'}\" required focus-init />\n" +
    "              <small>(No spaces, max 10 characters.)</small>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-5\">\n" +
    "              <span ng-show=\"newLayer.name.$error.pattern\" class=\"alert-danger\">Invalid characters in layer name.</span>\n" +
    "              <span ng-show=\"newLayer.name.$dirty && newLayer.name.$error.required\" class=\"alert-danger\">Required</span>\n" +
    "              <div ng-if=\"layerNameError\" class=\"alert-danger\">Another layer already has the name '{{layerInfo.name}}'.</div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"container\">\n" +
    "            <div class=\"col-xs-9\"><fieldset><legend>Data Source</legend></fieldset></div>\n" +
    "          </div>\n" +
    "          <div class=\"container\">\n" +
    "            <div class=\"col-xs-2\"><label for=\"dataSource\">Select an Existing Data Source:</label></div>\n" +
    "            <div class=\"col-xs-3\">\n" +
    "              <ui-select ng-model=\"datastores.selected\" ng-disabled=\"disabled\" theme=\"bootstrap\" reset-search-input=\"false\">\n" +
    "                <ui-select-match placeholder=\"Select a data store...\">\n" +
    "                  {{$select.selected.name}}\n" +
    "                </ui-select-match>\n" +
    "                <ui-select-choices repeat=\"datastore in datastores\">\n" +
    "                  <span ng-bind-html=\"datastore.name | highlight: $select.search\"></span>\n" +
    "                </ui-select-choices>\n" +
    "              </ui-select>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"container\">\n" +
    "            <div class=\"col-xs-9\"><fieldset><legend>Properties</legend></fieldset></div>\n" +
    "          </div>\n" +
    "          <div class=\"container\">\n" +
    "            <div class=\"col-xs-1\"><label for=\"layerTitle\">Title: </label></div>\n" +
    "            <div class=\"col-xs-3\">\n" +
    "              <input type=\"text\" class=\"form-control input-sm\" name=\"title\" placeholder=\"Display title\" ng-model=\"layerInfo.title\" ng-model-options=\"{updateOn: 'blur'}\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-2\">\n" +
    "              <label for=\"projection\">Projection SRS <span class=\"crs-warning\" popover-html-unsafe=\"{{crsTooltip}}\" popover-trigger=\"click\"><i class=\"icon-ln fa fa-info-circle\"></i></span>: </label>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-3\">\n" +
    "              <proj-field name=\"crs\" proj=\"layerInfo.proj\" ng-model-options=\"{updateOn: 'default blur', 'allowInvalid': true}\"></proj-field>\n" +
    "              <small>(e.g. EPSG:4326)</small>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-7\">\n" +
    "              <div ng-show=\"newLayer.crs.$dirty && !newLayer.crs.$error.pattern && !newLayer.crs.$error.required\" class=\"alert-success\"><i class=\"fa fa-check-circle\"></i> Valid CRS.</div>\n" +
    "              <div ng-show=\"newLayer.crs.$dirty && !newLayer.crs.$error.pattern && newLayer.crs.$error.required\" class=\"alert-danger\">Required</div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <br />\n" +
    "          <div class=\"container\">\n" +
    "            <div class=\"col-xs-1\"><label for=\"type\">Type:</label></div>\n" +
    "            <div class=\"col-xs-3\">\n" +
    "              <ui-select ng-model=\"types.selected\" ng-disabled=\"disabled\" theme=\"bootstrap\" reset-search-input=\"false\">\n" +
    "                <ui-select-match placeholder=\"Select a layer type...\">\n" +
    "                  {{$select.selected.name}}\n" +
    "                </ui-select-match>\n" +
    "                <ui-select-choices repeat=\"type in types\">\n" +
    "                  <span ng-bind-html=\"type.name | highlight: $select.search\"></span>\n" +
    "                </ui-select-choices>\n" +
    "              </ui-select>\n" +
    "            </div>\n" +
    "            <!--\n" +
    "            <div class=\"col-xs-5\">\n" +
    "              <button class=\"btn btn-default btn-sm\" ng-click=\"editOtherSettings()\"><img src=\"images/settings.png\" alt=\"Edit Other Settings\" title=\"Edit Other Settings\" /> Edit Other Settings</button>\n" +
    "              <i>Default settings will be applied.</i>\n" +
    "            </div>\n" +
    "            -->\n" +
    "          </div>\n" +
    "          <br />\n" +
    "          <div class=\"container\">\n" +
    "            <div class=\"col-xs-1\"><label for=\"projection\">Extent:</label></div>\n" +
    "            <div class=\"col-xs-5\">\n" +
    "              <div class=\"input-group\">\n" +
    "                <div class=\"input-group-btn\">\n" +
    "                  <ui-select class=\"small-control\" ng-model=\"extents.selected\" theme=\"bootstrap\" reset-search-input=\"false\" required>\n" +
    "                    <ui-select-match placeholder=\"Select an extent...\">\n" +
    "                      {{$select.selected.name}}\n" +
    "                    </ui-select-match>\n" +
    "                    <ui-select-choices repeat=\"extent in extents\">\n" +
    "                      <span ng-bind-html=\"extent.name | highlight: $select.search\"></span>\n" +
    "                    </ui-select-choices>\n" +
    "                  </ui-select>\n" +
    "                </div>\n" +
    "                <input ng-if=\"extents.selected.name=='Custom'\" type=\"text\" class=\"form-control\" name=\"layerExtent\" placeholder=\"[lower corner, upper corner]\" ng-model=\"layerInfo.extent\" ng-bind-html>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <!--div class=\"container\">\n" +
    "            <!--TODO: grab a thumbnail if it exists-->\n" +
    "            <!--<div class=\"col-xs-4 col-xs-offset-1\">\n" +
    "              <img ng-hide=\"thumbnail == ''\" class=\"thumbnail\" ng-model=\"thumbnail\" ng-src=\"{{thumbnail}}\" alt=\"Thumbnail View\" title=\"Thumbnail View\" />\n" +
    "            </div>\n" +
    "          </div>-->\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "     <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "     <button class=\"btn btn-success btn-sm\" ng-click=\"createLayer(layerInfo, datastores.selected.name, layerInfo.proj, types.selected.name, extents.selected.name)\" ng-disabled=\"!newLayer.$valid || layerNameError\">Create Layer</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/layers/deletelayer-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/layers/deletelayer-modal.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Delete Layer</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <p>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-lg-12\">\n" +
    "          <div class=\"input-group input-group-sm\">\n" +
    "            Are you sure you want to remove the layer \"{{selectedLayer.name}}\"?\n" +
    "          </div>\n" +
    "        </div><!-- /.col-lg-12 -->\n" +
    "      </div><!-- /.row -->\n" +
    "    </p>\n" +
    "    <p>&nbsp;</p>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button class=\"btn btn-danger btn-sm\" ng-click=\"ok()\">Delete</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/layers/detail/layer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/layers/detail/layer.tpl.html",
    "<div>\n" +
    "  <div ui-view></div>\n" +
    "</div>");
}]);

angular.module("/layers/layers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/layers/layers.tpl.html",
    "<div>\n" +
    "  <div class=\"container-fluid\">\n" +
    "    <h3 class=\"page-title\">\n" +
    "      <i class=\"icon-lg icon-stack\"></i> {{title}}\n" +
    "    </h3>\n" +
    "    <div class=\"page-content all-layers\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <div class=\"layers-count-sort\">\n" +
    "            <div class=\"workspace-choice\">\n" +
    "              <div class=\"workspace-label\">Project Workspace:</div>\n" +
    "              <div class=\"workspace-picker\">\n" +
    "                <ui-select ng-model=\"workspace.selected\" ng-disabled=\"disabled\" theme=\"bootstrap\" reset-search-input=\"false\">\n" +
    "                  <ui-select-match placeholder=\"Select a workspace...\">\n" +
    "                    {{$select.selected.name}}\n" +
    "                  </ui-select-match>\n" +
    "                  <ui-select-choices repeat=\"ws in workspaces\">\n" +
    "                    <span ng-bind-html=\"ws.name | highlight: $select.search\"></span>\n" +
    "                  </ui-select-choices>\n" +
    "                </ui-select>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"layers-count\">\n" +
    "              <strong>{{ totalServerItems }} layer<span ng-if=\"totalServerItems==0 || totalServerItems>1\">s</span></strong>\n" +
    "            </div>\n" +
    "            <div class=\"filter-box pull-right\">\n" +
    "              <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"opts.filter.filterText\" placeholder=\"Filter by name, title, desc...\" size=\"30\" ng-model-options=\"{debounce: 700}\" />\n" +
    "              <i class=\"fa fa-search\"></i>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <div class=\"add-to-map\">\n" +
    "            <span class=\"add-label\">\n" +
    "              <span ng-if=\"layerSelections.length==0\">Select layers below to add to a map.</span>\n" +
    "              <span ng-if=\"layerSelections.length > 0\">{{ layerSelections.length }} Layer<span ng-if=\"layerSelections.length>1\">s</span> selected.</span>\n" +
    "            </span>\n" +
    "            <div class=\"map-picker\">\n" +
    "              <ui-select ng-model=\"map.selected\" ng-disabled=\"disabled\" theme=\"bootstrap\" reset-search-input=\"false\" ng-change=\"setMap(map.selected);\">\n" +
    "                <ui-select-match placeholder=\"Select a map...\">\n" +
    "                  {{$select.selected.name}}\n" +
    "                </ui-select-match>\n" +
    "                <ui-select-choices repeat=\"map in maps\">\n" +
    "                  <span ng-bind-html=\"map.name | highlight: $select.search\"></span>\n" +
    "                </ui-select-choices>\n" +
    "              </ui-select>\n" +
    "              <button type=\"button\" class=\"btn btn-success btn-sm map-button\" ng-disabled=\"!selectedMap\" ng-click=\"addSelectedToMap()\"><i class=\"icon-plus\"></i> Add to Map</button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <div ng-grid=\"gridOptions\" ng-show=\"!layersLoading\"></div>\n" +
    "          <div class=\"layers-loading\" ng-show=\"layersLoading\">\n" +
    "            <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "              Loading Layers ...\n" +
    "            <div class=\"hint\">If layers do not load after a short time, verify GeoServer is running.</div>\n" +
    "          </div>\n" +
    "          <div class=\"paging\">\n" +
    "            <pagination total-items=\"totalServerItems\" items-per-page=\"opts.paging.pageSize\" max-size=\"10\" boundary-links=\"true\" rotate=\"false\" ng-class=\"{'remove-boundaries': !totalServerItems || totalServerItems < (opts.paging.pageSize*10)}\" ng-model=\"opts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/layers/layers.type.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/layers/layers.type.tpl.html",
    "<div ng-switch on=\"type\">\n" +
    "  <div ng-switch-when=\"vector\">\n" +
    "    <div ng-switch on=\"geometry\">\n" +
    "      <div ng-switch-when=\"Point\"><img ng-src=\"images/layer-point.png\" alt=\"Layer Type: Point\" title=\"Layer Type: Point\" /></div>\n" +
    "      <div ng-switch-when=\"MultiPoint\"><img ng-src=\"images/layer-point.png\" alt=\"Layer Type: MultiPoint\" title=\"Layer Type: MultiPoint\" /></div>\n" +
    "      <div ng-switch-when=\"LineString\"><img  ng-src=\"images/layer-line.png\" alt=\"Layer Type: LineString\" title=\"Layer Type: LineString\" /></div>\n" +
    "      <div ng-switch-when=\"MultiLineString\"><img  ng-src=\"images/layer-line.png\" alt=\"Layer Type: MultiLineString\" title=\"Layer Type: MultiLineString\" /></div>\n" +
    "      <div ng-switch-when=\"Polygon\"><img  ng-src=\"images/layer-polygon.png\" alt=\"Layer Type: Polygon\" title=\"Layer Type: Polygon\" /></div>\n" +
    "      <div ng-switch-when=\"MultiPolygon\"><img  ng-src=\"images/layer-polygon.png\" alt=\"Layer Type: MultiPolygon\" title=\"Layer Type: MultiPolygon\" /></div>\n" +
    "      <div ng-switch-when=\"Geometry\"><img  ng-src=\"images/layer-vector.png\" alt=\"Layer Type: Geometry\" title=\"Layer Type: Geometry\" /></div>\n" +
    "      <div ng-switch-default class=\"grid\"><img ng-src=\"images/layer-vector.png\" alt=\"Layer Type: Vector\" title=\"Layer Type: Vector\" /></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-switch-default class=\"grid\"><img ng-src=\"images/layer-raster.png\" alt=\"Layer Type: Raster\" title=\"Layer Type: Raster\" /></div>\n" +
    "</div>");
}]);

angular.module("/maps/deletemap-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/maps/deletemap-modal.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Delete Map</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <p>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sms-12\">\n" +
    "          <div class=\"input-group input-group-sm\">\n" +
    "            Are you sure you want to remove the map \"{{selectedMap.name}}\"?\n" +
    "        </div><!-- /.col-lg-12 -->\n" +
    "      </div><!-- /.row -->\n" +
    "    </p>\n" +
    "    <p>&nbsp;</p>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-danger btn-sm\" ng-click=\"ok()\">Delete</button>\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/maps/detail/map.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/maps/detail/map.tpl.html",
    "<div>\n" +
    "  <div ui-view></div>\n" +
    "</div>");
}]);

angular.module("/maps/maps.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/maps/maps.tpl.html",
    "<div>\n" +
    "  <div class=\"container-fluid\">\n" +
    "    <h3 class=\"page-title\">\n" +
    "      <i class=\"icon-lg icon-map\"></i> {{title}}\n" +
    "    </h3>\n" +
    "    <div class=\"page-content all-maps\">\n" +
    "      <div class=\"row\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <div class=\"maps-count-sort\">\n" +
    "          <div class=\"workspace-choice\">\n" +
    "            <div class=\"workspace-label\">Project Workspace:</div>\n" +
    "            <div class=\"workspace-picker\">\n" +
    "              <ui-select ng-model=\"workspace.selected\" ng-disabled=\"disabled\" theme=\"bootstrap\" reset-search-input=\"false\">\n" +
    "                <ui-select-match placeholder=\"Select a workspace...\">\n" +
    "                  {{$select.selected.name}}\n" +
    "                </ui-select-match>\n" +
    "                <ui-select-choices repeat=\"ws in workspaces\">\n" +
    "                  <span ng-bind-html=\"ws.name | highlight: $select.search\"></span>\n" +
    "                </ui-select-choices>\n" +
    "              </ui-select>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"maps-count\">\n" +
    "            <strong>{{ totalServerItems }} map<span ng-if=\"totalServerItems==0 || totalServerItems>1\">s</span></strong>\n" +
    "          </div>\n" +
    "          <div class=\"pull-right\">\n" +
    "            <div class=\"filter-box\">\n" +
    "              <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"opts.filter.filterText\" placeholder=\"Filter maps by...\" size=\"30\" ng-model-options=\"{debounce: 700}\" />\n" +
    "              <i class=\"fa fa-search\"></i>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"row maps-grid\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <div ng-grid=\"gridOptions\" ng-show=\"!mapsLoading\"></div>\n" +
    "        <div class=\"maps-loading\" ng-show=\"mapsLoading\">\n" +
    "          <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "            Loading Maps ...\n" +
    "          <div class=\"hint\">If maps do not load after a short time, verify GeoServer is running.</div>\n" +
    "        </div>\n" +
    "        <div class=\"paging\">\n" +
    "          <pagination total-items=\"totalServerItems\" items-per-page=\"opts.paging.pageSize\" max-size=\"10\" boundary-links=\"true\" rotate=\"false\" ng-class=\"{'remove-boundaries': !totalServerItems || totalServerItems < (opts.paging.pageSize*10)}\" ng-model=\"opts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/data/data.main.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/data/data.main.tpl.html",
    "<div class=\"data-tab-inner\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <div class=\"data-count-sort\">\n" +
    "        <div class=\"data-count\">\n" +
    "          <strong>{{ totalStores }} Data Store<span ng-if=\"datastores.length==0 || datastores.length>1\">s</span></strong> in current project.\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "          <div class=\"sort-by\">\n" +
    "            <span class=\"sort-label\">Sort by:</span>\n" +
    "            <span class=\"dropdown\" on-toggle=\"toggled(open)\" dropdown>\n" +
    "              <a href class=\"dropdown-toggle\" dropdown-toggle>\n" +
    "              {{ opts.sort.predicate | firstCaps }} <i class=\"fa fa-caret-down\"></i>\n" +
    "              </a>\n" +
    "              <ul class=\"dropdown-menu\">\n" +
    "                <li><a class=\"sort-options\" ng-click=\"sortBy(opts.sort, 'name')\">Name</a></li>\n" +
    "                <li><a class=\"sort-options\" ng-click=\"sortBy(opts.sort, 'type')\">Type</a></li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "          </div>\n" +
    "          <div class=\"filter-box\">\n" +
    "            <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"opts.filter.filterText\" placeholder=\"Filter data stores by...\" size=\"30\" />\n" +
    "            <i class=\"fa fa-search\"></i>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row datastores\">\n" +
    "    <div class=\"col-sm-6\">\n" +
    "      <ul class=\"list-unstyled stores-list\" ng-show=\"datastores && datastores.length > 0\" ng-style=\"storesListHeight\">\n" +
    "        <li class=\"store-row\" ng-repeat=\"ds in datastores\" ng-click=\"selectStore(ds);\" ng-class=\"{'selected': ds.name==selectedStore.name}\">\n" +
    "          <div class=\"icon-column\" ng-click=\"getTypeDetails(ds);\">\n" +
    "            <h3 class=\"datastore-icons\"><i ng-class=\"{'icon-file-4': ds.sourcetype=='shp', 'icon-folder-open': ds.sourcetype=='shp_dir', 'fa fa-database fa-md': ds.sourcetype=='database', 'icon-image-2': ds.sourcetype=='raster', 'icon-earth': ds.sourcetype=='web'}\"></i></h3>\n" +
    "            <p class=\"datastore-label\">{{ ds.sourcetype }}</p>\n" +
    "          </div>\n" +
    "          <div class=\"info-column\">\n" +
    "            <div ng-if=\"!ds.editing\" ng-click=\"storeEdit(ds, true)\">\n" +
    "              <strong>{{ ds.name }}</strong>\n" +
    "              <span ng-show=\"ds.refresh\"><i class=\"fa fa-spinner fa-spin\"></i></span>\n" +
    "            </div>\n" +
    "            <div ng-if=\"ds.editing\"><input class=\"store-edit\" type=\"text\" value=\"{{ds.name}}\" ng-blur=\"storeEdit(ds, false)\"></input></div>\n" +
    "            <div title=\"{{ ds.source }}\" class=\"source-info\" collapse=\"ds.name!=selectedStore.name\">\n" +
    "              <strong>Location:</strong><span>{{ ds.source }}</span>\n" +
    "            </div>\n" +
    "            <p>\n" +
    "              <div class=\"btn-group toggle-group\">\n" +
    "                <label class=\"btn btn-xs\" ng-class=\"{'btn-success': ds.enabled, 'btn-default': !ds.enabled}\" ng-click=\"enableDisableStore(ds)\" ng-model=\"ds.enabled\">Enabled</label>\n" +
    "                <label class=\"btn btn-xs\" ng-class=\"{'btn-primary': !ds.enabled, 'btn-default': ds.enabled}\" ng-click=\"enableDisableStore(ds)\">Disabled</label>\n" +
    "              </div>\n" +
    "              <div class=\"delete-column\" ng-show=\"selectedStore.name==ds.name\">\n" +
    "                <button ng-click=\"deleteStore();\" class=\"btn btn-default btn-xs\"><i class=\"icon-remove\"></i> Delete</button>\n" +
    "              </div>\n" +
    "            </p>\n" +
    "          </div>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      <div class=\"data-loading\" ng-show=\"dataLoading\">\n" +
    "        <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "          Loading Data ...\n" +
    "        <div class=\"hint\">If data does not load after a short time, verify GeoServer is running.</div>\n" +
    "      </div>\n" +
    "      <div class=\"data-paging\">\n" +
    "        <pagination total-items=\"totalStores\" items-per-page=\"opts.paging.pageSize\" max-size=\"10\" boundary-links=\"true\" rotate=\"false\" ng-class=\"{'remove-boundaries': !totalStores || totalStores < (opts.paging.pageSize*10)}\" ng-model=\"opts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "        <a id=\"bottom\"></a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-6\">\n" +
    "      <div>\n" +
    "        <div class=\"resources\">\n" +
    "          <div class=\"resources-header\">\n" +
    "            <span class=\"resources-name\">{{ totalResources }} Data Set<span ng-if=\"!selectedStore.enabled || totalResources != 1\">s</span> in {{ selectedStore.name }}</span>\n" +
    "            <div class=\"pull-right\">\n" +
    "              <div class=\"sort-by\">\n" +
    "                <span class=\"sort-label\">Sort by:</span>\n" +
    "                <span class=\"dropdown\" on-toggle=\"toggled(open)\" dropdown>\n" +
    "                  <a href class=\"dropdown-toggle\" dropdown-toggle>\n" +
    "                  {{ resourceOpts.sort.predicate | firstCaps }} <i class=\"fa fa-caret-down\"></i>\n" +
    "                  </a>\n" +
    "                  <ul class=\"dropdown-menu\">\n" +
    "                    <li><a class=\"sort-options\" ng-click=\"sortBy(resourceOpts.sort, 'name')\">Name</a></li>\n" +
    "                    <li><a class=\"sort-options\" ng-click=\"sortBy(resourceOpts.sort, 'published')\">Published</a></li>\n" +
    "                  </ul>\n" +
    "                </span>\n" +
    "              </div>\n" +
    "              <div class=\"filter-box\">\n" +
    "                <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"resourceOpts.filter.filterText\" placeholder=\"Filter data sets by...\" size=\"30\" />\n" +
    "                <i class=\"fa fa-search\"></i>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            \n" +
    "          </div>\n" +
    "          <div class=\"store-disabled\" ng-show=\"selectedStore && !selectedStore.enabled\">Source is disabled. <a ng-click=\"enableDisableStore(selectedStore)\">Enable</a> to view resources.</div>\n" +
    "          <div class=\"data-loading\" ng-show=\"selectedStore && selectedStore.enabled && pagedResources === null\">\n" +
    "            <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "              Loading Data Sets ...\n" +
    "          </div>\n" +
    "          <div class=\"store-disabled\" ng-show=\"selectedStore && selectedStore.enabled && pagedResources !== null && !totalResources\">No data sets <span ng-if=\"resourceOpts.filter.filterText\"> matching \"{{ resourceOpts.filter.filterText }}\"</span>\n" +
    "          </div>\n" +
    "          <div class=\"resources-content\">\n" +
    "            <ul class=\"list-unstyled\">\n" +
    "              <li class=\"singleResource\" ng-repeat=\"rsrc in pagedResources\">\n" +
    "                <div>\n" +
    "                  <span class=\"label-tag\">Resource:</span>\n" +
    "                  <strong> {{ rsrc.name }}</strong>\n" +
    "                </div>\n" +
    "                <div class=\"rsrc_info pull-right\">\n" +
    "                  <a title=\"Attributes\" ng-click=\"showAttrs(rsrc, selectedStore.name);\">\n" +
    "                    <i class=\"fa fa-list-alt fa-lg\" style=\"padding-left: 5px;\"></i>\n" +
    "                  </a>\n" +
    "                </div>\n" +
    "                <div ng-if=\"rsrc.proj.srs\" class=\"rsrc_info\">\n" +
    "                  <span class=\"label-tag\">Projection:</span> {{ rsrc.proj.srs }}\n" +
    "                </div>\n" +
    "                <div ng-if=\"rsrc.layers.length > 0\">\n" +
    "                  <div class=\"info\"><a pop=\"{{ getLayersForResource(rsrc); }}\" pop-show=\"{{ rsrc.publishedPopover }}\" pop-placement=\"left\" ng-click=\"closeResourcePopovers(rsrc);\" pop-title=\"{{rsrc.name}} is used in layers:\">Published</a></div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"rsrc.layers.length==0\">\n" +
    "                  <div class=\"info\"><strong>Not Published</strong> <span style=\"margin-left:10px;\"><a class=\"btn btn-default btn-xs\" ng-click=\"publishLayer(rsrc, selectedStore);\">Publish to Layer &rarr;</a></span>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "          <div class=\"resources-paging\">\n" +
    "            <pagination total-items=\"totalResources\" items-per-page=\"resourceOpts.paging.pageSize\" max-size=\"10\" boundary-links=\"true\" rotate=\"false\" ng-class=\"{'remove-boundaries': !totalResources || totalResources < (resourceOpts.paging.pageSize*10)}\" ng-model=\"resourceOpts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "            <a id=\"bottom\"></a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/data/data.modal.attributes.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/data/data.modal.attributes.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "  <h4 class=\"modal-title\"><strong>{{ title }}</strong></h4>\n" +
    "  <small>{{ attributes.length }} Attributes</small>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"row\" ng-if=\"attributes.length > 20\" ng-repeat=\"row in attributes | partition:3 \">\n" +
    "      <div class=\"col-xs-4 attr-cols\" ng-repeat=\"item in row\">\n" +
    "        <span class=\"attr-name\">{{ item.name }}</span>\n" +
    "        <span class=\"attr-type pull-right\">{{ item.type }}</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\" ng-if=\"attributes.length < 20\" ng-repeat=\"attr in attributes\">\n" +
    "      <div class=\"col-xs-6 col-xs-offset-3 attr-cols\">\n" +
    "        <span class=\"attr-name\">{{ attr.name }}</span>\n" +
    "        <span class=\"attr-type pull-right\">{{ attr.type }}</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <alert type=\"danger\" ng-show=\"error\">\n" +
    "      <p>Error retrieving attributes for <strong>{{ layerOrResource.name }}</strong>:</p>\n" +
    "      <p>{{ error }}</p>\n" +
    "    </alert>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"close()\">Close</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/data/data.modal.delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/data/data.modal.delete.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{ title }}</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <div ng-show=\"storeUndefined\">\n" +
    "      <p>Please select a store to delete.</p>\n" +
    "    </div>\n" +
    "    <div ng-show=\"!storeUndefined && !store.deleted\">\n" +
    "      <p>Delete store <strong>{{ store.name }}</strong>?</p>\n" +
    "      <p><strong>All store data will be removed.</strong></p>\n" +
    "      <p>Are you sure?</p>\n" +
    "    </div>\n" +
    "    <div ng-show=\"!storeUndefined && store.deleted\">\n" +
    "      Store <strong>{{ store.name }}</strong> deleted.\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Close</button>\n" +
    "    <button ng-hide=\"storeUndefined\" class=\"btn btn-danger btn-sm\" ng-click=\"delete()\" style=\"margin-left:20px; margin-right:20px;\">Yes, Delete Permanently</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/data/data.modal.update.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/data/data.modal.update.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{ desiredStateTitle }} Store</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <p ng-show=\"store.enabled\">\n" +
    "      All data and layers from <strong>{{ store.name }}</strong> not be available until you enable the store again. Are you sure?\n" +
    "    </p>\n" +
    "\n" +
    "    <p ng-show=\"!store.enabled\">\n" +
    "      Enable store <strong>{{ store.name }}</strong>?\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button ng-show=\"store.enabled\" class=\"btn btn-danger btn-sm\" ng-click=\"toggleStore();\" style=\"margin-left:20px; margin-right:20px;\">Yes, Disable</button>\n" +
    "    <button ng-show=\"!store.enabled\" class=\"btn btn-success btn-sm\" ng-click=\"toggleStore();\" style=\"margin-left:20px; margin-right:20px;\">Enable</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/data/data.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/data/data.tpl.html",
    "<div ui-view=\"data\"></div>\n" +
    "");
}]);

angular.module("/workspaces/detail/data/format.type.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/data/format.type.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{ resource.format }}</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <p><strong>Kind:</strong> {{ format.kind | firstCaps }}</p>\n" +
    "    <p><strong>Type:</strong> {{ format.type | firstCaps }}</p>\n" +
    "    <p><strong>Description:</strong> {{ format.description }}</p>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"close()\">Close</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/layers/layers.main.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/layers/layers.main.tpl.html",
    "<div class=\"layers-tab-inner\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <div class=\"layers-count-sort\">\n" +
    "        <div class=\"layers-count\">\n" +
    "          <strong>{{ totalItems }} layer<span ng-if=\"layers.length==0 || layers.length>1\">s</span></strong> in current project.\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "          <div class=\"sort-by\">\n" +
    "            <span class=\"sort-label\">Sort by:</span>\n" +
    "            <span class=\"dropdown\" on-toggle=\"toggled(open)\" dropdown>\n" +
    "              <a href class=\"dropdown-toggle\" dropdown-toggle>\n" +
    "              {{ opts.sort.predicate | firstCaps }} <i class=\"fa fa-caret-down\"></i>\n" +
    "              </a>\n" +
    "              <ul class=\"dropdown-menu\">\n" +
    "                <li><a class=\"sort-options\" ng-click=\"sortBy('name')\">Name</a></li>\n" +
    "                <li><a class=\"sort-options\" ng-click=\"sortBy('title')\">Title</a></li>\n" +
    "                <li><a class=\"sort-options\" ng-click=\"sortBy('type')\">Type</a></li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "          </div>\n" +
    "          <div class=\"filter-box\">\n" +
    "            <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"opts.filter.filterText\" placeholder=\"Filter layers by...\" size=\"30\" ng-model-options=\"{ debounce: 700 }\" />\n" +
    "            <i class=\"fa fa-search\"></i>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <div class=\"add-to-map\" ui-scrollfix=\"+140\">\n" +
    "        <span class=\"add-label\">\n" +
    "          <span ng-if=\"layerSelections.length==0\">Select layers below to add to a map.</span>\n" +
    "          <span ng-if=\"layerSelections.length > 0\">{{ layerSelections.length }} Layer<span ng-if=\"layerSelections.length>1\">s</span> selected.</span>\n" +
    "        </span>\n" +
    "        <div class=\"map-picker\">\n" +
    "          <ui-select ng-model=\"map.selected\" ng-disabled=\"disabled\" theme=\"bootstrap\" reset-search-input=\"false\" ng-change=\"setMap(map.selected);\">\n" +
    "            <ui-select-match placeholder=\"Select a map...\">\n" +
    "              {{$select.selected.name}}\n" +
    "            </ui-select-match>\n" +
    "            <ui-select-choices repeat=\"map in mapOptions\">\n" +
    "              <span ng-bind-html=\"map.name | highlight: $select.search\"></span>\n" +
    "            </ui-select-choices>\n" +
    "          </ui-select>\n" +
    "          <button type=\"button\" class=\"btn btn-success btn-sm map-button\" ng-disabled=\"!selectedMap\" ng-click=\"addSelectedToMap()\"><i class=\"icon-plus\"></i> Add to Map</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"layers-summary\" ng-show=\"layers.length > 0\">\n" +
    "    <div class=\"row\" ng-repeat=\"row in layers | partition:3\">\n" +
    "      <div class=\"col-sm-4\" ng-repeat=\"layer in row\">\n" +
    "        <div class=\"layer-summary-detail\" ng-style=\"{'outline': layer.selected ? '4px #28728D solid' : ''}\">\n" +
    "          <div class=\"layer-info-section\" ng-click=\"layer.selected=!layer.selected; toggleSelected(layer);\">\n" +
    "            <a ui-sref=\"editlayer({workspace: layer.workspace, name: layer.name})\"><img ng-src=\"{{ layer.thumbnail }}\" class=\"layerthumb\" title=\"Layer Preview\"  width=\"{{lyrThumbsWidth}}\" height=\"{{lyrThumbsHeight}}\"/></a>\n" +
    "            <div class=\"layer-detail\">\n" +
    "              <div pop=\"{{ layer.name }}\" pop-show=\"{{ layer.layerName }}\" pop-placement=\"bottom\" ng-click=\"closeLayerNPopovers(layer);\"><strong>{{ layer.name | truncate:false:28:true }}</strong></div>\n" +
    "              <div class=\"layer-title\" ng-if=\"layer.title\" pop=\"{{ layer.title }}\" pop-show=\"{{ layer.layerTitle }}\" pop-placement=\"bottom\" ng-click=\"closeLayerTPopovers(layer);\">{{ layer.title | truncate:false:28:true }}</div>\n" +
    "              <div class=\"layer-detail-inner\">\n" +
    "                <div class=\"layer-icon\">\n" +
    "                  <i class='icon-for-layer' ng-class=\"{'icon-location': layer.geometry=='Point', 'icon-share': layer.geometry=='MultiLineString' || layer.geometry=='LineString', 'icon-stop-2': layer.geometry=='MultiPolygon', 'icon-image-2': layer.geometry=='raster', 'icon-diamonds': layer.geometry=='Geometry'}\"></i>\n" +
    "                  <span class=\"text-for-icon\">{{ layer.geometry.toLowerCase() }}</span>\n" +
    "                </div>\n" +
    "                <div class=\"layer-mod\"><i class=\"icon-clock\"></i> Modified<strong><span ng-if=\"layer.modified.pretty\"> {{ layer.modified.pretty }}</span> <span ng-if=\"!layer.modified\">: N/A</span></strong></div>\n" +
    "                <!-- <p><a href=\"\" ng-click=\"newOLWindow(map)\">View in OpenLayers</a></p> -->\n" +
    "              </div>\n" +
    "              <div class=\"btn-group layer-detail-links\">\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-sm link\" ng-click=\"editLayerSettings(layer);\"><i class=\"fa fa-gear\"></i> Settings</button>\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-sm link\" title=\"Copy to New Layer\" ng-click=\"copyToNewLayer(layer);\"><i class=\"fa fa-copy\"></i> Copy</button>\n" +
    "                <button ng-click=\"deleteLayer(layer)\" class=\"btn btn-default btn-sm link\"><i class=\"icon-remove\"></i> Delete</button>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          \n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"layers-summary\" ng-show=\"layers.length==0\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <a ng-click=\"createLayer();\">\n" +
    "          <div class=\"new-layer-box\">New Layer\n" +
    "            <div class=\"plus\">+ <i class=\"icon-stack\"></i></div>\n" +
    "          </div>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"layers-loading\" ng-show=\"layersLoading\">\n" +
    "    <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "      Loading Layers ...\n" +
    "    <div class=\"hint\">If layers do not load after a short time, verify GeoServer is running.</div>\n" +
    "  </div>\n" +
    "  <div class=\"layers-paging\">\n" +
    "    <pagination total-items=\"totalItems\" items-per-page=\"opts.paging.pageSize\" max-size=\"10\" boundary-links=\"true\" rotate=\"false\" ng-class=\"{'remove-boundaries': !totalItems || totalItems < (opts.paging.pageSize*10)}\" ng-model=\"opts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "    <a id=\"bottom\"></a>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/layers/layers.modal.delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/layers/layers.modal.delete.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Delete Layer</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <p>Delete layer <strong>{{ layer.name }}</strong>?</p>\n" +
    "    <p><strong>This layer and its style will be permanently deleted.</strong></p>\n" +
    "    <p>This layer will also be removed from any maps containing it.</p>\n" +
    "    <p>The data store containing the layer data will be preserved.</p>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\" style=\"float:left;\">Cancel</button>\n" +
    "    <button class=\"btn btn-danger btn-sm\" ng-click=\"deleteForever()\" style=\"margin-left:20px; margin-right:20px;\">Delete</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/layers/layers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/layers/layers.tpl.html",
    "<div ui-view></div>\n" +
    "");
}]);

angular.module("/workspaces/detail/maps/maps.main.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/maps/maps.main.tpl.html",
    "<div class=\"map-tab-inner\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <div class=\"maps-count-sort\">\n" +
    "        <div class=\"maps-count\">\n" +
    "          <strong>{{ totalItems }} map<span ng-if=\"maps.length==0 || maps.length>1\">s</span></strong> in current project.\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "          <div class=\"sort-by\">\n" +
    "            <span class=\"sort-label\">Sort by:</span>\n" +
    "            <span class=\"dropdown\" on-toggle=\"toggled(open)\" dropdown>\n" +
    "              <a href class=\"dropdown-toggle\" dropdown-toggle>\n" +
    "              {{ opts.sort.predicate | firstCaps }} <i class=\"fa fa-caret-down\"></i>\n" +
    "              </a>\n" +
    "              <ul class=\"dropdown-menu\">\n" +
    "                <li><a class=\"sort-options\" ng-click=\"sortBy('name')\">Name</a></li>\n" +
    "                <li><a class=\"sort-options\" ng-click=\"sortBy('title')\">Title</a></li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "          </div>\n" +
    "          <div class=\"filter-box\">\n" +
    "            <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"opts.filter.filterText\" placeholder=\"Filter maps by...\" size=\"30\" />\n" +
    "            <i class=\"fa fa-search\"></i>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"map-summary\" ng-show=\"maps.length > 0\">\n" +
    "    <div class=\"row\" ng-repeat=\"row in maps | partition:2\">\n" +
    "      <div class=\"col-sm-6\" ng-repeat=\"map in row\">\n" +
    "        <div class=\"map-wrapper\">\n" +
    "          <a href=\"\" ui-sref=\"editmap({workspace: map.workspace, name: map.name})\">\n" +
    "            <img ng-src=\"{{ thumbnails[map.name] }}\" class=\"mapthumb\" title=\"Edit Map\" width=\"{{mapThumbsWidth}}\" height=\"{{mapThumbsHeight}}\"/>\n" +
    "          </a>\n" +
    "          <div class=\"map-summary-detail\">\n" +
    "            <div class=\"inline\">\n" +
    "              <div class=\"inline map-name\">{{ map.name }}</div>\n" +
    "            </div>\n" +
    "            <div class=\"map-title\"><span ng-if=\"map.title\">{{ map.title }}</span><span ng-if=\"!map.title\">&nbsp;</span></div>\n" +
    "            <div class=\"map-otherinfo\">\n" +
    "              <div class=\"otherinfo\"><i class=\"icon-stack\"></i> {{ map.layer_count }} Layer<span ng-if=\"map.layer_count==0 || map.layer_count>1\">s</span></div>\n" +
    "              <div class=\"otherinfo\"><i class=\"icon-compass\"></i> {{ map.proj.srs }}</div>\n" +
    "              <div class=\"otherinfo\" ng-if=\"map.modified.pretty\"><i class=\"icon-clock\"></i> Modified <strong>{{ map.modified.pretty }}</strong></div>\n" +
    "            </div>\n" +
    "            <div class=\"btn-group map-summary-links\">\n" +
    "              <button type=\"button\" class=\"btn btn-default btn-sm link\" ng-click=\"editMapSettings(map);\" alt=\"Map Settings\" title=\"Map Settings\"><i class=\"fa fa-gear\"></i> Settings</button>\n" +
    "              <button type=\"button\" class=\"btn btn-default btn-sm link\" ng-click=\"newOLWindow(map);\" alt=\"Map Link\" title=\"Map Link\"><i class=\"icon-link\"></i> Link</button>\n" +
    "              <button type=\"button\" class=\"btn btn-default btn-sm link\" ng-click=\"generateMapSrc(map);\" alt=\"Generate Map\" title=\"Generate Map\"><i style=\"line-height: 1;\"><strong>js</strong></i> Export</button>\n" +
    "              <button ng-click=\"deleteMap(map)\" class=\"btn btn-default btn-sm link\"><i class=\"icon-remove\"></i> Delete</button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"abstract\" ng-if=\"map.description\"><strong>Description:</strong> {{sanitizeHTML(map.description)}}</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"map-summary\" ng-show=\"maps.length==0\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <a ng-click=\"createMap();\">\n" +
    "          <div class=\"new-map-box\">New Map\n" +
    "            <div class=\"plus\">+ <i class=\"icon-map\"></i></div>\n" +
    "          </div>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"maps-loading\" ng-show=\"mapsLoading\">\n" +
    "    <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "      Loading Maps ...\n" +
    "    <div class=\"hint\">If maps do not load after a short time, verify GeoServer is running.</div>\n" +
    "  </div>\n" +
    "  <div class=\"maps-paging\">\n" +
    "    <pagination total-items=\"totalItems\" items-per-page =\"opts.paging.pageSize\" max-size=\"10\" boundary-links=\"true\" rotate=\"false\" ng-class=\"{'remove-boundaries': !totalItems || totalItems < (opts.paging.pageSize*10)}\" ng-model=\"opts.paging.currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/maps/maps.modal.delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/maps/maps.modal.delete.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Delete Map</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <p>Delete map <strong>{{ map.name }}</strong>?</p>\n" +
    "    <p>All layers and styles will be preserved.</p>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\" style=\"float:left;\">Cancel</button>\n" +
    "    <button class=\"btn btn-danger btn-sm\" ng-click=\"deleteForever()\" style=\"margin-left:20px; margin-right:20px;\">Delete</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/maps/maps.modal.export.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/maps/maps.modal.export.tpl.html",
    "<div class=\"ol-export\">\n" +
    "  <div class=\"modal-header\">\n" +
    "      <h3 class=\"modal-title\">OL3 Export</h3>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "      <textarea ng-model=\"ol3src\" resizable=\"false\" style=\"width: 100%; height: 100%;\"></textarea>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "      <button class=\"btn btn-secondary\" ng-click=\"preview()\">Preview</button>\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"$close()\">OK</button>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("/workspaces/detail/maps/maps.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/maps/maps.tpl.html",
    "<div ui-view=\"maps\"></div>\n" +
    "");
}]);

angular.module("/workspaces/detail/workspace.modal.delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/workspace.modal.delete.tpl.html",
    "<div>\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Delete Workspace</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\" style=\"font-size: 13px; margin-left: 20px;\">\n" +
    "    <p>Delete workspace <strong>{{ workspace }}</strong>?</p>\n" +
    "    <p><strong>All data, layers and styles will be permanently deleted.</strong></p>\n" +
    "    <p>This action cannot be undone! Are you absolutely sure?</p>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\" style=\"float:left;\">Cancel</button>\n" +
    "    <button class=\"btn btn-danger btn-sm\" ng-click=\"deleteForever()\" style=\"margin-left:20px; margin-right:20px;\">Delete</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/detail/workspace.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/detail/workspace.tpl.html",
    "<div>\n" +
    "  <div class=\"container-fluid\">\n" +
    "    <h3 class=\"section-title\">\n" +
    "      <a ng-click=\"go('workspace.maps.main')\">\n" +
    "        <i class=\"icon-lg icon-folder-open\"></i>\n" +
    "        {{ workspace }}\n" +
    "      </a>\n" +
    "      <span class=\"workspace-buttons\">\n" +
    "        <span class=\"divider\"></span>\n" +
    "        <a class=\"newmap\" ng-click=\"createMap();\">\n" +
    "          <i class=\"icon-plus icon\"></i> <span class=\"text\">New Map</span>\n" +
    "        </a>\n" +
    "        <span class=\"divider\"></span>\n" +
    "        <a class=\"import\" ng-click=\"importData();\">\n" +
    "          <i class=\"fa fa-share icon\"></i> <span class=\"text\">Add Data</span>\n" +
    "        </a>\n" +
    "        <span class=\"divider\"></span>\n" +
    "        <a class=\"settings\" ng-click=\"workspaceSettings();\">\n" +
    "          <i class=\"fa fa-gear icon\"></i> <span class=\"text\">Settings</span>\n" +
    "        </a>\n" +
    "      </span>\n" +
    "    </h3>\n" +
    "    <tabset class=\"maps-data-tabs\">\n" +
    "      <tab ng-repeat=\"t in tabs\" select=\"selectTab(t)\" active=\"t.active\">\n" +
    "        <tab-heading>\n" +
    "          <i ng-class=\"t.icon\" class=\"tab-icon\"></i> {{ t.heading }}\n" +
    "        </tab-heading>\n" +
    "      </tab>\n" +
    "     </tabset>\n" +
    "     <div ui-view></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/list.tpl.html",
    "<div class=\"container-fluid\">\n" +
    "  <h3 class=\"page-title\">{{title}}</h3>\n" +
    "  <div class=\"page-content workspaces-list-inner\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <div class=\"workspaces-count-sort\">\n" +
    "          <div class=\"workspaces-count\">\n" +
    "            <strong>{{ workspaces.length }} project workspace<span ng-if=\"workspaces.length==0 || workspaces.length>1\">s</span></strong>\n" +
    "          </div>\n" +
    "          <div class=\"pull-right\">\n" +
    "            <div class=\"sort-by\">\n" +
    "              <span class=\"sort-label\">Sort by:</span>\n" +
    "              <span class=\"dropdown\" on-toggle=\"toggled(open)\" dropdown>\n" +
    "                <a href class=\"dropdown-toggle\" ng-init=\"last='name'\" dropdown-toggle>\n" +
    "                {{ last | firstCaps }} <i class=\"fa fa-caret-down\"></i>\n" +
    "                </a>\n" +
    "                <ul class=\"dropdown-menu\">\n" +
    "                  <li><a class=\"sort-options\" ng-click=\"predicate='name'; reverse = (last=='name')? !reverse : reverse; last='name';\">Name</a></li>\n" +
    "                  <li><a class=\"sort-options\" ng-click=\"predicate='modified.timestamp'; reverse = (last=='modified')? !reverse : reverse; last='modified';\">Modified</a></li>\n" +
    "                </ul>\n" +
    "              </span>\n" +
    "            </div>\n" +
    "            <div class=\"filter-box\">\n" +
    "              <input type=\"text\" class=\"form-control input-sm grid-filter\" ng-model=\"filterText\" placeholder=\"Filter workspaces by...\" size=\"30\" />\n" +
    "              <i class=\"fa fa-search\"></i>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-3\">\n" +
    "        <div class=\"panel panel-default single-workspace-info\" ng-show=\"selected.showInfo\">\n" +
    "          <p>\n" +
    "            <span style=\"font-size: 1.1em;margin-right: 10px;\">{{ selected.workspaceInfo.name }}</span>\n" +
    "             {{ selected.workspaceInfo.maps }} Map<span ng-if=\"selected.workspaceInfo.maps==0 || selected.workspaceInfo.maps>1\">s</span>, {{ selected.workspaceInfo.layers }} Layer<span ng-if=\"selected.workspaceInfo.layers==0 || selected.workspaceInfo.layers>1\">s</span>, {{ selected.workspaceInfo.stores }} Store<span ng-if=\"selected.workspaceInfo.stores==0 || selected.workspaceInfo.stores>1\">s</span>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <div class=\"workspaces-summary\">\n" +
    "          <div class=\"row\" ng-init=\"predicate='modified.timestamp'\" ng-repeat=\"row in workspaces | orderBy:predicate:reverse | filter:filterText | partition:3\">\n" +
    "            <div class=\"col-sm-4\" ng-repeat=\"workspace in row\">\n" +
    "              <span class=\"workspace-summary-detail\">\n" +
    "                <div class=\"workspace-icon\" ng-mouseover=\"mouse=true\" ng-mouseleave=\"mouse=false\" ng-init=\"mouse=false\">\n" +
    "                  <a ng-click=\"onWorkspaceClick(workspace)\" class=\"no-underline\"><i class=\"icon-folder\"></i></a>\n" +
    "                  <div class=\"workspace-details in-folder\" ng-show=\"mouse\">\n" +
    "                    <span class=\"view\" ng-click=\"onWorkspaceClick(workspace)\"></span>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "                <div class=\"workspace-info\">\n" +
    "                  <div class=\"inline\">\n" +
    "                    <h4 class=\"workspace-name inline\">{{ workspace.name }}</h4>\n" +
    "                  </div>\n" +
    "                  <div class=\"workspace-default\" ng-if=\"workspace.default\" pop=\"{{ defaultDesc }}\" pop-show=\"{{ showDefaultDesc }}\" pop-placement=\"bottom\" ng-click=\"showDefaultDesc=!showDefaultDesc;\">\n" +
    "                      <i class=\"icon-star\"></i> Default</div>\n" +
    "                  <div class=\"workspace-default-spacer\" ng-if=\"!workspace.default\"> </div>\n" +
    "                  <div class=\"modified\" ng-if=\"workspace.modified\"><i class=\"icon-clock\"></i> Modified <strong>{{ workspace.modified.pretty }}</strong></div>\n" +
    "                  <div class=\"btn-group workspace-links\">\n" +
    "                    <button class=\"btn btn-default btn-sm workspace-settings link\" ng-click=\"workspaceSettings(workspace);\"><i class=\"fa fa-gear\" title=\"Edit Workspace Settings\"></i> Settings</button>\n" +
    "                    <button class=\"btn btn-default btn-sm workspace-view link\" ng-init=\"showInfo=false\" ng-click=\"onWorkspaceInfo(workspace);\"><i class=\"icon-info\"></i> Info</button>\n" +
    "                    <button ng-click=\"deleteWorkspace(workspace)\" class=\"btn btn-default btn-sm link\"><i class=\"icon-remove\"></i> Delete</button>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "                \n" +
    "              </span>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"workspaces.length==0\">\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-sm-6\">\n" +
    "              <a ng-click=\"createMap();\">\n" +
    "                <div class=\"new-map-box\">New Map\n" +
    "                  <div class=\"plus\">+ <i class=\"icon-map\"></i></div>\n" +
    "                </div>\n" +
    "              </a>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/workspaces/workspaces.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/workspaces/workspaces.tpl.html",
    "<div ui-view></div>\n" +
    "");
}]);
angular.module("gsApp").requires.push("gsApp.templates");
