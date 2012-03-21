﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Web.Mvc;
using WhereItGoes.Data;
using WhereItGoes.Model;
using System.IO;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace WhereItGoes.Web.Controllers
{
	public class HomeController : Controller
	{
		private DataContext _db = new DataContext();

		#region Views
		
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult Categories()
		{
			return View();
		}

		public ActionResult UploadStatements()
		{
			return View();
		}

		#endregion

		#region Postbacks & Json

		[HttpPost]
		public ActionResult Analyse(DateTime from, DateTime to)
		{
			var transactions = _db.Transactions.Where(t => t.Date >= from && t.Date <= to);
			var result = BuildResults(transactions);

			return SafeJson(result);
		}

		[HttpPost]
		public ActionResult RecategoriseAll(DateTime from, DateTime to)
		{
			var recategorised = CategoriseTransactions(_db.Transactions.Where(t => t.Date >= from && t.Date <= to)).ToList();
			_db.SaveChanges();
			var result = BuildResults(recategorised);
			return SafeJson(result);
		}

		[HttpPost]
		public ActionResult GetCategories()
		{
			return SafeJson(_db.Categories.OrderBy(c => c.Name).ToList());
		}

		[HttpPost]
		public ActionResult AddCategory()
		{
			var category = new Category
			{
				Id = Guid.NewGuid(),
				Name = "New Category"
			};

			_db.Categories.Add(category);
			_db.SaveChanges();

			return SafeJson(category);
		}

		[HttpPost]
		public ActionResult AddRule(Category category)
		{
			var match = _db.Categories.First(c => c.Id == category.Id);
			var rule = new Rule
			{
				Id = Guid.NewGuid(),
				Name = "New Rule",
				Pattern = "^[a-zA-Z0-9]*$",
				Result = match
			};

			if (match.Rules == null) match.Rules = new List<Rule>();

			match.Rules.Add(rule);
			_db.SaveChanges();

			return SafeJson(rule);
		}

		[HttpPost]
		public ActionResult SaveCategory(Category category)
		{
			_db.Categories.AddOrUpdate(category);

			if (category.Rules != null)
			{
				foreach (var rule in category.Rules)
				{
					_db.Rules.AddOrUpdate(rule);
				}
			}

			_db.SaveChanges();

			return SafeJson(true);
		}

		[HttpPost]
		public ActionResult RemoveCategory(Category category)
		{
			var match = _db.Categories.FirstOrDefault(c => c.Id == category.Id);
			if (match == null) return SafeJson(false);

			foreach (var transaction in _db.Transactions)
			{
				if (transaction.Category == match)
					transaction.Category = null;
			}

			_db.Categories.Remove(match);
			_db.SaveChanges();

			return SafeJson(true);
		}

		[HttpPost]
		public ActionResult UploadStatement(HttpPostedFileBase file)
		{
			var transactions = ReadTransactions(file.InputStream);
			var categorised  = CategoriseTransactions(transactions).ToList();

			foreach (var item in categorised)
			{
				_db.Transactions.Add(item);
			}
			_db.SaveChanges();

			return SafeJson(BuildResults(categorised));
		}

		#endregion

		#region Protected & Private Members

		private ActionResult SafeJson(object data)
		{
			var result        = new JsonNetResult();
			result.Formatting = Formatting.Indented;
			result.Data       = data;
			return result;
		}

		protected override void Dispose(bool disposing)
		{
			base.Dispose(disposing);

			if (disposing)
			{
				if (_db != null) _db.Dispose();
			}
		}

		private IEnumerable<Transaction> CategoriseTransactions(IEnumerable<Transaction> transactions)
		{
			var rules = _db.Rules.ToList() //extra ToList here to prevent Linq-to-Entities problems
							.Select(r => new
							{
								Rule = r,
								Pattern = new Regex(r.Pattern)
							}).ToList();

			foreach (var transaction in transactions)
			{
				foreach (var rule in rules)
				{
					if (rule.Pattern.IsMatch(transaction.Description))
					{
						transaction.Category = rule.Rule.Result;
						break;
					}
				}

				yield return transaction;
			}
		}

		private static IEnumerable<Transaction> ReadTransactions(Stream stream)
		{
			using (var reader = new StreamReader(stream))
			{
				var line = reader.ReadLine();
				
				//skip the first line - it contains headers
				line = reader.ReadLine();

				while (!reader.EndOfStream)
				{
					yield return ReadTransaction(line);
					line = reader.ReadLine();
				}
			}
		}

		private static Transaction ReadTransaction(string line)
		{
			var segments = line.Split(',');

			return new Transaction
			{
				Id          = Guid.NewGuid(),
				Date        = DateTime.Parse(segments[0]),
				Description = segments[2].TrimStart('"').TrimEnd('"'),
				Value       = double.Parse(segments[3])
			};
		}

		private static AnalysisResult BuildResults(IEnumerable<Transaction> transactions)
		{
			var result = new AnalysisResult();
			foreach (var transaction in transactions)
				result.Transactions.Add(transaction);

			foreach (var summary in transactions.Where(t => t.Value <= 0).GroupBy(t => t.Category))
			{
				var category = summary.Key ?? Category.Unknown;
				var total = summary.Sum(s => s.Value);
				result.TotalExpenditure -= total;
				result.Expenditure.Add(new object[] { string.Format("{0} ({1:c})", category.Name, Math.Abs(total)), total });
			}
			return result;
		}

		#endregion
	}
}
