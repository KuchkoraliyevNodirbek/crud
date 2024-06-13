const API_URL = 'http://localhost:3600/todos';

// Elementlarni yaratish
async function createItem(newItem) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });
        const data = await response.json();
        console.log('Yangi element yaratildi:', data);
        return data;
    } catch (error) {
        console.error('Element yaratishda xato:', error);
    }
}

// Elementlarni o'qish
async function getItems() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log('Elementlar:', data);
        renderItems(data);
        return data;
    } catch (error) {
        console.error('Elementlarni o\'qishda xato:', error);
    }
}

// Elementlarni yangilash
async function updateItem(id, updatedItem) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        });
        const data = await response.json();
        console.log(`Element yangilandi: ${id}`, data);
        return data;
    } catch (error) {
        console.error(`Elementni yangilashda xato: ${id}`, error);
    }
}

// Elementlarni o'chirish
async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log(`Element o'chirildi: ${id}`);
        } else {
            console.error(`Elementni o'chirishda xato: ${id}`);
        }
    } catch (error) {
        console.error(`Elementni o'chirishda xato: ${id}`, error);
    }
}

// Elementlarni ko'rsatish
function renderItems(items) {
    const itemsContainer = document.getElementById('itemsContainer');
    itemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <button data-delete="${item.id}">O'chirish</button>
            <button data-edit="${item.id}">Tahrirlash</button>
        `;
        itemsContainer.appendChild(itemElement);
    });
}

// Dastur yuklanganda elementlarni o'qish
document.addEventListener('DOMContentLoaded', getItems);

// Yaratish tugmasi bosilganda
document.getElementById('createItem').addEventListener('click', async () => {
    const itemName = document.getElementById('itemName').value;
    const itemDescription = document.getElementById('itemDescription').value;
    if (itemName && itemDescription) { // Ikkala input ham to'ldirilganligini tekshirish
        const newItem = { title: itemName, description: itemDescription };
        await createItem(newItem);
        await getItems(); // Yaratishdan keyin elementlarni qayta yuklash
        document.getElementById('itemName').value = ''; // Input maydonlarini bo'shatish
        document.getElementById('itemDescription').value = ''; // Input maydonlarini bo'shatish
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring");
    }
});

// Elementlarni o'chirish va tahrirlash uchun event delegation
document.getElementById('itemsContainer').addEventListener('click', async (e) => {
    const deleteId = e.target.dataset.delete;
    if (deleteId) {
        await deleteItem(deleteId);
        await getItems(); // O'chirishdan keyin elementlarni qayta yuklash
    }

    const editId = e.target.dataset.edit;
    if (editId) {
        const itemName = prompt("Yangi nomni kiriting:");
        const itemDescription = prompt("Yangi ta'rifni kiriting:");
        if (itemName !== null && itemDescription !== null) {
            const updatedItem = { title: itemName, description: itemDescription };
            await updateItem(editId, updatedItem);
            await getItems(); // Tahrirdan keyin elementlarni qayta yuklash
        }
    }
});
