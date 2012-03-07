using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
