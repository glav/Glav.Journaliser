using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Journaliser.Logic.Domain.Model
{
    public class JournalEntry : BaseDocument
    {
		public JournalEntry()
		{
			//SomeStuff = new SomeData();
		}
        public string Title { get; set; }
        public JournalEntryVisibility Visibility {get; set;}
        public DateTime? LastModifiedDate { get; set; }
        public string BodyText { get; set; }
		//public SomeData SomeStuff { get; set; }
		//public string NewField { get; set; }
    }

	public class SomeData
	{
		public SomeData()
		{
			Stuff = "this";
			NumberStuff = 2;
		}
		public string Stuff { get; set; }
		public int NumberStuff { get; set; }
	}
}
