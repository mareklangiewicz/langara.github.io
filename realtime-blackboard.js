//TODO: test under IE (read: https://developers.google.com/drive/realtime/application?hl=pl at the bottom)
//TODO: token refresh

$.rtbb = {};

$.rtbb.CLIENT_ID = '1068940960337.apps.googleusercontent.com';

$.rtbb.SCOPES = [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/drive.install',
          'openid'
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
        var str = model.createString('Napisz cos!');
        var rtlogger = model.createList();
        model.getRoot().set('strboard', str);
        model.getRoot().set('rtlogger', rtlogger);
    };

    var loaded = function(doc) {
        var str = doc.getModel().getRoot().get('strboard');
        var rtlogger = doc.getModel().getRoot().get('rtlogger');
        gapi.drive.realtime.databinding.bindString(str, jqText.get(0));
        jqText.removeAttr("disabled");
        
        if(!opt_jqUndo && !opt_jqRedo)
            return;
            
        // Add logic for undo button.
        var model = doc.getModel();
        if(opt_jqUndo) opt_jqUndo.click(function(e) { model.undo(); });
        if(opt_jqRedo) opt_jqRedo.click(function(e) { model.redo(); });

        var onUndoRedoStateChanged = function(e) {
            if(opt_jqUndo) opt_jqUndo.attr("disabled", !e.canUndo);
            if(opt_jqRedo) opt_jqRedo.attr("disabled", !e.canRedo);
        };
        model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, onUndoRedoStateChanged);
    };

    gapi.drive.realtime.load(rtbbFileId, loaded, initialize);
};

