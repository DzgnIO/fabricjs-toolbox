PaperToolbox = (function () {

    var self = {};

    self.CONSTS = {
        DEFAULT_OPTIONS: {
            strokeWidth: 3,
            strokeColor: '#000000',
            strokeCap: 'round',
            strokeSmoothing: 0.5,
        },
        TOOLBOX_CLASS: 'papertoolbox_toolbox',
        TOOL_ICON_CLASS: 'papertoolbox_tool-icon',
        TOOL_ICON_ACTIVE_CLASS: 'papertoolbox_tool-icon-active',
    }

    var tools = {};
    var options = getDefaultOptions();
    var view;

    var activeTool = null;
    var noToolsAdded = true;

    /*
     * Example usage:
     *
     */
    function addTool (tool) {
        if(tools[tool.name]) console.error('Warning: duplicate tool named ' + tool.name + '!')

        tools[tool.name] = tool;
        if(noToolsAdded) {
            activateTool(tool.name);
            noToolsAdded = false;
        }

        if(view) view.reflectChanges(self);
    }

    /*
     * Example usage:
     *
     */
    function activateTool (name) {
        var tool = getTool(name);
        if(!tool) throw Error('Tool ' + name + ' does not exist!');

        if(activeTool) activeTool.onDeselected();
        activeTool = tool;
        activeTool.onSelected();
        activeTool._paperTool.activate();

        if(view) view.reflectChanges(self);
    }

    /*
     * Example usage:
     *
     */
    function getTool (name) {
        return tools[name];
    }

    /*
     * Example usage:
     *
     */
    function getAllTools () {
        var allTools = [];

        for (name in tools) {
            allTools.push(tools[name]);
        }

        return allTools;
    }

    /*
     * Example usage:
     *
     */
    function getActiveTool (name) {
        return activeTool;
    }

    /*
     * Example usage:
     *
     */
    function getDefaultOptions () {
        return JSON.parse(JSON.stringify(self.CONSTS.DEFAULT_OPTIONS));
    }

    /*
     * Example usage:
     *
     */
    function setDefaultOptions () {
        options = getDefaultOptions();
    }

    /*
     * Example usage:
     *
     */
    function getOption (name) {
        return options[name];
    }

    /*
     * Example usage:
     *
     */
    function setOption (name, val) {
        options[name] = val;

        if(view) view.reflectChanges(self);
    }

    /*
     * Example usage:
     *
     */
    function createView (container) {
        view = new PaperToolbox.ToolboxView(container);
        view.reflectChanges(self);
    }

    self.addTool = addTool;
    self.activateTool = activateTool;
    self.getTool = getTool;
    self.getAllTools = getAllTools;
    self.getActiveTool = getActiveTool;
    self.getOption = getOption;
    self.setOption = setOption;
    self.setDefaultOptions = setDefaultOptions;
    self.createView = createView;
    return self;

})();

PaperToolbox.Tool = function (args) {

    var paperTool = new paper.Tool();
    paperTool.onMouseMove = args.onMouseMove;
    paperTool.onMouseDown = args.onMouseDown;
    paperTool.onDoubleClick = args.onDoubleClick;
    paperTool.onMouseDrag = args.onMouseDrag;
    paperTool.onMouseUp = args.onMouseUp;
    this._paperTool = paperTool;

    this.name = args.name;
    this.onSelected = args.onSelected;
    this.onDeselected = args.onDeselected;

}

PaperToolbox.ToolboxView = function (container) {

    var self = this;

    var viewDiv = document.createElement('div');
    viewDiv.className = PaperToolbox.CONSTS.TOOLBOX_CLASS;
    container.appendChild(viewDiv);

    var toolIcons = {};

    /*
     * Example usage:
     *
     */
    function reflectChanges (toolbox) {
        rebuildToolIcons(toolbox);

        for (name in toolIcons) {
            toolIcons[name].reflectChanges(toolbox);
        }
    }

    /*
     * Example usage:
     *
     */
    function rebuildToolIcons (toolbox) {
        toolbox.getAllTools().forEach(function (tool) {
            if(!toolIcons[tool.name]) {
                toolIcons[tool.name] = new PaperToolbox.ToolIconView(viewDiv, tool);
            }
        });
    }



    self.reflectChanges = reflectChanges;

}

PaperToolbox.ToolIconView = function (container, tool) {

    var self = this;

    var viewDiv = document.createElement('div');
    viewDiv.className = PaperToolbox.CONSTS.TOOL_ICON_CLASS;
    viewDiv.onclick = function (e) {
        PaperToolbox.activateTool(tool.name);
    }

    container.appendChild(viewDiv);

    /*
     * Example usage:
     *
     */
    function reflectChanges (toolbox) {
        viewDiv.className = PaperToolbox.CONSTS.TOOL_ICON_CLASS;
        if (toolbox.getActiveTool() === tool) {
            viewDiv.className += ' ' + PaperToolbox.CONSTS.TOOL_ICON_ACTIVE_CLASS;
        }
    }

    self.reflectChanges = reflectChanges;

    return self;

}
