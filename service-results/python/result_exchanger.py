"""
Service for exchanging result access keys and retrieving session results
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Any, List, Dict, Optional, Tuple, Union
import concurrent.futures

from .exchange_result_request import ExchangeResultRequest


class SessionsApiInterface(ABC):
    """Abstract interface for the Trinsic sessions API"""
    
    @abstractmethod
    def get_session_result(self, session_id: str, request: Dict[str, Any]) -> Any:
        """Gets session result from the API"""
        pass
    
    @abstractmethod
    async def get_session_result_async(self, session_id: str, request: Dict[str, Any]) -> Any:
        """Gets session result from the API asynchronously"""
        pass


class ResultExchanger:
    """Service for exchanging result access keys and retrieving session results"""
    
    def __init__(self, sessions_api: SessionsApiInterface):
        """
        Initialize the ResultExchanger
        
        Args:
            sessions_api: The Trinsic sessions API instance
            
        Raises:
            ValueError: If sessions_api is None
        """
        if sessions_api is None:
            raise ValueError("sessions_api cannot be None")
        
        self._sessions_api = sessions_api
    
    def exchange_result(self, request: ExchangeResultRequest) -> Any:
        """
        Exchange a result access key for the actual session results
        
        Args:
            request: The exchange request containing session ID and access key
            
        Returns:
            The session result
            
        Raises:
            ValueError: If request validation fails
            Exception: If API call fails
        """
        if request is None:
            raise ValueError("request cannot be None")
        
        # Validation is already done in the request __post_init__
        
        try:
            # Create the API request
            api_request = {
                "resultsAccessKey": request.results_access_key
            }
            
            # Call the API
            return self._sessions_api.get_session_result(request.session_id, api_request)
        except Exception as e:
            raise Exception(f"Failed to exchange result: {str(e)}") from e
    
    async def exchange_result_async(self, request: ExchangeResultRequest) -> Any:
        """
        Exchange a result access key for the actual session results asynchronously
        
        Args:
            request: The exchange request containing session ID and access key
            
        Returns:
            The session result
            
        Raises:
            ValueError: If request validation fails
            Exception: If API call fails
        """
        if request is None:
            raise ValueError("request cannot be None")
        
        try:
            # Create the API request
            api_request = {
                "resultsAccessKey": request.results_access_key
            }
            
            # Call the API asynchronously
            return await self._sessions_api.get_session_result_async(request.session_id, api_request)
        except Exception as e:
            raise Exception(f"Failed to exchange result: {str(e)}") from e
    
    def exchange_multiple_results(self, requests: List[ExchangeResultRequest]) -> Tuple[List[Any], List[Optional[str]]]:
        """
        Exchange multiple result access keys
        
        Args:
            requests: List of exchange requests
            
        Returns:
            Tuple of (results, errors) where errors contains error messages or None for successful requests
        """
        if not isinstance(requests, list):
            raise ValueError("requests must be a list")
        
        results = []
        errors = []
        
        for request in requests:
            try:
                result = self.exchange_result(request)
                results.append(result)
                errors.append(None)
            except Exception as e:
                results.append(None)
                errors.append(str(e))
        
        return results, errors
    
    async def exchange_multiple_results_async(self, requests: List[ExchangeResultRequest]) -> Tuple[List[Any], List[Optional[str]]]:
        """
        Exchange multiple result access keys concurrently
        
        Args:
            requests: List of exchange requests
            
        Returns:
            Tuple of (results, errors) where errors contains error messages or None for successful requests
        """
        if not isinstance(requests, list):
            raise ValueError("requests must be a list")
        
        async def exchange_single(request: ExchangeResultRequest) -> Tuple[Any, Optional[str]]:
            try:
                result = await self.exchange_result_async(request)
                return result, None
            except Exception as e:
                return None, str(e)
        
        # Execute all requests concurrently
        tasks = [exchange_single(request) for request in requests]
        completed = await asyncio.gather(*tasks)
        
        results = [item[0] for item in completed]
        errors = [item[1] for item in completed]
        
        return results, errors
    
    def exchange_result_with_retry(self, request: ExchangeResultRequest, max_retries: int = 3, 
                                 retry_delay: float = 1.0) -> Any:
        """
        Exchange a result with retry logic
        
        Args:
            request: The exchange request
            max_retries: Maximum number of retry attempts
            retry_delay: Delay between retries in seconds
            
        Returns:
            The session result
            
        Raises:
            ValueError: If request validation fails
            Exception: If all retry attempts fail
        """
        import time
        
        last_exception = None
        
        for attempt in range(max_retries + 1):
            try:
                return self.exchange_result(request)
            except ValueError:
                # Don't retry validation errors
                raise
            except Exception as e:
                last_exception = e
                
                if attempt < max_retries:
                    time.sleep(retry_delay)
                    
        raise Exception(f"Failed to exchange result after {max_retries + 1} attempts: {str(last_exception)}") from last_exception