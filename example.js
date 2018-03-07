App = function () {

    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);
    paper.setup(canvas);

    paper._mainLayer = new paper.Layer();
    paper._guiLayer = new paper.Layer();
    paper._guiLayer.locked = true;
    paper._mainLayer.activate();

    var toolboxContainer = document.createElement('div');
    document.body.appendChild(toolboxContainer);
    PaperToolbox.createView(toolboxContainer);

    window.addEventListener('resize', function () {
        fitCanvasToScreen();
    });
    fitCanvasToScreen();

    function fitCanvasToScreen () {
        canvas.style.width  = window.innerWidth+'px';
        canvas.style.height = window.innerHeight+'px';
        paper.view.viewSize.width  = window.innerWidth;
        paper.view.viewSize.height = window.innerHeight;
    }

}