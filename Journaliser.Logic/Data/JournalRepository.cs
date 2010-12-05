using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;
using Raven.Client;
using Journaliser.Logic.Properties;

namespace Journaliser.Logic.Data
{
    public class JournalRepository : IJournalRepository
    {
        private IDocumentStore _documentStore;

        public JournalRepository(IDocumentStore documentStore)
        {
            if (documentStore == null)
                throw new ArgumentNullException("DocumentStore cannot be NULL");

            _documentStore = documentStore;
        }
        public JournalEntry GetJournalEntry(string id)
        {
            using (var context = _documentStore.OpenSession())
            {
                return context.Load<JournalEntry>(id);
            }
        }


        public string AddJournalEntry(JournalEntry entry)
        {
            if (entry == null)
                return null;

            using (var context = _documentStore.OpenSession())
            {
                entry.CreatedDate = DateTime.Now;
                context.Store(entry);
                context.SaveChanges();
                return entry.Id;
            }
        }

        public IEnumerable<JournalEntry> GetJournalEntriesByCreationDate(DateTime fromDate, DateTime toDate, int maxRecords)
        {
            using (var context = _documentStore.OpenSession())
            {
                var entries = context.Query<JournalEntry>().Customize(x => x.WaitForNonStaleResultsAsOfNow())
                                .Where(x => x.CreatedDate >= fromDate)
                                .Where(x => x.CreatedDate <= toDate)
                                .Take(maxRecords);
                return entries;
            }
        }

        public void DeleteJournalEntry(JournalEntry entry)
        {
            using (var context = _documentStore.OpenSession())
            {
                if (entry != null)
                {
                    context.Delete<JournalEntry>(entry);
                    context.SaveChanges();
                }
            }
        }

        public void DeleteJournalEntry(string id)
        {
            using (var context = _documentStore.OpenSession())
            {
                var entry = context.Load<JournalEntry>(id);
                if (entry != null)
                {
                    context.Delete<JournalEntry>(entry);
                    context.SaveChanges();
                }
            }
        }
    }
}
