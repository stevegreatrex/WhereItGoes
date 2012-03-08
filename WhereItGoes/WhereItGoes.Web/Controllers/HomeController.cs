using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Web.Mvc;
using WhereItGoes.Data;
using WhereItGoes.Model;

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

		#endregion

		#region Json
		
		[HttpPost]
		public ActionResult GetCategories()
		{
			return Json(_db.Categories.OrderBy(c => c.Name).ToList());
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

			return Json(category);
		}

		[HttpPost]
		public ActionResult SaveCategory(Category category)
		{
			var match = _db.Categories.FirstOrDefault(c => c.Id == category.Id);
			if (match == null) return Json(false);

			match.Name = category.Name;
			_db.SaveChanges();

			return Json(true);
		}

		[HttpPost]
		public ActionResult RemoveCategory(Category category)
		{
			var match = _db.Categories.FirstOrDefault(c => c.Id == category.Id);
			if (match == null) return Json(false);

			_db.Categories.Remove(match);
			_db.SaveChanges();

			return Json(true);
		}

		#endregion

		protected override void Dispose(bool disposing)
		{
			base.Dispose(disposing);

			if (disposing)
			{
				if (_db != null) _db.Dispose();
			}
		}
	}
}
