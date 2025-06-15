"""
Standard request model for exchanging session result access keys
"""

import re
import uuid
from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class ExchangeResultRequest:
    """Standard request model for exchanging session result access keys"""
    
    session_id: str
    results_access_key: str
    
    def __post_init__(self):
        """Validate the request after initialization"""
        self.validate()
    
    def validate(self) -> None:
        """
        Validates the ExchangeResultRequest
        
        Raises:
            ValueError: If validation fails
        """
        if not self.session_id or not self.session_id.strip():
            raise ValueError("session_id cannot be empty")
        
        if not self.results_access_key or not self.results_access_key.strip():
            raise ValueError("results_access_key cannot be empty")
        
        if not self._is_valid_uuid(self.session_id):
            raise ValueError("session_id must be a valid UUID")
        
        if len(self.results_access_key) < 10:
            raise ValueError("results_access_key appears to be too short")
    
    def _is_valid_uuid(self, uuid_string: str) -> bool:
        """
        Checks if a string is a valid UUID
        
        Args:
            uuid_string: The string to check
            
        Returns:
            True if valid UUID, False otherwise
        """
        try:
            uuid.UUID(uuid_string)
            return True
        except ValueError:
            return False
    
    def to_dict(self) -> Dict[str, str]:
        """
        Converts the request to a dictionary
        
        Returns:
            Dictionary representation of the request
        """
        return {
            "sessionId": self.session_id,
            "resultsAccessKey": self.results_access_key
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ExchangeResultRequest':
        """
        Creates an ExchangeResultRequest from a dictionary
        
        Args:
            data: Dictionary containing the request data
            
        Returns:
            ExchangeResultRequest instance
            
        Raises:
            KeyError: If required fields are missing
            ValueError: If validation fails
        """
        try:
            session_id = data["sessionId"]
            results_access_key = data["resultsAccessKey"]
        except KeyError as e:
            raise KeyError(f"Missing required field: {e}")
        
        return cls(session_id=session_id, results_access_key=results_access_key)
    
    def sanitize_for_logging(self) -> Dict[str, str]:
        """
        Returns a sanitized version of the request for logging
        
        Returns:
            Dictionary with sensitive data redacted
        """
        return {
            "sessionId": self.session_id,
            "resultsAccessKey": "[REDACTED]"
        }
    
    def __str__(self) -> str:
        """String representation with redacted access key"""
        return f"ExchangeResultRequest(session_id={self.session_id}, results_access_key=[REDACTED])"