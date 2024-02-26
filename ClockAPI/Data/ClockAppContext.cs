using ClockAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClockAPI.Data
{
    public class ClockAppContext: DbContext
    {
        public ClockAppContext(DbContextOptions<ClockAppContext> context) : base(context)
        {
        }
        public DbSet<Alarms> Alarms { get; set; }
    }
}
