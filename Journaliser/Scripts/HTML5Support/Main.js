/// <reference path="jquery-1.4.2-vsdoc.js" />
/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="DataLayer.js" />
/// <reference path="RuntimeSettings.js" />
/// <reference path="CacheManager.js" />
/// <reference path="NetworkStatus.js" />

var _cacheManager = new CacheManager();
var _netStatus = new NetworkStatus(5000,_cacheManager);

$(document).ready(function () {

    var offlineLinks = ["offline/Home.htm", "offline/About.htm", "offline/Home.htm"];
    var onlineLinks = ["", "Home/About","Account/LogOn"];

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

    _netStatus.addNetworkStatusChangedHandler(function (args) {

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

    function bindMenuLinkStyles() {
        var pageId = $("#page-id").val();
        $("#menucontainer #menu li").each(function () {
            $(this).removeClass('selected');
        });
        $("#menucontainer #menu ." + pageId).addClass('selected');

    }

    _netStatus.startMonitoring({ pingUrl: _runtime.rootPath + "scripts/ping.js", enablePolling: true });

    bindMenuLinkStyles();

});