const path = require('path');
const fs = require('fs');

const autoenc = require('node-autodetect-utf8-cp1251-cp866');
const { TextDecoder } = require('util');

//



window.preloadMessageStart = 'Копирование началось'
window.preloadMessageEnd = 'Копирование закончилось'



window.myAPI = {
  
  getInfo: (list, dest) => {


    const objInfo = {
      folders: [],
      files: 0,
      uniqueFiles: 0,
      createFolder: []
  
    }


  
    const buffer = fs.readFileSync(list)
    const codirovka = autoenc.detectEncoding(buffer).encoding
    console.log(codirovka)

    let decoder = ''


    if(codirovka === 'cp1251') {
      decoder = new TextDecoder('cp1251')
    } else {
      decoder = new TextDecoder()
    }


    const airList = decoder.decode(buffer).split('\n').filter((item) => {
        return item.includes('movie')
      }).map((item) => {
        return item.split('\\\\')
      })
  
      const arrFolder = []
  
      airList.map((item) => {
        const folderFiles = `\\\\${path.dirname(item[1])}`.replace('\r', '').toLocaleLowerCase()
        arrFolder.push(folderFiles)
      })
  
      const setFolder = new Set(arrFolder)
  
  
  
    
  

      const getCurrentFolderList = (item) => {
  
        const folderName = item.split('\\')
        const currentFolderPath = folderName[folderName.length-1]
  
        let filesInFolder = 0
  
        fs.mkdirSync(`${dest}/${currentFolderPath}`, {recursive: true}) // создания папок
        const pathFolders = fs.readdirSync(`${dest}`) // получение папок
  
  
        // получени подпапок
  
        pathFolders.forEach((item) => {
  
          const subfolders = fs.readdirSync(`${dest}/${item}`)
          filesInFolder += subfolders.length

          objInfo.folders = pathFolders
          objInfo.files = airList.length
          objInfo.uniqueFiles = (airList.length === filesInFolder) ? 0 : airList.length - filesInFolder 
          objInfo.createFolder = pathFolders
  
        })

        return objInfo

      }

      setFolder.forEach((item) => {
        getCurrentFolderList(item)
      })
      
      localStorage.setItem('status', JSON.stringify(objInfo))

  
  },

  createAirList: (list, dest) => {

    const buffer = fs.readFileSync(list)
    const codirovka = autoenc.detectEncoding(buffer).encoding
    console.log(codirovka)


    let decoder = ''

    if(codirovka === 'cp1251') {
      decoder = new TextDecoder('cp1251')
    } else {
      decoder = new TextDecoder()
    }

    const airList = decoder.decode(buffer).split('\n').filter((item) => {
        return item.includes('movie')
      }).map((item) => {
        return item.split('\\\\')
      })


    // Запуск копирования файлов

    const copyFile = (list) => {

      list.map((item) => {

        const pathFolder = path.parse(item[1])
  
        const inputPath = `//${pathFolder.dir}`.replace('\r', '')
        const inputName = pathFolder.name.replace('\r', '')
        const inputExt = pathFolder.ext.replace('\r', '')


        const folderCopy = pathFolder.dir.replace('\r', '').split('\\')

        copyCheck(`${inputPath}/${inputName}${inputExt}`, `${dest}/${folderCopy[folderCopy.length-1]}/${inputName}${inputExt}`) // проверка наличия файла в папке
        copyCheck(`${inputPath}/${inputName}.SLIni`, `${dest}/${folderCopy[folderCopy.length-1]}/${inputName}.SLIni`) // проверка наличия файла в папке

      })

    }

    // проверка наличия файла в папке

    const copyCheck = (src, dest) => {

      try {

        fs.copyFileSync(src, dest)
        console.log(`Файл копируется из ${src} в ${dest}`);
        

      } catch (error) {

        if(error.code !== 'ENOENT') {
          fs.accessSync(dest, fs.constants.F_OK)
          console.warn('Файл уже существует или отсутствует в исходной папке')

        } 
        
      }

    }

    // 
    
    copyFile(airList)

    // перезапись исходного файла

    const writeFileAir = (buffer) => {

      const decoder = new TextDecoder('cp1251')
      const airFile = decoder.decode(buffer)

      const newFile = airFile.split('\n').map((item) => {
          const arrPath = item.split('\\\\')

          if(arrPath[1]) {
            const pathParse = path.parse(path.dirname(arrPath[1]))

            return [arrPath[0], arrPath[1].replace(pathParse.dir, dest)].join('')
          } else {
            return arrPath[0]
          }
        })

      fs.writeFileSync(list, newFile.join(''), {encoding: 'utf-8'})  
      return newFile

    }

    writeFileAir(buffer)

  },

}







