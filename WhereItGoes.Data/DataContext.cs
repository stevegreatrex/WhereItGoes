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
	}
}
