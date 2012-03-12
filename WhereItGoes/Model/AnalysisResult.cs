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
			this.CategoryCounts  = new Dictionary<Category,int>();
			this.AllTransactions = new List<Transaction>();
		}

		public Dictionary<Category, int> CategoryCounts { get; private set; }

		public ICollection<Transaction> AllTransactions { get; private set; }
	}
}
