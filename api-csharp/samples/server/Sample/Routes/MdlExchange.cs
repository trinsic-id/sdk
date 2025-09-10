using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;
using Trinsic.Api.Api;
using Trinsic.Api.Model;

namespace Sample;

public static class MdlExchange
{
    public static void MapMdlExchangeRoutes(this WebApplication app, IMdlApi mdlApi)
    {
        app.MapPost("/mdl/create",
            async (HttpContext context) =>
            {
                var request = await context.Request.ReadFromJsonAsync<MdlCreateBody>();

                // Assume a namespace of "org.iso.18013.5.1" for now
                var nameSpaces = new Dictionary<string, Dictionary<string, bool>>();
                nameSpaces["org.iso.18013.5.1"] = new Dictionary<string, bool>();
                foreach (var field in request!.RequestedFields)
                {
                    nameSpaces["org.iso.18013.5.1"][field] = request.WillRetain;
                }

                var apiRequest = new CreateMdlExchangeRequest(
                    documentType: request.DocumentType,
                    exchangeMechanism: MdlExchangeMechanism.DigitalCredentialsApi,
                    nameSpaces: nameSpaces,
                    provider: request.ProviderId,
                    verificationProfileId: Guid.Parse(request.VerificationProfileId),
                    digitalCredentialsApiHost: context.Request.Host.Host
                );

                var response = await mdlApi.CreateMdlExchangeAsync(apiRequest);
                response.LogAndThrowIfError(app.Logger);

                var result = response.Ok();
                await context.Response.WriteAsJsonAsync(result, new JsonSerializerOptions()
                {
                    Converters = { new JsonStringEnumConverter() },
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
            });

        app.MapPost("/mdl/finalize", async context =>
        {
            var request = await context.Request.ReadFromJsonAsync<MdlFinalizeBody>();

            var apiRequest = new FinalizeMdlExchangeRequest(request.ExchangeContext, Guid.Parse(request.ExchangeId),
                request.Token, Guid.Parse(request.VerificationProfileId));


            var response = await mdlApi.FinalizeMdlExchangeAsync(apiRequest);
            response.LogAndThrowIfError(app.Logger);

            var result = response.Ok();
            await context.Response.WriteAsJsonAsync(result, new JsonSerializerOptions()
            {
                Converters = { new JsonStringEnumConverter() },
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        });
    }
}

public record MdlCreateBody(
    string VerificationProfileId,
    string ProviderId,
    string DocumentType,
    string[] RequestedFields,
    bool WillRetain);

public record MdlFinalizeBody(string VerificationProfileId, string ExchangeId, string ExchangeContext, string Token);