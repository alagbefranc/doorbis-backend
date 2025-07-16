import asyncio
from database import get_database

async def list_users():
    try:
        db = await get_database()
        users = await db.users.find({}).to_list(length=None)
        
        print(f"Found {len(users)} users in database:")
        for user in users:
            print(f"  - Email: {user.get('email')}")
            print(f"    Active: {user.get('is_active', True)}")
            print(f"    Store: {user.get('store_name', 'N/A')}")
            print(f"    Has password: {'Yes' if user.get('hashed_password') else 'No'}")
            print()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_users())
