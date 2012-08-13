(function (window) {
    'use strict';
    var pushCallback = function (collection, callback, context) {
        collection.push({ callback: callback, context: context });
    },
    Stutter = function (time, completedCallback, completedCallbackContext, data) {
        this._state = {
            data: data,
            id: undefined,
            time: time || 1000,
            complete: [],
            cancel: [],
            always: []
        };

        if (completedCallback !== undefined) {
            this.complete(completedCallback, completedCallbackContext);
        }

        return this;
    };

    Stutter.prototype.complete = function (callback, context) {
        pushCallback(this._state.complete, callback, context);
        return this;
    };

    Stutter.prototype.cancel = function (callback, context) {
        pushCallback(this._state.cancel, callback, context);
        return this;
    };

    Stutter.prototype.always = function (callback, context) {
        pushCallback(this._state.always, callback, context);
        return this;
    };

    Stutter.prototype.set = function (data) {
        var state = this._state,
        self = this,
        time = state.time,
        makeCallbacks = function (callbacks) {
            var i = 0, callback;
            for (i = 0; i < callbacks.length; i++) {
                callback = callbacks[i];
                data = data || state.data;
                if (typeof data === 'function') {
                    data = data();
                }
                callback.callback.apply(callback.context, [data, self]);
            }
        };

        makeCallbacks(state.always);

        if (state.id !== undefined) {
            clearTimeout(state.id);
            makeCallbacks(state.cancel);
        }

        if (typeof time === 'function') {
            time = time(data);
        }

        state.id = setTimeout(function () {
            state.id = undefined;
            makeCallbacks(state.complete);
        }, time);
    };

    window.Stutter = Stutter;
})(window);
