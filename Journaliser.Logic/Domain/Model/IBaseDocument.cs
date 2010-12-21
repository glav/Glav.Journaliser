using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Journaliser.Logic.Domain.Model
{
    public interface IBaseDocument
    {
        string Id {get; set;}
        DateTime CreatedDate { get; set; }
        DateTime? ModifiedDate { get; set; }
        string Owner { get; set; }
    }
}
