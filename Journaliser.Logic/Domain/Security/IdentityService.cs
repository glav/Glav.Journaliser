using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Journaliser.Logic.Domain.Security
{
    public class IdentityService : IIdentityService
    {
        public string GetCurrentUsername()
        {
            if (Thread.CurrentPrincipal != null && Thread.CurrentPrincipal.Identity != null)
            {
                if (Thread.CurrentPrincipal.Identity.IsAuthenticated)
                    return Thread.CurrentPrincipal.Identity.Name;

            }
            return null;
        }

    }
}
