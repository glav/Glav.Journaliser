using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Journaliser.Models;
using Journaliser.Logic.Domain.Model;
using Journaliser.Logic.Domain.Serialisation;

namespace Journaliser.Tests.Serialisation
{
    [TestClass]
    public class JsonSerialisationTests
    {
        [TestMethod]
        public void EnsureObjectCreatableJsonIsEmitted()
        {
            const string expectedResult = "var __JournalEntry = {\"CreatedDate\":\"\\/Date(1295571278503+1100)\\/\",\"Id\":\"1\",\"ModifiedDate\":null,\"Owner\":\"test\",\"BodyText\":null,\"LastModifiedDate\":null,\"Title\":\"test title\",\"Visibility\":0}";
            var model = new JournalEntry()
            {
                Id = "1",
                Owner = "test",
                Title = "test title",
            };

            var serialiser = new JsonModelSerialiser();
            var result = serialiser.CreateJsonModelDefinition<JournalEntry>(model,"JournalEntry");

           Assert.IsFalse(string.IsNullOrWhiteSpace(result));
           Assert.IsTrue(result.Contains("var __JournalEntry = {\"CreatedDate\""));
           Assert.IsTrue(result.Contains("\"Id\":\"1\",\"ModifiedDate\":null,\"Owner\":\"test\",\"BodyText\":null,\"LastModifiedDate\":null,\"Title\":\"test title\",\"Visibility\":0}"));
        }
        [TestMethod]
        public void EnsureObjectCreatorFunctionIsEmitted()
        {
            var model = new JournalEntry()
            {
                Id = "1",
                Owner = "test",
                Title = "test title",
            };

            var serialiser = new JsonModelSerialiser();
            var scriptObj = serialiser.CreateJsonModelDefinition<JournalEntry>(model, "JournalEntry");
            var result = serialiser.AddCreateObjectHelperRoutineToModelDefinition("JournalEntry");

            Assert.IsFalse(string.IsNullOrWhiteSpace(result));
        }
    }
}
