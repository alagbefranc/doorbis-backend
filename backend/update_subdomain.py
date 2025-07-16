from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['kush_door']

# Update the user_001 to have green-valley-dispensary subdomain
result = db.users.update_one(
    {'id': 'user_001'},
    {'$set': {'subdomain': 'green-valley-dispensary'}}
)

print(f'Updated user_001 subdomain: {result.modified_count} documents modified')

# Check the updated user
user = db.users.find_one({'id': 'user_001'})
print(f"User_001 subdomain is now: {user.get('subdomain', 'N/A')}")
