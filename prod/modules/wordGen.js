const officegen = require('officegen')
const fs = require('fs')

module.exports = function(req,res,pathToWord, microTime) {
    // Create an empty Word object:
    let docx = officegen('docx') 

    // Officegen calling this function after finishing to generate the docx document:
    docx.on('finalize', function(written) {
      console.log(
        'Finish to create a Microsoft Word document.'
      )
    })        

    // Officegen calling this function to report errors:
    docx.on('error', function(err) {
        console.log(err)
    })                     

    // Заголовок всего документа    
    genTitle('Бриф на разработку', 'center', 36)
    pObj = docx.createP()                      
    
    // Данные с формы
    const settingsAll = JSON.parse(req.body.settingsAll);   

    // Генерим наши данные
    settingsAll.forEach((item, index) => {        
            // Заголовок секции
            genTitle(item.settingsTitle, 'center', 22);
            // Сборка всего и вся
            item.settingsData.forEach((childItem) => {
                // Поле файлы нам не нужно
                if(childItem.title === 'Файлы') return; 
                // Заголовок одной из форм
                genTitle(childItem.title, 'left');                
                // Проверка на тип , так как у нас vmodel может быть массивом или текстом
                if(typeof childItem.vModel === "string") {                    
                    genText(' - ');
                    genText(childItem.vModel);                    
                    return;
                } 
                // Генерация чекбоксов или радио так как они хранятся в массиве
                genText(' : ');
                childItem.vModel.forEach((grandsonItem) => {                                            
                    genText(grandsonItem)
                    genText(' , ')                
                })                                                                                                                                                           
            })                     
    })

    function genTitle(title, align, fontSize = 14) {
        pObj = docx.createP({
            align: align
        })
        pObj.addText(title, {
            font_size: fontSize
        })          
    }

    function genText(text, fontSize = 14, color = '548DD4') {        
        pObj.addText(text, {
            font_size: fontSize,
            color: color
        }) 
    }    

    // Let's generate the Word document into a file:    
    let out = fs.createWriteStream(pathToWord + `${microTime}.docx`)

    out.on('error', function(err) {
      console.log(err)
    })

    // Async call to generate the output file:
    docx.generate(out);

    // Ответ
    res.write('finish to create word document')
}