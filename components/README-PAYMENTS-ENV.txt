Environment variables for optional PayPal Sandbox (client-side only):

Add to a `.env.local` file in the project root:

NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id_here

Notes:
- If this variable is absent, the PayPal button will not render and the app will still support instant order placement via COD (client-only).
- No backend is required for COD flow. PayPal sandbox is optional and works entirely in the browser for demos.

UPI Intent (GPay/PhonePe/Paytm) — client-side only:

Add to `.env.local`:

NEXT_PUBLIC_UPI_VPA=your-vpa@bank
NEXT_PUBLIC_UPI_NAME=Your Name

Notes:
- This uses standard UPI Intent `upi://pay` and redirects to any installed UPI app.
- Since there is no backend, payment success is user-confirmed; user taps "I have paid — Place Order" to create the order.


