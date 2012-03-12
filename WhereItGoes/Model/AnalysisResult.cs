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
			this.Expenditure  = new List<object[]>();
			this.Transactions = new List<Transaction>();
		}

		public List<object[]> Expenditure { get; private set; }
		public double TotalExpenditure { get; set; }

		public ICollection<Transaction> Transactions { get; private set; }
	}
}
