import * as React from 'react';

import { IDirection, IPos } from '../interfaces';
import './style.css';

interface Props {
  minWidth?: number;
  maxWidth?: number;
  direction?: IDirection;
  children?: any;
}

export const Resizable = ({ minWidth, maxWidth, direction, children }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const prevPos = React.useRef<IPos>({ x: 0, y: 0 });
  const width = React.useRef<number>(256);

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
    const delta = e.clientX - prevPos.current.x;
    const newWidth = direction === 'left' ? width.current - delta : width.current + delta;

    if (newWidth < minWidth || newWidth > maxWidth) {
      return;
    }

    prevPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    width.current = newWidth;
    ref.current.style.width = `${newWidth}px`;
  }

  return (
    <div className='resizable' ref={ref}>
      <div className='resizable-anchor' onMouseDown={onMouseDown} style={{
        left: direction === 'left' ? 0 : 'unset',
      }} />
      {children}
    </div>
  );
}

Resizable.defaultProps = {
  maxWidth: 512
}
