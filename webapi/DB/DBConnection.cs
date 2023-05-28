using Microsoft.EntityFrameworkCore;


namespace webapi.DB
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=Chat.db");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Room>()
                .HasKey(r => r.Id);
            modelBuilder.Entity<Room>()
                .HasMany(b => b.Users)
                .WithMany(s => s.Rooms)
                .UsingEntity(j => j.ToTable("Enrollments"));
            modelBuilder.Entity<Room>()
                .HasMany(b => b.Messages);
        }
    }
}
