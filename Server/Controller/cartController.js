import catchAsync from "../Utils/catchAsync.js";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  fetchUserCart, buyNowItem
} from "../Services/cartService.js";

// Add product to cart
export const addToCart = catchAsync(async (req, res, next) => {
  const userid = req.user.id;
  const { productid, quantity } = req.body;

  console.log("🛒 Add to cart by user ID:", userid);

  const orderid = await addItemToCart(userid, productid, quantity);
  const updatedCart = await fetchUserCart(userid);

  res.status(201).json({
    status: "success",
    message: "Product added to cart",
    data: updatedCart,
  });
});

// Update quantity in cart
export const updateCartQuantity = catchAsync(async (req, res, next) => {
  const userid = req.user.id;
  const { productid, quantity } = req.body;

  console.log("🔄 Update quantity by user ID:", userid);

  await updateItemQuantity(userid, productid, quantity);
  const updatedCart = await fetchUserCart(userid);

  res.status(200).json({
    status: "success",
    message: "Quantity updated",
    data: updatedCart,
  });
});

// Remove item from cart
export const removeCartItem = catchAsync(async (req, res, next) => {
  const userid = req.user.id;
  const { productid } = req.body;

  console.log("🗑️ Remove item from cart by user ID:", userid);

  await removeItemFromCart(userid, productid);
  const updatedCart = await fetchUserCart(userid);

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    data: updatedCart,
  });
});

export const buyNow = catchAsync(async (req, res, next) => {
  const { id: userid } = req.user;
  const { productid, quantity } = req.body;

  if (!productid || !quantity) {
    return next(new cusError("Missing product or quantity", 400));
  }

  const orderId = await buyNowItem(userid, productid, quantity);

  res.status(201).json({
    status: "success",
    message: "Item purchased successfully",
    data: { orderId },
  });
});

// Fetch cart items
export const getCartItems = catchAsync(async (req, res, next) => {
  const userid = req.user.id;

  console.log("📥 Fetching cart for user ID:", userid);

  const items = await fetchUserCart(userid);

  res.status(200).json({
    status: "success",
    data: items,
  });
});
