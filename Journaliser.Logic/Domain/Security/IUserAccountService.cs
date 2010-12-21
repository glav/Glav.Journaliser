using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;

namespace Journaliser.Logic.Domain.Security
{
    public interface IUserAccountService
    {
        bool ValidateUser(string userName, string password);
        bool CreateUser(User userToCreate);
        bool ChangePassword(string userName, string oldPassword, string newPassword);
    }
}
