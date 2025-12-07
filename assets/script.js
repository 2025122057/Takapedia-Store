/* ============================
   DASHBOARD (RESPONSIVE)
============================ */

// ---------- MAIN INIT ----------
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();   // load products from localStorage
    updateStats();
    createStockChart();
    createSalesChart();
    handleMobile();
    window.addEventListener("resize", handleMobile);

    // Listen for localStorage changes to update dashboard in real-time
    window.addEventListener("storage", (event) => {
        if (event.key === "products") {
            loadProducts();
            updateStats();
            createStockChart();
        }
    });
});

// ---------- DEVICE CHECK LAYOUT ----------
function isMobile() {
    return window.innerWidth <= 480;  
}

function isTablet() {
    return window.innerWidth > 480 && window.innerWidth <= 768;
}

// ---------- LOAD PRODUCTS FROM LOCALSTORAGE ----------
let products = [];
let orders = [
    { customer: "Iman", qty: 1, price: 120, status: "Delivered" },
    { customer: "Zarul", qty: 1, price: 90, status: "Pending" },
    { customer: "Rusyaidi", qty: 2, price: 70, status: "Shipped" },
    { customer: "Dharif", qty: 1, price: 85, status: "Cancelled" },
    { customer: "Afiq", qty: 3, price: 25, status: "Delivered" }
];

function loadProducts() {
    products = JSON.parse(localStorage.getItem("products")) || [
        { id: 1, name: "T-Shirt", stock: 20 },
        { id: 2, name: "Jeans", stock: 15 },
        { id: 3, name: "Bag", stock: 8 },
        { id: 4, name: "Hat", stock: 30 },
        { id: 5, name: "Sunglasses", stock: 5 },
        { id: 6, name: "Sneakers", stock: 12 },
        { id: 7, name: "Watch", stock: 25 }
    ];
}

// ---------- STAT CARDS ----------
function updateStats() {
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalStock").textContent =
        products.reduce((s, p) => s + p.stock, 0);

    document.getElementById("totalSales").textContent =
        orders.filter(o => ["Delivered", "Shipped"].includes(o.status))
              .reduce((s, o) => s + o.qty * o.price, 0);
}

// ---------- STOCK BAR CHART ----------
let stockChart; 

function createStockChart() {
    const ctx = document.getElementById("stockChart");

    if (stockChart) stockChart.destroy();

    stockChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: products.map(p => p.name),
            datasets: [{
                data: products.map(p => p.stock),
                backgroundColor: products.map(p =>
                    p.stock < 13 ? "rgba(255, 99, 132, 0.7)" : "rgba(54, 162, 235, 0.7)"
                ),
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { bodyFont: { size: isMobile() ? 10 : 14 } }
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: isMobile() ? 0 : 45,
                        font: { size: isMobile() ? 8 : 12 }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: { font: { size: isMobile() ? 8 : 12 } }
                }
            }
        }
    });
}

// ---------- SALES PIE CHART ----------
let salesPieChart;

function createSalesChart() {
    const ctx = document.getElementById("salesPieChart");

    if (salesPieChart) salesPieChart.destroy();

    const totals = {};
    orders.forEach(o => {
        if (!totals[o.customer]) totals[o.customer] = 0;
        if (["Delivered", "Shipped"].includes(o.status)) {
            totals[o.customer] += o.qty * o.price;
        }
    });

    salesPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(totals),
            datasets: [{
                data: Object.values(totals),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: isMobile() ? "bottom" : "right",
                    labels: {
                        font: { size: isMobile() ? 10 : 14 }
                    }
                }
            }
        }
    });
}

// ---------- MOBILE LAYOUT FIXES ----------
function handleMobile() {
    const cards = document.querySelectorAll(".stat-card");

    if (isMobile()) {
        cards.forEach(c => {
            c.style.padding = "12px";
            c.querySelector("h3").style.fontSize = "14px";
            c.querySelector("h1").style.fontSize = "20px";
        });
    } else {
        cards.forEach(c => {
            c.style.padding = "20px";
            c.querySelector("h3").style.fontSize = "16px";
            c.querySelector("h1").style.fontSize = "26px";
        });
    }

    // Rebuild charts for new size
    createStockChart();
    createSalesChart();
}
