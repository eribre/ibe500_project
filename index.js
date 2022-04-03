process.env.NETWORK = "testnet";
// code above sets bsv to use testnet rather than mainnet

const express = require("express");
const path = require("path");

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
app.post("/view/finTx", async (req, res) => {
	const { address, utxoPWif, msg } = req.body;
	// console.log(utxoIndex);
	try {
		const output = await autoNewTx(
			address, // utxoFrom
			utxoPWif, // utxoPrivatekeyWif
			[msg] // msgToWrite
		);
		res.render("finTx", { output });
		res.end();
	} catch (err) {
		console.log(err);
		res.render("oops");
	}
});

app.post("/view/outData", async (req, res) => {
	const { transaction } = req.body;
	// console.log(utxoIndex);
	try {
		const outputData = await getTx(transaction);
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
