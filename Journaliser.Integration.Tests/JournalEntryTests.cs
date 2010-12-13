using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Journaliser.Logic.Data;
using System.Transactions;
using Raven.Client.Document;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic;
using Journaliser.Logic.Properties;
using Raven.Client;

namespace Journaliser.Integration.Tests
{
    [TestClass]
    public class JournalEntryTests : BaseTest
    {
        [TestCleanup]
        public void Cleanup()
        {
            this.Dispose();
        }

        [TestMethod]
        public void JournalEntryShouldAddToDatabase()
        {

            var entry = new JournalEntry();
            entry.Title = "test";
            entry.Owner = "unit test";

            var id = AddJournalEntry(entry);
            Assert.AreNotEqual<string>(null, id);
            Assert.AreNotEqual<string>(string.Empty, id);

            var addedEntity = Repository.GetDocument<JournalEntry>(id);
            Assert.IsNotNull(addedEntity);
            Assert.AreEqual<string>(entry.Title, addedEntity.Title);
        }

        [TestMethod]
        public void JournalEntriesShouldBeReturnedByCreationDate()
        {

            var addStart = DateTime.Now;
            // Add some dummy entries
            for (int i = 0; i < 3; i++)
            {
                var entry = new JournalEntry();
                entry.Title = "test" + i.ToString();
                entry.Owner = "unti tester";
                var id = AddJournalEntry(entry);
            }
            var addEnd = DateTime.Now;

            var allEntries = Repository.GetEntriesByCreationDate<JournalEntry>(addStart, addEnd, Config.Default.DefaultPageSize);
            Assert.AreEqual<int>(3, allEntries.Count());

            var sameEntries3 = Repository.GetEntriesByCreationDate<JournalEntry>(addEnd.AddHours(1), addEnd.AddHours(2), Config.Default.DefaultPageSize);
            Assert.AreEqual<int>(0, sameEntries3.Count());


        }
    }
}
