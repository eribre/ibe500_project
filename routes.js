const express = require("express");

const router = express.Router();

router.get("/views/newTx", (req, res) => {
	res.render("newTx", { title: "New Transaction" });
});

router.get("/views/viewTx", (req, res) => {
	res.render("viewTx", { title: "View Transactions" });
});

// export this router to use in our index.js
module.exports = router;
