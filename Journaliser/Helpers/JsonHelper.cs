using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Journaliser.Logic.Domain.Serialisation;
using Journaliser.Logic.Domain.Model;

namespace Journaliser.Helpers
{
    public static class JsonHelper
    {
        public static MvcHtmlString WriteJournalEntryJsonDefintion()
        {
            const string modelType = "JournalEntry";

            var serialiserSvc = DependencyResolver.Current.GetService<IModelSerialiser>();

            var blankEntry = new JournalEntry();
            string jsObject = serialiserSvc.CreateJsonModelDefinition<JournalEntry>(blankEntry, modelType);
            string createFunction = serialiserSvc.AddCreateObjectHelperRoutineToModelDefinition(jsObject, modelType);

            return MvcHtmlString.Create(string.Format("<script type=\"text/javascript\">{0}</script>",createFunction));
        }
    }
}