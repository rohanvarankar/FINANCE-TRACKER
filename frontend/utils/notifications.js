export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted");
  } else {
    console.log("Permission denied");
  }
}