/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="RuntimeSettings.js" />


function NetworkStatus(timeoutInMilliseconds, cacheManager) {
    /// <summary>
    /// This class will handle the checking of network status for offline and online mode as well
    /// as detecting support for the cache
    /// </summary>

    if (!this._isDefined($)) {
        alert('jQuery has not been detected. This component depends upon jQuery being loaded first.');
        return;
    }

    this._cacheMgr = null;
    if (cacheManager) {
        this._cacheMgr = cacheManager;
    }
    this._isOnline = true;
    this._initialised = false;
    this._timeout = 5000;
    if (timeoutInMilliseconds) {
        this._timeout = timeoutInMilliseconds;
    }

    this._networkStatusEventHandler = new Array();
    this._monitorTimer = null;
    this._pingUrl = "/scripts/ping.js";
}

NetworkStatus.prototype = {
    _isDefined: function (arg) {
        var undefined;
        if (arg === undefined) {
            return false;
        }
        return true;
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

    setPingUrl: function (pingUrl) {
        this._pingUrl = pingUrl;
    },

    getPingUrl: function () {
        return this._pingUrl;
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
        var numHandlers = this._networkStatusEventHandler.length;
        for (var cnt = 0; cnt < numHandlers; cnt++) {
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
        var numHandlers = this._networkStatusEventHandler.length;
        for (var cnt = 0; cnt < numHandlers; cnt++) {
            var handler = this._networkStatusEventHandler[cnt];
            if (typeof (handler) === 'function') {
                var args = {
                    "isOnline": this._isOnline,
                    "hasError": (errorMessage && errorMessage.length > 0),
                    "errorMessage": (errorMessage && errorMessage.length > 0) ? errorMessage : ""
                };
                handler(args);
            }
        }
    },

    _checkNetworkStatus: function () {
        var context = this;
        if (this._initialised === false) {
            alert("You must initiate network status checks first by calling the startMonitoring function on this component.");
            return;
        }

        // dont rely on the globally defined undefined constant
        var undefined;
        if (navigator.onLine === undefined || navigator.onLine === true) {
            // Just because the browser says we're online doesn't mean we're online. The browser lies.
            // Check to see if we are really online by making a call for a static JSON resource on
            // the originating Web site. If we can get to it, we're online. If not, assume we're
            // offline.
            $.ajaxSetup({
                async: true,
                cache: false,
                dataType: "json",
                error: function (req, status, ex) {
                    if (console) {
                        console.log("Error: " + ex + ", Status Text:" + status);
                    }
                    // We might not be technically "offline" if the error is not a timeout, but
                    // otherwise we're getting some sort of error when we shouldn't, so we're
                    // going to treat it as if we're offline.
                    // Note: This might not be totally correct if the error is because the
                    // manifest is ill-formed.

                    var msg = req.status >= 500 ? status : null;
                    context._fireStatusChangedEvent(false, msg);
                },
                success: function (data, status, req) {
                    context._fireStatusChangedEvent(true);
                },
                timeout: context._timeout,
                type: "GET",
                url: context._pingUrl
            });
            $.ajax();
        }
        else {
            context._fireStatusChangedEvent(false);
        }
    },

    startMonitoring: function (options) {
        var context = this;
        var enablePolling = false;
        if (this._monitorTimer !== null) {
            clearInterval(this.monitorTimer);
        }

        // Setup our options
        var settings = {
            'timeout': 5000,
            'enablePolling': false,
            'pingUrl': 'scripts/ping.js'
        };

        if (options) {
            // Merge the user supplied settings with the 'settings' object which contains all our
            // defaults
            $.extend(settings, options);
        }

        if (settings.enablePolling) {
            context.monitorTimer = setInterval(function () {
                context._checkNetworkStatus.apply(context);
            }, context.getTimeoutInMillseconds());
        }

        this.setTimeoutInMillseconds(settings.timeout);
        this._pingUrl = settings.pingUrl;

        // **********************************
        // bind ONLINE and OFFLINE DOM events
        // **********************************
        if (this._initialised === false) {
            $(document.body).bind("online", function (e) {
                context._checkNetworkStatus.apply(context, []);
                window.location.reload(true);
            });
            $(document.body).bind("offline", function (e) {
                context._fireStatusChangedEvent(false);
                context._checkNetworkStatus.apply(context, []);
            });
            this._initialised = true;
        }

        this._checkNetworkStatus();

    },

    stopMonitoring: function () {
        if (this._monitorTimer !== null) {
            clearInterval(this._monitorTimer);
        }

        if (this._initialised === true) {
            $(document.body).unbind("online", this._checkNetworkStatus);
            $(document.body).unbind("offline", this._checkNetworkStatus);
            this._initialised = false;
        }
    }
}
