using System;
using System.Web.Mvc;
using Journaliser.Logic.Data;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic.Domain.Security;
using System.Web.Helpers;

namespace Journaliser.Controllers
{
    public class JournalController : Controller
    {
        readonly IJournalRepository _repository;
        readonly IRepositoryFactory _repoFactory;
        readonly IIdentityService _identitySvc;

        public JournalController(IRepositoryFactory repoFactory, IJournalRepository repository, IIdentityService identitySvc)
        {
            _repoFactory = repoFactory;
            _repository = repository;
            _identitySvc = identitySvc;
        }
        //
        // GET: /Journal/

        public ActionResult AddToJournal()
        {
            JournalEntry entry = new JournalEntry();
            return View(entry);
        }

        [HttpPost]
        [Authorize]
        public ActionResult AddToJournal(JournalEntry entry)
        {
            if (ModelState.IsValid)
            {
                entry.Owner = _identitySvc.GetCurrentUsername();
                _repository.AddDocument<JournalEntry>(entry);
                return RedirectToAction("AddToJournal");
            }
            else
            {
                return View(entry);
            }
        }

		[Authorize]
		public ActionResult Delete(string id)
		{
			if (id != null)
			{
				_repository.DeleteDocument<JournalEntry>(id.ToString());
				var entries = _repository.GetEntriesByCreationDate<JournalEntry>(DateTime.Now.AddDays(-2),
				                                                                 DateTime.Now, 20);
				return View("ListJournals",entries);
			}

			return View();
		}

		public ActionResult ListJournals()
		{
			var entries = _repository.GetEntriesByCreationDate<JournalEntry>(DateTime.Now.AddDays(-2),
			                                                   DateTime.Now, 20);
			return View(entries);
		}

        [HttpPost]
        [Authorize]
        public JsonResult SyncJournal(JournalEntry entry)
        {
            if (ModelState.IsValid ||
                (!ModelState.IsValid && CheckForValidityInOfflineObject(entry) == true))
            {
            	var oldId = entry.Id;
            	entry.Id = null;
            	entry.Owner = _identitySvc.GetCurrentUsername();
                _repository.AddDocument<JournalEntry>(entry);
                ViewBag.SyncResult = "OK";
				return Json(new { WasSuccessful = true, entryId = oldId});
            }
            else
            {
                ViewBag.SyncResult = "ERROR";
				return Json(new { WasSuccessful = false });
            }
        }

        private bool CheckForValidityInOfflineObject(JournalEntry entry)
        {
            if (entry.LastModifiedDate == null && entry.ModifiedDate == null
                    && !string.IsNullOrWhiteSpace(entry.Title)
                    && entry.Title.ToLowerInvariant() != "null"
                    && !string.IsNullOrWhiteSpace(entry.Owner)
                    && entry.Owner.ToLowerInvariant() == "null")
                return true;
            else
                return false;
        }

    }
}
