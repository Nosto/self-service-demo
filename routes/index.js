const express = require('express');
const router = express.Router();
const nostoService = require('../modules/nostoService');
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    let persistedToken = nostoService.getPersistedToken('sso');
    const defaultFrameSrc= nostoService.getEndpoint('defaultIrame');
    if (persistedToken) {
        nostoService
            .getIframeUrl(persistedToken)
            .then((url) => {
                res.render('index', { iframeSrc: url });
            })
            .catch((error) => {
                res.render('index', { iframeSrc: defaultFrameSrc });
            });
    } else {
        res.render('index', { iframeSrc: defaultFrameSrc });
    }
});

module.exports = router;
