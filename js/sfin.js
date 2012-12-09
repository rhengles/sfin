
function pgto(taxa, nper, vp) {
  // fonte: http://www.dourado.net/2010/11/20/calcular-tabela-price-em-php-pgto-no-excel/
  if (isNaN(taxa) || isNaN(nper) || isNaN(vp)) return NaN;
  // console.log('PGTO '.concat(vp, ' taxa ', taxa.toFixed(3), ' nper ', nper.toFixed(0)));
  var e = 1.0, cont = 1.0, valor;
  for ( var k = 1; k <= nper; k++ ) {
    cont = cont * (taxa + 1);
    // console.log('PGTO '.concat(k, ' cont ', cont.toFixed(4), ' e ', e.toFixed(4)));
    e = e + cont;
  }
  e = e - cont;
  // console.log('e '.concat(e));
  vp = vp * cont;
  // console.log('vp '.concat(vp));
  vp = vp / e;
  // console.log('vp '.concat(vp));
  return vp;
}
function pgto_iof(taxa, nper, vp) {
  var parc = pgto(taxa, nper, vp)
    , total = parc * nper
    , vpcurr = vp
    , vpnext, vpafter, juro, amor
    , tiofdia = 0.000041
    , tiofmes = 0.0038
    , diaspormes = 30.4375
    , somaiof = 0
    , iof, ioffin;
  for ( var k = 1; k <= nper; k++ ) {
    vpnext = vpcurr*(1+taxa);
    vpafter = vpnext - parc;
    amor = vpcurr - vpafter;
    juro = vpnext - vpcurr;
    iof = amor * ( tiofmes + tiofdia * Math.min(365, diaspormes * k) );
    somaiof += iof;
    /* console.log('k '.concat(k,
      ' curr ', vpnext.toFixed(4),
      ' after ', vpafter.toFixed(4),
      ' amor ', amor.toFixed(4),
      ' juro ', juro.toFixed(4),
      ' iof ', iof.toFixed(4) )); // */
    vpcurr = vpafter;
  }
  ioffin = somaiof * vp / ( vp - somaiof );
  // console.log('total IOF '.concat(somaiof, ' fin ', ioffin));
  return [parc, parc+ioffin/nper, somaiof, ioffin];
}
/*function PMT(i, n, p) {
  return i * p * Math.pow((1 + i), n) / (1 - Math.pow((1 + i), n));
}*/
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
    , total   = parseInt(f.eq(0).val(), 10)
    , entrada = parseInt(f.eq(1).val(), 10)
    , divida = total-entrada;
  f.eq(2).val(isNaN(divida) ? '' : formatNum(divida));
  calc.call(this);
}
function calc() {
  var f = $(this).closest('tr').find('input')
    , divida = parseInt(f.eq(2).val(), 10)
    , tac    = parseInt(f.eq(3).val(), 10)
    , juros  = parseNum(f.eq(4).val())
    , nrParc = parseInt(f.eq(5).val(), 10)
    //, vrParc = pgto(juros/100, nrParc, divida+tac) //Math.pow(juros/100+1, 1/12)-1
    , pgto   = (isNaN(juros) || isNaN(nrParc) || isNaN(divida) || isNaN(tac))
      ? [NaN, NaN, NaN, NaN]
      : pgto_iof(juros/100, nrParc, divida+tac) //Math.pow(juros/100+1, 1/12)-1
    , vrParc = pgto[1]
    , iof    = pgto[3]
    , total  = vrParc * nrParc
    , custo  = total-divida
    , renda  = vrParc/0.3;
  f.eq(6 ).val(isNaN(vrParc) ? '' : formatNum(vrParc));
  f.eq(7 ).val(isNaN(total ) ? '' : formatNum(total ));
  f.eq(8 ).val(isNaN(custo ) ? '' : formatNum(custo ));
  f.eq(9 ).val(isNaN(iof   ) ? '' : formatNum(iof ));
  f.eq(10).val(isNaN(renda ) ? '' : formatNum(renda ));
}
function novaLinha() {
  var nr = $('#frSim tr').length
    , tr = document.createElement('tr')
    , tds = [document.createElement('td')];
  tds[0].className = 'col_0';
  tr.appendChild(tds[0]);
  for (var i = 1; i <= 11; i++) {
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
  $(tds[6].input).on('keyup', calc);
  tds[7].input.readOnly = true;
  tds[8].input.readOnly = true;
  tds[9].input.readOnly = true;
  tds[10].input.readOnly = true;
  tds[11].input.readOnly = true;
  $('#frSim table').append(tr);
}
var f = $('#frSim');
$('#btNovo').on('click', novaLinha);