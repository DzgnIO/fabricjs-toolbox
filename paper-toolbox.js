PaperToolbox = (function () {

    var self = {};

    var DEFAULT_OPTIONS = {
        strokeWidth: 1,
        strokeColor: '#000000',
        strokeCap: 'round',
        strokeSmoothing: 0.5,
    }

    var tools = {};
    var options = getDefaultOptions();
    var activeTool = null;
    var noToolsAdded = true;

    /*
     * Example usage:
     *
     */
    function addTool (tool) {
        tools[tool.name] = tool;
        if(noToolsAdded) {
            activateTool(tool.name);
            noToolsAdded = false;
        }
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

        console.log(activeTool)
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
    function getActiveTool (name) {
        return activeTool;
    }

    /*
     * Example usage:
     *
     */
    function getDefaultOptions () {
        return JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
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
    }

    self.addTool = addTool;
    self.activateTool = activateTool;
    self.getTool = getTool;
    self.getActiveTool = getActiveTool;
    self.getOption = getOption;
    self.setOption = setOption;
    self.setDefaultOptions = setDefaultOptions;
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
