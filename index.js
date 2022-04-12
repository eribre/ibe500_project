process.env.NETWORK = "testnet";
// code above sets bsv to use testnet rather than mainnet

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

const autoNewTx = require("./scripts/autoNewTxModuleV2");
const getTx = require("./scripts/getTx");

const routes = require("./routes");

// Set up pug and point to view folder
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// tells app to use routes
app.use("/", routes);

// readies app for user input via post method
app.use(
	express.urlencoded({
		extended: true,
	})
);

// renders main page
app.get("/", (req, res) => {
	res.render("index");
});

/*
* creates new transaction with user input from newTx.pug
TODO: sanetize user input
*/
app.post("/views/finTx", async (req, res) => {
	const { address, utxoPWif, msg } = req.body;
	// console.log(utxoIndex);
	try {
		const msgTrim = msg.trim();
		const output = await autoNewTx(
			address, // utxoFrom
			utxoPWif, // utxoPrivatekeyWif
			[msgTrim] // msgToWrite
		);
		// Ignore for now
		fs.appendFileSync("./data/txId.log", output, (err) => {
			if (err) {
				console.error(err);
			}
		});
		res.render("finTx", { output });
		res.end();
	} catch (err) {
		console.log(err);
		res.render("oops");
	}
});

/*
app.use("/views/viewHistory", async (req, res) => {
	// eslint-disable-next-line consistent-return
	fs.readFile("./data/txId.log", "utf-8", async (err, data) => {
		if (err) throw err;
		res.send(data);
	});
});
*/

app.get("/views/viewHistory", async (req, res) => {
	const array = fs.readFileSync("./data/txId.log", "utf-8").split("\n");
	res.render("viewHistory", { array });
});

app.post("/views/outData", async (req, res) => {
	const { transaction } = req.body;
	// console.log(utxoIndex);
	try {
		let outputData = await getTx(transaction);
		// outputData = outputData.substring(1);
		outputData = JSON.stringify(outputData);
		console.log(outputData);
		res.render("outData", { outputData });
		res.end();
	} catch (err) {
		console.log(err);
		res.render("oops");
	}
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
