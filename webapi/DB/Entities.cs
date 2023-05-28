
namespace webapi.DB
{
    public class Room
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = "";
        public string Password { get; set; } = "";
        public List<User> Users { get; set; } = new List<User>();
        public List<Message> Messages { get; set; } = new List<Message>();

    }
    public class User
    {
        public Guid Id { get; set; }= Guid.NewGuid();
        public string Name { get; set; } = "";
        public List<Room> Rooms { get; set; } = new List<Room>();
    }
    public class Message
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Sender { get; set; } = "";
        public string Content { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
