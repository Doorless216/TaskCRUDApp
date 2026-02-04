using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using Microsoft.Extensions.Configuration;
using TodoListModels;

namespace TodoListDataLayer;

public class TodoListDbContext : DbContext
{
    public DbSet<TodoListItem> TodoListItems { get; set; }

    public TodoListDbContext()
    {
        //blank
    }

    public TodoListDbContext(DbContextOptions options)
    : base(options)
    {
        //blank
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.Options.Extensions.OfType<SqlServerOptionsExtension>().Any())
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            var connStr = config.GetConnectionString("TodoListDbConnection");
            optionsBuilder.UseSqlServer(connStr);
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TodoListItem>(entity =>
        {
            entity.ToTable("Tasks");

            // Map C# properties to database columns
            entity.Property(e => e.Name)
                .HasColumnName("Title");

            entity.Property(e => e.IsComplete)
                .HasColumnName("IsCompleted");

            // Ignore Description since it doesn't exist in the table
            entity.Ignore(e => e.Description);
        });
    }
}
