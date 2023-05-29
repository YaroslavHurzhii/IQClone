using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using webapi.DB;

namespace webapi.hub
{
    [EnableCors("FCORS")]
    public class ChatHub : Hub
    {
        private ApplicationContext _context;
        public ChatHub(ApplicationContext db)
        {

            _context = db;
        }

        private object ConvertToJSON(object a)
        {
            if (a.GetType() == typeof(List<Room>))
            {
                var obj = ((List<Room>)a)[0];
                var result = new JObject{
                { "id", obj.Id},
                { "title", obj.Title },
                { "password", obj.Password },
                { "users", UsersToJarray(obj.Users) },
                { "messages", MessagesToJarray(obj.Messages) }
                };

                return result.ToString();
            }
            return null;
        }

        private JArray UsersToJarray(List<User> a)
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
        private JArray MessagesToJarray(List<Message> a)
        {
            var arr = new JArray();
            foreach (Message m in a)
            {
                var jObject = new JObject();
                jObject["Id"] = m.Id;
                jObject["sender"] = m.Sender;
                jObject["content"] = m.Content;
                arr.Add(jObject);
            }
            return arr;
        }
        public async Task JoinRoom(Modaldata d)
        {
            if (await _context.Rooms.AllAsync(e => e.Title != d.RoomName))
                await Clients.Caller.SendAsync("setupError", "Room with such name does not exist");
            else if (await _context.Rooms.AnyAsync(e => e.Title == d.RoomName && e.Password != d.Password))
                await Clients.Caller.SendAsync("setupError", "Wrong password");
            else
            {
                AddUserToRoom(d.UserName, d.RoomName);
                Room? r = await _context.Rooms.FirstOrDefaultAsync(r => r.Title == d.RoomName && r.Password == d.Password);
                await Groups.AddToGroupAsync(Context.ConnectionId, d.RoomName);
                var info = _context.Rooms.Where(t => t.Title == d.RoomName).Include(r => r.Users).Include(r => r.Messages).ToList();
                await Clients.Caller.SendAsync("JoinR", ConvertToJSON(info));
                User? user = await _context.Users.FirstOrDefaultAsync(r => r.Name == d.UserName);
                await Clients.Group(d.RoomName).SendAsync("NewUser", ConvertToJSON(user));
            }
        }
        public async Task CreateRoom(Modaldata d)
        {
            if (await _context.Rooms.AnyAsync(e => e.Title == d.RoomName))
            {
                await Clients.Caller.SendAsync("setupError", "Room with such name already created");
            }
            else
            {
                Room room = new Room { Title = d.RoomName, Password = d.Password };
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();
                AddUserToRoom(d.UserName, d.RoomName);
                await Groups.AddToGroupAsync(Context.ConnectionId, d.RoomName);
                var users = _context.Rooms.Where(r => r.Title == d.RoomName).Include(r => r.Users).Include(r => r.Messages).ToList();
                await Clients.Group(d.RoomName).SendAsync("JoinR", users);
            }
        }

        public async Task SendMessage(Mesdata d)
        {

            Message m = new Message { Content = d.Message, Sender = d.UserName };
            await _context.Messages.AddAsync(m);
            Room? r = await _context.Rooms.FirstOrDefaultAsync(r => r.Title == d.RoomName);
            r.Messages.Add(m);
            await _context.SaveChangesAsync();
            Message? mes = await _context.Messages.FirstOrDefaultAsync(m => m.Content == d.Message);
            await Clients.Group(d.RoomName).SendAsync("ReciveMessage", ConvertToJSON(mes));
        }

        private async void AddUserToRoom(string username, string room)
        {
            Room? r = await _context.Rooms.FirstOrDefaultAsync(r => r.Title == room);
            User us = await _context.Users.FirstOrDefaultAsync(u => u.Name == username);
            if (await _context.Users.AllAsync(u => u.Name != username))
            {
                us = new User { Name = username };
                await _context.Users.AddAsync(us);

            }
            if (us != null)
            {
                if (!r.Users.Contains(us))
                {
                    r.Users.Add(us);
                }

                await _context.SaveChangesAsync();
            }
        }
        public record class Mesdata(string RoomName, string Message, string UserName);
        public record class Modaldata(string RoomName, string Password, string UserName);
    }
}
