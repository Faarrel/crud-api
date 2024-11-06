<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$dsn = 'mysql:host=localhost;dbname=penjualan';
$username = 'root';
$password = '';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['id'])) {
        // Get a single product
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($product);
    } else {
        // Get all products
        $stmt = $pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
    }
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("INSERT INTO products (nama_produk, harga, stok, deskripsi) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['nama_produk'], $data['harga'], $data['stok'], $data['deskripsi']]);
    echo json_encode(['message' => 'Product created']);

} elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'], $data['nama_produk'], $data['harga'], $data['stok'], $data['deskripsi'])) {
        echo json_encode(['error' => 'Data tidak lengkap untuk update']);
        exit;
    }

    // Logging untuk memastikan data yang diterima
    error_log("Data diterima untuk update: " . print_r($data, true));

    $stmt = $pdo->prepare("UPDATE products SET nama_produk=?, harga=?, stok=?, deskripsi=? WHERE id=?");
    $stmt->execute([$data['nama_produk'], $data['harga'], $data['stok'], $data['deskripsi'], $data['id']]);

    echo json_encode(['message' => 'Product updated']);
}

elseif ($method == 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Product deleted']);
    } else {
        echo json_encode(['error' => 'Invalid ID']);
    }
}
?>
