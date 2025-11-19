// app.js - full functionality
const STORAGE_KEY = 'market_items';
const MAX_IMAGE_BYTES = 200 * 1024; // 200KB
const MAX_IMAGE_WIDTH = 600;

// UI refs
const itemForm = document.getElementById('itemForm');
const imageInput = document.getElementById('imageInput');
const imgPreview = document.getElementById('imgPreview');
const previewWrap = document.getElementById('previewWrap');
const nameInput = document.getElementById('nameInput');
const descInput = document.getElementById('descInput');
const priceInput = document.getElementById('priceInput');
const contactInput = document.getElementById('contactInput');
const conditionInput = document.getElementById('conditionInput');
const locationInput = document.getElementById('locationInput');
const listEl = document.getElementById('list');
const search = document.getElementById('search');
const openFormBtn = document.getElementById('openFormBtn');
const formPanel = document.getElementById('formPanel');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const cardTpl = document.getElementById('cardTpl');

let items = [];
let editId = null; // currently editing id
let currentImageBase64 = '';

// Utility: load & save
function loadItems(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    return JSON.parse(raw);
  }catch(e){
    console.error('Failed to parse items', e);
    return [];
  }
}
function saveItems(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// On first load, seed demo items
function seedDemo(){
  const existing = loadItems();
  if(existing.length) return;
  const now = Date.now();
  const demo = [
    {id:'demo-1', name:'Stainless Steel Kettle', description:'1.5L kettle, works fine, small dent', price:'$8', contact:'demo@seller.com', condition:'Good', location:'Colombo', datetime: now-86400000*3, image: '', sold:false},
    {id:'demo-2', name:'Wooden Chair', description:'Solid wood, some scratches', price:'$15', contact:'chair@example.com', condition:'Fair', location:'Kandy', datetime: now-86400000*5, image:'', sold:false},
    {id:'demo-3', name:'Set of Plates', description:'12 ceramic plates, like new', price:'$12', contact:'plates@example.com', condition:'Like new', location:'Galle', datetime: now-86400000*1, image:'', sold:false},
    {id:'demo-4', name:'LED Lamp', description:'Desk lamp, adjustable', price:'$6', contact:'lamp@example.com', condition:'Good', location:'Colombo', datetime: now-86400000*6, image:'', sold:false},
    {id:'demo-5', name:'Microwave (small)', description:'Compact microwave, 700W', price:'$45', contact:'microwave@example.com', condition:'Good', location:'Jaffna', datetime: now-86400000*12, image:'', sold:false}
  ];
  saveItems(demo);
}

// Render
function renderItems(filter=''){
  listEl.innerHTML='';
  const f = filter.trim().toLowerCase();
  items.sort((a,b)=>b.datetime - a.datetime);
  items.forEach(item=>{
    if(f){
      const hay = (item.name + ' ' + item.description).toLowerCase();
      if(!hay.includes(f)) return;
    }
    const node = cardTpl.content.cloneNode(true);
    const card = node.querySelector('.card');
    const imgEl = node.querySelector('.card-media img');
    const nameEl = node.querySelector('.item-name');
    const descEl = node.querySelector('.item-desc');
    const priceEl = node.querySelector('.price');
    const condEl = node.querySelector('.condition');
    const locEl = node.querySelector('.location');
    const dtEl = node.querySelector('.datetime');
    const contactEl = node.querySelector('.contact');

    imgEl.src = item.image || placeholderDataUrl(item.name);
    imgEl.alt = item.name;
    nameEl.textContent = item.name;
    descEl.textContent = item.description || '';
    priceEl.textContent = item.price || '';
    condEl.textContent = item.condition ? ' • ' + item.condition : '';
    locEl.textContent = item.location || '';
    dtEl.textContent = new Date(item.datetime).toLocaleString();
    contactEl.textContent = 'Contact: ' + (item.contact || '—');

    // sold overlay
    if(item.sold){
      const ov = document.createElement('div');
      ov.className = 'sold-overlay';
      ov.textContent = 'SOLD';
      card.style.position = 'relative';
      card.appendChild(ov);
    }

    // actions
    const editBtn = node.querySelector('.edit');
    const delBtn = node.querySelector('.delete');
    const soldBtn = node.querySelector('.markSold');

    editBtn.addEventListener('click',()=>openEdit(item.id));
    delBtn.addEventListener('click',()=>{ if(confirm('Delete item?')) deleteItem(item.id); });
    soldBtn.addEventListener('click',()=>toggleSold(item.id));

    listEl.appendChild(node);
  });
}

function placeholderDataUrl(text){
  // simple placeholder image as dataURL (generated with canvas)
  const c = document.createElement('canvas');
  c.width = 800; c.height = 450;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '40px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text.slice(0,20), c.width/2, c.height/2);
  return c.toDataURL('image/png');
}

// Add / Edit / Delete
async function handleFormSubmit(e){
  e.preventDefault();
  const name = nameInput.value.trim();
  if(!name){ alert('Name required'); return; }
  const obj = {
    id: editId || ('id-' + Date.now()),
    name,
    description: descInput.value.trim(),
    price: priceInput.value.trim(),
    contact: contactInput.value.trim(),
    condition: conditionInput.value.trim(),
    location: locationInput.value.trim(),
    datetime: Date.now(),
    image: currentImageBase64 || '',
    sold: false
  };
  if(editId){
    items = items.map(it=>it.id===editId?{...it,...obj, datetime: it.datetime}:it);
    editId = null;
  } else {
    items.push(obj);
  }
  saveItems(items);
  resetForm();
  hideForm();
  renderItems(search.value);
}

function deleteItem(id){
  items = items.filter(i=>i.id!==id);
  saveItems(items);
  renderItems(search.value);
}

function toggleSold(id){
  items = items.map(i=> i.id===id?{...i, sold: !i.sold}:i);
  saveItems(items);
  renderItems(search.value);
}

function openEdit(id){
  const it = items.find(x=>x.id===id); if(!it) return;
  editId = id;
  formTitle.textContent = 'Edit Item';
  nameInput.value = it.name;
  descInput.value = it.description || '';
  priceInput.value = it.price || '';
  contactInput.value = it.contact || '';
  conditionInput.value = it.condition || '';
  locationInput.value = it.location || '';
  currentImageBase64 = it.image || '';
  if(currentImageBase64){
    imgPreview.src = currentImageBase64; previewWrap.classList.remove('hidden');
  } else { previewWrap.classList.add('hidden'); }
  showForm();
}

function resetForm(){
  itemForm.reset();
  previewWrap.classList.add('hidden');
  currentImageBase64 = '';
  editId = null;
  formTitle.textContent = 'Add Item';
}

function showForm(){ formPanel.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); }
function hideForm(){ formPanel.classList.add('hidden'); resetForm(); }

// Image compression
function fileToImage(file){
  return new Promise((res,rej)=>{
    const reader = new FileReader();
    reader.onload = ()=>{
      const img = new Image();
      img.onload = ()=>res(img);
      img.onerror = rej;
      img.src = reader.result;
    };
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

async function compressImage(file){
  // returns base64 under MAX_IMAGE_BYTES if possible
  try{
    const img = await fileToImage(file);
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, MAX_IMAGE_WIDTH / img.width);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0,canvas.width,canvas.height);

    // try quality steps
    let quality = 0.9;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while(dataUrl.length > MAX_IMAGE_BYTES && quality > 0.2){
      quality -= 0.1;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }
    // as fallback, if still big, reduce canvas size until small enough
    let w = canvas.width;
    while(dataUrl.length > MAX_IMAGE_BYTES && w > 200){
      w = Math.round(w * 0.85);
      const h = Math.round((w / canvas.width) * canvas.height);
      const c2 = document.createElement('canvas');
      c2.width = w; c2.height = h;
      c2.getContext('2d').drawImage(img,0,0,w,h);
      dataUrl = c2.toDataURL('image/jpeg', quality);
    }
    return dataUrl;
  }catch(e){
    console.error('compressImage failed', e);
    return '';
  }
}

// handlers
imageInput.addEventListener('change', async (e)=>{
  const f = e.target.files && e.target.files[0];
  if(!f) return;
  const compressed = await compressImage(f);
  if(!compressed){ alert('Failed to process image'); return; }
  currentImageBase64 = compressed;
  imgPreview.src = compressed;
  previewWrap.classList.remove('hidden');
});

itemForm.addEventListener('submit', handleFormSubmit);
openFormBtn.addEventListener('click', ()=>{ showForm(); });
cancelBtn.addEventListener('click', ()=>{ hideForm(); });
search.addEventListener('input', ()=> renderItems(search.value));

// Edit by double-clicking a card (optional UX):
listEl.addEventListener('dblclick',(e)=>{
  const card = e.target.closest('.card');
  if(!card) return;
  const idx = Array.from(listEl.children).indexOf(card);
  // since we render template clones, map index to sorted items
});

// init
(function init(){
  seedDemo();
  items = loadItems();
  renderItems();
})();