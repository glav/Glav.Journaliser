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
			var serialiser = new DataContractJsonSerializer(typeof(T));
			var stream = new MemoryStream();
			serialiser.WriteObject(stream, model);
			stream.Position = 0;
			StreamReader reader = new StreamReader(stream);
			var js = reader.ReadToEnd();
			return js;
        }

        public string AddCreateObjectHelperRoutineToModelDefinition(string jsonObject, string modelObjectName)
        {
            //Note: The method below is outputting a function that returns an object literal. 
            //      Ideally, this should be using the Object.create function but this is not present in many browsers
            //      and is only part of the latest ECMAScript spec

			// This outputs a function to return an object object as per below:
			//
			//<script type="text/javascript">
			//  function JournalEntryModelCreator() { 
			//      return {"CreatedDate":"\/Date(1310545280016+1000)\/",
			//              "Id":null,
			//               "ModifiedDate":null,
			//                "Owner":null,
			//                "BodyText":null,
			//                "LastModifiedDate":null,
			//                "Title":null,
			//                "Visibility":0
		    //             };
		    //   }
			//</script>

            string objCreator = "function " + modelObjectName + "ModelCreator() { return " + jsonObject + "; }";
            return objCreator;
        }

    }
}
