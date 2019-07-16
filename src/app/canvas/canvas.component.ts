import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { DIMENSIONS } from './canvas.constants';

@Component({
  selector: 'app-canvas-joy-division',
  templateUrl: './canvas.component.html'
})

export class CanvasComponent implements OnInit {

  @ViewChild('joyDivisionCanvas', { static: true }) joyDivisionCanvas: ElementRef;
  context: CanvasRenderingContext2D;
  dpr = window.devicePixelRatio;
  lineWidth = DIMENSIONS.lineWidth;
  size = DIMENSIONS.canvasSize;

  ngOnInit() {
    this.context = (this.joyDivisionCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context.canvas.width = this.size * this.dpr;
    this.context.canvas.height = this.size * this.dpr;
    this.context.scale(this.dpr, this.dpr);
    this.context.lineWidth = this.lineWidth;

    this.drawCanvas();
  }

  private drawCanvas(): void {
    const step = DIMENSIONS.step;
    const lines = [];

    for (let i = step; i <= this.size - step; i += step) {
      const line = [];

      for (let j = step; j <= this.size - step; j += step) {
        const pattern = this.randomPattern(j);
        const point = {x: j, y: i + pattern };
        line.push(point);
      }
      lines.push(line);
    }

    for (let i = 5; i < lines.length; i++) {
      this.context.beginPath();
      this.context.moveTo(lines[i][0].x, lines[i][0].y);
      let j = 0;

      while (j < lines[i].length - 2) {
        const xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
        const yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
        this.context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
        j++;
      }

      this.context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
      this.context.save();
      this.context.globalCompositeOperation = 'destination-out';
      this.context.fill();
      this.context.restore();
      this.context.stroke();
    }
  }

  private randomPattern(index): number {
    const distanceToCenter = Math.abs(index - this.size / 2);
    const variance = Math.max(this.size / 2 - 50 - distanceToCenter, 0);
    return Math.random() * variance / 2 * -1;
  }
}
