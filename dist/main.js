function encode(width, height, bpp, pixels, iccProfile) {
  var openJPEG = require('./openJPEG-DynamicMemory-commonJS.js');

  var pixelsPtr = openJPEG._malloc(pixels.length);
  openJPEG.writeArrayToMemory(pixels, pixelsPtr);

  var iccProfilePtr = openJPEG._malloc(iccProfile.length);
  openJPEG.writeArrayToMemory(iccProfile, iccProfilePtr);

  var outPtrPtr = openJPEG._malloc(4);
  var outLenPtr = openJPEG._malloc(4);

  // jp2_encode(int width, int height, int bpp, void * pixels, void * icc, int iccLen, void ** out, int * outLen)
  var ret = openJPEG.ccall('jp2_encode','number', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
    [width, height, bpp, pixelsPtr, iccProfilePtr, iccProfile.length, outPtrPtr, outLenPtr]);
  if(ret == 0){
    console.log('[opj_encode] decoding failed!')
    openJPEG._free(pixelsPtr);
    openJPEG._free(openJPEG.getValue(outPtrPtr, '*'));
    openJPEG._free(iccProfilePtr);
    openJPEG._free(outLenPtr);
    return null;
  }

  var outLen = openJPEG.getValue(outLenPtr, 'i32');
  var outLenPtr = openJPEG.getValue(outPtrPtr, '*');
  var compressedData = Buffer.from(openJPEG.HEAP32.buffer, outLenPtr, outLen);

  openJPEG._free(pixelsPtr);
  openJPEG._free(openJPEG.getValue(outPtrPtr, '*'));
  openJPEG._free(iccProfilePtr);
  openJPEG._free(outLenPtr);
  return compressedData;
}

module.exports = {
  encode: encode
};
