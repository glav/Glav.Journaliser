using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic.Data;

namespace Journaliser.Logic.Domain.Security
{
    public class UserAccountService
    {
        IJournalRepository _repository;
        public UserAccountService(IJournalRepository repository)
        {
            _repository = repository;
        }
        public bool ValidateUser(string userName, string password)
        {
            if (String.IsNullOrEmpty(userName)) throw new ArgumentException("Value cannot be null or empty.", "userName");
            if (String.IsNullOrEmpty(password)) throw new ArgumentException("Value cannot be null or empty.", "password");

            var user = _repository.GetUser(userName, password);
            return (user != null);
        }

        public bool CreateUser(User userToCreate)
        {
            if (userToCreate == null) throw new ArgumentException("Value cannot be null or empty.", "userToCreate");
            if (String.IsNullOrEmpty(userToCreate.Username)) throw new ArgumentException("Value cannot be null or empty.", "userName");
            if (String.IsNullOrEmpty(userToCreate.Password)) throw new ArgumentException("Value cannot be null or empty.", "password");

            var id = _repository.AddDocument<User>(userToCreate);
            return (!string.IsNullOrWhiteSpace(id));
        }

        public bool ChangePassword(string userName, string oldPassword, string newPassword)
        {
            if (String.IsNullOrEmpty(userName)) throw new ArgumentException("Value cannot be null or empty.", "userName");
            if (String.IsNullOrEmpty(oldPassword)) throw new ArgumentException("Value cannot be null or empty.", "oldPassword");
            if (String.IsNullOrEmpty(newPassword)) throw new ArgumentException("Value cannot be null or empty.", "newPassword");

            var user = _repository.GetUser(userName, oldPassword);
            if (user != null)
            {
                user.Password = newPassword;
                _repository.UpdateDocument<User>(user);
                return true;
            }
            throw new System.Security.SecurityException("Invalid credentials. Password could not be changed");

        }
    }
}
