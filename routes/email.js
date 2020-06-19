var express = require('express');
var router = express.Router();
var sendgrid = new require('../components/providers/sendgrid');
var mailgun = new require('../components/providers/mailgun');

/**
 * @typedef Email - model for an email
 * @property {string} from.required - sender email address, must be configured in provider
 * @property {string} subject.required - email subject
 * @property {string} body.required - email subject
 * @property {Array.<string>} to.required - to email addresses
 * @property {Array.<string>} cc - cc email addresses
 * @property {Array.<string>} bcc - bcc email addresses
 */

/**
 * Send an email via sendgrid
 * @route POST /email/sendgrid
 * @group email - Operations to send emails
 * @param {Email.model} email.body.required - the email
 * @returns {object} 200 - email was sent successfully
 * @returns {Error}  400 - failed to send email
 * @returns {Error}  default - Unexpected error
 */

router.post('/sendgrid', function(req, res, next) {

    let email = new sendgrid();

    try {
        email.validate(req.body);
        console.log('kept going')
        email.send(req.body)
            .then(data => {
                console.log('Success:', data);
                res.sendStatus(200);
            })
            .catch((error) => {
                console.error('Error:', error);
                res.sendStatus(400);
            });
    }
    catch (err)
    {
        console.log(err)
        res.status(400).send(err);
    }
});

/**
 * Send an email via mailgun
 * @route POST /email/mailgun
 * @group email - Operations to send emails
 * @param {Email.model} email.body.required - the email
 * @returns {object} 200 - email was sent successfully
 * @returns {Error}  400 - failed to send email
 * @returns {Error}  default - Unexpected error
 */

router.post('/mailgun', function(req, res, next) {

    let email = new mailgun();

    console.log("mailgun");

    try {
        email.validate(req.body);
        console.log('kept going')
        email.send(req.body)
            .then(data => {
                if (data.status > 300)
                {
                    console.error('Error:', data.statusText)
                }
                else
                {
                    console.log('Success:', data.statusText);
                }

                res.status(data.status).send(data.statusText);
            })
            .catch((error) => {
                console.error('Error:', error);
                res.sendStatus(400);
            });
    }
    catch (err)
    {
        console.log(err)
        res.status(400).send(err);
    }
});

module.exports = router;