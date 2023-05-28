using Microsoft.EntityFrameworkCore;
using webapi.DB;
using webapi.hub;
using System.Text;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationContext>();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FCORS", builder => builder.WithOrigins("https://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials());
});

var app = builder.Build();

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("FCORS");

app.MapGet("/rooms",async (ApplicationContext db) =>{
    return await db.Rooms.ToListAsync();
});

app.MapGet("/room/{roomID}", async (string roomID, ApplicationContext db) => {
    return await db.Rooms.Where(r=>r.Title == roomID).Include(r => r.Users).Include(r => r.Messages).ToListAsync();
});
app.MapHub<ChatHub>("/chat");

app.Run();
record class Data(string RoomName, string password, string UserName);
