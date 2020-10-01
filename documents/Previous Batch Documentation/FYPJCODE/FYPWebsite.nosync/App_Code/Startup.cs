using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FYPWebsite.Startup))]
namespace FYPWebsite
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
