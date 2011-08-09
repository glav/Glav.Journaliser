/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="RuntimeSettings.js" />

function CacheManager() {
    if (window.applicationCache) {
        this._setupEventHandlers();
    }
}

CacheManager.prototype = {
    isCacheEnabled: function () {
        return (window.applicationCache);
    },

    _logMsg: function (msg) {
        if (console) {
            console.log(msg);
        }
    },

    _setupEventHandlers: function () {
        var context = this;
        window.applicationCache.addEventListener("cached", function () {
            context._logMsg("All resources for this web app have now been downloaded. You can run this application while not connected to the internet");
        }, false);
        window.applicationCache.addEventListener("checking", function () {
            context._logMsg("Checking manifest");
        }, false);
        window.applicationCache.addEventListener("downloading", function () {
            context._logMsg("Starting download of cached files");
        }, false);
        window.applicationCache.addEventListener("error", function (e) {
            context._logMsg("There was an error in the manifest, downloading cached files or you're offline: [" + e.type + " - " + (e.ERROR ? e.ERROR : "Unknown") + "]");
        }, false);
        window.applicationCache.addEventListener("noupdate", function () {
            context._logMsg("There was no update needed");
        }, false);
        window.applicationCache.addEventListener("progress", function () {
            context._logMsg("Downloading cached files");
        }, false);
        window.applicationCache.addEventListener("updateready", function () {
            context._logMsg("Updated cache is ready");
            context.kickCache();
        }, false);
    },

    kickCache: function () {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            // can only do  this when the cache is in the UPDATEREADY state
            window.applicationCache.update();
            this._logMsg("cache updated");
            try {
                window.applicationCache.swapCache();
                this._logMsg("cache swapped");
            } catch (err) {
                // this function is very finicky and often throws DOM errors even though the state is UPDATREADY
                this._logMsg("could not swap out cache [" + err + "]");
            }
        }

        // Even after swapping the cache the currently loaded page won't use it
        // until it is reloaded, so force a reload so it is current.
        alert("Application cache was refreshed. About to do a page reload.");
        window.location.reload(true);
        this._logMsg("Window reloaded");
    }

}