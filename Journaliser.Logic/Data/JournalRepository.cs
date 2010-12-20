using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;
using Raven.Client;
using Journaliser.Logic.Properties;
using System.Diagnostics.Contracts;

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
        public T GetDocument<T>(string id) where T : IBaseDocument
        {
            Contract.Requires<ArgumentNullException>(!string.IsNullOrWhiteSpace(id));

            using (var context = _documentStore.OpenSession())
            {
                return context.Load<T>(id);
            }
        }


        public string AddDocument<T>(T entry) where T : IBaseDocument
        {
            Contract.Requires<ArgumentNullException>(entry != null);
            Contract.Requires<ArgumentNullException>(!string.IsNullOrWhiteSpace(entry.Owner));

            using (var context = _documentStore.OpenSession())
            {
                entry.CreatedDate = DateTime.Now;
                context.Store(entry);
                context.SaveChanges();
                return entry.Id;
            }
        }

        public IEnumerable<T> GetEntriesByCreationDate<T>(DateTime fromDate, DateTime toDate, int maxRecords) where T : IBaseDocument
        {
            using (var context = _documentStore.OpenSession())
            {
                var entries = context.Query<T>().Customize(x => x.WaitForNonStaleResultsAsOfNow())
                                .Where(x => x.CreatedDate >= fromDate)
                                .Where(x => x.CreatedDate <= toDate)
                                .Take(maxRecords);
                return entries;
            }
        }

        public void DeleteDocument<T>(T entry) where T : IBaseDocument
        {
            Contract.Requires<ArgumentNullException>(entry != null);
            Contract.Requires<ArgumentNullException>(!string.IsNullOrWhiteSpace(entry.Owner));

            using (var context = _documentStore.OpenSession())
            {
                if (entry != null)
                {
                    context.Delete<T>(entry);
                    context.SaveChanges();
                }
            }
        }

        public void DeleteDocument<T>(string id) where T : IBaseDocument
        {
            Contract.Requires<ArgumentNullException>(!string.IsNullOrWhiteSpace(id));

            using (var context = _documentStore.OpenSession())
            {
                var entry = context.Load<T>(id);
                if (entry != null)
                {
                    context.Delete<T>(entry);
                    context.SaveChanges();
                }
            }
        }

        public User GetUser(string username)
        {
            using (var context = _documentStore.OpenSession())
            {
                var user = context.Query<User>()
                                .Where(u => u.Username == username);
                return user.FirstOrDefault();
            }
        }
        public void AddUser(User userToAdd)
        {
            using (var context = _documentStore.OpenSession())
            {
                context.Store(userToAdd);
                context.SaveChanges();
            }
        }
    }
}
