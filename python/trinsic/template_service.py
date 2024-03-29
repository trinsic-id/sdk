from grpclib.client import Channel

from trinsic.proto.sdk.options.v1 import TrinsicOptions
from trinsic.proto.services.verifiablecredentials.templates.v1 import *

from trinsic.service_base import ServiceBase

import deprecation


class TemplateService(ServiceBase):
    """Wrapper for the [Credential Templates Service](/reference/services/CredentialTemplates-service/)"""

    def __init__(
        self,
        *,
        server_config: TrinsicOptions | Channel = None,
    ):
        """
        Initialize a connection to the server.
        Args:
            server_config: The URL of the server, or a channel which encapsulates the connection already.
        """
        super().__init__(server_config)
        self.client = CredentialTemplatesStub(super().channel)

    async def search_template(
        self, *, request: SearchCredentialTemplatesRequest
    ) -> SearchCredentialTemplatesResponse:
        request.query = request.query or "SELECT * from c OFFSET 0 LIMIT 100"
        return await self.client.search(search_credential_templates_request=request)

    # BEGIN Code generated by protoc-gen-trinsic. DO NOT EDIT.
    # target: /home/runner/work/sdk/sdk/python/trinsic/template_service.py

    async def create(
        self, *, request: CreateCredentialTemplateRequest
    ) -> CreateCredentialTemplateResponse:
        """Create a credential template in the current ecosystem"""

        return await self.client.create(request, metadata=self.build_metadata(request))

    async def get(
        self, *, request: GetCredentialTemplateRequest
    ) -> GetCredentialTemplateResponse:
        """Fetch a credential template by ID"""

        return await self.client.get(request, metadata=self.build_metadata(request))

    async def update(
        self, *, request: UpdateCredentialTemplateRequest
    ) -> UpdateCredentialTemplateResponse:
        """Update metadata of a template"""

        return await self.client.update(request, metadata=self.build_metadata(request))

    async def list(
        self, *, request: ListCredentialTemplatesRequest
    ) -> ListCredentialTemplatesResponse:
        """Search credential templates using SQL, returning strongly-typed template data"""

        return await self.client.list(request, metadata=self.build_metadata(request))

    async def search(
        self, *, request: SearchCredentialTemplatesRequest
    ) -> SearchCredentialTemplatesResponse:
        """Search credential templates using SQL, returning raw JSON data"""

        return await self.client.search(request, metadata=self.build_metadata(request))

    async def delete(
        self, *, request: DeleteCredentialTemplateRequest
    ) -> DeleteCredentialTemplateResponse:
        """Delete a credential template from the current ecosystem by ID"""

        return await self.client.delete(request, metadata=self.build_metadata(request))

    @deprecation.deprecated(details="This method is experimental")
    async def create_verification_template(
        self, *, request: CreateVerificationTemplateRequest
    ) -> CreateVerificationTemplateResponse:
        """
        This method is experimental
          Create/update verification templates
        """

        return await self.client.create_verification_template(
            request, metadata=self.build_metadata(request)
        )

    @deprecation.deprecated(details="This method is experimental")
    async def list_verification_templates(
        self, *, request: ListVerificationTemplatesRequest
    ) -> ListVerificationTemplatesResponse:
        """This method is experimental"""

        return await self.client.list_verification_templates(
            request, metadata=self.build_metadata(request)
        )

    @deprecation.deprecated(details="This method is experimental")
    async def get_verification_template(
        self, *, request: GetVerificationTemplateRequest
    ) -> GetVerificationTemplateResponse:
        """This method is experimental"""

        return await self.client.get_verification_template(
            request, metadata=self.build_metadata(request)
        )

    @deprecation.deprecated(details="This method is experimental")
    async def update_verification_template(
        self, *, request: UpdateVerificationTemplateRequest
    ) -> UpdateVerificationTemplateResponse:
        """This method is experimental"""

        return await self.client.update_verification_template(
            request, metadata=self.build_metadata(request)
        )

    @deprecation.deprecated(details="This method is experimental")
    async def delete_verification_template(
        self, *, request: DeleteVerificationTemplateRequest
    ) -> DeleteVerificationTemplateResponse:
        """This method is experimental"""

        return await self.client.delete_verification_template(
            request, metadata=self.build_metadata(request)
        )


# END Code generated by protoc-gen-trinsic. DO NOT EDIT.
