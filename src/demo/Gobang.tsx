import { useEffect, useRef } from "react";

const Gobang = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    // 绘制棋盘
    // 水平棋盘线 15条
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(20, 20 + i * 40);
      ctx.lineTo(580, 20 + i * 40);
      ctx.stroke();
      ctx.closePath();
    }
    // 垂直棋盘线 15条
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(20 + i * 40, 20);
      ctx.lineTo(20 + i * 40, 580);
      ctx.stroke();
      ctx.closePath();
    }

    //记录当前执棋人 黑子先行
    let currentPlayer = true;

    // 棋盘二维数组
    const board = Array(15)
      .fill(0)
      .map(() => Array(15).fill(0));

    const onClick = (e: MouseEvent) => {
      const clientX = e.offsetX;
      const clientY = e.offsetY;
      // 计算点击的棋盘坐标
      const x = Math.round((clientX - 20) / 40);
      const y = Math.round((clientY - 20) / 40);
      // 落子
      if (board[y][x]) return;
      // 黑子为1 白子为2
      board[y][x] = currentPlayer ? 1 : 2;
      // 绘制棋子
      ctx.beginPath();
      ctx.arc(20 + x * 40, 20 + y * 40, 15, 0, 2 * Math.PI);
      ctx.fillStyle = currentPlayer ? "#000" : "#fff";
      ctx.fill();
      ctx.closePath();
      // 检查是否胜利
      setTimeout(() => {
        if (isWin(x, y)) {
          const win = confirm(
            `${currentPlayer ? "黑" : "白"}子赢了！是否重新开局？`
          );
          // 重新开局
          ctx.clearRect(0, 0, 600, 600);
          win && draw(ctx);
          canvasRef.current?.removeEventListener("click", onClick);
        } else {
          // 切换执棋人
          currentPlayer = !currentPlayer;
          roundPlayer();
        }
      }, 1);
    };

    // 鼠标点击事件
    canvasRef.current?.addEventListener("click", onClick);

    const isWin = (x: number, y: number) => {
      const flag = currentPlayer ? 1 : 2;
      try {
        // 检查是否有5个棋子连成一线
        console.log(
          judgeUpDown(x, y, flag),
          judgeLeftRight(x, y, flag),
          judgeLUDR(x, y, flag),
          judgeLDRU(x, y, flag)
        );

        if (
          judgeUpDown(x, y, flag) ||
          judgeLeftRight(x, y, flag) ||
          judgeLUDR(x, y, flag) ||
          judgeLDRU(x, y, flag)
        ) {
          return true;
        }
      } catch (error) {
        throw error;
      }
      return false;
    };
    const judgeUpDown = (x: number, y: number, flag: number) => {
      //检查当前坐标上下方是否有连续的五颗同色棋子
      let count = 1;
      // 检查上方
      for (let i = 1; i < 5; i++) {
        let tempY = y - i;
        if (tempY >= 0 && board[tempY][x] === flag) {
          count++;
        } else {
          break;
        }
      }

      // 检查下方
      for (let i = 1; i < 5; i++) {
        let tempY = y + i;
        if (tempY < 15 && board[tempY][x] === flag) {
          count++;
        } else {
          break;
        }
      }
      return count >= 5;
    };
    const judgeLeftRight = (x: number, y: number, flag: number) => {
      //检查当前坐标左右方是否有连续的五颗同色棋子
      let count = 1;
      // 检查左边
      for (let i = 1; i < 5; i++) {
        let tempX = x - i;
        if (tempX >= 0 && board[y][tempX] === flag) {
          count++;
        } else {
          break;
        }
      }

      // 检查右边
      for (let i = 1; i < 5; i++) {
        let tempX = x + i;
        if (tempX < 15 && board[y][tempX] === flag) {
          count++;
        } else {
          break;
        }
      }
      return count >= 5;
    };

    const judgeLUDR = (x: number, y: number, flag: number) => {
      //检查当前坐标左上右下方是否有连续的五颗同色棋子
      let count = 1;
      // 检查左上
      for (let i = 1; i < 5; i++) {
        let tempX = x - i;
        let tempY = y - i;
        if (tempX >= 0 && tempY >= 0 && board[tempY][tempX] === flag) {
          count++;
        } else {
          break;
        }
      }

      // 检查右下
      for (let i = 1; i < 5; i++) {
        let tempX = x + i;
        let tempY = y + i;
        if (tempX < 15 && tempY < 15 && board[tempY][tempX] === flag) {
          count++;
        } else {
          break;
        }
      }
      return count >= 5;
    };

    const judgeLDRU = (x: number, y: number, flag: number) => {
      //检查当前坐标左下右上方是否有连续的五颗同色棋子
      let count = 1;
      // 检查左下
      for (let i = 1; i < 5; i++) {
        let tempX = x + i;
        let tempY = y - i;
        if (tempX < 15 && tempY >= 0 && board[tempY][tempX] === flag) {
          count++;
        } else {
          break;
        }
      }

      // 检查右上
      for (let i = 1; i < 5; i++) {
        let tempX = x - i;
        let tempY = y + i;
        if (tempX >= 0 && tempY < 15 && board[tempY][tempX] === flag) {
          count++;
        } else {
          break;
        }
      }
      return count >= 5;
    };

    const roundPlayer = () => {
      const x = Math.round(Math.random() * 14);
      const y = Math.round(Math.random() * 14);
      if (board[y][x] !== 0) {
        roundPlayer();
      } else {
        board[y][x] = currentPlayer ? 1 : 2;
        ctx.beginPath();
        ctx.arc(20 + x * 40, 20 + y * 40, 15, 0, 2 * Math.PI);
        ctx.fillStyle = currentPlayer ? "#000" : "#fff";
        ctx.fill();
        ctx.closePath();

        // 检查是否胜利
        setTimeout(() => {
          if (isWin(x, y)) {
            console.log(board);
            const win = confirm(
              `${currentPlayer ? "黑" : "白"}子赢了！是否重新开局？`
            );
            // 重新开局
            ctx.clearRect(0, 0, 600, 600);
            win && draw(ctx);
          }
          // 切换执棋人
          currentPlayer = !currentPlayer;
        }, 100);
      }
    };
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx && draw(ctx);
    }
  }, [canvasRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="bg-[#e3cdb0] mx-auto"
      ></canvas>
    </>
  );
};

export default Gobang;
