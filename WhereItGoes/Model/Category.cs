using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WhereItGoes.Model
{
	public class Category : ICategory
	{
		public string Name { get; set; }

		public Guid Id { get; set; }
	}
}
