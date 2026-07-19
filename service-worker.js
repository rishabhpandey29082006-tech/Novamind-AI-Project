self.addEventListener("install", function (event) {
    console.log("Novamind AI Service Worker Installed");
});

self.addEventListener("activate", function (event) {
    console.log("Novamind AI Service Worker Activated");
});