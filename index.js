
$.RTBB_DEF_FILE_ID = "0B1u6KUOJMRI5YkRNNnZMOGpIOGs";

$(document).ready(onDocumentReady);
$(window).load(onWindowLoad);


function onDocumentReady() {
    $("#authorizeButton")
        .attr("disabled", "true")
        .click(onAuthorizeButtonClick);    
}

function onAuthorizeButtonClick() {
    $.rtbb.authorize(onRtbbAuthSuccess, onRtbbAuthFailure);
}

function onWindowLoad() {
    $.rtbb.init(onRtbbInitialized); //TODO: not sure if it can be moved to onDocumentReady safely..
}

function onRtbbInitialized() {
    $.rtbb.authorize(onRtbbAuthSuccess, onRtbbAuthFailure);
}

function onRtbbAuthFailure() {
    $("#authorizeButton").removeAttr("disabled");
}

function onRtbbAuthSuccess() {
    $("#authorizeButton").attr("disabled", "true");
    
    //$.rtbb.create("blackboard.bb", onRtbbFileCreated);
    $.rtbb.bind($.RTBB_DEF_FILE_ID, $("#blackboard"), $("#undoButton"), $("#redoButton"));
}

function onRtbbFileCreated(file) {
    console.log("created:", file)
    $.rtbb.bind(file.id, $("#blackboard"), $("#undoButton"), $("#redoButton"));
}












