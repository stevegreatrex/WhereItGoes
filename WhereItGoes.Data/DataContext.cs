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
	}
}
