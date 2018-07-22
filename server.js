const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
// send POST request to URL using methodOverride npm
const methodOverride = require("method-override");
const nodemailer = require("nodemailer");
const path = require("path");

const PORT = process.env.PORT || 8080;

const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// override with POST having ?_methode=DELETE
app.use(methodOverride("_method"));
// Set up Handlebars/view engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("index");
});
// Contact form post request
app.post("/send",  (req, res) => {
    const emailMsg = `
    <p>You have a new contact form message</p>
    <h2>Message Details</h2>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;
// ==================  Nodemailer Setup  ======================//
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'gmail email here', // generated ethereal user
            pass: 'gmail password here' // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data 
    let mailOptions = {
        from: '"Nodemailer Contact Form 👻" <gmail email here>', // sender address
        to: 'receiving email here', // list of receivers
        subject: 'Nodemailer contact message', // Subject line
        text: 'Hello world?', // plain text body
        html: emailMsg // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // respond with message sent on client side
        res.render('index', { msg: '✔ Email has been sent.'})
    });
//========================================================//

});


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});