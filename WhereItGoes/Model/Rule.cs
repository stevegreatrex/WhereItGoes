using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WhereItGoes.Model
{
	public class Rule
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string Pattern { get; set; }
		public Category Result { get; set; }
	}
}
