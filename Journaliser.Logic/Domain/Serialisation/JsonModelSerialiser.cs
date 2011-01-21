using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Journaliser.Logic.Domain.Model;
using System.Runtime.Serialization.Json;
using System.IO;

namespace Journaliser.Logic.Domain.Serialisation
{
    public class JsonModelSerialiser : IModelSerialiser
    {
        public string CreateJsonModelDefinition<T>(T model, string modelObjectName)
        {
            var serialisedModel = GetSerialisedJsonData<T>(model);
            var variableDefinition = MakeJsonVariableDefinition(serialisedModel, modelObjectName);
            return variableDefinition;
        }

        public string AddCreateObjectHelperRoutineToModelDefinition(string modelObjectName)
        {
            string objCreator = "function " + modelObjectName + "Creator() { return Object.Create(__" + modelObjectName+"); }";
            return objCreator;
        }

        private string MakeJsonVariableDefinition(string serialisedModel,string modelObjectName)
        {
            var varDefn = string.Format("var __{0} = {1}", modelObjectName, serialisedModel);
            return varDefn;
        }

        private string GetSerialisedJsonData<T>(T model)
        {
            var serialiser = new DataContractJsonSerializer(typeof(T));
            var stream = new MemoryStream();
            serialiser.WriteObject(stream, model);
            stream.Position = 0;
            StreamReader reader = new StreamReader(stream);
            var js = reader.ReadToEnd();
            return js;
        }
    }
}
