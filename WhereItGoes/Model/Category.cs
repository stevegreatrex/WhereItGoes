using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WhereItGoes.Model
{
	public class Category
	{
		public string Name { get; set; }

		public Guid Id { get; set; }

		public virtual User Owner { get; set; }

		public virtual ICollection<Rule> Rules { get; set; }

		public static readonly Category Unknown = new Category
		{
			Id   = Guid.Parse("2DE0C6C5-7A6C-45BF-9636-2B7E78A9E828"),
			Name = "Uncategorised"
		};
	}
}
