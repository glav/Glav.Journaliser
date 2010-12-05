﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;

namespace Journaliser.Logic.Data
{
    public interface IJournalRepository
    {
        JournalEntry GetJournalEntry(string id);
        string AddJournalEntry(JournalEntry entry);
        IEnumerable<JournalEntry> GetJournalEntriesByCreationDate(DateTime fromDate, DateTime toDate, int maxRecords);
        void DeleteJournalEntry(string id);
        void DeleteJournalEntry(JournalEntry entry);
    }
}