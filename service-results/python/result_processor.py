"""
Utility class for processing and validating session results
"""

from datetime import datetime
from dataclasses import dataclass
from typing import Any, List, Dict, Optional, Tuple, Union

from .exchange_result_request import ExchangeResultRequest


class ValidationError(Exception):
    """Custom validation error"""
    pass


@dataclass
class ProcessedResult:
    """Represents processed session result information"""
    
    session_id: Optional[str] = None
    state: Optional[str] = None
    fail_code: Optional[str] = None
    fail_reason: Optional[str] = None
    result_count: int = 0
    has_verifications: bool = False
    completed_at: Optional[datetime] = None
    processed_at: datetime = None
    
    def __post_init__(self):
        """Set processed_at to current time if not provided"""
        if self.processed_at is None:
            self.processed_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "sessionId": self.session_id,
            "state": self.state,
            "failCode": self.fail_code,
            "failReason": self.fail_reason,
            "resultCount": self.result_count,
            "hasVerifications": self.has_verifications,
            "completedAt": self.completed_at.isoformat() if self.completed_at else None,
            "processedAt": self.processed_at.isoformat() if self.processed_at else None,
        }


class ResultProcessor:
    """Utility class for processing and validating session results"""
    
    @staticmethod
    def validate_request(request: ExchangeResultRequest) -> None:
        """
        Validates an ExchangeResultRequest
        
        Args:
            request: The request to validate
            
        Raises:
            ValidationError: If request is None
            ValueError: If validation fails (raised by request.validate())
        """
        if request is None:
            raise ValidationError("request cannot be None")
        
        # The request validates itself in __post_init__
        # But we can call validate() again to be explicit
        try:
            request.validate()
        except ValueError as e:
            raise ValidationError(str(e)) from e
    
    @staticmethod
    def validate_multiple_requests(requests: List[ExchangeResultRequest]) -> Tuple[List[ExchangeResultRequest], List[Dict[str, Any]]]:
        """
        Validates multiple ExchangeResultRequest instances
        
        Args:
            requests: List of requests to validate
            
        Returns:
            Tuple of (valid_requests, invalid_requests) where invalid_requests contains error information
        """
        valid = []
        invalid = []
        
        for index, request in enumerate(requests):
            try:
                ResultProcessor.validate_request(request)
                valid.append(request)
            except (ValidationError, ValueError) as e:
                invalid.append({
                    "index": index,
                    "request": request,
                    "error": str(e)
                })
        
        return valid, invalid
    
    @staticmethod
    def process_session_result(result: Any) -> ProcessedResult:
        """
        Processes a session result and extracts common information
        
        Args:
            result: The session result to process
            
        Returns:
            ProcessedResult with extracted information
            
        Raises:
            ValueError: If result is None
        """
        if result is None:
            raise ValueError("result cannot be None")
        
        processed = ProcessedResult()
        
        # Extract fields from result (adjust based on actual API response structure)
        if isinstance(result, dict):
            # Handle dictionary result
            session = result.get("session", result)
            
            if isinstance(session, dict):
                processed.session_id = session.get("id") or session.get("sessionId")
                processed.state = session.get("state")
                processed.fail_code = session.get("failCode")
                processed.fail_reason = session.get("failReason")
                
                results_data = session.get("result", [])
                if isinstance(results_data, list):
                    processed.result_count = len(results_data)
                    processed.has_verifications = len(results_data) > 0
                
                # Parse completed_at timestamp
                updated_at = session.get("updatedAt")
                if updated_at:
                    try:
                        if isinstance(updated_at, str):
                            processed.completed_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                        elif isinstance(updated_at, datetime):
                            processed.completed_at = updated_at
                    except (ValueError, TypeError):
                        # If parsing fails, leave completed_at as None
                        pass
        elif hasattr(result, '__dict__'):
            # Handle object result
            session = getattr(result, 'session', result)
            
            processed.session_id = getattr(session, 'id', None) or getattr(session, 'session_id', None)
            processed.state = getattr(session, 'state', None)
            processed.fail_code = getattr(session, 'fail_code', None)
            processed.fail_reason = getattr(session, 'fail_reason', None)
            
            results_data = getattr(session, 'result', [])
            if hasattr(results_data, '__len__'):
                processed.result_count = len(results_data)
                processed.has_verifications = len(results_data) > 0
            
            # Parse completed_at timestamp
            updated_at = getattr(session, 'updated_at', None)
            if updated_at and isinstance(updated_at, datetime):
                processed.completed_at = updated_at
        
        return processed
    
    @staticmethod
    def sanitize_request_for_logging(request: ExchangeResultRequest) -> Dict[str, str]:
        """
        Sanitizes a request for logging (removes sensitive data)
        
        Args:
            request: The request to sanitize
            
        Returns:
            Dictionary with sensitive data redacted
        """
        if request is None:
            return {}
        
        return request.sanitize_for_logging()
    
    @staticmethod
    def sanitize_multiple_requests_for_logging(requests: List[ExchangeResultRequest]) -> List[Dict[str, str]]:
        """
        Sanitizes multiple requests for logging
        
        Args:
            requests: List of requests to sanitize
            
        Returns:
            List of sanitized request dictionaries
        """
        return [ResultProcessor.sanitize_request_for_logging(request) for request in requests]
    
    @staticmethod
    def extract_session_ids(requests: List[ExchangeResultRequest]) -> List[str]:
        """
        Extracts session IDs from a list of requests
        
        Args:
            requests: List of requests
            
        Returns:
            List of session IDs
        """
        return [request.session_id for request in requests if request and request.session_id]
    
    @staticmethod
    def group_by_session_id(requests: List[ExchangeResultRequest]) -> Dict[str, List[ExchangeResultRequest]]:
        """
        Groups requests by session ID
        
        Args:
            requests: List of requests to group
            
        Returns:
            Dictionary mapping session IDs to lists of requests
        """
        groups = {}
        for request in requests:
            if request and request.session_id:
                if request.session_id not in groups:
                    groups[request.session_id] = []
                groups[request.session_id].append(request)
        
        return groups