using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
            return View();
        }

    }
}
