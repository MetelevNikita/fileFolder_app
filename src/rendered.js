const { ipcRenderer } = require('electron')


const btnFile = document.getElementById('load_file')
const btnDist = document.getElementById('load_dist')

//

const infoFile = document.getElementById('info_file')
const infoDist = document.getElementById('info_dist')

//

const createBtn = document.getElementById('create_btn')
const statusDonwload = document.getElementById('status_download_text')
const statusInfo = document.getElementById('status_info_text')



statusDonwload.innerText = 'Программа остановлена'


// status




btnFile.addEventListener('click', () => {
  const filename = ipcRenderer.sendSync('open-file', '', {
    type: 'file',
  })
  infoFile.innerText = filename[0]
})


btnDist.addEventListener('click', () => {
  const filename = ipcRenderer.sendSync('synchronous-message', '', {
    type: 'dist',
  })
  infoDist.innerText = filename[0]
})


createBtn.addEventListener('click', () => {

  const statusText = JSON.parse(localStorage.getItem('status'))
  const copiedFiles = localStorage.getItem('copied')

  statusDonwload.innerText = window.preloadMessageStart
  
  if (infoFile.textContent === '' || infoDist.textContent === '') {
    statusDonwload.innerText = 'Необходимо выбрать все файл .air и выходную папку!'
    return
  }
  
  statusDonwload.innerText = copiedFiles

  window.myAPI.getInfo(infoFile.textContent, infoDist.textContent)
  window.myAPI.createAirList(infoFile.textContent, infoDist.textContent)




  statusInfo.innerHTML = `
                          <div class="create_folder">Созданные папки: ${statusText.createFolder.join(' , ')}</div>

                          <div class="files">Количество файлов в файле .air: ${statusText.files}</div>

                          <div class="uniq_Files">Количество уникальных файлов: ${statusText.uniqueFiles}</div>
                        `

  statusDonwload.innerText = window.preloadMessageEnd

})









