using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;

namespace WhereItGoes.Data.Migrations
{
    public class Configuration : DbMigrationsConfiguration<DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }
    }
}
