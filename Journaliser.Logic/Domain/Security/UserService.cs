using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic.Data;
using Journaliser.Logic.Common;

namespace Journaliser.Logic.Domain.Security
{
    public class UserService : IMembershipService
    {
        IJournalRepository _repository;
        public UserService(IJournalRepository repository)
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

        public bool CreateUser(string userName, string password, DateTime? dateOfBirth, string firstName, string lastName, string email)
        {
            if (String.IsNullOrEmpty(userName)) throw new ArgumentException("Value cannot be null or empty.", "userName");
            if (String.IsNullOrEmpty(password)) throw new ArgumentException("Value cannot be null or empty.", "password");

            if (_repository.DoesUserDocumentExist(userName))
                return false;

            var user = new User()
            {
                Username = userName,
                Password = password,
                DateOfBirth = dateOfBirth,
                Firstname = firstName,
                Lastname = lastName,
                Email = email,
                Owner = SystemConstants.SystemUserAccount
            };
            _repository.AddDocument<User>(user);
            return true;
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

        public int MinPasswordLength
        {
            get { return MinimumPasswordLengthValue; }
        }

        public const int MinimumPasswordLengthValue = 8;
    }
}
