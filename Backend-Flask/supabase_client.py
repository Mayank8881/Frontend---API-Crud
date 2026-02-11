from dotenv import load_dotenv
load_dotenv()

import os
from supabase import create_client, Client

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_ANON_KEY")

    if not url or not key:
        raise Exception("SUPABASE_URL or SUPABASE_ANON_KEY missing")

    return create_client(url, key)
