const form = document.getElementById('itemForm');
const listEl = document.getElementById('list');
const search = document.getElementById('search');

const STORAGE_KEY = 'household_market_items';

function loadItems(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveItems(items){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function render(filter=''){
  const items = loadItems().filter(i => (i.title+i.desc).toLowerCase().includes(filter.toLowerCase()));
  listEl.innerHTML = items.length ? items.map(i=>`
    <div class="card" data-id="${i.id}">
      <strong>${i.title} ${i.sold? '(SOLD)':''}</strong>
      <div class="meta">LKR ${i.price} • ${i.contact || 'no contact'}</div>
      <p>${i.desc || ''}</p>
      <div class="actions">
        <button onclick="markSold('${i.id}')">${i.sold ? 'Undo sold' : 'Mark sold'}</button>
        <button onclick="removeItem('${i.id}')">Delete</button>
      </div>
    </div>
  `).join('') : '<p>No items yet.</p>';
}

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

window.markSold = function(id){
  const items = loadItems().map(i => i.id===id ? {...i, sold: !i.sold} : i);
  saveItems(items); render(search.value);
}
window.removeItem = function(id){
  const items = loadItems().filter(i => i.id !== id);
  saveItems(items); render(search.value);
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const price = document.getElementById('price').value.trim() || '0';
  const contact = document.getElementById('contact').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const items = loadItems();
  items.unshift({ id: uid(), title, price, contact, desc, sold:false, created: Date.now() });
  saveItems(items);
  form.reset(); render();
});

search.addEventListener('input', ()=> render(search.value));
render();
