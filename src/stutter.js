(function (window) {
    'use strict';
    var Stutter = function (time, completedCallback, completedCallbackContext, data) {
        this._state = {
            data: data,
            id: undefined,
            time: time || 1000,
            complete: [],
            cancel: []
        };

        if (completedCallback !== undefined) {
            this.complete(completedCallback, completedCallbackContext);
        }

        return this;
    },
    pushCallback = function (collection, callback, context) {
        collection.push({ callback: callback, context: context });
    };

    Stutter.prototype.complete = function (callback, context) {
        pushCallback(this._state.complete, callback, context);
        return this;
    };

    Stutter.prototype.cancel = function (callback, context) {
        pushCallback(this._state.cancel, callback, context);
        return this;
    };

    Stutter.prototype.set = function (data) {
        var state = this._state,
        makeCallbacks = function (callbacks) {
            var i = 0, callback;
            for (i = 0; i < callbacks.length; i++) {
                callback = callbacks[i];
                data = data || state.data;
                if (typeof data === 'function') {
                    data = data();
                }
                callback.callback.apply(callback.context, [data]);
            }
        };

        if (state.id !== undefined) {
            clearTimeout(state.id);
            makeCallbacks(state.cancel);
        }

        state.id = setTimeout(function () {
            makeCallbacks(state.complete);
        }, state.time);
    };

    window.Stutter = Stutter;
})(window);
