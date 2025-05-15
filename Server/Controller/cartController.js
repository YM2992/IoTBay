import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  fetchUserCart,

} from "../Services/cartService.js";

// Add product to cart
export const addToCart = catchAsync(async (req, res, next) => {
  const userid = req.user.userid;  
  const { productid, quantity } = req.body;

  if (!productid || !quantity) {
    return next(new cusError("Missing product or quantity", 400));
  }

  const orderid = await addItemToCart(userid, productid, quantity);
  const updatedCart = await fetchUserCart(userid);

  res.status(201).json({
    status: "success",
    message: "Product added to cart",
    data: updatedCart,
  });
});

// Update item quantity
export const updateCartQuantity = catchAsync(async (req, res, next) => {
  const userid = req.user.userid;
  const { productid, quantity } = req.body;



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
  const userid = req.user.userid;
  const { productid } = req.body;


  await removeItemFromCart(userid, productid);
  const updatedCart = await fetchUserCart(userid);

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    data: updatedCart,
  });
});




// Get Cart Items
export const getCartItems = catchAsync(async (req, res, next) => {
  const userid = req.user.userid;  


  const items = await fetchUserCart(userid);

  res.status(200).json({
    status: "success",
    data: items,
  });
});

