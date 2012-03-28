using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WhereItGoes.Model
{
	public class Transaction
	{
		public Guid Id { get; set; }
		public double Value { get; set; }
		public DateTime Date { get; set; }
		public string Description { get; set; }
		public virtual Category Category { get; set; }

		public virtual User Owner { get; set; }
	}
}
