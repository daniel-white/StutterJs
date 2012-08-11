(function (window, undefined) {
    var _items = [],
        _Item = function (key) {
            _items[key] = this;
            return this;
        };

    _Item.prototype.timeoutHandle = '';
    _Item.prototype.timeout = 1000;
    _Item.prototype.completedCallbacks = [];
    _Item.prototype.cancelCallbacks = [];
    _Item.prototype.addCompletedCallback = function (callback, context) {
        this.completedCallbacks.push({ callback: callback, context: context });
    };
    _Item.prototype.addCancelCallback = function (callback, context) {
        this.cancelCallbacks.push({ callback: callback, context: context });
    };

    var Stutter = function (key, timeout, completedCallback, completedCallbackContext) {
        var item = new _Item(key);

        item.timeout = timeout || item.timeout;

        if (completedCallback != undefined) {
            item.addCompletedCallback(completedCallback, completedCallbackContext);
        }

        this._key = key;
        return this;
    };

    Stutter.prototype.complete = function (callback, context) {
        var item = _items[this._key];
        item.addCompletedCallback(callback, context);
        return this;
    };

    Stutter.prototype.cancel = function (callback, context) {
        var item = _items[this._key];
        item.addCancelCallback(callback, context);
        return this;
    };

    Stutter.prototype.set = function () {
        var item = _items[this._key];

        var makeCallbacks = function (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
                var callback = callbacks[i];
                callback.callback.apply(callback.context);
            }
        }

        if (item.timeoutHandle !== '') {
            clearTimeout(item.timeoutHandle);
            makeCallbacks(item.cancelCallbacks);
        }

        item.timeoutHandle = setTimeout(function () {
            makeCallbacks(item.completedCallbacks);
        }, item.timeout);
    };

    window.Stutter = Stutter;
})(window);