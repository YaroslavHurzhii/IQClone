using Newtonsoft.Json.Linq;
using webapi.DB;

namespace webapi.Utils
{
    public static class JSONConvertor
    {
        public static object ConvertToJSON(object a)
        {
            if (a.GetType() == typeof(List<Room>))
            {
                var obj = ((List<Room>)a)[0];
                var result = new JObject{
                { "title", obj.Title },
                { "users", UsersToJarray(obj.Users) },
                { "messages", MessagesToJarray(obj.Messages) }
                };

                return result.ToString();
            }
            else if (a.GetType() == typeof(Message))
            {
                var m = (Message)a;
                var jObject = new JObject();
                jObject["Id"] = m.Id;
                jObject["sender"] = m.Sender;
                jObject["content"] = m.Content;
                jObject["time"] = m.Timestamp;
                return jObject.ToString();
            }
            else if (a.GetType() == typeof(User))
            {
                var u = (User)a;
                var jObject = new JObject();
                jObject["Id"] = u.Id;
                jObject["Name"] = u.Name;
                return jObject.ToString();
            }
            return null;
        }

        private static JArray UsersToJarray(List<User> a)
        {
            var arr = new JArray();
            foreach (User u in a)
            {
                var jObject = new JObject();
                jObject["Id"] = u.Id;
                jObject["Name"] = u.Name;
                arr.Add(jObject);
            }
            return arr;
        }
        private static JArray MessagesToJarray(List<Message> a)
        {
            var arr = new JArray();
            foreach (Message m in a)
            {
                var jObject = new JObject();
                jObject["Id"] = m.Id;
                jObject["sender"] = m.Sender;
                jObject["content"] = m.Content;
                jObject["time"] = m.Timestamp;
                arr.Add(jObject);
            }
            return arr;
        }
    }
}
