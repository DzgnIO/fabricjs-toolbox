(function () {

    var selectedObjects = [];

    var GUI_DOTS_SIZE = 5;
    var GUI_DOTS_FILLCOLOR = 'rgba(255,255,255,0.3)';
    var GUI_DOTS_STROKECOLOR = 'rgba(100,150,255,1.0)'
    var HIDDEN_ROTATE_HANDLE_COLOR = 'rgba(0,0,0,0.0001)'
    var ROTATE_HANDLE_LENGTH = 20;

    var makingSelectionSquare = false;
    var selectionSquare = null;
    var selectionSquareTopLeft;
    var selectionSquareBottomRight;

    var selectionRect;
    var selectionBoundsRect;
    var scaleBR;
    var scaleTR;
    var scaleTL;
    var scaleBL;
    var scaleT;
    var scaleB;
    var scaleL;
    var scaleR;
    var rotateTL;
    var rotateTR;
    var rotateBL;
    var rotateBR;
    var individualObjectBoxes;

    var hitResult;
    var addedPoint;

    var lastEvent;
    var transformMode;

    var hitOptions = {
        allowGroups: true,
        segments: false,
        fill: true,
        curves: true,
        handles: false,
        stroke: true,
    }

    function updateSelection () {
        paper.settings.handleSize = 10;
        paper.project.activeLayer.children.forEach(function (child) {
            if(isObjectSelected(child)) {
                if(!selectionBoundsRect) {
                    selectionBoundsRect = child.bounds.clone()
                } else {
                    selectionBoundsRect = selectionBoundsRect.unite(child.bounds);
                }
            }
        });

        selectionBoundsRect = null;

        paper.project.activeLayer.children.forEach(function (child) {
            if(isObjectSelected(child)) {
                if(!selectionBoundsRect) {
                    selectionBoundsRect = child.bounds.clone()
                } else {
                    selectionBoundsRect = selectionBoundsRect.unite(child.bounds);
                }
            }
        });

        if(selectionRect) selectionRect.remove();
        if(scaleBR) scaleBR.remove();
        if(scaleBL) scaleBL.remove();
        if(scaleTL) scaleTL.remove();
        if(scaleTR) scaleTR.remove();
        if(scaleT) scaleT.remove();
        if(scaleB) scaleB.remove();
        if(scaleL) scaleL.remove();
        if(scaleR) scaleR.remove();
        if(rotateTL) rotateTL.remove();
        if(rotateTR) rotateTR.remove();
        if(rotateBL) rotateBL.remove();
        if(rotateBR) rotateBR.remove();
        if(individualObjectBoxes) {
            individualObjectBoxes.forEach(function (o) {
                o.remove();
            })
        }

        if(selectionBoundsRect) {
            //selectionBoundsRect = selectionBoundsRect.expand(10);
            var strokeWidth = 1;

            selectionRect = new paper.Path.Rectangle(selectionBoundsRect);
            selectionRect.strokeColor = GUI_DOTS_STROKECOLOR;
            selectionRect.strokeWidth = strokeWidth;
            selectionRect._wickInteraction = 'selectionRect';
            selectionRect.locked = true;

            var dotSize = GUI_DOTS_SIZE;

            individualObjectBoxes = [];
            //var selectedObjs = wickEditor.project.getSelectedObjectsByType(WickObject)
            if(selectedObjects.length > 1) {
                console.log(selectedObjects.length)
                selectedObjects.forEach(function (o) {
                    var oRect = new paper.Rectangle(o.bounds);
                    var oPaperRect = new paper.Path.Rectangle(oRect);
                    oPaperRect.strokeWidth = strokeWidth;
                    oPaperRect.strokeColor = GUI_DOTS_STROKECOLOR;
                    oPaperRect._wickInteraction = 'individualObjectBox';
                    individualObjectBoxes.push(oPaperRect);
                });
            }

            var rotateHandleLength = ROTATE_HANDLE_LENGTH;

            rotateTL = new paper.Path.Rectangle(selectionBoundsRect.topLeft.add(0,-rotateHandleLength), selectionBoundsRect.topRight)
            rotateTL.fillColor = HIDDEN_ROTATE_HANDLE_COLOR;
            rotateTL._wickInteraction = 'rotate';
            rotateTL._cursor = 'url("resources/cursor-rotate.png") 32 32,default';

            rotateTR = new paper.Path.Rectangle(selectionBoundsRect.topRight.add(rotateHandleLength,0), selectionBoundsRect.bottomRight)
            rotateTR.fillColor = HIDDEN_ROTATE_HANDLE_COLOR;
            rotateTR._wickInteraction = 'rotate';
            rotateTR._cursor = 'url("resources/cursor-rotate.png") 32 32,default';

            rotateBL = new paper.Path.Rectangle(selectionBoundsRect.bottomLeft.add(0,rotateHandleLength), selectionBoundsRect.bottomRight)
            rotateBL.fillColor = HIDDEN_ROTATE_HANDLE_COLOR;
            rotateBL._wickInteraction = 'rotate';
            rotateBL._cursor = 'url("resources/cursor-rotate.png") 32 32,default';

            rotateBR = new paper.Path.Rectangle(selectionBoundsRect.topLeft.add(-rotateHandleLength,0), selectionBoundsRect.bottomLeft)
            rotateBR.fillColor = HIDDEN_ROTATE_HANDLE_COLOR;
            rotateBR._wickInteraction = 'rotate';
            rotateBR._cursor = 'url("resources/cursor-rotate.png") 32 32,default';

            scaleBR = new paper.Path.Circle(selectionBoundsRect.bottomRight, dotSize);
            scaleBR.fillColor = GUI_DOTS_FILLCOLOR;
            scaleBR.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleBR.strokeWidth = strokeWidth;
            scaleBR._wickInteraction = 'scaleBR';
            scaleBR._cursor = 'nwse-resize';

            scaleBL = new paper.Path.Circle(selectionBoundsRect.bottomLeft, dotSize);
            scaleBL.fillColor = GUI_DOTS_FILLCOLOR;
            scaleBL.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleBL.strokeWidth = strokeWidth;
            scaleBL._wickInteraction = 'scaleBL';
            scaleBL._cursor = 'nesw-resize';

            scaleTL = new paper.Path.Circle(selectionBoundsRect.topLeft, dotSize);
            scaleTL.fillColor = GUI_DOTS_FILLCOLOR;
            scaleTL.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleTL.strokeWidth = strokeWidth;
            scaleTL._wickInteraction = 'scaleTL';
            scaleTL._cursor = 'nwse-resize';

            scaleTR = new paper.Path.Circle(selectionBoundsRect.topRight, dotSize);
            scaleTR.fillColor = GUI_DOTS_FILLCOLOR;
            scaleTR.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleTR.strokeWidth = strokeWidth;
            scaleTR._wickInteraction = 'scaleTR';
            scaleTR._cursor = 'nesw-resize';

            scaleT = new paper.Path.Circle(selectionBoundsRect.topCenter, dotSize);
            scaleT.fillColor = GUI_DOTS_FILLCOLOR;
            scaleT.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleT.strokeWidth = strokeWidth;
            scaleT._wickInteraction = 'scaleT';
            scaleT._cursor = 'ns-resize';

            scaleB = new paper.Path.Circle(selectionBoundsRect.bottomCenter, dotSize);
            scaleB.fillColor = GUI_DOTS_FILLCOLOR;
            scaleB.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleB.strokeWidth = strokeWidth;
            scaleB._wickInteraction = 'scaleB';
            scaleB._cursor = 'ns-resize';

            scaleL = new paper.Path.Circle(selectionBoundsRect.leftCenter, dotSize);
            scaleL.fillColor = GUI_DOTS_FILLCOLOR;
            scaleL.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleL.strokeWidth = strokeWidth;
            scaleL._wickInteraction = 'scaleL';
            scaleL._cursor = 'ew-resize';

            scaleR = new paper.Path.Circle(selectionBoundsRect.rightCenter, dotSize);
            scaleR.fillColor = GUI_DOTS_FILLCOLOR;
            scaleR.strokeColor = GUI_DOTS_STROKECOLOR;
            scaleR.strokeWidth = strokeWidth;
            scaleR._wickInteraction = 'scaleR';
            scaleR._cursor = 'ew-resize';
        }
    }

    function isObjectSelected (object) {
        return selectedObjects.indexOf(object) !== -1;
    }

    var tool = new PaperToolbox.Tool({
        name: 'Cursor',
        icon: 'cursor.svg',
        onMouseDown : function (e) {
            if(hitResult && hitResult.item && hitResult.item._wickInteraction) {
                transformMode = hitResult.item._wickInteraction
                return;
            }

            if(hitResult && !hitResult.item._wickInteraction) {

                selectedObjs = [];

                /*var wickObj = hitResult.item.wick || hitResult.item.parent.wick;
                if(wickObj) {
                    if(wickEditor.project.isObjectSelected(wickObj)) {
                        if(event.modifiers.shift) {
                            wickEditor.project.deselectObject(wickObj);
                        }
                    } else {
                        if(!event.modifiers.shift) {
                            wickEditor.project.clearSelection();
                        }
                        wickEditor.project.selectObject(wickObj);
                    }

                    var currObj = wickEditor.project.getCurrentObject();
                    currObj.currentLayer = currObj.layers.indexOf(wickObj.parentFrame.parentLayer);
                    wickEditor.syncInterfaces();
                }*/

            } else {
                /*if(!event.modifiers.shift && !wickEditor.colorPicker.isOpen()) {
                    wickEditor.project.clearSelection();
                }
                wickEditor.syncInterfaces();*/

                makingSelectionSquare = true;
                selectionSquareTopLeft = e.point;
                selectionSquareBottomRight = e.point
            }
        },
        onDoubleClick : function (e) {

        },
        onMouseMove : function (e) {
            updateSelection()

            hitResult = paper.project.hitTest(e.point, hitOptions);

            if(hitResult) {
                if(isObjectSelected(hitResult.item)) {
                    console.log(hitResult.item)
                }
            }
        },
        onMouseDrag : function (e) {
            if(transformMode === 'scaleBR') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeRatio = e.point.subtract(rect.topLeft);
                    if(resizeRatio.x < 1 || resizeRatio.y < 1) return;
                    resizeRatio.x /= rect.width;
                    resizeRatio.y /= rect.height;
                    o.scale(resizeRatio.x, resizeRatio.y, rect.topLeft);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'scaleTL') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeRatio = rect.bottomRight.subtract(e.point);
                    if(resizeRatio.x < 1 || resizeRatio.y < 1) return;
                    resizeRatio.x /= rect.width;
                    resizeRatio.y /= rect.height;
                    o.scale(resizeRatio.x, resizeRatio.y, rect.bottomRight);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'scaleBL') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeRatio = {
                        x: rect.topRight.x - e.point.x,
                        y: e.point.y - rect.topRight.y,
                    }
                    if(resizeRatio.x < 1 || resizeRatio.y < 1) return;
                    resizeRatio.x /= rect.width;
                    resizeRatio.y /= rect.height;
                    o.scale(resizeRatio.x, resizeRatio.y, rect.topRight);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'scaleTR') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeRatio = {
                        x: e.point.x - rect.bottomLeft.x,
                        y: rect.bottomLeft.y - e.point.y,
                    }
                    if(resizeRatio.x < 1 || resizeRatio.y < 1) return;
                    resizeRatio.x /= rect.width;
                    resizeRatio.y /= rect.height;
                    o.scale(resizeRatio.x, resizeRatio.y, rect.bottomLeft);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'scaleT') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeY = rect.bottomCenter.y - e.point.y
                    if(resizeY < 1) return;
                    resizeY /= rect.height;
                    o.scale(1, resizeY, rect.bottomCenter);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'scaleB') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeY = e.point.y - rect.topCenter.y
                    if(resizeY < 1) return;
                    resizeY /= rect.height;
                    o.scale(1, resizeY, rect.topCenter);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'scaleR') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeX = e.point.x - rect.leftCenter.x
                    if(resizeX < 1) return;
                    resizeX /= rect.width;
                    o.scale(resizeX, 1, rect.leftCenter);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'scaleL') {
                var rect = selectionBoundsRect
                selectedObjects.forEach(function (o) {
                    var resizeX = rect.rightCenter.x - e.point.x
                    if(resizeX < 1) return;
                    resizeX /= rect.width;
                    o.scale(resizeX, 1, rect.rightCenter);
                    updateSelection()
                });
                return;
            }
            if(transformMode === 'rotate') {
                var rect = selectionBoundsRect
                var pivot = rect.center;
                var oldAngle = e.lastPoint.subtract(pivot).angle;
                var newAngle = e.point.subtract(pivot).angle;
                var rotationAmount = newAngle-oldAngle;
                wickEditor.project.getSelectedObjectsByType(WickObject).forEach(function (o) {
                    o.rotate(rotationAmount, pivot);
                    //updateSelection()
                });
                selectionRect.rotate(rotationAmount, pivot);
                //rotate.rotate(rotationAmount, pivot);
                scaleBR.rotate(rotationAmount, pivot);
                scaleBL.rotate(rotationAmount, pivot);
                scaleTR.rotate(rotationAmount, pivot);
                scaleTL.rotate(rotationAmount, pivot);
                scaleT.rotate(rotationAmount, pivot);
                scaleB.rotate(rotationAmount, pivot);
                scaleL.rotate(rotationAmount, pivot);
                scaleR.rotate(rotationAmount, pivot);
                return;
            }

            if(makingSelectionSquare) {
                selectionSquareBottomRight = e.point;

                if(selectionSquare) {
                    selectionSquare.remove();
                }

                selectionSquare = new paper.Path.Rectangle(
                        new paper.Point(selectionSquareTopLeft.x, selectionSquareTopLeft.y), 
                        new paper.Point(selectionSquareBottomRight.x, selectionSquareBottomRight.y));
                selectionSquare.strokeColor = 'rgba(100,100,255,0.7)';
                selectionSquare.strokeWidth = 1;
                selectionSquare.fillColor = 'rgba(100,100,255,0.15)';
            } else {
                if(hitResult && hitResult.item) {
                    selectedObjects.forEach(function (o) {
                        o.paper.position = new paper.Point(
                            o.paper.position.x + e.delta.x,
                            o.paper.position.y + e.delta.y
                        );
                    });
                    updateSelection()
                }
            }
        },
        onMouseUp : function (e) {
            transformMode = null;

            if(makingSelectionSquare) {
                if(!selectionSquare) {
                    selectionSquare = null;
                    makingSelectionSquare = false;
                    return;
                }

                /*if(!e.modifiers.shift) {
                    wickEditor.project.clearSelection()
                }*/
                /*wickEditor.project.getCurrentObject().getAllActiveChildObjects().forEach(function (wickObject) {
                    if(!wickObject.paper) return;
                    if(wickObject.parentFrame.parentLayer.locked || wickObject.parentFrame.parentLayer.hidden) return;
                    if(selectionSquare.bounds.intersects(wickObject.paper.bounds)) {
                        if(selectionSquare.bounds.contains(wickObject.paper.bounds)
                        || (selectionSquare.intersects(wickObject.paper)) && !e.modifiers.alt) {
                            wickEditor.project.selectObject(wickObject)
                        }
                    }
                });*/
                paper.project.activeLayer.children.forEach(function (child) {
                    if(child._wickInteraction) return;
                    if(selectionSquare.bounds.intersects(child.bounds)) {
                        if(selectionSquare.bounds.contains(child.bounds)
                        || (selectionSquare.intersects(child)) && !e.modifiers.alt) {
                            selectedObjects.push(child);
                        }
                    }
                });
                //wickEditor.syncInterfaces()

                if(selectionSquare) {
                    selectionSquare.remove();
                }
                selectionSquare = null;
                makingSelectionSquare = false;

                updateSelection()
                return;
            }

            if(!hitResult) return;
            if(!hitResult.item) return;

            /*var objs = wickEditor.project.getSelectedObjectsByType(WickObject);
            var modifiedStates = [];
            objs.forEach(function (wickObject) {
                var parentAbsPos;
                if(wickObject.parentObject)
                    parentAbsPos = wickObject.parentObject.getAbsolutePosition();
                else 
                    parentAbsPos = {x:0,y:0};

                if(wickObject.isSymbol) {
                    modifiedStates.push({
                        rotation: wickObject.paper.rotation,
                        x: wickObject.paper.position.x - parentAbsPos.x,
                        y: wickObject.paper.position.y - parentAbsPos.y,
                        scaleX: wickObject.paper.scaling.x,
                        scaleY: wickObject.paper.scaling.y,
                    });
                } else if (wickObject.isPath) {
                    wickObject.paper.applyMatrix = true;

                    wickObject.rotation = 0;
                    wickObject.scaleX = 1;
                    wickObject.scaleY = 1;
                    wickObject.flipX = false;
                    wickObject.flipY = false;

                    modifiedStates.push({
                        x : wickObject.paper.position.x - parentAbsPos.x,
                        y : wickObject.paper.position.y - parentAbsPos.y,
                        svgX : wickObject.paper.bounds._x,
                        svgY : wickObject.paper.bounds._y,
                        width : wickObject.paper.bounds._width,
                        height : wickObject.paper.bounds._height,
                        pathData: wickObject.paper.exportSVG({asString:true}),
                    });
                } else if (wickObject.isImage) {
                    modifiedStates.push({
                        x : wickObject.paper.position.x - parentAbsPos.x,
                        y : wickObject.paper.position.y - parentAbsPos.y,
                        scaleX : wickObject.paper.scaling.x,
                        scaleY : wickObject.paper.scaling.y,
                        rotation : wickObject.paper.rotation,
                    })
                } else if (wickObject.isText) {
                    modifiedStates.push({
                        x : wickObject.paper.position.x - parentAbsPos.x,
                        y : wickObject.paper.position.y - parentAbsPos.y,
                        rotation : wickObject.paper.rotation,
                    });
                }
            });
            wickEditor.actionHandler.doAction('modifyObjects', {
                objs: objs,
                modifiedStates: modifiedStates
            });*/
        },
        onSelected : function (e) {

        },
        onDeselected : function (e) {

        },
    });
    PaperToolbox.addTool(tool);

})();