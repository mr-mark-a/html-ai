// Desktop File Manager - Glass UI
// Uses File System Access API (Chromium browsers)

const selectFolderBtn = document.getElementById('selectFolderBtn');
const fileGrid = document.getElementById('fileGrid');
const breadcrumb = document.getElementById('breadcrumb');
const previewPane = document.getElementById('previewPane');

let currentDirHandle = null;
let pathStack = [];

// Helper to clear UI
function clearUI(){ fileGrid.innerHTML=''; previewPane.innerHTML='<p>Select a file to preview</p>'; }

async function listDirectory(dirHandle){
  clearUI();
  const entries = [];
  for await (const entry of dirHandle.values()){
    entries.push(entry);
  }
  // Sort folders first
  entries.sort((a,b)=>{
    if(a.kind===b.kind) return a.name.localeCompare(b.name);
    return a.kind === 'directory' ? -1 : 1;
  });
  entries.forEach(entry=>{ createFileCard(entry); });
  updateBreadcrumb();
}



async function navigateTo(dirHandle){
  currentDirHandle = dirHandle;
  await listDirectory(dirHandle);
}

function createFileCard(entry){
  const card = document.createElement('div');
  card.className='file-card';
  const icon = document.createElement('img');
  icon.src = entry.kind==='directory' ? 'https://img.icons8.com/ios-filled/50/ffffff/folder.png' : 'https://img.icons8.com/ios-filled/50/ffffff/file.png';
  const label = document.createElement('div');
  label.textContent = entry.name;
  card.appendChild(icon);
  card.appendChild(label);
  card.onclick = async ()=>{
    if(entry.kind==='directory'){
      pathStack.push(entry);
      await navigateTo(entry);
    } else {
      await previewFile(entry);
    }
  };
  fileGrid.appendChild(card);
}

async function previewFile(fileHandle){
  const file = await fileHandle.getFile();
  const url = URL.createObjectURL(file);
  previewPane.innerHTML='';
  const ext = file.name.split('.').pop().toLowerCase();
  if(['png','jpg','jpeg','gif','webp','svg'].includes(ext)){
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth='100%';
    previewPane.appendChild(img);
  } else if(['txt','md','html','js','css','json','xml','csv'].includes(ext)){
    const text = await file.text();
    const pre = document.createElement('pre');
    pre.textContent = text;
    previewPane.appendChild(pre);
  } else if (['mp3','m4a','wav','ogg'].includes(ext)) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = url;
    audio.volume = 1; // max volume
    previewPane.appendChild(audio);
  } else {
    previewPane.textContent = "Cannot preview ." + ext + " files.";
  }
}

// Updated folder selection with permission request
selectFolderBtn.addEventListener('click', async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();
    // Request read/write permission
    const granted = await dirHandle.requestPermission({ mode: 'readwrite' });
    if (!granted) {
      console.warn('Permission not granted for the selected folder');
      return;
    }
    currentDirHandle = dirHandle; // store globally
    pathStack = [];
    await navigateTo(dirHandle);
  } catch (err) {
    console.error('Folder selection cancelled or failed', err);
  }
});

// Fix root breadcrumb navigation to use currentDirHandle
function updateBreadcrumb(){
  breadcrumb.innerHTML='';
  const rootLink = document.createElement('a');
  rootLink.textContent='Root';
  rootLink.href='#';
  rootLink.onclick = async (e)=>{ e.preventDefault(); if(currentDirHandle) await navigateTo(currentDirHandle); };
  breadcrumb.appendChild(rootLink);
  pathStack.forEach((handle,i)=>{
    const sep = document.createTextNode(' / ');
    breadcrumb.appendChild(sep);
    const link = document.createElement('a');
    link.textContent = handle.name;
    link.href='#';
    link.onclick = async (e)=>{ e.preventDefault(); const newStack = pathStack.slice(0,i+1); pathStack = newStack; await navigateTo(handle); };
    breadcrumb.appendChild(link);
  });
}

