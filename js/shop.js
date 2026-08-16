/* =========================================
   RUBY GAMES SHOP
   SHOP PRODUCT DATA
========================================= */


/* =========================================
   POINT REWARDS
========================================= */

const rewardProducts = [

    {
        name: "Ruby Games Exclusive Jersey",
        category: "MERCHANDISE",
        description: "Limited exclusive club jersey.",
        points: 1200,
        image: "images/exclusive_jersey.png",
        redeemLimit: 1,
        dailyLimit: null,
        weeklyLimit: null
    },

    {
        name: "Complete Digital Wallpaper Pack",
        category: "DIGITAL GOODS",
        description: "Full HD official Ruby Games wallpaper.",
        points: 280,
        image: "images/wallpaper.png",
        redeemLimit: 1,
        dailyLimit: null,
        weeklyLimit:null
    },

    {
        name: "Ruby Games Sticker Pack",
        category: "MERCHANDISE",
        description: "Official printed club sticker collection.",
        points: 360,
        image: "images/sticker.png",
        redeemLimit: null,
        dailyLimit: null,
        weeklyLimit:3
    },

    {
        name: "Ruby Games Gaming Mouse",
        category: "MERCHANDISE",
        description: "Official branded gaming mouse.",
        points: 3200,
        image: "images/mouse.png",
        redeemLimit: 1,
        dailyLimit: null,
        weeklyLimit:null
    },

     {
        name: "Ruby Games Mechanical Keyboard",
        category: "MERCHANDISE",
        description: "Official branded mechanical keyboard.",
        points: 4800,
        image: "images/keyboard.png",
        redeemLimit: 1,
        dailyLimit: null,
        weeklyLimit:null
    },

    {
        name: "Priority Gaming Room Booking",
        category: "PRIVILEGES",
        description: "Use your points for Priority Booking.",
        points: 500,
        image: "images/gaming_room.png",
        redeemLimit: null,
        dailyLimit: 1,
        weeklyLimit: null
    }

];



/* =========================================
   CASH STORE
========================================= */

const storeProducts = [

    {
        name: "Ruby Games Enamel Badge",
        category: "MERCHANDISE",
        description: "Metal enamel club badge, official merchandise.",
        price: 29,
        image: "images/badge.png"
    },

    {
        name: "Ruby Games Silicone Wristband",
        category: "MERCHANDISE",
        description: "Printed silicone club wristband.",
        price: 18,
        image: "images/wristband.png"
    },

    {
        name: "Ruby Games Gaming Tumbler Cup",
        category: "MERCHANDISE",
        description: "Reusable drinking cup.",
        price: 149,
        image: "images/cup.png"
    },

    {
        name: "Ruby Games Cap",
        category: "MERCHANDISE",
        description: "Adjustable embroidered cap.",
        price: 54,
        image: "images/cap.png"
    },

    {
        name: "Ruby Games Standard Game Jersey",
        category: "MERCHANDISE",
        description: "Regular version club jersey.",
        price: 99,
        image: "images/jersey.png"
    },

    {
        name: "Ruby Games Standard Mouse Pad",
        category: "ACCESSORY",
        description: "Standard size official mouse pad.",
        price: 42,
        image: "images/mousepad.png"
    }

];


/* =========================================
   MEMBER POINTS
========================================= */

function updateShopPoints() {

    const memberPoints =
        localStorage.getItem("memberPoints") || 0;

    const points = Number(memberPoints);

    const shopPoints =
        document.getElementById("shopPoints");

    if (shopPoints) {
        shopPoints.textContent = points;
    }
    updateMemberLevel(points);

}

function updateMemberLevel(points) {

    let level = "BRONZE";

    if (points >= 3000) {
        level = "DIAMOND";
    } else if (points >= 1500) {
        level = "GOLD";
    } else if (points >= 500) {
        level = "SILVER";
    }

    const memberLevel =
        document.getElementById("memberLevel");

    if (memberLevel) {
        memberLevel.textContent = level;
    }
}

/* =========================================
   RENDER REWARDS
========================================= */

function renderRewards() {

    const container =
        document.getElementById("rewardContainer");

    if (!container) return;

    container.innerHTML = "";

    rewardProducts.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className =
            "col-lg-4 col-md-6";


        /* =================================
           REDEMPTION LIMIT
        ================================= */

        const redeemedCount =
            getRedeemedCount(product.name);

        const hasLimit =
            product.redeemLimit !== null;

        const dailyCount =
            getDailyRedeemedCount(product.name);

        const weeklyCount =
            getWeeklyRedeemedCount(product.name);

        const limitReached =
            hasLimit &&
            redeemedCount >= product.redeemLimit;

        const dailyLimitReached =
            product.dailyLimit !== null &&
            dailyCount >= product.dailyLimit;

        const weeklyLimitReached =
            product.weeklyLimit !== null &&
            weeklyCount >= product.weeklyLimit;

        const anyLimitReached =
            limitReached ||
            dailyLimitReached ||
            weeklyLimitReached;

        /* =================================
           LIMIT DISPLAY
        ================================= */

        let limitHTML = "";

        if (product.redeemLimit !== null) {

            limitHTML += `
                <small class="redeem-limit">
                    Lifetime Limit: ${redeemedCount} / ${product.redeemLimit}
                </small>
            `;

        }

        if (product.dailyLimit !== null) {

            limitHTML += `
                <small class="redeem-limit">
                    Daily Limit: ${dailyCount} / ${product.dailyLimit}
                </small>
            `;

        }

        if (product.weeklyLimit !== null) {

            limitHTML += `
                <small class="redeem-limit">
                    Weekly Limit: ${weeklyCount} / ${product.weeklyLimit}
                </small>
            `;

        }

        /* =================================
           BUTTON
        ================================= */

        const buttonHTML =
            anyLimitReached

                ? `
                    <button
                        class="shop-redeem-btn disabled"
                        disabled>

                        LIMIT REACHED

                    </button>
                `

                : product.name === "Priority Gaming Room Booking"

                    ? `
                        <button
                            class="shop-redeem-btn"
                            onclick="redeemReward('${product.name}')">

                            BOOK NOW 🎮

                        </button>
                    `

                    : `
                        <button
                            class="shop-redeem-btn"
                            onclick="redeemReward('${product.name}')">

                            REDEEM

                        </button>
                    `;


        /* =================================
           CARD
        ================================= */

        card.innerHTML = `

            <div class="shop-product">

                <div class="shop-product-image">

                    <img
                        src="${product.image}"
                        onerror="this.onerror=null;this.src='images/Logo.jpeg';"
                        alt="${product.name}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                    >

                </div>


                <div class="shop-product-body">

                    <span class="shop-product-tag">

                        ${product.category}

                    </span>


                    <h3>

                        ${product.name}

                    </h3>


                    <p>

                        ${product.description}

                    </p>


                    ${limitHTML}


                    <div class="shop-product-bottom">

                        <strong>

                            💎 ${product.points}

                            <small>
                                Points
                            </small>

                        </strong>


                        ${buttonHTML}

                    </div>

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}

function getRedeemedCount(productName) {

    let rewardHistory = [];

    try {

        rewardHistory =
            JSON.parse(
                localStorage.getItem("rewardHistory")
            ) || [];

        if (!Array.isArray(rewardHistory)) {
            rewardHistory = [];
        }

    } catch (error) {

        rewardHistory = [];

    }

    return rewardHistory.filter(function(item) {

        return item.name === productName;

    }).length;

}

function getDailyRedeemedCount(productName) {

    let rewardHistory = [];

    try {
        rewardHistory =
            JSON.parse(
                localStorage.getItem("rewardHistory")
            ) || [];

        if (!Array.isArray(rewardHistory)) {
            rewardHistory = [];
        }

    } catch (error) {
        rewardHistory = [];
    }


    const today = new Date();

    return rewardHistory.filter(function(item) {

        if (item.name !== productName) {
            return false;
        }

        const rewardDate = new Date(item.date);

        return (
            rewardDate.getFullYear() === today.getFullYear() &&
            rewardDate.getMonth() === today.getMonth() &&
            rewardDate.getDate() === today.getDate()
        );

    }).length;
}

function getWeeklyRedeemedCount(productName) {

    let rewardHistory = [];

    try {

        rewardHistory =
            JSON.parse(
                localStorage.getItem("rewardHistory")
            ) || [];

        if (!Array.isArray(rewardHistory)) {
            rewardHistory = [];
        }

    } catch (error) {

        rewardHistory = [];

    }


    const now = new Date();

    const startOfWeek = new Date(now);

    const day = startOfWeek.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    startOfWeek.setDate(
        startOfWeek.getDate() + diff
    );

    startOfWeek.setHours(0, 0, 0, 0);


    return rewardHistory.filter(function(item) {

        if (item.name !== productName) {
            return false;
        }

        const rewardDate =
            new Date(item.date);

        return rewardDate >= startOfWeek;

    }).length;
}

/* =========================================
   RENDER STORE
========================================= */

function renderStore() {

    const container =
        document.getElementById("storeContainer");


    if (!container) return;


    container.innerHTML = "";


    storeProducts.forEach(function(product) {


        const card = document.createElement("div");

        card.className =
            "col-lg-4 col-md-6";


        card.innerHTML = `

            <div class="shop-product">

                <div class="shop-product-image">

                    <img
                        src="${product.image}"
                        onerror="this.onerror=null;this.src='images/Logo.jpeg';"
                        alt="${product.name}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                    >

                </div>


                <div class="shop-product-body">


                    <span class="shop-product-tag">

                        ${product.category}

                    </span>


                    <h3>

                        ${product.name}

                    </h3>


                    <p>

                        ${product.description}

                    </p>


                    <div class="shop-product-bottom">


                        <strong class="cash-price">

                            RM${product.price}

                        </strong>


                        <button
                            class="shop-cart-btn"
                            onclick="addToCart('${product.name}')">

                            ADD TO CART

                        </button>


                    </div>


                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   REDEEM
========================================= */

function redeemReward(productName) {

    if (productName === "Priority Gaming Room Booking") {
        window.location.href = "booking.html";
        return;
    }

    const product = rewardProducts.find(
        function(item) {
            return item.name === productName;
        }
    );

    if (!product) {
        return;
    }


    let memberPoints =
        Number(localStorage.getItem("memberPoints")) || 0;


    /* =================================
       LOAD REWARD HISTORY
    ================================= */

    let rewardHistory = [];

    try {

        rewardHistory =
            JSON.parse(
                localStorage.getItem("rewardHistory")
            ) || [];

        if (!Array.isArray(rewardHistory)) {
            rewardHistory = [];
        }

    } catch (error) {

        rewardHistory = [];

    }


    /* =================================
    LOAD REDEMPTION COUNTS
    ================================= */

    let rewardRedeemCounts = {};

    try {

        rewardRedeemCounts =
            JSON.parse(
                localStorage.getItem("rewardRedeemCounts")
            ) || {};

        if (
            typeof rewardRedeemCounts !== "object" ||
            Array.isArray(rewardRedeemCounts)
        ) {

            rewardRedeemCounts = {};

        }

    } catch (error) {

        rewardRedeemCounts = {};

    }


    /* =================================
    GET REDEMPTION COUNT
    ================================= */

    let redeemedCount =
        Number(rewardRedeemCounts[product.name]) || 0;


    /* =================================
    BACKWARD COMPATIBILITY
    ================================= */

    if (redeemedCount === 0 && rewardHistory.length > 0) {

        redeemedCount =
            rewardHistory.filter(function(item) {

                return item.name === product.name;

            }).length;

    }


    /* =================================
    CHECK REDEMPTION LIMIT
    ================================= */

    if (
        product.redeemLimit !== null &&
        redeemedCount >= product.redeemLimit
    ) {

        showShopToast(
            "You have reached the redemption limit for this reward."
        );

        return;

    }

    if (
        product.dailyLimit !== null &&
        dailyCount >= product.dailyLimit
    ) {

        showShopToast(
            "You have reached the daily redemption limit."
        );

        return;
    }

    if (
        product.weeklyLimit !== null &&
        weeklyCount >= product.weeklyLimit
    ) {

        showShopToast(
            "You have reached the weekly redemption limit."
        );

        return;
    }

    /* =================================
       CHECK POINTS
    ================================= */

    if (memberPoints < product.points) {

        showShopToast(
            "You do not have enough points."
        );

        return;
    }


    /* =================================
       CONFIRM
    ================================= */

    const confirmed = confirm(

        "Redeem " +
        product.name +
        " for " +
        product.points +
        " Points?\n\n" +

        "Your current balance: " +
        memberPoints +
        " Points"

    );


    if (!confirmed) {
        return;
    }


    /* =================================
       DEDUCT POINTS
    ================================= */

    memberPoints -= product.points;


    localStorage.setItem(
        "memberPoints",
        memberPoints
    );

    /* =================================
    UPDATE REDEMPTION COUNT
    ================================= */

    rewardRedeemCounts[product.name] =
        redeemedCount + 1;


    localStorage.setItem(
        "rewardRedeemCounts",
        JSON.stringify(rewardRedeemCounts)
    );

    /* =================================
       SAVE REWARD HISTORY
    ================================= */

    rewardHistory.push({

        name: product.name,

        points: product.points,

        date: new Date().toISOString()

    });


    if (rewardHistory.length > 20) {

        rewardHistory.shift();

    }


    localStorage.setItem(
        "rewardHistory",
        JSON.stringify(rewardHistory)
    );


    updateShopPoints();

    renderRewardHistory();


    showShopToast(

        "Successfully redeemed " +
        product.name +
        "!\n\n" +

        "Remaining Points: " +
        memberPoints

    );

}

/* =========================================
   SHOP TOAST
========================================= */

function showShopToast(message) {

    const toast =
        document.getElementById("shopToast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function() {

        toast.classList.remove("show");

    }, 2000);

}

/* =========================================
   RENDER REWARD HISTORY
========================================= */

function renderRewardHistory() {

    const container =
        document.getElementById(
            "rewardHistoryContainer"
        );


    if (!container) return;


    const rewardHistory =
        JSON.parse(
            localStorage.getItem("rewardHistory")
        ) || [];


    container.innerHTML = "";


    if (rewardHistory.length === 0) {

        container.innerHTML = `

            <div class="reward-history-empty">

                You have not redeemed any rewards yet.

            </div>

        `;

        return;

    }


    rewardHistory
        .slice()
        .reverse()
        .forEach(function(reward) {

            const item =
                document.createElement("div");


            item.className =
                "reward-history-item";


            const info =
                document.createElement("div");

            info.className =
                "reward-history-info";


            const name =
                document.createElement("div");

            name.className =
                "reward-history-name";

            name.textContent =
                reward.name;


            const date =
                document.createElement("div");

            date.className =
                "reward-history-date";


            const rewardDate =
                new Date(reward.date);


            date.textContent =
                rewardDate.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            info.appendChild(name);

            info.appendChild(date);


            const points =
                document.createElement("div");

            points.className =
                "reward-history-points";

            points.textContent =
                `−${reward.points} Points`;


            item.appendChild(info);

            item.appendChild(points);


            container.appendChild(item);

        });

}

/* =========================================
   ORDER HISTORY
========================================= */

function renderOrderHistory() {

    const container =
        document.getElementById(
            "orderHistoryContainer"
        );


    if (!container) return;


    let orderHistory = [];


    try {

        orderHistory =
            JSON.parse(
                localStorage.getItem("orderHistory")
            ) || [];


        if (!Array.isArray(orderHistory)) {

            orderHistory = [];

        }

    } catch (error) {

        orderHistory = [];

    }


    container.innerHTML = "";


    /* =================================
       EMPTY
    ================================= */

    if (orderHistory.length === 0) {

        container.innerHTML = `

            <div class="order-history-empty">

                You have no orders yet.

            </div>

        `;

        return;

    }


    /* =================================
       RENDER ORDERS
    ================================= */

    orderHistory
        .slice()
        .reverse()
        .forEach(function(order, index) {

            const item =
                document.createElement("div");


            item.className =
                "order-history-item";


            const orderDate =
                new Date(order.date);


            const formattedDate =
                orderDate.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            item.innerHTML = `

                <div class="order-history-info">

                    <strong>
                        ORDER #${order.id}
                    </strong>


                    <span class="order-history-status">

                        ${order.status || "Placed"}

                    </span>


                    <span class="order-history-date">

                        ${formattedDate}

                    </span>

                </div>


                <strong class="order-history-total">

                    RM${order.total}

                </strong>


                <button
                    class="order-view-btn"
                    onclick="openOrderDetails(${index})"
                    aria-label="View order details">

                    VIEW

                </button>

            `;


            container.appendChild(item);

        });

}

/* =========================================
   ORDER DETAILS
========================================= */

function openOrderDetails(index) {

    let orderHistory = [];


    try {

        orderHistory =
            JSON.parse(
                localStorage.getItem("orderHistory")
            ) || [];


        if (!Array.isArray(orderHistory)) {

            orderHistory = [];

        }

    } catch (error) {

        orderHistory = [];

    }


    const orders =
        orderHistory.slice().reverse();


    const order = orders[index];


    if (!order) return;


    const modal =
        document.getElementById(
            "orderDetailsModal"
        );


    const container =
        document.getElementById(
            "orderDetailsContent"
        );


    if (!modal || !container) return;


    const orderDate =
        new Date(order.date);


    const formattedDate =
        orderDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    container.innerHTML = `

        <div class="order-details-header">

            <small>
                ORDER
            </small>

            <h2>
                #${order.id}
            </h2>

            <span>
                ${formattedDate}
            </span>

        </div>


        <div class="order-details-status">

            <span>
                STATUS
            </span>

            <strong>
                ${order.status || "Placed"}
            </strong>

        </div>


        <div class="order-details-items">

            <h3>
                ORDER ITEMS
            </h3>

            ${order.items.map(function(item) {

                return `

                    <div class="order-detail-item">

                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <span>
                                ${item.quantity} × RM${item.price}
                            </span>

                        </div>


                        <strong>
                            RM${item.price * item.quantity}
                        </strong>

                    </div>

                `;

            }).join("")}

        </div>


        <div class="order-details-total">

            <span>
                TOTAL
            </span>

            <strong>
                RM${order.total}
            </strong>

        </div>

    `;


    modal.classList.add("show");
    modal.style.display = "flex";

}


function closeOrderDetails() {

    const modal =
        document.getElementById(
            "orderDetailsModal"
        );


    if (!modal) return;


    modal.classList.remove("show");
    modal.style.display = "none";

}

/* =========================================
   SHOPPING CART
========================================= */

let cart = [];

try {

    cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (!Array.isArray(cart)) {

        cart = [];

    }

} catch (error) {

    cart = [];

}

/* =========================================
   ADD TO CART
========================================= */

function addToCart(productName) {
    if (!sessionStorage.getItem("username")) {
        sessionStorage.setItem("rubyPendingAction", JSON.stringify({
            type: "addToCart",
            productName: productName,
            returnUrl: window.location.pathname + window.location.search
        }));
        window.location.href = "signin.html";
        return;
    }

    const product = storeProducts.find(
        function(item) {
            return item.name === productName;
        }
    );

    if (!product) return;


     const existingItem = cart.find(
        function(item) {
            return item.name === productName;
        }
    );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    renderCart();

    showShopToast(
        productName + " has been added to your cart."
    );
}

function updateCart() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) return;

    const totalQuantity =
        cart.reduce(
            function(total, item) {

                return total + item.quantity;

            },
            0
        );

    cartCount.textContent =
        totalQuantity;

}

function openCart() {

    const cartPanel =
        document.getElementById("cartPanel");

    if (!cartPanel) return;

    cartPanel.classList.add("show");

    renderCart();

}

function closeCart() {

    const cartPanel =
        document.getElementById("cartPanel");

    if (!cartPanel) return;

    cartPanel.classList.remove("show");

}

function renderCart() {

    const container =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("cartTotal");


    if (!container) return;


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="cart-empty">

                Your cart is empty.

            </div>

        `;

        if (totalElement) {

            totalElement.textContent = "RM0";

        }

        return;

    }


    let total = 0;


    cart.forEach(function(product, index) {

        total += product.price * product.quantity;


        const item =
            document.createElement("div");


        item.className =
            "cart-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                onerror="this.onerror=null;this.src='images/Logo.jpeg';"
                alt="${product.name}"
            >


            <div class="cart-item-info">

                <strong>
                    ${product.name}
                </strong>


                <span>
                    RM${product.price}
                </span>


                <div class="cart-quantity">

                    <button
                        onclick="changeQuantity(${index}, -1)">

                        −

                    </button>


                    <input
                        type="number"
                        min="1"
                        value="${product.quantity}"
                        onchange="setQuantity(${index}, this.value)"
                    >


                    <button
                        onclick="changeQuantity(${index}, 1)">

                        +

                    </button>

                </div>

            </div>


            <strong class="cart-item-total">

                RM${product.price * product.quantity}

            </strong>


            <button
                onclick="removeFromCart(${index})"
                class="cart-remove">

                ×

            </button>

        `;


        container.appendChild(item);

    });


    if (totalElement) {

        totalElement.textContent =
            "RM" + total;

    }

}

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    renderCart();

}

function changeQuantity(index, amount) {

    if (!cart[index]) return;


    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    renderCart();

}

function setQuantity(index, value) {

    if (!cart[index]) return;


    let quantity = parseInt(value);


    if (isNaN(quantity) || quantity < 1) {

        quantity = 1;

    }


    cart[index].quantity = quantity;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    renderCart();

}

function checkoutCart() {

    if (cart.length === 0) {

        showShopToast("Your cart is empty.");

        return;

    }

    closeCart();
    renderCheckout();


    const checkoutPanel =
        document.getElementById("checkoutPanel");


    if (checkoutPanel) {

        checkoutPanel.classList.add("show");

    }

}

function renderCheckout() {

    const container =
        document.getElementById("checkoutContent");

    const totalElement =
        document.getElementById("checkoutTotal");


    if (!container) return;


    container.innerHTML = "";


    let total = 0;


    /* ================================
       ORDER ITEMS
    ================================= */

    cart.forEach(function(product) {

        const subtotal =
            product.price * product.quantity;

        total += subtotal;


        const item =
            document.createElement("div");

        item.className =
            "checkout-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${product.name}
                </strong>

                <span>
                    ${product.quantity} × RM${product.price}
                </span>

            </div>


            <strong>
                RM${subtotal}
            </strong>

        `;


        container.appendChild(item);

    });


    /* ================================
       CUSTOMER INFORMATION
    ================================= */

    const form =
        document.createElement("div");

    form.className =
        "checkout-form";


    form.innerHTML = `

        <div class="checkout-form-title">
            CUSTOMER INFORMATION
        </div>


        <div class="checkout-field">

            <label>
                Name
            </label>

            <input
                type="text"
                id="checkoutName"
                placeholder="Enter your name"
            >

        </div>


        <div class="checkout-field">

            <label>
                Phone
            </label>

            <input
                type="tel"
                id="checkoutPhone"
                placeholder="Enter your phone number"
            >

        </div>


        <div class="checkout-field">

            <label>
                Email
            </label>

            <input
                type="email"
                id="checkoutEmail"
                placeholder="Enter your email"
            >

        </div>


        <div class="checkout-field">

            <label>
                Order Type
            </label>

            <div class="checkout-options">

                <label>
                    <input
                        type="radio"
                        name="orderType"
                        value="Delivery"
                        checked
                        onchange="toggleAddress()"
                    >

                    Delivery
                </label>


                <label>
                    <input
                        type="radio"
                        name="orderType"
                        value="Pickup"
                        onchange="toggleAddress()"
                    >

                    Pickup
                </label>

            </div>

        </div>


        <div
            class="checkout-field"
            id="addressField"
        >

            <label>
                Address
            </label>

            <textarea
                id="checkoutAddress"
                placeholder="Enter your delivery address"
                rows="3"
            ></textarea>

        </div>


        <div class="checkout-field">

            <label>
                Payment Method
            </label>


            <div class="checkout-options">

                <label>

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash"
                        checked
                    >

                    Cash
                </label>


                <label>

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Online Banking"
                    >

                    Online Banking
                </label>


                <label>

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Card"
                    >

                    Card
                </label>

            </div>

        </div>

    `;


    container.appendChild(form);


    /* ================================
       TOTAL
    ================================= */

    if (totalElement) {

        totalElement.textContent =
            "RM" + total;

    }

}

function toggleAddress() {

    const addressField =
        document.getElementById("addressField");

    const selectedType =
        document.querySelector(
            'input[name="orderType"]:checked'
        );


    if (!addressField || !selectedType) {
        return;
    }


    if (selectedType.value === "Pickup") {

        addressField.style.display = "none";

    } else {

        addressField.style.display = "block";

    }

}

function closeCheckout() {

    const checkoutPanel =
        document.getElementById("checkoutPanel");


    if (checkoutPanel) {

        checkoutPanel.classList.remove("show");

    }

}

function placeOrder() {

    if (cart.length === 0) {

        return;

    }

        /* =================================
       GET CUSTOMER INFORMATION
    ================================= */

    const name =
        document.getElementById("checkoutName")?.value.trim();

    const phone =
        document.getElementById("checkoutPhone")?.value.trim();

    const email =
        document.getElementById("checkoutEmail")?.value.trim();

    const address =
        document.getElementById("checkoutAddress")?.value.trim();

    const orderType =
        document.querySelector(
            'input[name="orderType"]:checked'
        )?.value;

    const paymentMethod =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        )?.value;


    /* =================================
       VALIDATION
    ================================= */

    if (!name || !phone || !email) {

        showShopToast(
            "Please complete your information."
        );

        return;

    }


    if (orderType === "Delivery" && !address) {

        showShopToast(
            "Please enter your delivery address."
        );

        return;

    }

    const now = new Date();

    const datePart =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    let orderHistory = [];

    try {

        orderHistory =
            JSON.parse(
                localStorage.getItem("orderHistory")
            ) || [];

        if (!Array.isArray(orderHistory)) {
            orderHistory = [];
        }

    } catch (error) {

        orderHistory = [];

    }


    /* =================================
    GENERATE ORDER ID
    ================================= */

    const orderNumber =
        String(orderHistory.length + 1).padStart(3, "0");

    const orderId =
        "RG-" +
        datePart +
        "-" +
        orderNumber;


    /* =================================
    CREATE ORDER
    ================================= */

    const order = {

        id: orderId,

        items: [...cart],

        total: cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        ),

            customer: {

            name: name,

            phone: phone,

            email: email,

            orderType: orderType,

            address:
                orderType === "Delivery"
                    ? address
                    : "",

            paymentMethod: paymentMethod

        },

        date: now.toISOString(),

        status: "Placed"

    };

    console.log("Order:", order);

    orderHistory.push(order);


    if (orderHistory.length > 20) {

        orderHistory.shift();

    }


    localStorage.setItem(
        "orderHistory",
        JSON.stringify(orderHistory)
    );

    showShopToast(
        "Your order has been placed successfully!"
    );

    renderOrderHistory();

    cart = [];

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    renderCart();

    closeCheckout();

}

/* =========================================
   INITIALIZE SHOP
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {
        renderRewardHistory();
        renderOrderHistory();
        updateShopPoints();
        renderRewards();
        renderStore();
        updateCart();
        renderCart();

        if (sessionStorage.getItem("username")) {
            try {
                const pendingAction = JSON.parse(sessionStorage.getItem("rubyPendingAction") || "null");
                if (pendingAction?.type === "addToCart" && pendingAction.returnUrl === window.location.pathname + window.location.search) {
                    sessionStorage.removeItem("rubyPendingAction");
                    addToCart(pendingAction.productName);
                    storeBtn.click();
                    openCart();
                }
            } catch (error) {
                sessionStorage.removeItem("rubyPendingAction");
            }
        }
    }
);

/* =========================================
   REWARDS / STORE SWITCH
========================================= */

const rewardsBtn =
    document.getElementById("rewardsBtn");

const storeBtn =
    document.getElementById("storeBtn");

const rewardsSection =
    document.getElementById("rewardsSection");

const storeSection =
    document.getElementById("storeSection");


storeSection.style.display = "none";


rewardsBtn.addEventListener("click", function () {

    rewardsBtn.classList.add("active");
    storeBtn.classList.remove("active");

    rewardsSection.style.display = "block";
    storeSection.style.display = "none";

});


storeBtn.addEventListener("click", function () {

    storeBtn.classList.add("active");
    rewardsBtn.classList.remove("active");

    rewardsSection.style.display = "none";
    storeSection.style.display = "block";

});
