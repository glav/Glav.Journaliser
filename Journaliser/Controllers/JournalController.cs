using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic.Data;
using Raven.Client;
using Journaliser.Logic.Domain.Security;

namespace Journaliser.Controllers
{
    public class JournalController : Controller
    {
        IJournalRepository _repository;
        IRepositoryFactory _repoFactory;
        IIdentityService _identitySvc;

        public JournalController()
        {
            _repoFactory = new RepositoryFactory();
            _repository = new JournalRepository(_repoFactory.CreateDocumentStore());
            _identitySvc = new IdentityService();
        }

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
                entry = new JournalEntry();
                return View(entry);
            }
            else
            {
                return View(entry);
            }
        }

    }
}
