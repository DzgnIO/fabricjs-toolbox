App = function () {

    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);
    paper.setup(canvas);

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