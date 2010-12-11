/// <reference path="../jquery-1.4.2-vsdoc.js" />
/// <reference path="../HTML5Support/RuntimeSettings.js" />
/// <reference path="../HTML5Support/DataLayer.js" />

$(document).ready(function () {
    function addTestResult(testName, result) {
        $("#testResults").append("<li>Test: '" + testName + "' - '" + result + "'</li>");
    }

    function testCanStore() {
        var dal = new DataLayer();
        dal.clearAllEntries();

        var testEntry = { field1: "test", field2: "test2" };
        var actual = dal.storeJournalEntry(testEntry);

        if (actual.field1 != actual.field1 === "test" || !actual._storageKey) {
            addTestResult("testCanStore", "Failed - Retrieved entry from storage did not match.");
        }

        var numItems = dal.getNumberOfStoredItems();
        if (numItems !== 1) {
            addTestResult("testCanStore", "Failed - Exptected 1 Itemin Store but there was " + numItems);
        } else {
            addTestResult("testCanStore", "Passed");
        }

    }

    function testCanRetrieve() {
        var dal = new DataLayer();
        var testEntry = { field1: "test", field2: "test2" };
        try {
            var tmpEntry = dal.storeJournalEntry(testEntry);
            var key = tmpEntry._storageKey;
            var actual = dal.getJournalEntry(key);
            if (actual && actual.field1 === "test" && actual._storageKey > 0) {
                addTestResult("testCanRetrieve", "Passed");
            } else {
                addTestResult("testCanRetrieve", "Failed");
            }
        } catch (e) {
            addTestResult("testCanRetrieve", "Failed with Exception [" + e + "]");
        }
        dal.clearAllEntries();
    }

    function testGetAllEntriesAndClearAllEntries() {
        var dal = new DataLayer();
        dal.clearAllEntries();

        var testEntry1 = { field1: "test", field2: "test-again" };
        var testEntry2 = { field1: "test2", field2: "test-again2" };
        try {
            var tmpEntry1 = dal.storeJournalEntry(testEntry1);
            var tmpEntry2 = dal.storeJournalEntry(testEntry2);

            var actualEntries = dal.getAllJournalEntries();
            if (!actualEntries || actualEntries.length !== 2) {
                addTestResult("testGetAllEntriesAndClearAllEntries", "Failed - Expected 2 entries to be returned but there was not.");
                return;
            }

            if (testEntry1.field1 !== actualEntries[0].field1 || testEntry1.field2 !== actualEntries[0].field2) {
                addTestResult("testGetAllEntriesAndClearAllEntries", "Failed - data of 1st returned entry did not match");
                return;
            }
            if (testEntry2.field2 !== actualEntries[1].field2 || testEntry2.field2 !== actualEntries[1].field2) {
                addTestResult("testGetAllEntriesAndClearAllEntries", "Failed - data of 2nd returned entry did not match");
                return;
            }

            dal.clearAllEntries();
            actualEntries = dal.getAllJournalEntries();
            if (!actualEntries || actualEntries.length !== 0) {
                addTestResult("testGetAllEntriesAndClearAllEntries", "Failed - cleared store but still returned items. Expected no items.");
                return;
            }

            addTestResult("testGetAllEntriesAndClearAllEntries", "Passed");

        } catch (e) {
            addTestResult("testCanRetrieve", "Failed with Exception [" + e + "]");
        }
        dal.clearAllEntries();

    }

    function runAllTests() {
        testCanStore();
        testCanRetrieve();
        testGetAllEntriesAndClearAllEntries();
    }

    runAllTests();
});