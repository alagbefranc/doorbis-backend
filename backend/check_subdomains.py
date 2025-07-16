from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['kush_door']

users = list(db.users.find({}, {'id': 1, 'subdomain': 1, 'store_name': 1}))
print('Users with subdomains:')
for user in users:
    print(f"  ID: {user.get('id', 'N/A')}")
    print(f"  Subdomain: {user.get('subdomain', 'N/A')}")
    print(f"  Store: {user.get('store_name', 'N/A')}")
    print()
