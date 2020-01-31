const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const nodemailer = require("nodemailer");
const fs = require('fs');
const history = require('connect-history-api-fallback');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(history())
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// debug
app.get('/api/debug', (req,res) => {
    const dt = new Date();         
        // Получить значение фио формы        
        // Генерация 
        const dtName = `Brief ${dt.getDay()}.${dt.getMonth()}.${dt.getFullYear()} from ${client}`
        console.log(dtName)              
})

// Main
app.post('/api/upload', (req,res) => {
    let files, uploadPath, 
        attachmentsSettings = [];
    const microTime = process.hrtime(),
          pathToWord = __dirname + '/output/';           

    if (req.files) {
        files = req.files.files,
        uploadPath = __dirname + '/attachments/';           
        sendAttachments();            
    }    
    genWord();   
    
    main().then(() => {
        deleteAttachments();
        deleteWord();
        res.send();
    }).catch(err => {
        console.log(err)
    });  


    // Отправка на почту        
    async function main(){
        let transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'no-reply@newestate.kz', // generated ethereal user
              pass: 'rtyfgh123!' // generated ethereal password
            }
          });
        const settingsAll = JSON.parse(req.body.settingsAll) 
        const clientEmail = settingsAll[0].settingsData[1].vModel;  
        const companyName = settingsAll[1].settingsData[0].vModel;
        const defaultText = `
        Копия вашего брифа. С уважением компания KazDevOps
        `
        // send mail with defined transport object
        let us = await transporter.sendMail({
          from: '"Brief" <no-reply@newestate.kz>', // sender address
          to: 'sanch941@gmail.com, kazdevops@gmail.com', // list of receivers
          subject: "Бриф на разработку", // Subject line
          attachments: attachmentsSettings,
          text: `Бриф от компании ${companyName}`, // plain text body
          html: `<b> Бриф от компании ${companyName} </b>` // html body
        });              
        let client = await transporter.sendMail({
            from: '"Brief" <no-reply@newestate.kz>', // sender address
            to: `${clientEmail}`, // list of receivers
            subject: "Бриф на разработку", // Subject line            
            attachments: attachmentsSettings,
            text: `${defaultText}`, // plain text body
            html: `<b> ${defaultText} </b>` // html body
        })
        res.write("Message sent: ");
    }          
  
    // Прикрепление файлов
    function sendAttachments() {
        if(!files.length) {
            upload(files);
            res.write('file uploaded')
        } else {
            for(let i = 0; i < files.length; i++) {
                upload(files[i])
            }
            res.write('files uploaded');            
        }
    
        function upload(item) {
            const filename = microTime + item.name;
            const uploadPathWithName = uploadPath + filename;            
            attachmentsSettings.push({
                filename: item.name,
                path: uploadPathWithName
            })
            item.mv(uploadPathWithName, (err) => {
                if(err) return res.status(500).send(err);            
            })        
        }
    } 

    // Удаление прикреплений
    function deleteAttachments() {        
        if(req.files) {
            if(!files.length) {
                deleteFile(files);
                return;
            }
            
            for (let i = 0; i < files.length; i++) {
                deleteFile(files[i])
            }                        
            // Удалить файл по микротайму
            function deleteFile(item) {
                fs.unlinkSync(uploadPath + microTime + item.name)
            }
        }
    }
    
    function deleteWord() {
        fs.unlinkSync(pathToWord + `${microTime}.docx`)
    }

    // Генерация word
    function genWord() {
        require('./modules/wordGen')(req,res,pathToWord, microTime);        

        const dt = new Date();         
        // Получить значение фио формы
        let client = JSON.parse(req.body.settingsAll);
        client = client[0].settingsData[0].vModel
        // Генерация 
        const dtName = `Бриф ${dt.getDate()}.0${dt.getMonth() + 1}.${dt.getFullYear()} от ${client}`,
              sendFileName = `${dtName}.docx`,
              uploadPathWithName = pathToWord + `${microTime}.docx`;  
        // Прикрепление этого файла при отправке на почту
        attachmentsSettings.push({
            filename: sendFileName,
            path: uploadPathWithName
        })
    }    
})

app.listen(port, () => {
    console.log(`Прослушивание порта ${port}`)
})
