using System;
namespace Journaliser.Logic.Domain.Serialisation
{
    public interface IModelSerialiser
    {
        string AddCreateObjectHelperRoutineToModelDefinition(string jsonObject, string modelObjectName);
        string CreateJsonModelDefinition<T>(T model, string modelObjectName);
    }
}
