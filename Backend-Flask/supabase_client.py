"""
Supabase Client Configuration Module
Initializes and provides the Supabase client for database operations
Loads environment variables from .env file
"""

from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

import os
from supabase import create_client, Client

def get_supabase() -> Client:
    """
    Initialize and return a Supabase client instance
    
    This function retrieves the Supabase URL and anonymous key from environment variables
    and creates a client connection to the Supabase backend
    
    Environment variables required:
        - SUPABASE_URL: The Supabase project URL
        - SUPABASE_ANON_KEY: The Supabase anonymous API key
    
    Returns:
        Client: A configured Supabase client instance

    """
    # Retrieve Supabase credentials from environment
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_ANON_KEY")

    # Validate that both required credentials are present
    if not url or not key:
        raise Exception("SUPABASE_URL or SUPABASE_ANON_KEY missing")

    # Create and return a Supabase client instance
    return create_client(url, key)
