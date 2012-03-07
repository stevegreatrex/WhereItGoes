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

		public ActionResult Index()
		{
			return View();
		}

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
