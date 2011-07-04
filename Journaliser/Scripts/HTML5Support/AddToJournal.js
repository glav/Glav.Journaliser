/// <reference path="jquery-1.4.2-vsdoc.js" />
/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="DataLayer.js" />
/// <reference path="RuntimeSettings.js" />
/// <reference path="CacheManager.js" />
/// <reference path="NetworkStatus.js" />
/// <reference path="Main.js" />

$(document).ready(function () {

    function bindAddJournalEntryButton() {
        $("#add-journal-entry").click(function () {
            var loggedIn = ($("#login-status").val() === "LoggedIn");
            if (_netStatus.isOnline() === true && loggedIn === true) {
                $(this).submit();
            } else {
                addEntryToOfflineStorage();
                refreshSyncMessageAndRedirectAddToJournalButton();
                return false;
            }
        });
    }

    function entryRemovedFromLocalCache(entry, numEntriesLeftInLocalStore) {
        var msg = "'Entry" + ": " + entry.Title + "' has been synchronised. There are " + numEntriesLeftInLocalStore + " entries left to synchronise";
        $("#sync-message span.status").text(msg).css("display", "block");
        if (numEntriesLeftInLocalStore == 0) {
            refreshSyncMessageAndRedirectAddToJournalButton();
        }
    }

    function refreshSyncMessageAndRedirectAddToJournalButton() {
        var isOnline = (_netStatus.isOnline() === true);
        var dal = new DataLayer();
        var loggedIn = ($("#login-status").val() === "LoggedIn");
        var numItems = dal.getNumberOfStoredItems();
        if (numItems > 0) {
            $("#sync-message span.message")
                    .text("You have " + numItems + " items stored locally. You need to synchronise")
                    .css("color", "yellow");
            if (loggedIn === true) {
                $("#sync-message a")
                    .slideDown()
                    .unbind()
                    .click(function () {
                        $("#sync-message span.status").fadeIn();
                        dal.synchroniseWithServer(function (syncedEntry, numEntriesLeftInLocalStore) {
                            entryRemovedFromLocalCache(syncedEntry, numEntriesLeftInLocalStore);
                        }, function (err, entry, numEntriesLeftInLocalStore) {
                            if (err.status == 200 && err.statusText == "OK") {
                                entryRemovedFromLocalCache(entry, numEntriesLeftInLocalStore);
                            } else {
                                alert(' sync failed');
                            }
                        });
                    });
            }
        } else {
            $("#sync-message span.message")
                    .text("All items are synchronised.")
                    .css("color", "lime");
            $("#sync-message a")
                    .slideUp('slow')
                    .unbind();
            $("#sync-message span.status")
                    .text("");
        }
    }

    function addEntryToOfflineStorage() {
        var dal = new DataLayer();
        var newEntity = JournalEntryModelCreator();

        newEntity.BodyText = $("#BodyText").val();
        newEntity.Title = $("#Title").val();

        dal.storeJournalEntry(newEntity);

        $("#Title").val("");
        $("#BodyText").val("");

    }

    bindAddJournalEntryButton();
    refreshSyncMessageAndRedirectAddToJournalButton();

});
