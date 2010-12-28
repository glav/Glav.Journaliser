using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Journaliser.Logic.Domain.Model;

namespace Journaliser.Controllers
{
    public class JournalController : Controller
    {
        //
        // GET: /Journal/

        public ActionResult Index()
        {
            ViewData["page"] = "home";
            return View();
        }

        public ActionResult AddToJournal()
        {
            JournalEntry entry = new JournalEntry();
            return View(entry);
        }

    }
}
