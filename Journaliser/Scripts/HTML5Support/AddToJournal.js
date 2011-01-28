/// <reference path="jquery-1.4.2-vsdoc.js" />
/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="DataLayer.js" />
/// <reference path="RuntimeSettings.js" />
/// <reference path="CacheManager.js" />
/// <reference path="NetworkStatus.js" />
/// <reference path="Main.js" />

$(document).ready(function () {

    function AddEntryToOfflineStorage() {
        var title = $("field-data title input").val();
        var createdDate = $("field-data created-date input").val();
        var bodyText = $("field-data body-text input").val();

        var offlineDoc = {
            Title: title,
            CreatedDate: createdDate,
            BodyText: bodyText
        };

        var dal = new DataLayer();
        dal.storeJournalEntry(offlineDoc);
        var numEntries = dal.getNumberOfStoredItems();
        alert('Journal Entry stored offline. When the app is inline, the data will be synchronised with the server. You have ' + numEntries + ' waiting to be synced');
    }

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
            var numItems = dal.getNumberOfStoredItems();
            if (numItems > 0) {
                alert('You have ' + num  items stored locally. You need to synchronise');
            }
            $("#add-journal-entry").unbind();
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
