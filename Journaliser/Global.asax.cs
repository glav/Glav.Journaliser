using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Journaliser.Logic.Common;
using Journaliser.Logic.Data;
using Journaliser.Logic.Domain.Security;
using Raven.Client;
using Raven.Client.Document;

namespace Journaliser
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    
    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            RegisterDependencyContainer();
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
        }

        private void RegisterDependencyContainer()
        {
            var settings = new Ninject.NinjectSettings() { AllowNullInjection = true };
            var kernel = new Ninject.StandardKernel(settings);
            NinjectResolver resolver = new NinjectResolver(kernel);
            DependencyResolver.SetResolver(resolver);

            // Create a single document store object to use for resolution
            kernel.Bind<IRepositoryFactory>().To<RepositoryFactory>().InSingletonScope();
            var docStore = DependencyResolver.Current.GetService<IRepositoryFactory>().CreateDocumentStore();
            kernel.Bind<IDocumentStore>().ToConstant(docStore);

            kernel.Bind<IJournalRepository>().To<JournalRepository>().InSingletonScope();
            kernel.Bind<IIdentityService>().To<IdentityService>();
            kernel.Bind<IMembershipService>().To<UserService>();
            kernel.Bind<IFormsAuthenticationService>().To<FormsAuthenticationService>();


        }
    }
}