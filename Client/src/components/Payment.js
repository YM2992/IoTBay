import { API_ROUTES, fetchDelete, fetchGet, fetchPost, optionMaker } from "@/api";


// Get payment cards function
export const getPaymentCards = async (token) => {
    const response = await fetchGet(API_ROUTES.payment.getPaymentCards, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response) throw new Error("Failed to fetch payment cards");
    if (!response.status || response.status !== "success") throw new Error("Failed to fetch payment cards");

    return response;
};

// Save/update payment card function
export const savePaymentCard = async (paymentCard, token) => {
    const response = await fetchPost(API_ROUTES.payment.updatePaymentCard, optionMaker(paymentCard, "POST", token));

    if (!response) throw new Error("Failed to save payment card");
    if (!response.status || response.status !== "success") throw new Error("Failed to save payment card");

    return response;
};

// Remove payment card function
export const removePaymentCard = async (cardid, cardNumber, token) => {
    const response = await fetchDelete(API_ROUTES.payment.removePaymentCard, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: {
            cardid: cardid,
            cardNumber: cardNumber
        }
    });
    if (!response) throw new Error("Failed to delete payment card");
    if (!response.status || response.status !== "success") throw new Error("Failed to delete payment card");

    return response;
};