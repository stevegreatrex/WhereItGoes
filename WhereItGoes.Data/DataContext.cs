using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using WhereItGoes.Model;

namespace WhereItGoes.Data
{
	public class DataContext : DbContext
	{
		public DbSet<Category> Categories { get; set; }
		public DbSet<Transaction> Transactions { get; set; }
		public DbSet<Rule> Rules { get; set; }
		public DbSet<User> Users { get; set; }

		protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<User>().HasKey(u => u.UserName);
			
			modelBuilder.Entity<Category>()
					.HasMany<Rule>(c => c.Rules)
					.WithRequired(r => r.Result)
					.WillCascadeOnDelete();

			modelBuilder.Entity<Transaction>()
					.HasOptional<Category>(t => t.Category);

			modelBuilder.Entity<Category>()
				.HasRequired<User>(c => c.Owner);

			modelBuilder.Entity<Transaction>()
				.HasRequired<User>(c => c.Owner);
		}
	}
}
