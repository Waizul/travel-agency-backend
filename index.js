const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q5fov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db('insertDB');
		const haiku = database.collection('haiku');
		// create a document to insert
		const doc = {
			title: 'Record of a Shriveled Datum',
			content: 'No bytes, no problem. Just insert a document, in MongoDB',
		};
		const result = await haiku.insertOne(doc);
		console.log(
			`A document was inserted with the _id: ${result.insertedId}`,
		);
	} finally {
		// await client.close()
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('server');
});

app.listen(port, () => {
	console.log('listening to port', port);
});
