using System.Web.Mvc;
using Journaliser.Logic.Data;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic.Domain.Security;

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

        [Authorize]
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

        [HttpPost]
        [Authorize]
        public ActionResult SyncJournal(JournalEntry entry)
        {
            if (ModelState.IsValid ||
                (!ModelState.IsValid && CheckForValidityInOfflineObject(entry) == true))
            {
                entry.Owner = _identitySvc.GetCurrentUsername();
                _repository.AddDocument<JournalEntry>(entry);
                ViewBag.SyncResult = "OK";
                return View("AddToJournalSyncResult");
            }
            else
            {
                ViewBag.SyncResult = "ERROR";
                return View("AddToJournalSyncResult");
            }
        }

        private bool CheckForValidityInOfflineObject(JournalEntry entry)
        {
            if (entry.LastModifiedDate == null && entry.ModifiedDate == null
                    && !string.IsNullOrWhiteSpace(entry.Title)
                    && entry.Title.ToLowerInvariant() != "null"
                    && !string.IsNullOrWhiteSpace(entry.Owner)
                    && entry.Owner.ToLowerInvariant() != "null")
                return true;
            else
                return false;
        }

    }
}
