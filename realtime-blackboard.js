//TODO: test under IE (read: https://developers.google.com/drive/realtime/application?hl=pl at the bottom)
//TODO: token refresh

$.rtbb = {};

$.rtbb.CLIENT_ID = '1068940960337.apps.googleusercontent.com';

$.rtbb.SCOPES = [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/userinfo.email',
          //'https://www.googleapis.com/auth/userinfo.profile',
          //'https://www.googleapis.com/auth/drive.install',
          'openid' //FIXME: po co to openid????
        ];
        
$.rtbb.MIMETYPE = 'application/vnd.google-apps.drive-sdk';        
        
$.rtbb.immediateAuth = true; // it will be changed to false if authorization fail.

$.rtbb.init = function(callback) {
    gapi.load("auth:client,drive-realtime,drive-share", callback);
};

$.rtbb.authorize = function(success, failure) {
    gapi.auth.authorize(
        {
            'client_id': $.rtbb.CLIENT_ID,
            'scope': $.rtbb.SCOPES.join(' '),
            'immediate': $.rtbb.immediateAuth
        },
        function(authResult) {
            if(!authResult || authResult.error) {
                $.rtbb.immediateAuth = false;
                console.log("Authorization failed. result:", authResult);
                failure();
                return;
            }
            console.log("Authorization succeeded. result:", authResult);
            success(authResult);            
        }
    );
};

/**
 * Creates a new blackboard file.
 * @param title {string} title of the newly created file.
 * @param callback {Function} the callback to call after creation.
 */
$.rtbb.create = function(title, callback) {
  gapi.client.load('drive', 'v2', function() {
    gapi.client.drive.files.insert({
      resource: {
        mimeType: $.rtbb.MIMETYPE,
        title: title
      }
    }).execute(callback);
  });
};

/**
 * Binds GUI element to given drive file (blackboard file).
 * @param {string} rtbbFileId id of a drive file to bind.
 * @param {!Object} jqText jQuery object with textArea element to bind.
 * @param {!Object} jqLogger jQuery object with textArea element to display a logging information.
 * @param {!Object=} opt_jqUndo Optional jQuery object that holds an undo button
 * @param {!Object=} opt_jqRedo Optional jQuery object that holds a redo button
 */
$.rtbb.bind = function(rtbbFileId, jqText, jqLogger, opt_jqUndo, opt_jqRedo) {

    var initialize = function(model) {
        var strboard = model.createString('Napisz cos!');
        var rtlogger = model.createList();
        model.getRoot().set('strboard', strboard);
        model.getRoot().set('rtlogger', rtlogger);
    };

    var loaded = function(doc) {

        var root = doc.getModel().getRoot();
        var strboard = root.get('strboard');
        var rtlogger = root.get('rtlogger');


        var updateText = function(e) {
            console.log("updateText:", e);
            jqText.val(strboard);
        };
        strboard.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, updateText);
        strboard.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, updateText);
        jqText.keyup(function(e) {
            console.log("jqText.keyup:", e);
            strboard.setText(jqText.val());
        });
        updateText();

        jqText.prop("disabled", false);

        var updateLogger = function(e) {
            console.log("updateLogger:", e);
        };

        rtlogger.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, updateLogger);
        rtlogger.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, updateLogger);
        rtlogger.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, updateLogger);
        
        if(!opt_jqUndo && !opt_jqRedo)
            return;
            
        // Add logic for undo button.
        var model = doc.getModel();
        if(opt_jqUndo) opt_jqUndo.click(function(e) { model.undo(); });
        if(opt_jqRedo) opt_jqRedo.click(function(e) { model.redo(); });

        var onUndoRedoStateChanged = function(e) {
            if(opt_jqUndo) { opt_jqUndo.prop("disabled", !e.canUndo); }
            if(opt_jqRedo) { opt_jqRedo.prop("disabled", !e.canRedo); }
        };
        model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, onUndoRedoStateChanged);
    };

    gapi.drive.realtime.load(rtbbFileId, loaded, initialize);
};


