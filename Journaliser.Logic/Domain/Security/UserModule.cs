using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Data;
using System.Diagnostics.Contracts;
using Journaliser.Logic.Domain.Model;

namespace Journaliser.Logic.Domain.Security
{
    public class UserModule
    {
        IJournalRepository _repository;

        public UserModule(IJournalRepository repository)
        {
            Contract.Requires<ArgumentNullException>(repository != null);

            _repository = repository;
        }
        public void CreateUser(string userName, string password, DateTime? dateOfBirth, string firstName, string lastName, string email)
        {
            var user = new User()
            {
                Username = userName,
                Password = password,
                DateOfBirth = dateOfBirth,
                Firstname = firstName,
                Lastname = lastName,
                Email = email
            };
            _repository.AddDocument<User>(user);
        }

        public bool ValidateUser(string userName, string password)
        {
            throw new NotImplementedException();
        }
    }
}
