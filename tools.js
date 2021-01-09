var tooltip = document.getElementById("tooltip");
var tooltip_x = document.getElementById("tooltip_x");
var tooltip_y = document.getElementById("tooltip_y");
var container = document.getElementsByClassName("blocks-container")[0];
var last_x = -1;
var last_y = -1;
var blocks = [];

var width = 16384;
var height = 16384;

function stopWheelZoom(event) {
    if (event.ctrlKey == true) {
        event.preventDefault();
    }
}

function stopKeyZoom(event) {
    if (event.ctrlKey && [48, 61, 96, 107, 109, 187, 189].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
}

function onMouseMove(e) {
    if (e.pageX > 0 && e.pageX < width && e.pageY > 0 && e.pageY < height) {

        if(e.pageX < width - 256) {
            tooltip.style.left = (e.clientX + 8) + "px";
        } else {
            tooltip.style.left = (e.clientX - 138) + "px";
        }

        if(e.pageY < height - 256) {
            tooltip.style.top = (e.clientY - 10) + "px";
        } else {
            tooltip.style.top = (e.clientY - 25) + "px";
        }

        var block_x = Math.floor(e.pageX / 64);
        var block_y = Math.floor(e.pageY / 64);

        if(block_x != last_x || block_y != last_y)
        {
            createBlockAtPosition(block_x, block_y);
            tooltip.style.display = "block";
            var text_x = x[block_x];
            var text_y = y[block_y];
            tooltip_x.innerText = text_x;
            tooltip_y.innerText = text_y;
            
            // tooltip_x.innerText = block_x;
            // tooltip_y.innerText = block_y;

            last_x = block_x;
            last_y = block_y;
        }    
    } else {
        tooltip.style.display = "none";
        last_x = -1;
        last_y = -1;
    }
}

function createBlockAtPosition(x, y)
{
    var blockNode = document.createElement("div");
    blockNode.classList.add("block");
    blockNode.style.left = (x * 64) + "px";
    blockNode.style.top = (y * 64) + "px";
    container.append(blockNode);
    blocks.push({
        node: blockNode,
        x: x,
        y: y
    });
}

function hasBlockAtPosition(x, y) {
    
    blocks.forEach(block => {
        if(block.x == x && block.y == y) return true;
    });

    return false;
}

function removeTransparentBlocks() {
    for (let i = blocks.length - 1; i >= 0; i--) {
        if(window.getComputedStyle(blocks[i].node).opacity <= 0.01)
        {
            blocks[i].node.remove();
            blocks.splice(i, 1);
        }
    }
}

function update()
{
    removeTransparentBlocks();
    setTimeout(update, 100);
}

function onMouseOut(e) {
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
        tooltip.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    update();
});

document.addEventListener("keydown", stopKeyZoom);
document.addEventListener('mousewheel', stopWheelZoom);
document.addEventListener('DOMMouseScroll', stopWheelZoom);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseout', onMouseOut);