const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

async function seedMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:Mahadev1234@vk0.ksj1gsp.mongodb.net/taplink?retryWrites=true&w=majority&appName=vk0';
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB Atlas!');
  const db = client.db('taplink');
  
  const customersPath = path.join(__dirname, '..', 'data', 'customers.json');
  if (fs.existsSync(customersPath)) {
    const raw = fs.readFileSync(customersPath, 'utf-8');
    const customers = JSON.parse(raw);
    console.log('Seeding', customers.length, 'initial customers to MongoDB...');
    for (const c of customers) {
      await db.collection('customers').updateOne(
        { username: c.username },
        { $set: c },
        { upsert: true }
      );
    }
    console.log('Initial customers seeded successfully!');
  }
  
  // Create index on username
  await db.collection('customers').createIndex({ username: 1 }, { unique: true });
  console.log('Unique index on username created!');
  
  const count = await db.collection('customers').countDocuments();
  console.log('Total customers in MongoDB:', count);
  await client.close();
}

seedMongo().catch(console.error);
