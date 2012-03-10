using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using WhereItGoes.Model;

namespace WhereItGoes.Data.Migrations
{
    public class Configuration : DbMigrationsConfiguration<DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
			AutomaticMigrationDataLossAllowed = true;
        }

		protected override void Seed(DataContext context)
		{
			base.Seed(context);

			//context.Categories.AddOrUpdate(new[] {
			//    new Category { Id = Guid.NewGuid(), Name = "Category 1" },
			//    new Category { Id = Guid.NewGuid(), Name = "Category 2" },
			//    new Category { Id = Guid.NewGuid(), Name = "Category 3" }
			//});
		}
    }
}
