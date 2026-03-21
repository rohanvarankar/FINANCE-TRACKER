const Brevo = require("@getbrevo/brevo");
console.log("Brevo keys:", Object.keys(Brevo));
if (Brevo.ApiClient) {
  console.log("ApiClient:", typeof Brevo.ApiClient);
} else {
  console.log("No ApiClient property");
}
