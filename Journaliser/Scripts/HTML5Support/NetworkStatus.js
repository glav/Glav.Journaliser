/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="RuntimeSettings.js" />


function NetworkStatus(timeoutInMilliseconds) {
    /// <summary>
    /// This class will handle the checking of network status for offline and online mode as well
    /// as detecting support for the cache
    /// </summary>
    this._cache = null;
    this._isOnline = true;
    this._initialised = false;
    this._timeout = 5000;
    if (timeoutInMilliseconds) {
        this._timeout = timeoutInMilliseconds;
    }


    this._networkStatusEventHandler = new Array();
    this._monitorTimer = null;
}

NetworkStatus.prototype = {
    initialise: function () {
        if (this._initialised === false) {
            $(document.body).bind("online", this._checkNetworkStatus);
            $(document.body).bind("offline", this._checkNetworkStatus);
            this._initialised = true;
        }
        this._checkNetworkStatus();
    },

    isOnline: function () {
        /// <summary>
        /// Is the application in online or offline mode
        /// </summary>
        return this._isOnline;
    },

    setTimeoutInMillseconds: function (timeoutInMseconds) {
        this._timeout = timeoutInMseconds;
    },
    getTimeoutInMillseconds: function () {
        return this._timeout;
    },

    addNetworkStatusChangedHandler: function (handler) {
        /// <summary>
        /// 
        /// </summary>
        this._networkStatusEventHandler.push(handler);
    },

    removeNetworkStatusChangedHandler: function (handler) {
        /// <summary>
        /// Removes a handler from the list of handlers that deal with network status changed events
        /// </summary>
        var tmpArray = new Array();
        for (var cnt = 0; cnt < this._networkStatusEventHandler.length; cnt++) {
            if (handler === this._networkStatusEventHandler[cnt]) {
                this._networkStatusEventHandler[cnt] = null;
            } else {
                tmpArray.push(this._networkStatusEventHandler[cnt]);
            }
        }

        this._networkStatusEventHandler = tmpArray;
    },

    clearNetworkStatusChangedHandlers: function () {
        /// <summary>
        /// Clears all network status changed event handlers from the list of handlers
        /// </summary>
        this._networkStatusEventHandler = new Array();
    },

    _fireStatusChangedEvent: function (isOnline, errorMessage) {
        this._isOnline = isOnline;
        for (var cnt = 0; cnt < this._networkStatusEventHandler.length; cnt++) {
            var handler = this._networkStatusEventHandler[cnt];
            if (typeof (handler) === 'function') {
                var args = { "isOnline": this._isOnline,
                    "hasError": (errorMessage && errorMessage.length > 0),
                    "errorMessage": (errorMessage && errorMessage.length > 0) ? errorMessage : ""
                };
                handler(args);
            }
        }
    },

    _checkNetworkStatus: function () {
        if (this._initialised === false) {
            alert("You must initialise this component first. (_networkStatus.initialise(); )");
            return;
        }

        if (navigator.onLine || navigator.online === 'undefined') {
            // Just because the browser says we're online doesn't mean we're online. The browser lies.
            // Check to see if we are really online by making a call for a static JSON resource on
            // the originating Web site. If we can get to it, we're online. If not, assume we're
            // offline.
            $.ajaxSetup({
                async: true,
                cache: false,
                context: $("#status"),
                dataType: "json",
                error: function (req, status, ex) {
                    console.log("Error: " + ex + ", Status Text:" + status);
                    // We might not be technically "offline" if the error is not a timeout, but
                    // otherwise we're getting some sort of error when we shouldn't, so we're
                    // going to treat it as if we're offline.
                    // Note: This might not be totally correct if the error is because the
                    // manifest is ill-formed.

                    var msg = req.status >= 500 ? status : null;
                    _networkStatus._fireStatusChangedEvent(false, msg);
                },
                success: function (data, status, req) {
                    _networkStatus._fireStatusChangedEvent(true);
                },
                timeout: _networkStatus._timeout,
                type: "GET",
                url: _runtime.rootPath + "scripts/ping.js"
            });
            $.ajax();
        }
        else {
            _networkStatus._fireStatusChangedEvent(false);
        }
    },

    startMonitoring: function () {
        if (this._monitorTimer == null) {
            this.monitorTimer = setInterval(this._checkNetworkStatus, this.getTimeoutInMillseconds());
        }
    },

    stopMonitoring: function () {
        if (this._monitorTimer) {
            clearInterval(this._monitorTimer);
        }
    }
}

var _networkStatus;
if (typeof (_networkStatus === 'undefined')) {
    _networkStatus = new NetworkStatus();
}
