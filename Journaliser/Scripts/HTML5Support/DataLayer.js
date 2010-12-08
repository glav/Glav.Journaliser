/// <reference path="../jquery-1.4.2-vsdoc.js" />

function DataLayer() {
    this._storageEnabled = true;
    if (!window.localStorage) {
        this._storageEnabled = false;
    }
}

DataLayer.prototype = {
    getAllJournalEntries: function () {
        /// <summary>
        /// Retrieves all Journal entries
        /// </summary>
    },
    storeJournalEntry: function (entry) {
    },


    constructJournalEntry: function () {
        /// <summary>
        /// Constructs a blank journal entry entity
        /// </summary>
        var entity =
        {
            CreatedDate: null,
            owner: "",
            title: "",
            body: ""
        };
        return entity;
    }
}

