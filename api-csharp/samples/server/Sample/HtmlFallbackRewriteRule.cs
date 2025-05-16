using Microsoft.AspNetCore.Rewrite;

public class HtmlFallbackRewriteRule : IRule
{
    public void ApplyRule(RewriteContext context)
    {
        var path = context.HttpContext.Request.Path.Value;

        // Skip if it already has an extension or is root
        if (string.IsNullOrEmpty(path) || Path.HasExtension(path)) return;

        var env = context.HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>();
        if (path.Equals("/"))
        {
            path = "/index";
        }
        var staticFilePath = Path.Combine(env.WebRootPath, path.TrimStart('/') + ".html");
        

        if (File.Exists(staticFilePath))
        {
            context.HttpContext.Request.Path = new PathString(path + ".html");
            context.Result = RuleResult.SkipRemainingRules;
        }

        
    }
}