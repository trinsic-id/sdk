"""
ServiceResults Python Package

This package provides standardized result handling and exchange functionality
for the Trinsic SDK.
"""

from .exchange_result_request import ExchangeResultRequest
from .result_exchanger import ResultExchanger, SessionsApiInterface
from .result_processor import ResultProcessor, ProcessedResult, ValidationError

__version__ = "1.0.0"
__author__ = "Trinsic ID"
__email__ = "support@trinsic.id"

__all__ = [
    "ExchangeResultRequest",
    "ResultExchanger", 
    "SessionsApiInterface",
    "ResultProcessor",
    "ProcessedResult",
    "ValidationError",
]