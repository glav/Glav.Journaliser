using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;

namespace Journaliser.Logic.Domain.Security
{
    public interface IMembershipService
    {
        int MinPasswordLength { get; }

        bool ValidateUser(string userName, string password);
        bool CreateUser(string userName, string password, DateTime? dateOfBirth, string firstName, string lastName, string email);
        bool ChangePassword(string userName, string oldPassword, string newPassword);
    }
}
