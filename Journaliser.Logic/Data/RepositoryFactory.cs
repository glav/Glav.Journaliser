using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Raven.Client;
using Raven.Client.Document;
using Raven.Database.Data;

namespace Journaliser.Logic.Data
{
    public class RepositoryFactory : IRepositoryFactory
    {
        public IDocumentStore CreateDocumentStore()
        {
            var docStore = new DocumentStore()
            {
                ConnectionStringName="Journaliser"
            };

            docStore.Initialize();
            return docStore;
        }
    }
}
