let express = require('express')
let bodyParser = require('body-parser')
let cors = require('cors')
const puppeteer = require ('puppeteer');
const fs = require('fs');

let app = express()
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cors({
	exposedHeaders: 'Content-Range',
	origin: '*',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
	optionsSuccessStatus: 204,
}))

var browser = null

const launchBrowser = () => {

    return new Promise(async (resolve, reject) => {

        if(browser === null){
            browser = await puppeteer.launch({headless: true, dumpio: true}) // don't need dumpio normally, useful for debugging.
        }
        resolve()
    })


}

app.post('/generate', async (req, res) =>{

    await launchBrowser()

    const {html} = req.body
    const page = await browser.newPage();
    await page.setContent(html);

    const pdf = await page.pdf()

    fs.writeFileSync('./test.pdf', pdf)
    res.contentType("application/pdf");

    res.send(pdf);
})

app.listen(3000, () => {

    console.log('App started')
})

module.exports = app
