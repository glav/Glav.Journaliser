using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Journaliser.Logic.Domain.Security
{
    public interface IIdentityService
    {
        string GetCurrentUsername();
    }
}
