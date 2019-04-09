/* eslint-disable */
export const getImage=(e)=> {
    return new Promise((resolve, reject) => {
    var i = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: e,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: !1,
        correctOrientation: !0,
        saveToPhotoAlbum: 1,
        targetWidth: 480,
        targetHeight: 640,

    };
    // eslint-disable-next-line
    navigator.camera.getPicture((e) => {
        movePic(e, resolve);
        console.log(e);
        // t(e)
    }, function (e) {
        console.log("error: " + e), console.debug("Unable to obtain picture: " + e, "app")
        reject(e);
    }, i)
})
}




function movePic(file, t) {
    window.resolveLocalFileSystemURL(file, resolveOnSuccess.bind(t), resOnError);
}

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry) {
    let cb = this;
    const today = new Date()
    const year = today.getFullYear()
    const month = `${today.getMonth() + 1}`.padStart(2, 0)
    const day = `${today.getDate()}`.padStart(2, 0)
    const h = `${today.getHours()}`.padStart(2, 0)
    const m = `${today.getMinutes()}`.padStart(2, 0)
    const s = `${today.getSeconds()}`.padStart(2, 0)
    const ms = `${today.getMilliseconds()}`.padStart(4, 0)

    const stringDate = [year, month, day, h, m, s].join("");

    //new file name
    var newFileName = "img_" + stringDate + ".jpg";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
        
    console.log('file system open: ' + fileSys.name);
        //The folder is created if doesn't exist
        fileSys.root.getDirectory('QuikAudit',
            { create: true, exclusive: false },
            function (dirEntry) {
                dirEntry.getDirectory('evidence',
                    { create: true, exclusive: false },
                    function (directory) {
                        entry.moveTo(directory, newFileName, successMove.bind(cb), resOnError);
                    },
                    resOnError);
            },
            resOnError);
    },
        resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //I do my insert with "entry.fullPath" as for the path
    console.log(entry);
    this(entry.nativeURL);
    //t(entry.fullPath);
}

function resOnError(error) {
    alert(error.code);
}


export function savefileimg(e, o, cb) {

    var d = new Date();
    var n = d.getTime();
    //new file name
    if (o.includes("img")) { o = "anotate_" + n + ".jpg"; }

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (t) {
        t.root.getDirectory("QuikAudit/evidence", {
            create: !0,
            exclusive: !1
        }, function (t) {
            t.getFile(o, {
                create: !0,
                exclusive: !1
            }, function (fileEntry) {
                fileEntry.createWriter(function (t) {
                    console.log("Start creating image file"), t.seek(0), t.write(e), console.log("End creating image file. File created")

                    t.onwriteend = function () {
                        console.log("Successful file write...");
                        console.log(fileEntry);
                        cb(fileEntry.nativeURL)
                    };

                }, fail)
            }, fail)
        }, fail)
    }, fail)
}

export const writeToFile = (type, fileName, data, cb) => {
    if (cb === undefined) {
        cb = function () { };
    }
    data = JSON.stringify(data, null, '\t');
    //console.log("write: "+data);
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (de) {
        de.getDirectory(type, {
            create: true
        }, function (directoryEntry) {

            directoryEntry.getFile(fileName, {
                create: true
            }, function (fileEntry) {
                // console.log("fileEntry");
                fileEntry.createWriter(function (fileWriter) {
                    // console.log("createWriter");
                    fileWriter.onwriteend = function (es) {
                        // for real-world usage, you might consider passing a success callback
                        //console.log('Write of file "' + fileName + '" completed.');
                        cb()

                    };

                    fileWriter.onerror = function (es) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Write failed: ' + es.toString());
                    };

                    var blob = new Blob([data], {
                        type: 'text/plain'
                    });
                    fileWriter.write(blob);
                }, function (e) { fail(e, "writeToFile createWriter : " + fileName) });
            }, function (e) { fail(e, "writeToFile getFile : " + fileName) });
        }, function (e) { fail(e, "writeToFile getDirectory : " + fileName) });
    }, function (e) { fail(e, "writeToFile resolveLocalFileSystemURL : " + fileName) });
}

export const readFile = (type, fileName, returnfile, returnerror) => {
    if (returnfile === undefined) {
        returnfile = function () { };
    }
    if (returnerror === undefined) {
        returnerror = function (e) { fail(e, "readFile : " + fileName) };
    }
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (de) {
        de.getDirectory(type, {
            create: false
        }, function (directoryEntry) {
            directoryEntry.getFile(fileName, {
                create: false
            }, function (fileEntry) {
                //    console.log("fileEntry");
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        // console.log("Successful read : "+fileName);
                        returnfile(this.result);
                        // displayFileData(fileEntry.fullPath + ": " + this.result);
                    };

                    reader.readAsText(file);

                }, returnerror);
            }, returnerror);
        }, returnerror);
    }, returnerror);
}

const deletefile = (filedir, filename, cb) => {
    if (cb === undefined) {
        cb = function () { };
    }
    window.resolveLocalFileSystemURL(filedir, function (dir) {
        dir.getFile(filename, { create: false }, function (fileEntry) {
            fileEntry.remove(function () {
                // The file has been removed succesfully
                cb();
            }, function (error) {
                console.log(error);
            }, function (error) {
                console.log("file not exists");
            });
        });
    });
}

function fail(e) {
    console.log(e)
}

export const sharefile=(name,url)=>{
    window.plugins.socialsharing.share(null, name, url, null);
}

export const downloadfile=(name,url)=>{
    
}
