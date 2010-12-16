/// <reference path="jquery-1.4.2-vsdoc.js" />
/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="DataLayer.js" />
/// <reference path="RuntimeSettings.js" />
/// <reference path="CacheManager.js" />
/// <reference path="NetworkStatus.js" />


$(document).ready(function () {
    var cacheManager = new CacheManager();
    var netStatus = new NetworkStatus();

    function handleOnline() {
        $("#onlineStatus span")
                    .addClass("status-online")
                    .removeClass("status-offline")
                    .text("Online");
        $("#logindisplay").slideDown('slow');
    }

    function handleOffline() {
        $("#onlineStatus span")
                    .addClass("status-offline")
                    .removeClass("status-online")
                    .text("Offline");
        $("#logindisplay").slideUp('slow');
    }

    netStatus.addNetworkStatusChangedHandler(function (args) {

        if (!args.hasError) {
            if (args.isOnline) {
                handleOnline();
            } else {
                handleOffline();
            }
        } else {
            alert('There was an error checking Network Status: ' + args.errorMessage);
        }
    });

    netStatus.startMonitoring({ pingUrl: _runtime.rootPath + "scripts/ping.js" });


});