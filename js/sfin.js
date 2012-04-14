
function pgto(taxa, nper, vp) {
  if (isNaN(taxa) || isNaN(nper) || isNaN(vp)) return NaN;
  var e = 1.0, cont = 1.0, valor;
  for ( var k = 1; k <= nper; k++ ) {
    cont = cont * (taxa + 1);
    e = e + cont;
  }
  e = e - cont;
  vp = vp * cont;
  return vp / e;
}
function parseNum(s) {
  s = s.replace('.', '');
  s = s.replace(',', '.');
  return parseFloat(s);
}
function formatNum(n) {
  return n.toFixed(2).replace('.', ',');
}
function calcDivida() {
  var f = $(this).closest('tr').find('input')
    , vrTotal = parseInt(f.eq(0).val(), 10)
    , entrada = parseInt(f.eq(1).val(), 10)
    , divida = vrTotal-entrada;
  f.eq(2).val(isNaN(divida) ? '' : formatNum(divida));
  calc.call(this);
}
function calc() {
  var f = $(this).closest('tr').find('input')
    , divida = parseInt(f.eq(2).val(), 10)
    , juros  = parseNum(f.eq(3).val())
    , nrParc = parseInt(f.eq(4).val(), 10)
    , vrParc = pgto(juros/100, nrParc, divida) //Math.pow(juros/100+1, 1/12)-1
    , total  = vrParc * nrParc
    , vrJuro = total-divida
    , renda  = vrParc/0.3;
  f.eq(5).val(isNaN(vrParc) ? '' : formatNum(vrParc));
  f.eq(6).val(isNaN(total ) ? '' : formatNum(total ));
  f.eq(7).val(isNaN(vrJuro) ? '' : formatNum(vrJuro));
  f.eq(8).val(isNaN(renda ) ? '' : formatNum(renda ));
}
function novaLinha() {
  var nr = $('#frSim tr').length
    , tr = document.createElement('tr')
    , tds = [document.createElement('td')];
  tds[0].className = 'col_0';
  tr.appendChild(tds[0]);
  for (var i = 1; i < 10; i++) {
    var col = {
      td: document.createElement('td'),
      input: document.createElement('input')
    };
    col.input.type = 'text';
    col.input.name = 'inp_'.concat(nr, '_', i);
    col.td.className = 'col_'.concat(i);
    col.td.appendChild(col.input);
    tr.appendChild(col.td);
    tds.push(col);
  }
  $(tds[1].input).on('keyup', calcDivida);
  $(tds[2].input).on('keyup', calcDivida);
  tds[3].input.readOnly = true;
  $(tds[4].input).on('keyup', calc);
  $(tds[5].input).on('keyup', calc);
  tds[6].input.readOnly = true;
  tds[7].input.readOnly = true;
  tds[8].input.readOnly = true;
  tds[9].input.readOnly = true;
  $('#frSim table').append(tr);
}
var f = $('#frSim');
$('#btNovo').on('click', novaLinha);