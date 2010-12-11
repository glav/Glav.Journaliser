/// <reference path="jquery-1.4.2-vsdoc.js" />
/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="DataLayer.js" />
/// <reference path="RuntimeSettings.js" />
/// <reference path="CacheManager.js" />


$(document).ready(function () {
    _networkStatus.initialise();

    var cacheManager = new CacheManager();

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

    _networkStatus.addNetworkStatusChangedHandler(function (args) {

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

    //_networkStatus.startMonitoring();

});