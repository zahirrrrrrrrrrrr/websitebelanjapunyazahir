const sliderWrapper = document.querySelector(".sliderWrapper");
const menuItem = document.querySelectorAll(".menuItem");

const products = [
  {
    id: 1,
    title: "LOST IN SPACE",
    price: 119,
    colors: [
      {
        code: "black",
        img: "./assets/Lost_In_Space-removebg-preview.png.png",
      },
      {
        code: "",
        img: "",
      },
    ],
  },
  {
    id: 2,
    title: "NO MORE",
    price: 149,
    colors: [
      {
        code: "",
        img: "./assets/snapedit_1739932902557-removebg-preview.png",
      },
      {
        code: "",
        img: "",
      },
    ],
  },
  {
    id: 3,
    title: "",
    price: 109,
    colors: [
      {
        code: "lightgray",
        img: "./img/blazer.png",
      },
      {
        code: "green",
        img: "./img/blazer2.png",
      },
    ],
  },
  {
    id: 4,
    title: "",
    price: 129,
    colors: [
      {
        code: "",
        img: "./img/crater.png",
      },
      {
        code: "",
        img: "./img/crater2.png",
      },
    ],
  },
  {
    id: 5,
    title: "",
    price: 99,
    colors: [
      {
        code: "gray",
        img: "./img/hippie.png",
      },
      {
        code: "",
        img: "./img/hippie2.png",
      },
    ],
  },
];

// Inisialisasi variabel untuk keranjang belanja
let cart = [];
let cartCount = 0;
let totalPrice = 0;

// DOM Elements
const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const closeCartButton = document.getElementById("closeCartButton");
const totalItemsElement = document.getElementById("totalItems");
const totalPriceElement = document.getElementById("totalPrice");
const proceedToPaymentButton = document.getElementById(
  "proceedToPaymentButton"
);
const paymentModal = document.getElementById("paymentModal");
const closePaymentModal = document.getElementById("closePaymentModal");

// Fungsi untuk menampilkan modal keranjang
cartIcon.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartDisplay();
});

// Fungsi untuk menutup modal keranjang
closeCartButton.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Fungsi untuk menangani klik di luar modal untuk menutupnya
window.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
  if (event.target === paymentModal) {
    paymentModal.style.display = "none";
  }
});

// Tampilkan modal pembayaran
proceedToPaymentButton.addEventListener("click", function () {
  if (cart.length > 0) {
    cartModal.style.display = "none";
    paymentModal.style.display = "block";
  } else {
    Swal.fire({
      title: "Keranjang Kosong",
      text: "Silakan tambahkan barang ke keranjang terlebih dahulu!",
      icon: "info",
      confirmButtonText: "OK",
    });
  }
});

// Tutup modal pembayaran
closePaymentModal.addEventListener("click", function () {
  paymentModal.style.display = "none";
});

// Fungsi untuk menambahkan item ke keranjang
function addToCart(id, name, price, size = "42", color = "", quantity = 1) {
  // Cek apakah item sudah ada di keranjang
  const existingItemIndex = cart.findIndex(
    (item) => item.id === id && item.size === size
  );

  if (existingItemIndex > -1) {
    // Update quantity jika item sudah ada
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Tambahkan item baru ke keranjang
    cart.push({
      id,
      name,
      price,
      size,
      color,
      quantity,
    });
  }

  // Update jumlah total item dan harga
  updateCartTotal();

  // Tampilkan notifikasi
  Swal.fire({
    title: "Berhasil",
    text: `${name} telah ditambahkan ke keranjang!`,
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
  });
}

// Fungsi untuk update total keranjang
function updateCartTotal() {
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Update tampilan jumlah di ikon keranjang
  document.querySelector(".cartCount").textContent = cartCount;
}

// Fungsi untuk memperbarui tampilan keranjang
function updateCartDisplay() {
  // Kosongkan daftar item keranjang
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="emptyCart">Keranjang belanja kosong</li>';
  } else {
    // Tambahkan setiap item ke daftar
    cart.forEach((item, index) => {
      const cartItem = document.createElement("li");
      cartItem.className = "cartItem";

      cartItem.innerHTML = `
        <div class="cartItemInfo">
          <span class="cartItemName">${item.name}</span>
          <span class="cartItemDetails">
            Size: ${item.size} |  Quantity: ${item.quantity}
          </span>
          <span class="cartItemPrice">Rp ${numberWithCommas(
            item.price * item.quantity
          )}</span>
        </div>
        <div class="cartItemActions">
          <button class="quantityBtn" onclick="changeQuantity(${index}, -1)">-</button>
          <span class="itemQuantity">${item.quantity}</span>
          <button class="quantityBtn" onclick="changeQuantity(${index}, 1)">+</button>
          <button class="removeBtn" onclick="removeFromCart(${index})">×</button>
        </div>
      `;

      cartItems.appendChild(cartItem);
    });
  }

  // Update total items dan harga
  totalItemsElement.textContent = cartCount;
  totalPriceElement.textContent = `Rp ${numberWithCommas(totalPrice)}`;
}

// Fungsi untuk mengubah jumlah item
function changeQuantity(index, change) {
  const newQuantity = cart[index].quantity + change;

  if (newQuantity > 0) {
    cart[index].quantity = newQuantity;
  } else {
    removeFromCart(index);
  }

  updateCartTotal();
  updateCartDisplay();
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartTotal();
  updateCartDisplay();
}

// Utilitas untuk memformat angka dengan koma
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Event listener untuk tombol "Add to Cart" di halaman produk
document.addEventListener("DOMContentLoaded", function () {
  // Tambahkan event listener untuk semua tombol "Add to Cart"
  const addToCartButtons = document.querySelectorAll(".addToCartButton");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productContainer = this.closest(".product");
      const id = productContainer.id;
      const name = productContainer.querySelector(".productTitle").textContent;
      const priceText =
        productContainer.querySelector(".productPrice").textContent;
      const price = parseInt(priceText.replace(/\D/g, ""));

      // Ambil ukuran yang dipilih (jika ada)
      const selectedSize = productContainer.querySelector(".size.selected");
      const size = selectedSize ? selectedSize.textContent : "42";

      // Ambil warna yang dipilih (jika ada)
      const selectedColor = productContainer.querySelector(".color.selected");
      const colorIndex = selectedColor
        ? Array.from(productContainer.querySelectorAll(".color")).indexOf(
            selectedColor
          )
        : 0;
      const colors = ["black", "blue", "red", "green"]; // sesuaikan dengan warna yang Anda miliki
      const color = colors[colorIndex] || "black";

      addToCart(id, name, price, size, color, 1);
    });
  });

  // Tambahkan event listener untuk tombol "BUY NOW!"
  const buyNowButtons = document.querySelectorAll(".productButton");

  buyNowButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productContainer = this.closest(".product");
      const id = productContainer.id;
      const name = productContainer.querySelector(".productTitle").textContent;
      const priceText =
        productContainer.querySelector(".productPrice").textContent;
      const price = parseInt(priceText.replace(/\D/g, ""));

      // Ambil ukuran yang dipilih (jika ada)
      const selectedSize = productContainer.querySelector(".size.selected");
      const size = selectedSize ? selectedSize.textContent : "42";

      // Ambil warna yang dipilih (jika ada)
      const selectedColor = productContainer.querySelector(".color.selected");
      const colorIndex = selectedColor
        ? Array.from(productContainer.querySelectorAll(".color")).indexOf(
            selectedColor
          )
        : 0;
      const colors = ["black", "blue", "red", "green"]; // sesuaikan dengan warna yang Anda miliki
      const color = colors[colorIndex] || "black";

      // Tambahkan ke keranjang
      addToCart(id, name, price, size, color, 1);

      // Buka modal keranjang
      cartModal.style.display = "flex";
      updateCartDisplay();
    });
  });

  // Event listener untuk memilih ukuran
  const sizeElements = document.querySelectorAll(".size");

  sizeElements.forEach((element) => {
    element.addEventListener("click", function () {
      // Hapus kelas 'selected' dari semua ukuran dalam produk yang sama
      const productContainer = this.closest(".product");
      productContainer.querySelectorAll(".size").forEach((el) => {
        el.classList.remove("selected");
      });

      // Tambahkan kelas 'selected' ke ukuran yang dipilih
      this.classList.add("selected");
    });
  });

  // Event listener untuk memilih warna
  const colorElements = document.querySelectorAll(".color");

  colorElements.forEach((element) => {
    element.addEventListener("click", function () {
      // Hapus kelas 'selected' dari semua warna dalam produk yang sama
      const productContainer = this.closest(".product");
      productContainer.querySelectorAll(".color").forEach((el) => {
        el.classList.remove("selected");
      });

      // Tambahkan kelas 'selected' ke warna yang dipilih
      this.classList.add("selected");
    });
  });

  // Menangani slider untuk memilih produk
  const sliderItems = document.querySelectorAll(".sliderItem");

  sliderItems.forEach((item) => {
    item.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const priceText = this.getAttribute("data-price");
      const price = parseInt(priceText.replace(/\D/g, ""));
      if (!name || !address || !paymentMethod) {
        // Jika ada data yang belum diisi, tampilkan alert
        Swal.fire({
          title: "Data Pembayaran Belum Lengkap",
          text: "Pastikan semua data pembayaran telah diisi dengan benar.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        // Buka halaman produk terkait atau tambahkan langsung ke keranjang
        // Misalnya, scroll ke produk dengan ID yang sesuai
        const productElement = document.getElementById(id);
        if (productElement) {
          productElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // Tambahkan fungsi checkout
  const payButton = document.querySelector(".payButton");

  payButton.addEventListener("click", function () {
    if (cart.length > 0) {
      Swal.fire({
        title: "Pesanan Berhasil",
        text: "Terima kasih atas pembelian Anda!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Reset keranjang
        cart = [];
        updateCartTotal();
        updateCartDisplay();
        paymentModal.style.display = "none";
      });
    }
  });
});

// Fungsi untuk membuat slider bekerja
const wrapper = document.querySelector(".sliderWrapper");
const menuItems = document.querySelectorAll(".menuItem");

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // Change current slide
    wrapper.style.transform = `translateX(${-100 * index}vw)`;
  });
});
// Menangani klik pada item di navbar
document.addEventListener("DOMContentLoaded", function () {
  // Mengambil semua item menu di navbar
  const menuItems = document.querySelectorAll(".menuItem");

  // Mengambil semua produk
  const products = document.querySelectorAll(".product");

  // Menambahkan event listener untuk setiap item menu
  menuItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      // Menyembunyikan semua produk
      products.forEach((product) => {
        product.style.display = "none";
      });

      // Menampilkan produk yang sesuai dengan menu yang diklik
      const productId = `product${index + 1}`;
      const selectedProduct = document.getElementById(productId);
      if (selectedProduct) {
        selectedProduct.style.display = "flex";
        // Scroll ke produk
        selectedProduct.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Menangani klik pada item di slider
  const sliderItems = document.querySelectorAll(".sliderItem");

  sliderItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Mendapatkan ID dari atribut data-id
      const id = item.getAttribute("data-id");

      // Menyembunyikan semua produk
      products.forEach((product) => {
        product.style.display = "none";
      });

      // Menampilkan produk yang sesuai dengan slider yang diklik
      const productId = `product${id}`;
      const selectedProduct = document.getElementById(productId);
      if (selectedProduct) {
        selectedProduct.style.display = "flex";
        // Scroll ke produk
        selectedProduct.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Kode navbar dan slider yang sudah ada

  // Menangani klik pada tombol size
  const sizeButtons = document.querySelectorAll(".size-button"); // Sesuaikan dengan class yang Anda gunakan

  sizeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Menghapus kelas 'active' dari semua tombol size
      sizeButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Menambahkan kelas 'active' ke tombol yang diklik
      this.classList.add("active");

      // Menyimpan size yang dipilih
      const selectedSize = this.getAttribute("data-size"); // Anda perlu menambahkan atribut data-size di HTML

      // Opsional: menyimpan ukuran yang dipilih ke variabel atau elemen lain
      document.getElementById("selectedSize").textContent = selectedSize; // Jika ada elemen untuk menampilkan ukuran terpilih

      // Atau menyimpan ke variabel global jika diperlukan untuk proses checkout
      window.selectedProductSize = selectedSize;
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Kode existing untuk navbar dan slider tetap ada

  // Menangani filter kategori
  const categoryButtons = document.querySelectorAll(".category-btn");
  const products = document.querySelectorAll(".product");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Hapus kelas active dari semua tombol
      categoryButtons.forEach((btn) => btn.classList.remove("active"));

      // Tambahkan kelas active ke tombol yang diklik
      this.classList.add("active");

      // Dapatkan kategori yang dipilih
      const selectedCategory = this.getAttribute("data-category");

      // Tampilkan produk sesuai kategori
      products.forEach((product) => {
        if (selectedCategory === "all") {
          product.style.display = "none"; // Sembunyikan dulu semua

          // Jika halaman pertama kali dimuat, tampilkan produk pertama
          document.getElementById("product1").style.display = "flex";
        } else {
          const productCategory = product.getAttribute("data-category");

          if (productCategory === selectedCategory) {
            product.style.display = "flex";
            // Scroll ke produk pertama dengan kategori ini
            product.scrollIntoView({ behavior: "smooth" });
          } else {
            product.style.display = "none";
          }
        }
      });
    });
  });

  // Kode untuk tombol size yang sudah dibuat sebelumnya tetap ada
});
