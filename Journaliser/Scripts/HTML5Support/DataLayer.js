﻿/// <reference path="../jquery-1.4.2-vsdoc.js" />

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


    synchroniseWithServer: function (successCallback, errorCallback) {
        var allEntries = this.getAllJournalEntries();
        for (var cnt = 0; cnt < allEntries.length; cnt++) {
            var entry = allEntries[cnt];
            $.ajax({
                url: "AddToJournal",
                type: "POST",
                success: successCallback,
                error: errorCallback,
                data: entry
            });
        }
        alert('not complete yet');
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

