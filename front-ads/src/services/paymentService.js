import api from "@/lib/api";

export const paymentService = {
  // 결제 정보 조회
  async getPayment(data) {
    const response = await api.post("/api/payment", data);
    return response.data;
  },

  // 결제 처리
  async processPayment(orderData) {
    try {
      const response = await api.post("/api/payment", {
        shopOrderNo: orderData.shopOrderNo,
        amount: orderData.amount,
        orderInfo: {
          goodsName: orderData.goodsName,
          customerInfo: {
            customerName: orderData.customerName,
            customerMail: orderData.customerMail,
            customerContactNo: orderData.customerContactNo,
          },
        },
      });

      if (response.data.success) {
        return {
          success: true,
          authPageUrl: response.data.data.authPageUrl,
        };
      } else {
        throw new Error(
          response.data.message || "결제 처리 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      console.error("결제 처리 오류:", error);
      throw error;
    }
  },

  // 결제 상태 조회
  async getPaymentStatus(orderNo) {
    try {
      const response = await api.get(`/api/payment/status/${orderNo}`);
      return response.data;
    } catch (error) {
      console.error("결제 상태 조회 오류:", error);
      throw error;
    }
  },
};
