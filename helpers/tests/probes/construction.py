import inspect
import json

from pydantic import BaseModel
import trinsic_api
from trinsic_api import GetSessionResultRequest


request = GetSessionResultRequest(
    results_access_key="results-key", redirect_token="redirect-token"
)
expected = {"resultsAccessKey": "results-key", "redirectToken": "redirect-token"}
assert json.loads(request.to_json()) == expected, "Keyword fields were rebound"
assert GetSessionResultRequest.from_json(request.to_json()).to_dict() == expected

for args in [("results-key",), ("results-key", "redirect-token"), (expected,)]:
    try:
        GetSessionResultRequest(*args)
    except TypeError as error:
        assert "positional" in str(error), error
    else:
        raise AssertionError(f"Positional model construction accepted: {args}")

# Check every generated Pydantic model, including any new upstream model shape.
models = [
    model for model in vars(trinsic_api).values()
    if inspect.isclass(model)
    and model.__module__.startswith("trinsic_api.models.")
    and issubclass(model, BaseModel)
]
assert models, "No generated models were inspected"
for model in models:
    parameters = list(inspect.signature(model.__init__).parameters.values())[1:]
    assert all(parameter.kind in (parameter.KEYWORD_ONLY, parameter.VAR_KEYWORD)
               for parameter in parameters), f"Positional model fields: {model}"
print(f"Keyword construction and JSON behavior passed for {len(models)} model signatures")
