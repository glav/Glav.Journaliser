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
            if (_netStatus.isOnline() === true) {
                $(this).submit();
            } else {
                AddEntryToOfflineStorage();
                return false;
            }
        });
    }

    function redirectAddToJournalButton(isOnline) {
        var dal = new DataLayer();
        if (isOnline && isOnline === true) {
            $("#add-journal-entry").unbind();
            var numItems = dal.getNumberOfStoredItems();
            if (numItems > 0) {
                alert('You have ' + numItems + ' items stored locally. You need to synchronise');
            }
        } else {
            $("#add-journal-entry").unbind().click(function () {
                var newEntity = JournalEntryModelCreator();

                newEntity.BodyText = $("#Title").val();
                newEntity.Title = $("BodyText").val();

                dal.storeJournalEntry(newEntity);
                var numItems = dal.getNumberOfStoredItems();
                alert('Entry Stored to local storage. You currently have ' + numItems + ' items stored locally and awaiting synchronisatin.');

                $("#Title").val("");
                $("#BodyText").val("");

                return false;
            });
        }
    }

    bindAddJournalEntryButton();
    _netStatus.addNetworkStatusChangedHandler(function (args) {

        if (!args.hasError) {
            redirectAddToJournalButton(args.isOnline);
        } else {
            alert('There was an error checking Network Status: ' + args.errorMessage);
        }
    });

});
