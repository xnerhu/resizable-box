import * as React from 'react';

import { IDirection, IPos } from '../../interfaces';
import './style.css';

interface Props {
  direction?: IDirection;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  anchorSize?: number;
  children?: any;
  style?: React.CSSProperties;
  anchorStyle?: React.CSSProperties;
}

export const Resizable = ({ minSize, maxSize, direction, anchorSize, defaultSize, children, style, anchorStyle }: Props) => {
  const vertical = direction === 'top' || direction === 'bottom';

  const ref = React.useRef<HTMLDivElement>(null);
  const prevPos = React.useRef<IPos>({ x: 0, y: 0 });
  const size = React.useRef<number>(defaultSize);

  const onMouseDown = (e: React.MouseEvent) => {
    prevPos.current = {
      x: e.clientX,
      y: e.clientY,
    }

    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('mousemove', onWindowMouseMove);
  }

  const onWindowMouseUp = () => {
    window.removeEventListener('mouseup', onWindowMouseUp);
    window.removeEventListener('mousemove', onWindowMouseMove);
  }

  const onWindowMouseMove = (e: MouseEvent) => {
    const delta = vertical ? e.clientY - prevPos.current.y : e.clientX - prevPos.current.x;
    const newSize = direction === 'left' || direction === 'top' ? size.current - delta : size.current + delta;

    if (newSize < minSize || newSize > maxSize) {
      return;
    }

    prevPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    size.current = newSize;

    const style = `${newSize}px`;

    if (vertical) {
      ref.current.style.height = style;
    } else {
      ref.current.style.width = style;
    }
  }

  if (defaultSize == null) {
    React.useEffect(() => {
      if (size.current == null) {
        const { clientHeight, clientWidth } = ref.current;
        size.current = vertical ? clientHeight : clientWidth;
      }
    }, [ref]);
  }

  return (
    <div className='resizable' ref={ref} style={{ ...style, [vertical ? 'height' : 'width']: defaultSize }}>
      <div className='resizable-anchor' onMouseDown={onMouseDown} style={{
        ...anchorStyle,
        width: vertical ? '100%' : anchorSize,
        height: vertical ? anchorSize : '100%',
        cursor: vertical ? 'ns-resize' : 'ew-resize',
        [direction]: 0
      }} />
      {children}
    </div >
  );
}

Resizable.defaultProps = {
  minSize: 0,
  maxSize: 0,
  anchorSize: 4,
}
