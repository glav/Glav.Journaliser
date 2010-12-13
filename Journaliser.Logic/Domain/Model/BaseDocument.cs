using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Journaliser.Logic.Domain.Model
{
    public abstract class BaseDocument : IBaseDocument
    {
        public string Id {get; set;}

        DateTime _createdDate = DateTime.Now;
        public DateTime CreatedDate
        {
            get { return _createdDate; }
            set {_createdDate = value; }
        }
        public string Owner { get; set; }
    }
}
