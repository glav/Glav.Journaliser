﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Journaliser.Logic.Domain.Model
{
    public class JournalEntry : BaseDocument
    {
        public string Title { get; set; }
        public JournalEntryVisibility Visibility {get; set;}
        public DateTime? LastModifiedDate { get; set; }
        public string BodyText { get; set; }

		//public string NewField { get; set; }
    }
}
