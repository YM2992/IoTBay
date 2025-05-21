import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  fetchUserCart,
  fetchGuestCart,
} from "../Services/cartService.js";

// Add product to cart
export const addToCart = catchAsync(async (req, res, next) => {
  const userid = req.user ? req.user.userid : null;
  console.log("Cur User: ", req.user);

  const { productid, quantity } = req.body;

  // console.log("USER ID", userid);

  if (!productid || !quantity) {
    return next(new cusError("Missing product or quantity", 400));
  }

  const orderid = await addItemToCart(userid, productid, quantity);
  const updatedCart = await fetchUserCart(userid);

  res.status(201).json({
    status: "success",
    message: "Product added to cart",
    data: {
      cart: updatedCart,
      orderid, // 🧠 make sure you're returning this
    },
  });
});

// Update item quantity
export const updateCartQuantity = catchAsync(async (req, res, next) => {
  const userid = req.user ? req.user.userid : null;
  const { productid, quantity, orderid } = req.body;

  await updateItemQuantity(userid, productid, quantity, orderid);

  const updatedCart = userid ? await fetchUserCart(userid) : await fetchGuestCart(orderid);

  res.status(200).json({
    status: "success",
    message: "Quantity updated",
    data: updatedCart,
  });
});

// Remove item from cart
export const removeCartItem = catchAsync(async (req, res, next) => {
  const userid = req.user ? req.user.userid : null;
  const productid = req.query.productid;
  const orderid = req.query.orderid;
  if (!productid) {
    return next(new cusError("Missing product ID", 400));
  }

  await removeItemFromCart(userid, productid, orderid);

  const updatedCart = userid ? await fetchUserCart(userid) : await fetchGuestCart(orderid);

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    data: updatedCart,
  });
});

// Get Cart Items
export const getCartItems = catchAsync(async (req, res, next) => {
  const userid = req.user ? req.user.userid : null;
  const guestOrderId = req.query.orderid;

  let items = [];

  if (userid) {
    items = await fetchUserCart(userid);
  } else if (guestOrderId) {
    items = await fetchGuestCart(guestOrderId);
  }

  res.status(200).json({
    status: "success",
    data: items,
  });
});
