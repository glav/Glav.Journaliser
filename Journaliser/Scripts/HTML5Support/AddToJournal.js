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
        alert('Journal Entry stored offline. When the app is inline, the data will be synchronised with the server. You have ' +numEntries + ' waiting to be synced');
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

    bindAddJournalEntryButton();
});
