/// <reference path="jquery-1.4.2-vsdoc.js" />
/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="DataLayer.js" />
/// <reference path="RuntimeSettings.js" />
/// <reference path="CacheManager.js" />
/// <reference path="NetworkStatus.js" />

$(document).ready(function () {
    var cacheManager = new CacheManager();
    var netStatus = new NetworkStatus();

    var offlineLinks = ["offline/Home.htm", "offline/About.htm"];
    var onlineLinks = ["", "Home/About"];
    function mapLinks(status) {
        var arrLen = offlineLinks.length;
        $(".cache-link").each(function () {
            var el = $(this);
            if (status && status === "online") {
                for (var cnt = 0; cnt < arrLen; cnt++) {
                    var link = _runtime.rootPath + offlineLinks[cnt];
                    if (link === el.attr("href")) {
                        el.attr("href", _runtime.rootPath + onlineLinks[cnt]);
                    }
                }
            } else {
                for (var cnt = 0; cnt < arrLen; cnt++) {
                    var link = _runtime.rootPath + onlineLinks[cnt];
                    if (link === el.attr("href")) {
                        el.attr("href", _runtime.rootPath + offlineLinks[cnt]);
                    }
                }
            }
        });
    }

    function handleOnline() {
        $("#onlineStatus span")
                    .addClass("status-online")
                    .removeClass("status-offline")
                    .text("Online");
        $("#logindisplay").slideDown('slow');
        mapLinks('online');
    }

    function handleOffline() {
        $("#onlineStatus span")
                    .addClass("status-offline")
                    .removeClass("status-online")
                    .text("Offline");
        $("#logindisplay").slideUp('slow');
        mapLinks('offline');
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

    netStatus.startMonitoring({ pingUrl: _runtime.rootPath + "scripts/ping.js", enablePolling: true });


});