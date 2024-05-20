// Definisikan record untuk menu dan keranjang menggunakan objek JavaScript
class Pelanggan {
  constructor(namaPelanggan, noAntrian) {
    this.namaPelanggan = namaPelanggan;
    this.noAntrian = noAntrian;
  }
}

class MenuItem {
  constructor(nama, harga, image, className) {
    this.nama = nama;
    this.harga = harga;
    this.image = image;
    this.className = className;
  }
}

class KeranjangItem {
  constructor(nama, harga, jumlah) {
    this.nama = nama;
    this.harga = harga;
    this.jumlah = jumlah;
  }
}

// Membuat daftar menu
const daftarMenu = [
  new MenuItem("Nasi Goreng", 12000, "assets/image/nasigoreng.jpeg", "makanan"),
  new MenuItem("Mie Goreng", 8000, "assets/image/miegoreng.jpeg", "makanan"),
  new MenuItem("Mie Rebus", 8000, "assets/image/mierebus.jpeg", "makanan"),
  new MenuItem("Magelangan", 14000, "assets/image/magelangan.jpeg", "makanan"),
  new MenuItem("Es Teh", 2000, "assets/image/esteh.jpeg", "minuman"),
  new MenuItem("Es Jeruk", 3000, "assets/image/esjeruk.jpeg", "minuman"),
];

// Menyimpan data ke localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Memuat data dari localStorage
function loadData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Menyimpan dan memuat data keranjang
function saveKeranjang(keranjang) {
  saveData("KERANJANG", keranjang);
}

function loadKeranjang() {
  return loadData("KERANJANG") || [];
}

// Mendapatkan referensi ke elemen-elemen HTML
const containerMenu = document.getElementById("menu");
const containerKeranjang = document.getElementById("keranjang");
const tombolTambahKeranjang = document.getElementById("tombolTambahKeranjang");
const tombolSelesai = document.getElementById("clearCartButton");

// Function to search for food items
function searchFood() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filteredFoods = daftarMenu.filter((food) =>
    food.nama.toLowerCase().includes(searchTerm)
  );
  tampilanMenu(filteredFoods);
}

// Function to sort food items
function sortFood() {
  const sortBy = document.getElementById("sort").value;
  let sortedFoods = [...daftarMenu];
  if (sortBy === "name_asc") {
    sortedFoods.sort((a, b) => a.nama.localeCompare(b.nama));
  } else if (sortBy === "name_desc") {
    sortedFoods.sort((a, b) => b.nama.localeCompare(a.nama));
  } else if (sortBy === "price_asc") {
    sortedFoods.sort((a, b) => a.harga - b.harga);
  } else if (sortBy === "price_desc") {
    sortedFoods.sort((a, b) => b.harga - a.harga);
  }
  tampilanMenu(sortedFoods);
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");

  // Event listener untuk pencarian
  searchInput.addEventListener("input", function () {
    searchFood();
  });

  // Event listener untuk penyortiran
  sortSelect.addEventListener("change", function () {
    sortFood();
  });
});

// Menampilkan menu
function tampilanMenu(menuItems = daftarMenu) {
  containerMenu.innerHTML = "<h2>Menu</h2>";
  menuItems.forEach((item) => {
    const menu = document.createElement("div");
    menu.innerHTML = `
      <div class="menu-item">
        <img class="${item.className}" src="${item.image}" alt="${item.nama}">
        <h3>${item.nama}</h3>
        <p>Harga: Rp ${item.harga}</p>
        <label>Jumlah Pesanan: <input type="number" name="jumlah" value="0"></label>
      </div>
    `;
    containerMenu.appendChild(menu);
  });
}
// Menampilkan keranjang
function transaksi() {
  containerKeranjang.innerHTML = "<h1>Keranjang</h1>";
  let totalTagihan = 0;
  const keranjang = [];

  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((menuItem) => {
    const jumlah = parseInt(
      menuItem.querySelector('input[name="jumlah"]').value
    );
    if (jumlah > 0) {
      const namaMenu = menuItem.querySelector("h3").textContent;
      const item = daftarMenu.find((item) => item.nama === namaMenu);
      const totalHarga = item.harga * jumlah;

      keranjang.push(new KeranjangItem(namaMenu, item.harga, jumlah));

      const itemKeranjang = document.createElement("div");
      itemKeranjang.innerHTML = `<p>${namaMenu} x ${jumlah} = Rp ${totalHarga}</p>`;
      containerKeranjang.appendChild(itemKeranjang);

      totalTagihan += totalHarga;
    }
  });

  const totalPemesanan = document.createElement("h3");
  totalPemesanan.textContent = `Total Tagihan: Rp ${totalTagihan}`;
  containerKeranjang.appendChild(totalPemesanan);

  // Simpan keranjang ke localStorage
  saveKeranjang(keranjang);
}

// Fungsi untuk menghapus semua item dari keranjang dan localStorage
function hapusSemuaDariKeranjang() {
  const userConfirmed = confirm(
    "Apakah Anda yakin ingin menghapus semua item dari keranjang?"
  );
  if (userConfirmed) {
    localStorage.removeItem("KERANJANG");
    containerKeranjang.innerHTML = "<h1>Keranjang</h1>"; // Kosongkan tampilan keranjang
    alert("Keranjang telah dikosongkan!");
  } else {
    alert("Penghapusan keranjang dibatalkan.");
  }
}

// Event listener untuk tombol tambah ke keranjang
tombolTambahKeranjang.addEventListener("click", transaksi);

// Event listener untuk tombol selesai
tombolSelesai.addEventListener("click", function () {
  const namaPelanggan = prompt("Masukkan nama pelanggan:");
  const noAntrian = prompt("Masukkan nomor antrian:");

  if (namaPelanggan && noAntrian) {
    const pelanggan = new Pelanggan(namaPelanggan, noAntrian);
    alert(
      `haii kak ${pelanggan.namaPelanggan} dengan nomor antrian ${pelanggan.noAntrian} sudah memesan makanan/minuman kami yang sangat tidak enak ini.\nsilahkan ditunggu makanan/minumananya selama 5 jam ya\nTerima kasih jangan datang lagi ya!`
    );
  } else {
    alert("Mohon masukkan nama pelanggan dan nomor antrian!");
  }

  hapusSemuaDariKeranjang(); // Panggil fungsi hapusSemuaDariKeranjang
});

// Memuat data keranjang dari localStorage saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  tampilanMenu();

  const keranjang = loadKeranjang();
  keranjang.forEach((item) => {
    const itemKeranjang = document.createElement("div");
    itemKeranjang.innerHTML = `<p>${item.nama} x ${item.jumlah} = Rp ${
      item.harga * item.jumlah
    }</p>`;
    containerKeranjang.appendChild(itemKeranjang);
  });

  const totalTagihan = keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );
  const totalPemesanan = document.createElement("h3");
  totalPemesanan.textContent = `Total Tagihan: Rp ${totalTagihan}`;
  containerKeranjang.appendChild(totalPemesanan);
});
