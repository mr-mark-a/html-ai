// script.js – Handles dynamic UI for the Aircraft Upgrade showcase with cart functionality

// ---------- Utility ----------
function $(selector) {
  return document.querySelector(selector);
}
function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// ---------- Global State ----------
const TOTAL_SEATS = 138;
const TOTAL_LOCKERS = 300;
const LOCKERS_PER_PAGE = 30;
let lockerPage = 1;

// Cart state – each entry {name: string, price: number}
const cart = [];
const ADDON_PRICE = 50; // USD per add‑on

// ---------- Rendering Functions ----------
function renderSeats() {
  const container = $('#seatGrid');
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    const card = document.createElement('div');
    card.className = 'card seat-card';
    card.textContent = `Seat ${i}`;
    container.appendChild(card);
  }
}

function renderLockers(page = 1) {
  const container = $('#lockerGrid');
  container.innerHTML = '';
  const start = (page - 1) * LOCKERS_PER_PAGE + 1;
  const end = Math.min(start + LOCKERS_PER_PAGE - 1, TOTAL_LOCKERS);
  for (let i = start; i <= end; i++) {
    const card = document.createElement('div');
    card.className = 'card locker-card';
    card.textContent = `Locker ${i}`;
    card.dataset.id = i;
    card.addEventListener('click', () => openLockerModal(i));
    container.appendChild(card);
  }
  $('#pageInfo').textContent = `Page ${page} of ${Math.ceil(TOTAL_LOCKERS / LOCKERS_PER_PAGE)}`;
}

// ---------- Cart Functions ----------
function addToCart(addonName) {
  cart.push({ name: addonName, price: ADDON_PRICE });
  updateCartUI();
}
function updateCartUI() {
  $('#cartBtn').textContent = `Cart (${cart.length})`;
}
function showCart() {
  const list = $('#cartList');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} – $${item.price}`;
    list.appendChild(li);
    total += item.price;
  });
  $('#cartTotal').textContent = `$${total}`;
  $('#modalOverlay').classList.remove('hidden');
  $('#modal').classList.remove('hidden');
}
function hideCart() {
  $('#modalOverlay').classList.add('hidden');
  $('#modal').classList.add('hidden');
}
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  const total = cart.reduce((s, i) => s + i.price, 0);
  alert(`Purchase successful! Total: $${total}`);
  cart.length = 0; // clear
  updateCartUI();
  hideCart();
}

// ---------- Locker Modal (uses generic modal) ----------
function openLockerModal(id) {
  const content = `<h2>Locker ${id} – Auto‑Feeder Setup</h2>
    <p>Enter ticket number to associate an auto‑feeder schedule:</p>
    <input type="text" id="ticketInput" placeholder="Ticket #" style="padding:0.5rem;width:80%"/>
    <button class="btn primary" id="saveLockerBtn">Save</button>`;
  showGenericModal(content);
  $('#saveLockerBtn').addEventListener('click', () => {
    const ticket = $('#ticketInput').value.trim();
    alert(`Locker ${id} linked to ticket ${ticket || '—'} (simulation)`);
    hideGenericModal();
  });
}

// ---------- Ticket Scan Modal (generic) ----------
function openScanTicketModal() {
  const content = `<h2>Scan Ticket</h2>
    <p>Enter ticket number (simulating QR scan):</p>
    <input type="text" id="ticketScan" placeholder="Ticket #" style="padding:0.5rem;width:80%"/>
    <button class="btn primary" id="confirmTicketBtn">Confirm</button>`;
  showGenericModal(content);
  $('#confirmTicketBtn').addEventListener('click', () => {
    const ticket = $('#ticketScan').value.trim();
    if (!ticket) { alert('Please enter a ticket number'); return; }
    hideGenericModal();
    startRestaurantFlow(ticket);
  });
}

// ---------- Restaurant Flow ----------
function startRestaurantFlow(ticket) {
  $('#orderPanel').classList.remove('hidden');
  const menu = [
    { name: 'Chicken Wrap', price: '$8' },
    { name: 'Vegan Salad', price: '$7' },
    { name: 'Coffee', price: '$3' },
    { name: 'Soda', price: '$2' }
  ];
  const menuDiv = $('#menuItems');
  menuDiv.innerHTML = '';
  menu.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn secondary';
    btn.textContent = `${item.name} – ${item.price}`;
    btn.dataset.idx = idx;
    btn.addEventListener('click', () => btn.classList.toggle('selected'));
    menuDiv.appendChild(btn);
  });
}
function placeOrder() {
  const selected = $$('#menuItems button.selected');
  if (selected.length === 0) { alert('Select at least one menu item'); return; }
  $('#orderStatus').classList.remove('hidden');
  $('#placeOrderBtn').disabled = true;
  const progress = $('#orderProgress');
  let percent = 0;
  const interval = setInterval(() => {
    percent += 10;
    progress.value = percent;
    if (percent >= 100) clearInterval(interval);
  }, 500);
}
function launchPetCam() {
  $('#petCam').classList.toggle('hidden');
}

// ---------- Generic Modal Helpers (for lockers, ticket, etc.) ----------
function showGenericModal(htmlContent) {
  $('#modalContent').innerHTML = htmlContent;
  $('#modalOverlay').classList.remove('hidden');
  $('#modal').classList.remove('hidden');
}
function hideGenericModal() {
  $('#modalOverlay').classList.add('hidden');
  $('#modal').classList.add('hidden');
}
// Close generic modal on overlay click or dedicated close button
$('#modalOverlay').addEventListener('click', hideGenericModal);
$('#modalClose').addEventListener('click', hideGenericModal);

// ---------- Event Listeners ----------
// Purchase buttons
$$('.purchaseBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const addonName = btn.dataset.addon;
    addToCart(addonName);
    alert(`${addonName} added to cart ($${ADDON_PRICE})`);
  });
});
$('#cartBtn').addEventListener('click', showCart);
$('#checkoutBtn').addEventListener('click', checkout);
$('#modalClose').addEventListener('click', hideCart); // same close button for cart modal

$('#scanTicketBtn').addEventListener('click', openScanTicketModal);
$('#placeOrderBtn').addEventListener('click', placeOrder);
$('#launchPetCamBtn').addEventListener('click', launchPetCam);
$('#prevPage').addEventListener('click', () => {
  if (lockerPage > 1) { lockerPage--; renderLockers(lockerPage); }
});
$('#nextPage').addEventListener('click', () => {
  const maxPage = Math.ceil(TOTAL_LOCKERS / LOCKERS_PER_PAGE);
  if (lockerPage < maxPage) { lockerPage++; renderLockers(lockerPage); }
});

// ---------- Init ----------
renderSeats();
renderLockers(lockerPage);
updateCartUI();
