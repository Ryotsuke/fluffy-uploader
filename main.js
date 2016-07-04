const electron = require('electron');
const fs = require('fs');
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const NodeApp = require('./node-app');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})

    let inkBunnyHandler = NodeApp.createHandler(new NodeApp.Credentials(NodeApp.Site.InkBunny, "Ryotsuke", "password"));
    // and load the index.html of the app.
    //mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.loadURL(`https://inkbunny.net/filesedit.php?sales=no&wizardmode=yes`)
    var wc = mainWindow.webContents;

    try {
        wc.debugger.attach("1.1");
    } catch (err) {
        console.error("Debugger attach failed : ", err);
    };

    wc.on('did-finish-load', () => {
        "use strict";
        wc.debugger.sendCommand("DOM.getDocument", {}, function (err, res) {
            if(err) console.error("document", err, res);
            wc.debugger.sendCommand("DOM.querySelector", {
                nodeId: res.root.nodeId,
                selector: "input[type=file]"  // CSS selector of input[type=file] element
            }, function (err, res) {
                if(err) console.error("query", err, res);
                wc.debugger.sendCommand("DOM.setFileInputFiles", {
                    nodeId: res.nodeId,
                    files: ['e:\\!DROPBOX\\Dropbox\\android\\IMG_20150927_083145.jpg']  // Actual list of paths
                }, function (err, res) {
                    if(err) console.error("setInpput", err, res);
                    wc.debugger.detach();
                });
            });
        });
    });
    
    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })


    let win = new BrowserWindow({width: 800, height: 1500, show: false});
    win.loadURL('http://github.com/');

    let webContents = win.webContents;

    webContents.on('did-finish-load', () => {
        // Use default printing options
        win.capturePage({x: 0, y: 0, width: 800, height: 1500}, (image) => {
            fs.writeFile('./print.png', image.toPng(), (error) => {
                if (error) throw error;
                console.log('Write PDF successfully.');
            });
        });
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
