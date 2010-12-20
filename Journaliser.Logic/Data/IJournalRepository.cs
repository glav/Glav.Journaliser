using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;

namespace Journaliser.Logic.Data
{
    public interface IJournalRepository
    {
        T GetDocument<T>(string id) where T : IBaseDocument;
        string AddDocument<T>(T entry) where T : IBaseDocument;
        IEnumerable<T> GetEntriesByCreationDate<T>(DateTime fromDate, DateTime toDate, int maxRecords) where T : IBaseDocument;
        void DeleteDocument<T>(string id) where T : IBaseDocument;
        void DeleteDocument<T>(T entry) where T : IBaseDocument;

        User GetUser(string username);
        void AddUser(User userToAdd)+
    }
}
