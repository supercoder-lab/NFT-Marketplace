var FormData = require('form-data');
var fs = require('fs');
var fetch = require('node-fetch');
var axios = require('axios')
const imageThumbnail = require('image-thumbnail');
const probe = require('probe-image-size');
//const express = require("express");
//const app = express();
const FileType = require('file-type');
const request = require('request');

async function download(url, dest) {

    /* Create an empty file where we can save data */
    const file = fs.createWriteStream(dest);

    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
        request({
            /* Here you should specify the exact link to the file you are trying to download */
            uri: url,
            gzip: true,
        })
            .pipe(file)
            .on('finish', async () => {
                console.log(`The file is finished downloading.`);
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            });
    })
        .catch((error) => {
            console.log(`Something happened: ${error}`);
        });
}


exports.compressImages = async function(ipfsImages,file_type){
console.log(ipfsImages);
console.log("in image compress");
    let mainArray = [];
    let imagesArr =[];
    try {
        if(file_type == 'video'){
            var img = ipfsImages[0];
            var response1 = await axios.get(img, { responseType: 'arraybuffer' })
            var buffer = Uint8Array.from(response1.data);
            const type = await FileType.fromBuffer(buffer);
            console.log("type", type);
            const newFileType = type.ext;
            var fileName = `video-${new Date().getTime()}.${newFileType}`;
            var filePath = './uploads/' + fileName;
            const newFiledownloaded = await download(img, filePath);

            var oldHash = img.substring(img.lastIndexOf('/') + 1);
            mainArray.push(oldHash);
            imagesArr.push(fileName);
            return { success: true, imageHash: mainArray,images:imagesArr }
        }

        // jpegOptions: { force: true, quality: 80 }
        
        for (var i = 0; i < ipfsImages.length; i++) {
            var img = ipfsImages[i];
            let result = await probe(img);
            let options = {width: result.width, height: result.height,  responseType: 'base64',jpegOptions: { force: true, quality: 50 } }


            var response1 = await axios.get(img, { responseType: 'arraybuffer' })
            var buffer = Uint8Array.from(response1.data);

            const type = await FileType.fromBuffer(buffer);
            console.log("type", type);
            const newFileType = type.ext;
            var fileName = `image-${new Date().getTime()}.${newFileType}`;
            var filePath = './uploads/' + fileName;
            const newFiledownloaded = await download(img, filePath);
            var oldHash = img.substring(img.lastIndexOf('/') + 1);

            console.log((buffer.byteLength));
            if (buffer.byteLength > 2097152 ) 
            {
                
                var thumbnail = await imageThumbnail({ uri: img }, options);
                var fileContents = new Buffer.from(thumbnail, 'base64');
                if(newFileType != 'gif' && newFileType != 'mp4'){
                    fs.writeFileSync(filePath, fileContents);
                }
                
                var url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                let formdata = new FormData();
                formdata.append('file', fs.createReadStream(filePath));

                const response2 = await fetch(url, { 
                    method: 'POST', headers: {
                        // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
                        'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
                        'pinata_api_key': 'b26a087893e3f0033bbf',
                        'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                    },
                    body: formdata
                });
                const filedata = await response2.json();

                console.log('newhash',filedata.IpfsHash)
                mainArray.push(filedata.IpfsHash);
                imagesArr.push(fileName);
            } else {
                console.log('oldHash',oldHash)
                mainArray.push(oldHash);
                imagesArr.push(fileName);
            }
        }
        
        console.log('imagesArr',imagesArr)
        return { success: true, imageHash: mainArray,images:imagesArr }
    } catch (err) {
        return { success: false, imageHash: mainArray }
    }
}

// ['https://ipfs.io/ipfs/QmSiVPNC2uhZ8Z23vSq1RKggpAA5YKXsacT8k6TWMJAPQm','https://ipfs.io/ipfs/QmSiVPNC2uhZ8Z23vSq1RKggpAA5YKXsacT8k6TWMJAPQm']
