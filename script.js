const apiUrl = 'api.php';

async function fetchProducts() {
    const response = await fetch(apiUrl);
    const products = await response.json();
    const productList = document.getElementById("product-list");
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-3 product-card';
        productCard.innerHTML = `
            <div class="card h-100 animate__animated animate__fadeInUp">
                <div class="card-body">
                    <h5 class="card-title">${product.nama_produk}</h5>
                    <p class="card-text">Harga: Rp ${product.harga}</p>
                    <p class="card-text">Stok: ${product.stok}</p>
                    <p class="card-text">${product.deskripsi}</p>
                    <button class="btn btn-primary" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Hapus</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

function toggleForm() {
    const form = document.getElementById("product-form");
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function saveProduct() {
    const productId = document.getElementById("product-id").value;
    const nama_produk = document.getElementById("product-name").value;
    const harga = document.getElementById("product-price").value;
    const stok = document.getElementById("product-stock").value;
    const deskripsi = document.getElementById("product-description").value;

    // Log semua data untuk memastikan nilainya sebelum dikirim
    console.log("Sebelum dikirim:", { nama_produk, harga, stok, deskripsi });

    const productData = {
        id: productId,
        nama_produk,
        harga: parseInt(harga) || 0,
        stok: parseInt(stok) || 0,
        deskripsi: deskripsi || ''
    };

    const method = productId ? 'PUT' : 'POST';
    const url = productId ? `${apiUrl}?id=${productId}` : apiUrl;

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });

    const result = await response.json();
    console.log("Response dari server:", result);

    toggleForm();
    fetchProducts();
}



async function editProduct(id) {
    const response = await fetch(`${apiUrl}?id=${id}`);
    const product = await response.json();

    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.nama_produk;
    document.getElementById("product-price").value = product.harga;
    document.getElementById("product-stock").value = product.stok;
    document.getElementById("product-description").value = product.deskripsi;
    toggleForm();
}

async function deleteProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        await fetch(`${apiUrl}?id=${id}`, { method: 'DELETE' });
        fetchProducts();
    }
}

document.addEventListener('DOMContentLoaded', fetchProducts);

