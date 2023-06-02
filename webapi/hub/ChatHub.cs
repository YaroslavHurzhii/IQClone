using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using webapi.Utils;
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
                await Clients.Caller.SendAsync("JoinR", JSONConvertor.ConvertToJSON(info));
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
                var info = _context.Rooms.Where(t => t.Title == d.RoomName).Include(r => r.Users).Include(r => r.Messages).ToList();
                await Clients.Caller.SendAsync("JoinR", JSONConvertor.ConvertToJSON(info));
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
            await Clients.Group(d.RoomName).SendAsync("ReciveMessage", JSONConvertor.ConvertToJSON(mes));
        }

        private async void AddUserToRoom(string username, string room)
        {
            Room? r = await _context.Rooms.FirstOrDefaultAsync(r => r.Title == room);
            User us = await _context.Users.FirstOrDefaultAsync(u => u.Name == username);
            if (await _context.Users.AllAsync(u => u.Name != username))
            {
                us = new User { Name = username };
                await _context.Users.AddAsync(us);
                try
                {
                    r.Users.Add(us);
                    await _context.SaveChangesAsync();
                    await Clients.Group(r.Title).SendAsync("NewUser", JSONConvertor.ConvertToJSON(us));
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }
        public record class Mesdata(string RoomName, string Message, string UserName);
        public record class Modaldata(string RoomName, string Password, string UserName);
    }
}
