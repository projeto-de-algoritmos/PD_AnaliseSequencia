const arquivo_1 = document.getElementById('arquivo_1');

arquivo_1.onchange = () => {
  const selectedFile = fileInput.files[0];
  console.log(selectedFile);
}

const arquivo_2 = document.getElementById('arquivo_2');

arquivo_2.onchange = () => {
  const selectedFile = fileInput.files[0];
  console.log(selectedFile);
}

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
}

// Exemplo de uso
const seq1 = 'AGTACGTA';
const seq2 = 'TATGCGT';
const [alignedSeq1, alignedSeq2] = alignSequences(seq1, seq2);

//console.log('Sequência 1 alinhada:', alignedSeq1);
//console.log('Sequência 2 alinhada:', alignedSeq2);
  