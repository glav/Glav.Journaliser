using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Raven.Client;

namespace Journaliser.Logic.Data
{
    public interface IRepositoryFactory
    {
        IDocumentStore CreateDocumentStore();
    }
}
