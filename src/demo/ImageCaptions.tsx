import { useEffect, useRef, useState } from "react";

const width = 688;
const height = 360;

const src = "https://picsum.photos/688/360";

type DrawingSign = {
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
  rotatable?: boolean;
  rotateAngle?: number;
  type?: string;
} & {
  type?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};

const ImageCaptions = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<{
    src: string;
    width: number;
    height: number;
  } | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [blobSrc, setBlobSrc] = useState<string | null>(null);
  let scale = 1,
    scaleX = 0,
    scaleY = 0,
    isDragging = false,
    startX = 0,
    startY = 0,
    translateX = 0,
    translateY = 0,
    sginStartX = 0,
    sginStartY = 0,
    shiftX = 0,
    shiftY = 0,
    prevX = 0,
    prevY = 0,
    editorShiftX = 0,
    editorShiftY = 0,
    signs: DrawingSign[] = [
      // {
      //   x: 300,
      //   y: 200,
      //   width: 100,
      //   height: 100,
      //   isEditing: false,
      //   rotatable: true,
      //   rotateAngle: 20,
      // },
    ];

  let drawingSign: DrawingSign | null = null;
  let editSign: DrawingSign | null = null;
  let draggingSign: DrawingSign | null = null;
  let startEditSgin: DrawingSign | null = null;
  let dragingEditor: DrawingSign | null = null;
  let rotatingRect: DrawingSign | null = null;

  const img = new Image();
  img.src = src;

  const drawImage = () => {
    if (image) {
      img.src = image.src;
      img.onload = () => {
        draw();
      };
    } else {
      img.onload = () => {
        draw();
      };
    }
  };

  const draw = () => {
    console.log("draw");
    if (canvasRef.current) {
      const _width = image?.width || width;
      const _height = image?.height || height;
      const ctx = canvasRef.current.getContext("2d")!;
      ctx.clearRect(0, 0, _width, _height);
      ctx.save();
      ctx.translate(scaleX, scaleY);
      ctx.scale(scale, scale);
      ctx.translate(-scaleX, -scaleY);
      ctx.translate(translateX, translateY);
      ctx.drawImage(img, 0, 0, _width, _height);
      signs.forEach((r) => {
        ctx.strokeStyle = r.isEditing
          ? "rgba(102, 205, 204, 1)"
          : "rgba(255, 0, 0)";

        ctx.save();
        if (r.rotatable) {
          ctx.translate(r.x + r.width / 2, r.y + r.height / 2);
          ctx.rotate((r.rotateAngle! * Math.PI) / 180);
          ctx.translate(-(r.x + r.width / 2), -(r.y + r.height / 2));
        }
        ctx.strokeRect(r.x, r.y, r.width, r.height);

        if (r.isEditing) {
          drawEditor(r);
        }
        ctx.restore();
      });
      if (drawingSign) {
        ctx.strokeRect(
          drawingSign.x,
          drawingSign.y,
          drawingSign.width,
          drawingSign.height
        );
      }
      ctx.restore();

      if (image) {
        const url = canvasRef.current.toDataURL("image/png", 1)
        setBlobSrc(url)
      }
    }
  };

  const onWheel = (event: WheelEvent) => {
    if (event.altKey) {
      event.preventDefault();

      if (event.deltaY < 0) {
        console.log("放大");
        if (scale < 3) {
          scale = Math.min(scale + 0.1, 3);
          scaleX = event.offsetX;
          scaleY = event.offsetY;
          draw();
        }
      } else {
        console.log("缩小");
        if (scale > 1) {
          scale = Math.max(scale - 0.1, 1);
          draw();
        }
      }
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    startX = event.pageX - translateX;
    startY = event.pageY - translateY;
    isDragging = true;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (event.ctrlKey && isDragging) {
      event.preventDefault();
      translateX = event.pageX - startX;
      translateY = event.pageY - startY;
      draw();
      //   draggable.style.transform =
      //     "translate(" + translateX + "px, " + translateY + "px)";
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    isDragging = false;
  };

  const computexy = (x: number, y: number) => {
    return {
      x: (x - scaleX * (1 - scale) - translateX * scale) / scale,
      y: (y - scaleY * (1 - scale) - translateY * scale) / scale,
    };
  };

  const computewh = (width: number, height: number) => {
    return {
      width: width / scale,
      height: height / scale,
    };
  };

  const computeRect = (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    return {
      ...computexy(rect.x, rect.y),
      ...computewh(rect.width, rect.height),
      rotatable: true,
      rotateAngle: 0,
    };
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.altKey) {
      const _x = event.offsetX;
      const _y = event.offsetY;
      sginStartX = _x;
      sginStartY = _y;
      const { x, y } = computexy(_x, _y);

      if (editSign) {
        const editor: any = poInEditor({ x, y }, editSign);
        if (editor) {
          //执行旋转
          if (editor.type === "rotRect") {
            rotatingRect = editSign;
            prevX = _x;
            prevY = _y;
            return;
          }
          startEditSgin = { ...editSign };
          dragingEditor = editor;
          editorShiftX = x - editor.x;
          editorShiftY = y - editor.y;
          return;
        }
      }

      const pickSgin = signs.find((s) => judgePosition(x, y, s));
      if (pickSgin) {
        if (editSign && pickSgin !== editSign) {
          editSign.isEditing = false;
          editSign = null;
        }

        shiftX = x - pickSgin.x;
        shiftY = y - pickSgin.y;
        draggingSign = pickSgin;

        editSign = pickSgin;
        editSign.isEditing = true;
        draw();
      } else {
        if (editSign) {
          editSign.isEditing = false;
          editSign = null;
          draw();
        }
        drawingSign = drawingSign || ({} as any);
      }

      console.log("mousedown");
    }
  };
  const onPointerMove = (event: PointerEvent) => {
    const { x, y } = computexy(event.offsetX, event.offsetY);
    if (event.altKey) {
      if (editSign) {
        const editor = poInEditor({ x, y }, editSign);
        if (dragingEditor) {
          const moveX = (event.offsetX - sginStartX) / scale;
          const moveY = (event.offsetY - sginStartY) / scale;
          console.log(dragingEditor.type);

          switch (dragingEditor.type) {
            case "top":
              editSign.y = startEditSgin!.y + moveY;
              editSign.height = startEditSgin!.height - moveY;
              break;
            case "right":
              editSign.width = startEditSgin!.width + moveX;
              break;
            case "bottom":
              editSign.height = startEditSgin!.height + moveY;
              break;
            case "left":
              editSign.x = startEditSgin!.x + moveX;
              editSign.width = startEditSgin!.width - moveX;
              break;
            case "leftTop":
              editSign.y = startEditSgin!.y + moveY;
              editSign.height = startEditSgin!.height - moveY;
              editSign.x = startEditSgin!.x + moveX;
              editSign.width = startEditSgin!.width - moveX;
              break;
            case "rightTop":
              editSign.width = startEditSgin!.width + moveX;
              editSign.y = startEditSgin!.y + moveY;
              editSign.height = startEditSgin!.height - moveY;
              break;
            case "rightBottom":
              editSign.width = startEditSgin!.width + moveX;
              editSign.height = startEditSgin!.height + moveY;
              break;
            case "leftBottom":
              editSign.x = startEditSgin!.x + moveX;
              editSign.width = startEditSgin!.width - moveX;
              editSign.height = startEditSgin!.height + moveY;
              break;
          }
          draw();
          return;
        }
        if (rotatingRect) {
          const _x = event.offsetX;
          const _y = event.offsetY;
          const relativeAngle = getRelativeRotationAngle(
            computexy(_x, _y),
            computexy(prevX, prevY),
            {
              x: editSign.x + editSign.width / 2,
              y: editSign.y + editSign.height / 2,
            }
          );
          console.log("relativeAngle", relativeAngle);
          editSign.rotateAngle! += (relativeAngle * 180) / Math.PI;
          prevX = _x;
          prevY = _y;

          draw();
          return;
        }
      }
      if (draggingSign) {
        draggingSign.x = x;
        draggingSign.y = y;
        draw();
        return;
      }
      if (drawingSign) {
        drawingSign = computeRect({
          x: sginStartX,
          y: sginStartY,
          width: event.offsetX - sginStartX,
          height: event.offsetY - sginStartY,
        });
        draw();
        return;
      }
    }
  };
  const onPointerUP = (event: PointerEvent) => {
    if(rotatingRect){
      rotatingRect = null;
    }
    if (dragingEditor) {
      dragingEditor = null;
      startEditSgin = null;
      return;
    }
    if (draggingSign) {
      draggingSign = null;
      return;
    }
    if (drawingSign) {
      drawingSign = null;
      // 如果绘制的矩形太小，则不添加，防止原地点击时添加矩形
      // 如果反向绘制，则调整为正向
      const width = Math.abs(event.offsetX - sginStartX);
      const height = Math.abs(event.offsetY - sginStartY);
      if (width > 1 || height > 1) {
        const newrect = computeRect({
          x: Math.min(sginStartX, event.offsetX),
          y: Math.min(sginStartY, event.offsetY),
          width,
          height,
        });
        signs.push(newrect as any);
        draw();
      }
      return;
    }
  };
  //判断 是否选中标注
  const judgePosition = (x: number, y: number, sgin: DrawingSign) => {
    return (
      x >= sgin.x &&
      x <= sgin.x + sgin.width &&
      y >= sgin.y &&
      y <= sgin.y + sgin.height
    );
  };

  const computedEditSgin = (rect: DrawingSign) => {
    const width = 10;
    const linelen = 16;
    return {
      top: {
        type: "top",
        x: rect.x + rect.width / 2 - width / 2,
        y: rect.y - width / 2,
        width,
        height: width,
      },
      right: {
        type: "right",
        x: rect.x + rect.width - width / 2,
        y: rect.y + rect.height / 2 - width / 2,
        width,
        height: width,
      },
      bottom: {
        type: "bottom",
        x: rect.x + rect.width / 2 - width / 2,
        y: rect.y + rect.height - width / 2,
        width,
        height: width,
      },
      left: {
        type: "left",
        x: rect.x - width / 2,
        y: rect.y + rect.height / 2 - width / 2,
        width,
        height: width,
      },
      leftTop: {
        type: "leftTop",
        x: rect.x - width / 2,
        y: rect.y - width / 2,
        width,
        height: width,
      },
      rightTop: {
        type: "rightTop",
        x: rect.x + rect.width - width / 2,
        y: rect.y - width / 2,
        width,
        height: width,
      },
      rightBottom: {
        type: "rightBottom",
        x: rect.x + rect.width - width / 2,
        y: rect.y + rect.height - width / 2,
        width,
        height: width,
      },
      leftBottom: {
        type: "leftBottom",
        x: rect.x - width / 2,
        y: rect.y + rect.height - width / 2,
        width,
        height: width,
      },
      ...(rect.rotatable
        ? {
            rotLine: {
              type: "rotLine",
              x1: rect.x + rect.width / 2,
              y1: rect.y - linelen - width / 2,
              x2: rect.x + rect.width / 2,
              y2: rect.y - width / 2,
            },
            rotRect: {
              type: "rotRect",
              x: rect.x + rect.width / 2 - width / 2,
              y: rect.y - width / 2 - linelen - width,
              width,
              height: width,
            },
          }
        : null),
    };
  };

  const drawEditor = (rect: DrawingSign) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!;
      ctx.save();
      const editor = computedEditSgin(rect);
      ctx.fillStyle = "rgba(102, 205, 204, 1)";
      const { rotLine, rotRect, ...rects } = editor;

      if (rect.rotatable && rotRect && rotLine) {
        ctx.fillRect(rotRect.x, rotRect.y, rotRect.width, rotRect.height);
        ctx.beginPath();
        ctx.moveTo(rotLine.x1, rotLine.y1);
        ctx.lineTo(rotLine.x2, rotLine.y2);
        ctx.stroke();
      }
      for (const iterator of Object.values(rects)) {
        ctx.fillRect(iterator.x, iterator.y, iterator.width, iterator.height);
      }
      ctx.restore();
    }
  };

  const poInEditor = (point: Record<string, number>, sgin: DrawingSign) => {
    const editor = computedEditSgin(sgin);
    if (!editor) return;
    for (const iterator of Object.values(editor)) {
      if (
        poInRotRect(
          point,
          iterator as any,
          {
            x: sgin.x + sgin.width / 2,
            y: sgin.y + sgin.height / 2,
          },
          sgin.rotateAngle
        )
      ) {
        return iterator;
      }
    }
  };

  const rotatePoint = (
    point: Record<string, number>,
    rotateCenter: Record<string, number>,
    rotateAngle: number
  ) => {
    const dx = point.x - rotateCenter.x;
    const dy = point.y - rotateCenter.y;
    const deg = (-rotateAngle * Math.PI) / 180;
    const x = dx * Math.cos(deg) - dy * Math.sin(deg) + rotateCenter.x;
    const y = dx * Math.sin(deg) + dy * Math.cos(deg) + rotateCenter.y;
    return { x, y };
  };

  const poInRotRect = (
    point: Record<string, number>,
    rect: DrawingSign,
    rotateCenter = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    },
    rotateAngle = rect.rotateAngle
  ) => {
    if (rotateAngle) {
      const rotatedPoint = rotatePoint(point, rotateCenter, rotateAngle);
      const res = judgePosition(rotatedPoint.x, rotatedPoint.y, rect);
      return res;
    }
    return judgePosition(point.x, point.y, rect);
  };

  const getRelativeRotationAngle = (
    point: Record<string, number>,
    prev: Record<string, number>,
    center: Record<string, number>
  ) => {
    // 计算上一次鼠标位置和旋转中心的角度
    let prevAngle = Math.atan2(prev.y - center.y, prev.x - center.x);

    // 计算当前鼠标位置和旋转中心的角度
    let curAngle = Math.atan2(point.y - center.y, point.x - center.x);

    // 得到相对旋转角度
    let relativeAngle = curAngle - prevAngle;

    return relativeAngle;
  };

  const onDelete = (event:KeyboardEvent)=>{
    if(editSign&&event.code==='Delete'){
      const list = signs.filter(s=>s!==editSign)
      signs=list
      draw()
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        drawImage();
      }

      document.addEventListener("wheel", onWheel, { passive: false });
      canvasRef.current.addEventListener("mousedown", onMouseDown, {
        passive: false,
      });
      canvasRef.current.addEventListener("mousemove", onMouseMove, {
        passive: false,
      });
      canvasRef.current.addEventListener("mouseup", onMouseUp, {
        passive: false,
      });
      canvasRef.current.addEventListener("pointerdown", onPointerDown, {
        passive: false,
      });
      canvasRef.current.addEventListener("pointermove", onPointerMove, {
        passive: false,
      });
      canvasRef.current.addEventListener("pointerup", onPointerUP, {
        passive: false,
      });
      document.addEventListener("keydown", onDelete, {
        passive: false,
      });
      return () => {
        document.removeEventListener("wheel", onWheel);
        canvasRef.current?.removeEventListener("mousedown", onMouseDown);
        canvasRef.current?.removeEventListener("mousemove", onMouseMove);
        canvasRef.current?.removeEventListener("mouseup", onMouseUp);
        canvasRef.current?.removeEventListener("pointerdown", onPointerDown);
        canvasRef.current?.removeEventListener("pointermove", onPointerMove);
        canvasRef.current?.removeEventListener("pointerup", onPointerUP);
        document.removeEventListener("keydown", onDelete);
      };
    }
  }, [image]);
  const upLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file, "file");
      const [mime, ext] = file.type.split("/");
      if (mime === "image") {
        if (file.size >= 5242880) {
          alert(`图片不能大于${5}M`);
          return;
        }
        setName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target?.result as string;
          img.onload = () => {
            setImage({
              src: e.target?.result as string,
              width: img.width,
              height: img.height,
            });
          };
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <>
    <div>
      <h3 className="text-[20px] text-center">图片编辑</h3>
      <ol>
        <li>
          1. 按住ctrl+鼠标左键，移动图片
        </li>
        <li>
          2. 按住alt+鼠标滚轮，即可放大/缩小图片
        </li>
        <li>
          3. 按住alt+鼠标左键，移动鼠标，即可绘制矩形
        </li>
        <li>
          4. 按住alt+鼠标左键，点击矩形，即可选中矩形
        </li>
        <li>
          5. 按住alt+鼠标左键，点击矩形(长按)，移动鼠标，即可使选中矩形的矩形跟随鼠标移动
        </li>
        <li>
          6. 选中矩形后 按住alt+鼠标左键，点击操作方块并拖动 即可改变矩形大小 或旋转矩形（最上方的操作方块选中后拖动可以旋转矩形）
        </li>
        <li>
          7.选中矩形后 按下Delete键，即可删除矩形
        </li>
      </ol>
    </div>
   <blockquote>
    <p>
      当前demo只能在pc端使用；且支持上传图片和保存编辑后的图片；上传的图片最大支持5MB
    </p>
   </blockquote>
      <div className="py-[10px]">
        <label className="ml-[30px]">
          上传图片：
          <input type="file" accept="image/*" onChange={upLoad} />
        </label>
      </div>
      {image && blobSrc ? (
        <div className="py-[10px]">
          <label className="ml-[30px]">
            <a href={blobSrc} download={`edito_${name}`}>下载图片</a>
          </label>
        </div>
      ) : null}
      {/* {image && (
        <img
          src={image.src}
          width={image.width}
          height={image.height}
          alt=""
          className="w-[100%] h-[100%] object-cover"
        />
      )} */}
      <div className="border-[#6cc] border-solid border-[1px] overflow-hidden">
        <canvas
          className="mx-auto"
          ref={canvasRef}
          width={image?.width || width}
          height={image?.height || height}
        ></canvas>
      </div>
    </>
  );
};

export default ImageCaptions;
