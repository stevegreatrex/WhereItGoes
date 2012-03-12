using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WhereItGoes.Model
{
	public class AnalysisResult
	{
		public AnalysisResult()
		{
			this.CategoryCounts  = new List<object[]>();
			this.Transactions = new List<Transaction>();
		}

		public List<object[]> CategoryCounts { get; private set; }

		public ICollection<Transaction> Transactions { get; private set; }
	}
}
