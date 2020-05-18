const camelCase = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');

export const resolveColorUrl = (waxed?: boolean, color?: string, isPrimary?: boolean) => {
  if (!color) {
    return undefined;
  }
  let base = 'https://d3ruufruf2uqog.cloudfront.net/paracordImages/';
  base += waxed ? 'waxed/' : 'unwaxed/';
  base += camelCase(color);
  base += isPrimary ? 'Left' : 'Right';
  base += waxed ? 'Waxed.jpg' : '.jpg';
  return base;
};

export const drawBullwhipPreviews = (pattern: string) => {
  const primaryImage = document.getElementById('primary-image-uri');
  const secondaryImage = document.getElementById('secondary-image-uri');
  const canvas = document.getElementById('preview-canvas');
  // @ts-ignore
  const c = canvas.getContext('2d');

  const color1 = c.createPattern(primaryImage, 'repeat');
  const color2 = c.createPattern(secondaryImage, 'repeat');
  const bw = 400;
  const b16 = bw / 16;

  if (!pattern) {
    return;
  }

  const patterns: { [index: string]: () => void } = {
    Box: () => {
      const pattern1 = [0, 1, 4, 5, 8, 9, 12, 13, 16];
      const pattern2 = [0, 3, 4, 7, 8, 11, 12, 15, 16];
      const rowPattern1 = [-12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36];
      const rowPattern2 = [-11, -7, -3, 1, 5, 9, 13, 17, 21, 25, 29, 33, 37];
      const rowPattern3 = [-10, -6, -2, 2, 6, 10, 14, 18, 22, 26, 30, 34, 38];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();
          if (rowPattern1.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (rowPattern2.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (rowPattern3.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          }
          c.fill();
        }
      }
    },
    Accent: () => {
      const pattern1 = [3, 4, 11, 12, 19, 20, 27, 28];
      const row1 = [0, 1, 8, 9, 16, 17, 24, 25];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();
          if (row1.includes(j / (b16 * 2))) {
            if (pattern1.includes(i / b16)) {
              c.fillStyle = color2;
            } else {
              c.fillStyle = color1;
            }
          } else {
            c.fillStyle = color1;
          }
          c.fill();
        }
      }
    },
    Celtic: () => {
      const pattern1 = [0, 1, 4, 5, 8, 9, 12, 13, 16];
      const pattern2 = [0, 3, 4, 7, 8, 11, 12, 15, 16];
      //celtic pattern
      const pattern5 = [0, 1, 4, 5, 8, 9, 16];
      const pattern6 = [0, 3, 4, 7, 8, 15, 16];
      const pattern7 = [0, 1, 4, 5, 8, 9, 10, 11, 12, 16];
      const pattern8 = [0, 3, 4, 7, 11, 15, 16];
      const pattern9 = [0, 1, 6, 8, 9, 10, 11, 12, 13, 16];
      const pattern10 = [0, 5, 7, 9, 12, 15, 16];
      const pattern11 = [0, 1, 4, 5, 6, 7, 8, 11, 16];
      const pattern12 = [0, 5, 8, 9, 10, 11, 12, 13, 14, 16];
      const pattern13 = [0, 1, 4, 7, 9, 13, 15, 16];
      const pattern14 = [0, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16];
      const pattern15 = [0, 1, 5, 7, 9, 11, 15, 16];
      const pattern16 = [0, 4, 6, 7, 8, 9, 10, 11, 12, 13, 16];
      const pattern17 = [0, 1, 3, 7, 9, 12, 15, 16];
      const pattern18 = [0, 2, 3, 4, 5, 6, 7, 8, 11, 16];
      const pattern19 = [0, 5, 8, 9, 10, 11, 12, 15, 16];
      const pattern20 = [0, 1, 4, 7, 9, 11, 16];
      const pattern21 = [0, 3, 4, 5, 6, 7, 8, 10, 15, 16];
      const pattern22 = [0, 1, 5, 9, 12, 13, 16];
      const pattern23 = [0, 4, 5, 6, 7, 8, 11, 12, 15, 16];
      const pattern24 = [0, 1, 8, 9, 12, 13, 16];
      const pattern25 = [0, 7, 8, 11, 12, 15, 16];

      //box rows
      const row1 = [-8, -4, 21, 25, 29];
      const row2 = [-7, -3, 22, 26, 30];
      const row3 = [-6, -2, 23, 27, 31];
      const row4 = [-5, -1, 24, 28, 32];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();

          if (row1.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row2.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (row3.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row4.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 0) {
            c.fillStyle = pattern5.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 1) {
            c.fillStyle = pattern6.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 2) {
            c.fillStyle = pattern7.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 3) {
            c.fillStyle = pattern8.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 4) {
            c.fillStyle = pattern9.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 5) {
            c.fillStyle = pattern10.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 6) {
            c.fillStyle = pattern11.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 7) {
            c.fillStyle = pattern12.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 8) {
            c.fillStyle = pattern13.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 9) {
            c.fillStyle = pattern14.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 10) {
            c.fillStyle = pattern15.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 11) {
            c.fillStyle = pattern16.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 12) {
            c.fillStyle = pattern17.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 13) {
            c.fillStyle = pattern18.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 14) {
            c.fillStyle = pattern19.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 15) {
            c.fillStyle = pattern20.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 16) {
            c.fillStyle = pattern21.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 17) {
            c.fillStyle = pattern22.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 18) {
            c.fillStyle = pattern23.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 19) {
            c.fillStyle = pattern24.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 20) {
            c.fillStyle = pattern25.includes(i / b16) ? color1 : color2;
          }
          c.fill();
        }
      }
    },
    'Egyptian Eye': () => {
      const pattern1 = [0, 1, 2, 3, 5, 6, 7, 8, 13];
      const pattern2 = [3, 8, 9, 10, 11, 13, 14, 15, 16];
      const pattern3 = [0, 2, 7, 11, 16];
      const pattern4 = [1, 6, 8, 10, 15];
      const pattern5 = [0, 5, 9, 14, 16];

      const row1 = [-10, -5, 0, 5, 10, 15, 20, 25, 30];
      const row2 = [-9, -4, 1, 6, 11, 16, 21, 26, 31];
      const row3 = [-8, -3, 2, 7, 12, 17, 22, 27, 32];
      const row4 = [-7, -2, 3, 8, 13, 18, 23, 28];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();
          //The egyptian eye does not function like Emerald did,
          //when row 1 completes its first 16, it actually turns into row4,
          //then row2, then row5, then row3, THEN row 1 again.  May need longer
          //arrays, as I can't subract or add 16 to the 'row if's' like I could have
          //done with emerald, as this pattern seems to run on a factor of 8? (16x(the five rows))
          //Also, I still think there is some positioning that I am not taking into account,
          //the first 5 rows are correct, then it gets off.
          if (row1.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row2.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (row3.includes(j / (b16 * 2))) {
            c.fillStyle = pattern3.includes(i / b16) ? color1 : color2;
          } else if (row4.includes(j / (b16 * 2))) {
            c.fillStyle = pattern4.includes(i / b16) ? color1 : color2;
          } else {
            c.fillStyle = pattern5.includes(i / b16) ? color1 : color2;
          }
          c.fill();
        }
      }
    },
    Emerald: () => {
      const pattern1 = [0, 1, 3, 5, 8, 9, 11, 13, 16];
      const pattern2 = [1, 3, 4, 7, 9, 11, 12, 15];
      const pattern3 = [1, 4, 5, 7, 9, 12, 13, 15];
      const pattern4 = [0, 3, 5, 7, 8, 11, 13, 15, 16];
      const row1 = [-16, -12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32];
      const row2 = [-15, -11, -7, -3, 1, 5, 9, 13, 17, 21, 25, 29, 33];
      const row3 = [-14, -10, -6, -2, 2, 6, 10, 14, 18, 22, 26, 30];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();
          if (row1.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row2.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (row3.includes(j / (b16 * 2))) {
            c.fillStyle = pattern3.includes(i / b16) ? color1 : color2;
          } else {
            c.fillStyle = pattern4.includes(i / b16) ? color1 : color2;
          }
          c.fill();
        }
      }
    },
    'Vertical Strip': () => {
      const pattern1 = [0, 1, 4, 5, 8, 9, 12, 13, 16];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();
          c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          c.fill();
        }
      }
    },

    Valknut: () => {
      //box pattern
      const pattern1 = [0, 1, 4, 5, 8, 9, 12, 13, 16];
      const pattern2 = [0, 3, 4, 7, 8, 11, 12, 15, 16];
      //valknut pattern
      const pattern5 = [0, 1, 4, 5, 8, 9, 12, 13, 14, 15, 16];
      const pattern6 = [0, 3, 4, 7, 8, 11, 12, 13, 14, 15, 16];
      const pattern7 = [0, 1, 4, 5, 8, 9];
      const pattern8 = [0, 3, 4, 7, 8, 10, 11, 12, 14];
      const pattern9 = [0, 1, 4, 5, 14, 16];
      const pattern10 = [0, 3, 4, 6, 8, 9, 10, 16];
      const pattern11 = [0, 1, 2, 3, 5, 7, 8, 10, 12, 14, 16];
      const pattern12 = [0, 1, 2, 4, 6, 8, 9, 11, 13, 14, 16];
      const pattern13 = [0, 1, 6, 7, 8, 10, 12, 13, 14, 16];
      const pattern14 = [0, 2];
      const pattern15 = [2, 4, 5, 6, 8, 10, 11, 12, 14];
      const pattern16 = [14, 16];
      const pattern17 = [0, 2, 3, 4, 6, 8, 9, 10, 16];
      const pattern18 = [0, 2, 3, 5, 7, 8, 10, 12, 14, 16];
      const pattern19 = [0, 2, 4, 6, 8, 9, 11, 13, 14, 16];
      const pattern20 = [0, 6, 7, 8, 10, 12, 13, 14, 16];
      const pattern21 = [0, 2];
      const pattern22 = [2, 4, 5, 6, 8, 10, 11, 12, 14];
      const pattern23 = [14, 16];
      const pattern24 = [0, 2, 3, 4, 6, 8, 9, 10, 15, 16];
      const pattern25 = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 16];
      const pattern26 = [0, 2, 4, 6, 8, 9, 11, 13, 14, 15, 16];
      const pattern27 = [0, 6, 7, 8, 10, 12, 13, 16];
      const pattern28 = [0, 2, 11, 12, 15, 16];
      const pattern29 = [2, 4, 5, 6, 8, 9, 12, 13, 16];
      const pattern30 = [7, 8, 11, 12, 15, 16];
      const pattern31 = [0, 1, 2, 3, 4, 5, 8, 9, 12, 13, 16];
      const pattern32 = [0, 1, 2, 3, 4, 7, 8, 11, 12, 15, 16];
      const pattern33 = [0, 1, 4, 5, 8, 9, 12, 13, 16];

      //box rows
      const row1 = [-8, 28, 32];
      const row2 = [-7, 25, 29];
      const row3 = [-6, 26, 30];
      const row4 = [-5, 27, 31];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();

          if (row1.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row2.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (row3.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row4.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -4) {
            c.fillStyle = pattern5.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -3) {
            c.fillStyle = pattern6.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -2) {
            c.fillStyle = pattern7.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -1) {
            c.fillStyle = pattern8.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 0) {
            c.fillStyle = pattern9.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 1) {
            c.fillStyle = pattern10.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 2) {
            c.fillStyle = pattern11.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 3) {
            c.fillStyle = pattern12.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 4) {
            c.fillStyle = pattern13.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 5) {
            c.fillStyle = pattern14.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 6) {
            c.fillStyle = pattern15.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 7) {
            c.fillStyle = pattern16.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 8) {
            c.fillStyle = pattern17.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 9) {
            c.fillStyle = pattern18.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 10) {
            c.fillStyle = pattern19.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 11) {
            c.fillStyle = pattern20.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 12) {
            c.fillStyle = pattern21.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 13) {
            c.fillStyle = pattern22.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 14) {
            c.fillStyle = pattern23.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 15) {
            c.fillStyle = pattern24.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 16) {
            c.fillStyle = pattern25.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 17) {
            c.fillStyle = pattern26.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 18) {
            c.fillStyle = pattern27.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 19) {
            c.fillStyle = pattern28.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 20) {
            c.fillStyle = pattern29.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 21) {
            c.fillStyle = pattern30.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 22) {
            c.fillStyle = pattern31.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 23) {
            c.fillStyle = pattern32.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 24) {
            c.fillStyle = pattern33.includes(i / b16) ? color1 : color2;
          }
          c.fill();
        }
      }
    },

    'Neo Celtic': () => {
      //box pattern
      const pattern1 = [0, 1, 4, 5, 8, 9, 12, 13, 16];
      const pattern2 = [0, 3, 4, 7, 8, 11, 12, 15, 16];
      //celtic pattern
      const pattern5 = [0, 1, 4, 5, 8, 9, 12, 13];
      const pattern6 = [0, 3, 4, 7, 8, 11, 12];
      const pattern7 = [0, 1, 4, 5, 8, 9, 16];
      const pattern8 = [0, 3, 4, 7, 8, 12, 13, 14];
      const pattern9 = [0, 1, 4, 5, 8, 9, 10, 11, 13];
      const pattern10 = [0, 3, 4, 7, 11, 12, 14, 15, 16];
      const pattern11 = [0, 1, 6, 8, 10, 13];
      const pattern12 = [0, 4, 5, 9, 12, 14, 16];
      const pattern13 = [3, 5, 6, 7, 8, 9, 10, 11, 15];
      const pattern14 = [2, 3, 4, 7, 9, 12, 13, 14];
      const pattern15 = [0, 6, 7, 8, 9, 10, 11, 16];
      const pattern16 = [2, 3, 4, 5, 7, 9, 12, 13, 14];
      const pattern17 = [1, 6, 7, 8, 9, 10, 11, 13];
      const pattern18 = [0, 2, 4, 5, 7, 11, 12, 14, 15, 16];
      const pattern19 = [3, 6, 8, 10, 13];
      const pattern20 = [0, 1, 2, 4, 5, 9, 11, 12, 14, 16];
      const pattern21 = [3, 5, 6, 7, 8, 9, 10, 15];
      const pattern22 = [2, 3, 4, 7, 9, 11, 12, 13, 14];
      const pattern23 = [0, 5, 6, 7, 8, 9, 10, 16];
      const pattern24 = [2, 3, 4, 7, 9, 12, 13, 14];
      const pattern25 = [1, 5, 6, 7, 8, 9, 10, 11, 13];
      const pattern26 = [0, 2, 4, 7, 11, 12, 16];
      const pattern27 = [3, 6, 8, 10, 15, 16];
      const pattern28 = [0, 1, 2, 4, 5, 9, 12, 13, 16];
      const pattern29 = [3, 5, 6, 7, 8, 11, 12, 15, 16];
      const pattern30 = [2, 3, 4, 8, 9, 12, 13, 16];
      const pattern31 = [0, 7, 8, 11, 12, 15, 16];
      const pattern32 = [4, 5, 8, 9, 12, 13, 16];
      const pattern33 = [3, 4, 7, 8, 11, 12, 15, 16];

      //box rows
      const row1 = [-8, 25, 29];
      const row2 = [-7, 26, 30];
      const row3 = [-6, 27, 31];
      const row4 = [-5, 28, 32];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();

          if (row1.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row2.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (row3.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row4.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -4) {
            c.fillStyle = pattern5.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -3) {
            c.fillStyle = pattern6.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -2) {
            c.fillStyle = pattern7.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === -1) {
            c.fillStyle = pattern8.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 0) {
            c.fillStyle = pattern9.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 1) {
            c.fillStyle = pattern10.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 2) {
            c.fillStyle = pattern11.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 3) {
            c.fillStyle = pattern12.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 4) {
            c.fillStyle = pattern13.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 5) {
            c.fillStyle = pattern14.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 6) {
            c.fillStyle = pattern15.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 7) {
            c.fillStyle = pattern16.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 8) {
            c.fillStyle = pattern17.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 9) {
            c.fillStyle = pattern18.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 10) {
            c.fillStyle = pattern19.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 11) {
            c.fillStyle = pattern20.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 12) {
            c.fillStyle = pattern21.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 13) {
            c.fillStyle = pattern22.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 14) {
            c.fillStyle = pattern23.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 15) {
            c.fillStyle = pattern24.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 16) {
            c.fillStyle = pattern25.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 17) {
            c.fillStyle = pattern26.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 18) {
            c.fillStyle = pattern27.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 19) {
            c.fillStyle = pattern28.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 20) {
            c.fillStyle = pattern29.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 21) {
            c.fillStyle = pattern30.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 22) {
            c.fillStyle = pattern31.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 23) {
            c.fillStyle = pattern32.includes(i / b16) ? color1 : color2;
          } else if (j / (b16 * 2) === 24) {
            c.fillStyle = pattern33.includes(i / b16) ? color1 : color2;
          }
          c.fill();
        }
      }
    },

    'Web of Wyrd': () => {
      const pattern1 = [0, 1, 3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16];
      const pattern2 = [1, 2, 7, 8, 10, 12, 14];
      const pattern3 = [0, 2, 6, 8, 9, 10, 11, 12, 13, 14];
      const pattern4 = [2, 3, 4, 5, 6, 7, 8, 10, 14, 16];
      const pattern5 = [2, 4, 6, 8, 9, 14, 15];
      const pattern6 = [0, 1, 2, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16];
      const pattern7 = [2, 4, 7, 8, 13, 14];
      const pattern8 = [1, 2, 3, 6, 8, 12, 14];
      const pattern9 = [0, 2, 5, 8, 11, 14, 16];
      const pattern10 = [2, 4, 8, 10, 13, 14, 15];
      const pattern11 = [2, 3, 8, 9, 12, 14];

      const row1 = [-16, -5, 6, 17, 28];
      const row2 = [-15, -4, 7, 18, 29];
      const row3 = [-14, -3, 8, 19, 30];
      const row4 = [-13, -2, 9, 20];
      const row5 = [-12, -1, 10, 21];
      const row6 = [-11, 0, 11, 22];
      const row7 = [-10, 1, 12, 23];
      const row8 = [-9, 2, 13, 24];
      const row9 = [-8, 3, 14, 25];
      const row10 = [-7, 4, 15, 26];

      for (let j = -b16 * 16; j <= b16 * 62; j += b16 * 2) {
        for (let i = -b16 * 8; i <= bw * 2; i += b16) {
          c.beginPath();
          c.moveTo(i, i + j + 2 * b16);
          c.lineTo(i - b16, i + j + b16);
          c.lineTo(i, i + j);
          c.lineTo(i + b16, i + j + b16);
          c.closePath();
          c.stroke();
          //The egyptian eye does not function like Emerald did,
          //when row 1 completes its first 16, it actually turns into row4,
          //then row2, then row5, then row3, THEN row 1 again.  May need longer
          //arrays, as I can't subract or add 16 to the 'row if's' like I could have
          //done with emerald, as this pattern seems to run on a factor of 8? (16x(the five rows))
          //Also, I still think there is some positioning that I am not taking into account,
          //the first 5 rows are correct, then it gets off.
          if (row1.includes(j / (b16 * 2))) {
            c.fillStyle = pattern1.includes(i / b16) ? color1 : color2;
          } else if (row2.includes(j / (b16 * 2))) {
            c.fillStyle = pattern2.includes(i / b16) ? color1 : color2;
          } else if (row3.includes(j / (b16 * 2))) {
            c.fillStyle = pattern3.includes(i / b16) ? color1 : color2;
          } else if (row4.includes(j / (b16 * 2))) {
            c.fillStyle = pattern4.includes(i / b16) ? color1 : color2;
          } else if (row5.includes(j / (b16 * 2))) {
            c.fillStyle = pattern5.includes(i / b16) ? color1 : color2;
          } else if (row6.includes(j / (b16 * 2))) {
            c.fillStyle = pattern6.includes(i / b16) ? color1 : color2;
          } else if (row7.includes(j / (b16 * 2))) {
            c.fillStyle = pattern7.includes(i / b16) ? color1 : color2;
          } else if (row8.includes(j / (b16 * 2))) {
            c.fillStyle = pattern8.includes(i / b16) ? color1 : color2;
          } else if (row9.includes(j / (b16 * 2))) {
            c.fillStyle = pattern9.includes(i / b16) ? color1 : color2;
          } else if (row10.includes(j / (b16 * 2))) {
            c.fillStyle = pattern10.includes(i / b16) ? color1 : color2;
          } else {
            c.fillStyle = pattern11.includes(i / b16) ? color1 : color2;
          }
          c.fill();
        }
      }
    },
  };

  patterns[pattern]();
};
