const express = require('express');
const router = express.Router();
const Account = require('../../model/account');

router.get('/',async (req, res) => {
    let accountList = await Account.find({}).lean();
    let avatar = req.body.image;
    res.render('homev2',{accountList: accountList});
});
module.exports = router;
