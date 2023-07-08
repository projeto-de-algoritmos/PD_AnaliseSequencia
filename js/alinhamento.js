let nomeArq1;
const arquivo_1 = document.querySelector('#arquivo_1');
const preview_1 = document.querySelector('#preview_1');

let nomeArq2;
const arquivo_2 = document.querySelector('#arquivo_2');
const preview_2 = document.querySelector('#preview_2');

const btnDownload = document.querySelector('#baixar');
const btnAnalisar = document.querySelector('#analisar');

arquivo_1.addEventListener('change', function(){
  const arquivo = this.files[0];
  nomeArq1 = this.files[0].name;
  nomeArq1 = nomeArq1.substring(0, nomeArq1.length - 4);
  const leitor = new FileReader();

  leitor.addEventListener('load', function(){
    preview_1.value = leitor.result;
  });

  if(arquivo) {
    leitor.readAsText(arquivo);
  }
});

arquivo_2.addEventListener('change', function(){
  const arquivo = this.files[0];
  nomeArq2 = this.files[0].name;
  nomeArq2 = nomeArq2.substring(0, nomeArq2.length - 4);
  const leitor = new FileReader();

  leitor.addEventListener('load', function(){
    preview_2.value = leitor.result;
  });

  if(arquivo) {
    leitor.readAsText(arquivo);
  }
});

const download = function(){
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  return function(conteudo, nomeArquivo){
    const blob = new Blob([conteudo], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    window.URL.revokeObjectURL(url);
  };
};

function alignSequences(seq1, seq2, matchScore = 2, mismatchPenalty = -5, gapPenalty = -1) {
  const m = seq1.length;
  const n = seq2.length;
  const scoreMatrix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));

  // Cálculo do memorization
  const calculateScore = (i, j) => {
    if (scoreMatrix[i][j] !== null) return scoreMatrix[i][j];
    if (i === 0 && j === 0) return 0;
    if (i === 0) return j * gapPenalty;
    if (j === 0) return i * gapPenalty;

    const match = seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchPenalty;
    const diagonalScore = calculateScore(i - 1, j - 1) + match;
    const leftScore = calculateScore(i, j - 1) + gapPenalty;
    const upScore = calculateScore(i - 1, j) + gapPenalty;

    scoreMatrix[i][j] = Math.max(diagonalScore, leftScore, upScore);
    return scoreMatrix[i][j];
  };

  // Fazendo o alinhamento
  const align = (i, j) => {
    if (i === 0 && j === 0) return ['', ''];
    if (i === 0) return align(i, j - 1).map((seq, idx) => seq + (idx === 1 ? seq2[j - 1] : '-'));
    if (j === 0) return align(i - 1, j).map((seq, idx) => seq + (idx === 0 ? seq1[i - 1] : '-'));

    const match = seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchPenalty;
    const [alignedSeq1, alignedSeq2] = align(i - 1, j - 1);
    const [alignedSeq1Gap, alignedSeq2Gap] = align(i, j - 1);
    const [alignedSeq1Up, alignedSeq2Up] = align(i - 1, j);

    if (scoreMatrix[i][j] === scoreMatrix[i - 1][j - 1] + match)
      return [alignedSeq1 + seq1[i - 1], alignedSeq2 + seq2[j - 1]];
    if (scoreMatrix[i][j] === scoreMatrix[i][j - 1] + gapPenalty)
      return [alignedSeq1Gap + '-', alignedSeq2Gap + seq2[j - 1]];

    return [alignedSeq1Up + seq1[i - 1], alignedSeq2Up + '-'];
  };

  calculateScore(m, n);
  return align(m, n);
};

// const seq1 = 'AGTACGTA';
// const seq2 = 'TATGCGT';

// const [alignedSeq1, alignedSeq2] = alignSequences(seq1, seq2);

let ans1;
let ans2;

btnAnalisar.addEventListener('click', function(){
  const seq1 = preview_1.value;
  const seq2 = preview_2.value;

  console.log(seq1);
  
  const [alignedSeq1, alignedSeq2] = alignSequences(seq1, seq2);
  ans1 = alignedSeq1;
  ans2 = alignedSeq2;
});

btnDownload.addEventListener('click', function(){
  download()(ans1, nomeArq1 + '-alinhado.csv');
  download()(ans2, nomeArq2 + '-alinhado.csv');
});