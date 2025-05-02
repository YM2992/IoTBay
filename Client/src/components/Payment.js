import { API_ROUTES, fetchDelete, fetchGet, fetchPost, optionMaker } from "@/api";
import toast from "react-hot-toast";


// Get payment cards function
export const getPaymentCards = async (token) => {
    try {
        const response = await fetchGet(API_ROUTES.payment.getPaymentCards, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch payment cards");

        const resData = await response.json();

        return resData;
    } catch (error) {
        console.error("Error fetching payment cards:", error);
        toast.error("Failed to fetch payment card information.");
        throw error;
    }
};

// Save/update payment card function
export const savePaymentCard = async (paymentCard, token) => {
    try {
        const response = await fetchPost(API_ROUTES.payment.savePaymentCard, optionMaker(paymentCard, "POST", token));
        if (!response.ok) throw new Error("Failed to save payment card");

        const resData = await response.json();

        return resData;
    } catch (error) {
        console.error("Error saving payment card:", error);
        toast.error("Failed to save payment card information.");
        throw error;
    }
};

// Remove payment card function
export const removePaymentCard = async (cardNumber, token) => {
    try {
        const response = await fetchDelete(API_ROUTES.payment.removePaymentCard, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: {
                cardNumber: cardNumber
            }
        });
        if (!response.ok) throw new Error("Failed to delete payment card");

        const resData = await response.json();

        return resData;
    } catch (error) {
        console.error("Error deleting payment card:", error);
        toast.error("Failed to delete payment card information.");
        throw error;
    }
};