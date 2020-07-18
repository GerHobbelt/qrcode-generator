const RENDERMODE = 1;

var body_loadHander = function() {

  var crtOpt = function(value, label) {
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(label) );
    opt.value = value;
    return opt;
  };

  var t = document.forms['qrForm'].elements['t'];
  t.appendChild(crtOpt('' + 0, 'Auto Detect') );
  for (var i = 1; i <= 40; i += 1) {
    t.appendChild(crtOpt('' + i, '' + i) );
  }
  t.value = '0';

  update_qrcode();
};


var create_qrcode = function(text, typeNumber, errorCorrectionLevel, mode, mb) {
  qrcode.stringToBytes = qrcode.stringToBytesFuncs[mb];

  var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');

  qr.addData(text, mode);
  qr.make();

  switch (RENDERMODE) {
   case 0:
  return qr.createTableTag();

default:
  case 1:
 return qr.createSvgTag();

 case 2:
  return qr.createImgTag();

 case 3:
 // cellSize: 1 ('half')
  return '<pre class="qrcode">' + qr.createASCII() + '</pre>';
 
 case 4:
 // cellSize: 2
  return '<pre class="qrcode">' + qr.createASCII(2) + '</pre>';
 }
};

var update_qrcode = function() {
  var form = document.forms['qrForm'];
  var text = form.elements['site'].value.
    replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  var row = form.elements['row'].value.
    replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  var col = parseInt(form.elements['col'].value);
  var lines = parseInt(form.elements['lines'].value);
  var t = form.elements['t'].value;
  var e = form.elements['e'].value;
  var m = form.elements['m'].value;
  var mb = form.elements['mb'].value;

  let tbl = ['<table class="A4">'];
  for (let y = 0; y < lines * 2; y++) {
    tbl.push(`<tr class="${y % 2 === 0 ? "odd" : "even"}">`);
    for (let x = 0; x < 5; x++) {
      let colstr = String(col).padStart(3, '0');
      let code = text.replace('{row}', row).replace('{col}', colstr);

      tbl.push('<td class="qrcode">');
      tbl.push(create_qrcode(code, t, e, m, mb));
      tbl.push('</td>');
      tbl.push('<td class="human-readable">');
      tbl.push(`${row} ${colstr}`);
      tbl.push('</td>');
      col++;
    }
    tbl.push('</tr>');
  }
  tbl.push('</table>');

  document.getElementById('qr').innerHTML = tbl.join('\n');
};
