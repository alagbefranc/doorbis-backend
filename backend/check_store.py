import asyncio
from database import get_database

async def check_store():
    db = await get_database()
    user = await db.users.find_one({'subdomain': 'green-valley'})
    print('User found:', user is not None)
    if user:
        print('User ID:', user.get('id'))
        print('Subdomain:', user.get('subdomain'))
        print('Email:', user.get('email'))
    else:
        print('No user found with subdomain "green-valley"')
        
    # Also check all users
    users = await db.users.find({}).to_list(10)
    print(f'\nAll users in database ({len(users)} total):')
    for user in users:
        print(f'- ID: {user.get("id")}, Subdomain: {user.get("subdomain")}, Email: {user.get("email")}')

asyncio.run(check_store())
