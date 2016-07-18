/* global $ */
(function(exports){

var screen = $('<div></div>').css({
    position:"fixed",
    backgroundColor:"#999",
    width:"100%",
    height:"100%",
    left:0,
    top:0,
    opacity:0.5,
    filter:"alpha(opacity=50)",
    zIndex:10,
    display:"none"
});

var dialog = $('<div id="modal-dialog-outer-pane"></div>').css({
    position:"absolute",
    left:"100px",
    top:"50px",
    padding:"10px",
    border:"2px solid gray",
    backgroundColor:"white",
    opacity:1.0,
    filter:"alpha(opacity=100)",
    zIndex:20,
    overflow: "auto"
});
var header = $("<table width='100%' cellpadding='0' cellspacing='0'><tr>" +
    "<td width='*'></td><td width='auto'></td></tr></table>").css({
        margin:0,
        padding:0
    });
dialog.append(header);
var handle = $('<div></div>');
var title = $("<div></div>").css({
    cursor:"move",
    backgroundColor:"#ccc",
    fontWeight:"bold",
    padding:"6px 4px 4px 4px"
});
handle.append(title);
$(header.find("td")[0]).append(handle);
var closeBox = $("<a href='javascript:void(0)'>×</a>").css({
    fontSize:"13px",
    fontWeight:"bold",
    margin:"4px 0 4px 4px",
    padding:0,
    textDecoration:"none",
    color:"#333"
});
$(header.find("td")[1]).css({
    width:"16px",
    verticalAlign:"middle"
}).append(closeBox);
var content = $("<div></div>").css({
    marginTop:"10px"
});
dialog.append(content);

$("body").append(screen);

handle.on("mousedown", function(event){
    event.preventDefault();
    var offset = dialog.offset();
    var origEvent = event.originalEvent;
    var innerX = origEvent.pageX - offset.left;
    var innerY = origEvent.pageY - offset.top;
    dialog.data({innerX: innerX, innerY: innerY, width: dialog.outerWidth(), height: dialog.outerHeight()});
    handle.on("mousemove", function(event){
        event.preventDefault();
        var origEvent = event.originalEvent;
        var newLeft = origEvent.pageX - dialog.data("innerX");
        if( newLeft < 0 ){
            return;
        }
        var newTop = origEvent.pageY - dialog.data("innerY");
        if( newTop < 0 ){
            return;
        }
        var newRight = newLeft + dialog.data("width");
        if( newRight > screen.innerWidth() ){
            return;
        }
        var newBottom = newTop + dialog.data("height");
        if( newBottom > screen.innerHeight() ){
            return;
        }
        dialog.css({left: newLeft, top: newTop})
    })
    handle[0].setCapture();
})

handle.on("mouseup", function(event){
    handle.off("mousemove");
})

function reposition() {
    var screen_width = $(window).width();
    var screen_height = $(window).height();
    var dialog_width = dialog.outerWidth();
    dialog.css("left", (screen_width - dialog_width) / 2 + "px");
    dialog.css("max-height", (screen_height - 100) + "px");
}

exports.start = function(title_str, onOpen, onClose){
    title.text(title_str);
    content.html("");
    onOpen(content[0]);
    closeBox.on("click", function(event){ onClose(content[0]); });
    screen.show();
    dialog.hide();
    $("body").append(dialog);
    reposition();
    dialog.show();
};

exports.stop = function(){
    closeBox.off("click");
    dialog.detach();
    screen.hide();
}

})(window.modal = {});