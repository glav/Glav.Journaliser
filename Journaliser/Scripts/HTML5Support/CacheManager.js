/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="RuntimeSettings.js" />

function CacheManager() {
    this._cache = null;

    if (window.applicationCache) {
        this._cache = window.applicationCache;
        this._setupEventHandlers();
    }
}

CacheManager.prototype = {
    isCacheEnabled: function () {
        return (this.cache !== null);
    },

    _setupEventHandlers: function () {
        var context = this;
        this._cache.addEventListener("cached", function () {
            console.log("All resources for this web app have now been downloaded. You can run this application while not connected to the internet");
        }, false);
        this._cache.addEventListener("checking", function () {
            console.log("Checking manifest");
        }, false);
        this._cache.addEventListener("downloading", function () {
            console.log("Starting download of cached files");
        }, false);
        this._cache.addEventListener("error", function (e) {
            console.log("There was an error in the manifest, downloading cached files or you're offline: [" + e.type + " - " + (e.ERROR ? e.ERROR : "Unknown") + "]");
        }, false);
        this._cache.addEventListener("noupdate", function () {
            console.log("There was no update needed");
        }, false);
        this._cache.addEventListener("progress", function () {
            console.log("Downloading cached files");
        }, false);
        this._cache.addEventListener("updateready", function () {
            context._cache.swapCache();
            console.log("Updated cache is ready");
            // Even after swapping the cache the currently loaded page won't use it
            // until it is reloaded, so force a reload so it is current.
            window.location.reload(true);
            console.log("Window reloaded");
        }, false);
    }

}