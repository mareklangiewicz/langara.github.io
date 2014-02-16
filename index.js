
$.RTBB_DEF_FILE_ID = "0B1u6KUOJMRI5XzkzQzdnUFA4cDg";
$(document).ready(onDocumentReady);
$(window).load(onWindowLoad);


function onDocumentReady() {
    $("#authorizeButton").prop("disabled", true);
    //$("#authorizeButton").click(onAuthorizeButtonClick);    
}

function onAuthorizeButtonClick() {
    $.rtbb.authorize(onRtbbAuthSuccess, onRtbbAuthFailure);
}

function onWindowLoad() {
    $.rtbb.init(onRtbbInitialized); //TODO: not sure if it can be moved to onDocumentReady safely..
}

function onRtbbInitialized() {
    //$.rtbb.authorize(onRtbbAuthSuccess, onRtbbAuthFailure);
    $("#authorizeButton").prop("disabled", false);
}

function onRtbbAuthFailure() {
    $("#authorizeButton").prop("disabled", false);
}

function onRtbbAuthSuccess() {
    $("#authorizeButton").prop("disabled", true);
    
    //$.rtbb.create("blackboard.bb", onRtbbFileCreated);
    $.rtbb.bind($.RTBB_DEF_FILE_ID, $("#blackboard"), $("#logger"), $("#undoButton"), $("#redoButton"));
}

function onRtbbFileCreated(file) {
    console.log("created:", file)
    $.rtbb.bind(file.id, $("#blackboard"), $("#logger"), $("#undoButton"), $("#redoButton"));
}












