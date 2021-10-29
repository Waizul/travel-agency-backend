const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
		const database = client.db('traveldb');
		const placeCollection = database.collection('places');
		const bookingInfoCollection = database.collection('bookingInfos');

		//GET ALL DATA
		app.get('/places', async (req, res) => {
			const cursor = placeCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});

		//POST PLACE
		app.post('/places', async (req, res) => {
			const place = req.body;
			const result = await placeCollection.insertOne(place);
			res.send(result);
			console.log(result, place);
		});

		//GET A SINGLE DATA
		app.get('/booking/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			console.log(id, query);
			const place = await placeCollection.findOne(query);
			res.json(place);
		});

		//POST DATA
		app.post('/bookingInfos', async (req, res) => {
			const bookingInfo = req.body;
			const result = await bookingInfoCollection.insertOne(bookingInfo);
			res.send(result);
			console.log(result, bookingInfo);
		});

		//GET BOOKING INFO
		app.get('/bookingInfos', async (req, res) => {
			const cursor = bookingInfoCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});
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
