const { makeBadge } = require('badge-maker');
const fs = require('fs');
const { app, BrowserWindow } = require('electron');

let status = fs.readFileSync("../status.txt").toString().trim().split("\n").map(i => i.replace(/ +/g, ""));
let supported = status[0].trim().length;
let total = status[1].trim().length;
let percentage = Math.round((supported / total) * 100);

let color = "lightgray";

if (percentage >= 100) {
    color = "blue";
} else if (percentage >= 90) {
    color = "brightgreen";
} else if (percentage >= 80) {
    color = "green";
} else if (percentage >= 70) {
    color = "yellowgreen";
} else if (percentage >= 60) {
    color = "yellow";
} else if (percentage >= 50) {
    color = "orange";
} else if (percentage >= 25) {
    color = "red";
}

fs.writeFileSync("../docs/badge.svg", makeBadge({
    label: 'available characters (latin)',
    message: percentage + '%',
    color: color
}));

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 550,
        frame: false,
        show: false,
        resizable: false,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.on('did-finish-load', (_, title) => {
        setTimeout(() => {
            mainWindow.webContents.capturePage().then(image => {
                fs.writeFileSync("../docs/state.png", image.toPNG());
                app.quit();
            });
        }, 2000);
    });
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
})