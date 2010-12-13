using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Raven.Client.Document;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic;
using Journaliser.Logic.Properties;
using Raven.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Journaliser.Logic.Data;

namespace Journaliser.Integration.Tests
{
    public class BaseTest : IDisposable
    {
        IDocumentStore _docStore;
        List<string> _idsAdded = new List<string>();

        public BaseTest()
        {
            _docStore = new RepositoryFactory().CreateDocumentStore();
            Repository = new JournalRepository(_docStore);
        }

        protected JournalRepository Repository { get; set; }

        public string AddJournalEntry(JournalEntry entry)
        {
            var id = Repository.AddDocument<JournalEntry>(entry);
            _idsAdded.Add(id);
            return id;
        }
        public void Dispose()
        {
            _idsAdded.ForEach(d => Repository.DeleteDocument<JournalEntry>(d));
        }
    }
}
