const express = require('express');
const router = express.Router();
const axios = require('axios');
const nostoService = require('../modules/nostoService');

/* Set default for the API calls */
axios.defaults.headers.post['Content-Type'] = 'application/json';

/* Creates a Nosto account into current scope */
router.post('/create', function(req, res, next) {
    axios.defaults.headers.common['Authorization'] = 'Basic ' + Buffer.from(':' + nostoService.getTestToken('signup')).toString('base64');
    // Populate data object accordning your platform logic
    const nostoAccount = 'test-store-' + Math.floor(Date.now() / 1000);
    const data = JSON.stringify({
        name: nostoAccount,
        front_page_url: "http://localhost:3000",
        platform: nostoService.getPlatform(),
        owner: {
            name: "Test User",
            email: req.body.email
        },
        currency_code: "EUR",
        tokens: [
            'API_SSO',
            'API_PRODUCTS',
            'API_SETTINGS'
        ]
    });
    axios.post(nostoService.getEndpoint('create'), data).then((nostoResponse) => {
        nostoService.saveAccount(nostoResponse.data);
        const token = nostoService.getPersistedToken('sso');
        nostoService.getIframeUrl(token).then((result) => {
            res.json({
                redirect_url: result
            });
        }).catch((reason) => {
            res.status(400).json({
                message: "SSO failed",
                error: reason
            })
        });
    }).catch((nostoError) => {
        res.status(400).json({
            message: "Account creation failed",
            error: nostoError.message
        })
    });
});

/* removes Nosto account from current store scope */
router.post('/remove', function(req, res, next) {
    // Figure out the store scope & remove Nosto account
    const account = nostoService.findAccountInScope(req.scope);
    nostoService.uninstallAccount(account);
});

module.exports = router;
