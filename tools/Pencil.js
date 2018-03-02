(function () {

    var MIN_PATH_CLOSE = 5;

    var path;
    var totalDelta;
    var lastEvent;

    function simplifyPath () {
        var smoothing = PaperToolbox.getOption('strokeSmoothing');
        if(smoothing > 0) {
            path.simplify(path.strokeWidth * smoothing);
        }
        path.join(path, MIN_PATH_CLOSE);
    }

    var tool = new PaperToolbox.Tool({
        name: 'Pencil',
        icon: 'pencil.svg',
        onMouseDown : function (e) {
            console.log('onMouseDown')
            if (!path) {
                path = new paper.Path({
                    strokeColor: PaperToolbox.getOption('strokeColor'),
                    strokeCap: PaperToolbox.getOption('strokeCap'),
                    strokeWidth: PaperToolbox.getOption('strokeWidth'),
                });
                console.log(path)
            }

            path.add(e.point);
        },
        onDoubleClick : function (e) {

        },
        onMouseMove : function (e) {
            
        },
        onMouseDrag : function (e) {
            if(!totalDelta) {
                totalDelta = e.delta;
            } else {
                totalDelta.x += e.delta.x;
                totalDelta.y += e.delta.y;
            }

            if (totalDelta.length > 2) {

                totalDelta.x = 0;
                totalDelta.y = 0;

                path.add(e.point)
                path.smooth();
                lastEvent = e;

            }
        },
        onMouseUp : function (e) {
            if (path) {

                path.add(e.point)
                
                if(path.segments.length > 2) {
                    path.smooth();
                    simplifyPath();
                }

                path = null;
            }
        },
        onSelected : function (e) {

        },
        onDeselected : function (e) {

        },
    });
    PaperToolbox.addTool(tool);

})();