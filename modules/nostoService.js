const axios = require('axios');
const nostoConfig = require('../config');
const fs = require('fs');

module.exports = {
    getIframeUrl(token) {
        axios.defaults.headers.common['Authorization'] = 'Basic ' + Buffer.from(':' + token).toString('base64');
        const data = {
            first_name: "test",
            last_name: "user",
            email: "some@email.com"
        }
        return axios
            .post(this.getEndpoint('sso'), data)
            .then((nostoResponse) => {
                return nostoResponse.data.login_url
            })
            .catch((nostoError) => {
                return 'Got error: ' +nostoError.message;
            });
    },
    saveAccount(nostoAccountObject) {
        const accountFileName = this.getConfig('accountFileName');
        return new Promise((resolve, reject) => {
            fs.writeFile(accountFileName, JSON.stringify(nostoAccountObject), error => {
                if (error) reject(error);
                resolve(nostoAccountObject);
            });
        });
    },
    findAccountInScope(storeScope) {
        // implement logic for fethching Nosto account in given scope (store view)
    },
    uninstallAccount(nostoAccountObject) {
        // implement logic for removing Nosto account id and tokens
    },
    getPersistedToken(tokenName) {
        // implement logic for peristing Nosto account id and tokens
        if (this.getConfig('useTestTokens')) {
            this.getTestToken(tokenName);
        }
        // Read from file
        const config = fs.readFileSync(this.getConfig('accountFileName'));
        // Check if the result is empty & return null if it is
        if (config && config.toString() &&config.length > 10) {
            const json = JSON.parse(config.toString());
            return json.sso_token;
        }

        return null;
    },
    getConfig(key) {
        return nostoConfig[key];
    },
    getPlatform() {
        return this.getConfig('platform');
    },
    getEndpoint(key) {
        const endpoints = this.getConfig('endpoints');
        const domain = this.getConfig('nostoDomain');
        return domain + endpoints[key];
    },
    getTestToken(tokenName) {
        const tokens = this.getConfig('testToken');
        return tokens[tokenName];
    }
};
