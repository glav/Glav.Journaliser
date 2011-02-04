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
        var numItems = dal.getNumberOfStoredItems();
        if (numItems > 0) {
            $("#sync-message span")
                    .text("You have " + numItems + " items stored locally. You need to synchronise")
                    .css("color", "yellow");
            if (isOnline === true) {
                $("#sync-message a")
                    .slideDown('slow')
                    .unbind()
                    .click(function () {
                        dal.synchroniseWithServer(function () {
                            alert('it worked!');
                        }, function () {
                            alert(' sync failed');
                        });
                    });
            } else {
                $("#sync-message a")
                            .unbind()
                            .slideUp('slow');
            }
        } else {
            $("#sync-message span")
                    .text("All items are synchronised.")
                    .css("color", "lime");
            $("#sync-message a")
                    .slideUp('slow')
                    .unbind();
        }

        if (isOnline === true) {
            $("#add-journal-entry").unbind();
        } else {
            $("#add-journal-entry").unbind().click(function () {
                var newEntity = JournalEntryModelCreator();

                newEntity.BodyText = $("#BodyText").val();
                newEntity.Title = $("#Title").val();

                dal.storeJournalEntry(newEntity);

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
