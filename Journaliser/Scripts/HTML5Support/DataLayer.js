/// <reference path="../jquery-1.4.2-vsdoc.js" />

function DataLayer() {
    this._storageEnabled = true;
    this._storage = null;

    try {
        this._storageEnabled = ('localStorage' in window && window['localStorage'] !== null);
    } catch (e) {
        this._storageEnabled = false;
    }


    if (this._storageEnabled === false) {
        alert('Local Storage not available within this browser');
    } else {
        this._storage = window.localStorage;
    }
    // Initialise our index
    this._index = null;
    this._updateIndexFromStore();
}

DataLayer.prototype = {
    _updateIndexFromStore: function () {
        var indexKey = "docIndex";
        var index;


        index = JSON.parse(this._storage.getItem(indexKey));

        if (index) {
            this._index = index;
        } else {
            this._index = {
                lastUpdate: null,
                lastIdUsed: 0,
                key: indexKey
            };
            this._storage.setItem(this._index.key, JSON.stringify(this._index));
        }
    },

    deleteJournalEntry: function (id) {
        this._updateIndexFromStore();
        var item = this.getJournalEntry(id);
        if (item && item != null && item.Id === id) {
            this._storage.removeItem(id);
            var key = this._index.lastIdUsed - 1;
            this._index.lastIdUsed = key;
            this._updateIndexToStore();
        }
    },

    syncSuccessCallbackProxy: function (status, syncedEntry, successCallback) {
        if (status.WasSuccessful === true) {
            var returnedId = parseInt(status.entryId, 10);
            console.log("id: " + returnedId + " , entry: " + syncedEntry.Title);

            this.deleteJournalEntry(returnedId);

            //this.deleteJournalEntry(syncedEntry.Id);
            var allEntries = this.getAllJournalEntries();
            successCallback(syncedEntry, allEntries.length);
        }
    },

    syncErrorCallbackProxy: function (e, entry, errorCallback) {
        //this.deleteJournalEntry(syncedEntry.Id);
        var allEntries = this.getAllJournalEntries();
        errorCallback(e, entry, allEntries.length);
    },

    synchroniseWithServer: function (successCallback, errorCallback) {
        var $this = this;
        var thisErrorCallback = errorCallback;
        var allEntries = this.getAllJournalEntries();
        var numEntries = allEntries.length;
        for (var cnt = 0; cnt < numEntries; cnt++) {
            var entry = allEntries[cnt];
            console.log("before ajax - cnt: " + cnt + ", id: " + entry.Id);
            $.ajax({
                url: _runtime.rootPath + "Journal/SyncJournal",
                type: "POST",
                success: function (e) { $this.syncSuccessCallbackProxy(e, entry, successCallback); },
                error: function (e) { $this.syncErrorCallbackProxy(e, entry, thisErrorCallback); },
                data: entry
            });
        }
    },

    _updateIndexToStore: function () {
        this._index.lastUpdate = new Date();
        this._storage.setItem(this._index.key, JSON.stringify(this._index));
    },

    getAllJournalEntries: function () {
        /// <summary>
        /// Retrieves all Journal entries
        /// </summary>
        this._updateIndexFromStore();
        var entryList = new Array();
        if (this._index.lastIdUsed > 0) {
            for (var cnt = 1; cnt <= this._index.lastIdUsed; cnt++) {
                var serialisedEntry = this._storage.getItem(cnt);
                if (serialisedEntry && serialisedEntry.length > 0) {
                    var entry = JSON.parse(serialisedEntry);
                    entryList.push(entry);
                }
            }
        }
        return entryList;
    },

    clearAllEntries: function () {
        this._storage.clear();
        this._index.lastIdUsed = 0;
        this._updateIndexToStore();
    },

    storeJournalEntry: function (entry) {
        this._updateIndexFromStore();
        var key = this._index.lastIdUsed + 1;
        entry.Id = key;
        this._storage.setItem(key, JSON.stringify(entry));
        this._index.lastIdUsed = key;
        this._updateIndexToStore();
        return entry;
    },

    updateJournalEntry: function (entry) {
        this._storage.setItem(entry.Id, JSON.stringify(entry));
    },

    getJournalEntry: function (id) {
        var entry = this._storage.getItem(id);
        if (entry) {
            return JSON.parse(entry);
        }

        return null;
    },


    getNumberOfStoredItems: function () {
        return this.getAllJournalEntries().length;
    }
}

