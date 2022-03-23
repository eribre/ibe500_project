const express = require("express");

const router = express.Router();

router.get("/favicon.ico", (req, res) => res.status(204));

router.get("/views/autoNewTx", (req, res) => {
	res.render("autoNewTx", { title: "New Transaction" });
});

router.get("/views/viewTx", (req, res) => {
	res.render("viewTx", { title: "View Transactions" });
});

// export this router to use in our index.js
module.exports = router;
