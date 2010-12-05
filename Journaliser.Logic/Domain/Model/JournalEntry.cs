using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Journaliser.Logic.Domain.Model
{
    public class JournalEntry
    {
        public JournalEntry()
        {
            CreatedDate = DateTime.Now;
        }
        public string Id { get; set; }
        public string Title { get; set; }
        public JournalEntryVisibility Visibility {get; set;}
        public string Owner { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
