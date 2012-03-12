using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace WhereItGoes.Web
{
	public class JsonNetResult : ActionResult
	{
		public Encoding ContentEncoding { get; set; }
		public string ContentType { get; set; }
		public object Data { get; set; }

		public JsonSerializerSettings SerializerSettings { get; set; }
		public Formatting Formatting { get; set; }

		public JsonNetResult()
		{
			SerializerSettings = new JsonSerializerSettings()
				{
					ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
					ContractResolver      = new ContractResolver()
				};
		}

		public override void ExecuteResult(ControllerContext context)
		{
			if (context == null)
				throw new ArgumentNullException("context");

			HttpResponseBase response = context.HttpContext.Response;

			response.ContentType = !string.IsNullOrEmpty(ContentType)
			  ? ContentType
			  : "application/json";

			if (ContentEncoding != null)
				response.ContentEncoding = ContentEncoding;

			if (Data != null)
			{
				JsonTextWriter writer = new JsonTextWriter(response.Output) { Formatting = Formatting };

				JsonSerializer serializer = JsonSerializer.Create(SerializerSettings);
				serializer.Serialize(writer, Data);

				writer.Flush();
			}
		}
	}

	class ContractResolver : DefaultContractResolver
	{
		protected override List<System.Reflection.MemberInfo> GetSerializableMembers(Type objectType)
		{
			if (objectType.Namespace.StartsWith("System.Data.Entity.Dynamic"))
			{
				return base.GetSerializableMembers(objectType.BaseType);
			}

			return base.GetSerializableMembers(objectType);
		}
	}
}