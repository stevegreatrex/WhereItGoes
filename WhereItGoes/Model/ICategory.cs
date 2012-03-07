using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WhereItGoes.Model
{
	public interface ICategory
	{
		Guid Id { get; set; }
		string Name { get; set; }
	}
}
