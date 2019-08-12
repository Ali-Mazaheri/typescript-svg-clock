import './style.css';

export class Clock {
  timeOffset: number;
  dateHand: SVGElement;
  secondHand: SVGElement;
  minuteHand: SVGElement;
  hourHand: SVGElement;

  public constructor(container: HTMLElement, timeOffset: number) {
    this.timeOffset = timeOffset;
    this.initial(container);
  }

  createSVGElement(type: string): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", type);
  }

  initial(container: HTMLElement) {
    let rect = container.getBoundingClientRect();
    let size = Math.min(rect.height, rect.width);
    let midPoint = size / 2;

    let svg = this.createSVGElement("svg");
    svg.setAttribute("width", size.toString());
    svg.setAttribute("height", size.toString());

    let clockFace = this.renderFace(midPoint);
    svg.appendChild(clockFace);

    let updateGroup = this.renderStaticElement(midPoint);
    svg.appendChild(updateGroup);


    container.appendChild(svg);

    this.update(midPoint);
    setInterval(()=>{
      requestAnimationFrame(this.update.bind(this, midPoint));
      }, 1000);
  }

  renderFace(midPoint: number) {

    let faceGroup = this.createSVGElement("g");
    faceGroup.classList.add("faceGroup");

    let strokeWidth = (midPoint / 20);
    let clockFace = this.createSVGElement("circle");
    clockFace.classList.add("clockFace");
    clockFace.setAttribute("cx", midPoint.toString());
    clockFace.setAttribute("cy", midPoint.toString());
    clockFace.setAttribute("r", (midPoint - strokeWidth / 2).toString());
    clockFace.setAttribute("stroke-width", strokeWidth.toString());
    faceGroup.appendChild(clockFace);

    this.addTicks(faceGroup, midPoint);

    return faceGroup;
  }
  addTicks(faceGroup: SVGElement, midPoint) {

    let minuteAngle = (2 * Math.PI) / 60;

    let j = 0;
    for (let i = 0; i < (Math.PI * 2); i = i + minuteAngle) {

      let h = i;
      let cos = Math.cos(h);
      let sin = Math.sin(h);

      let x = midPoint + midPoint / 1.1 * cos;
      let y = midPoint + midPoint / 1.1 * sin;

      let x1 = midPoint + midPoint / 1.15 * cos;
      let y1 = midPoint + midPoint / 1.15 * sin;

      let x2 = midPoint + midPoint / 1.20 * cos;
      let y2 = midPoint + midPoint / 1.20 * sin;

      let tick = this.createSVGElement("line");
      tick.setAttribute("x1", x.toString());
      tick.setAttribute("y1", y.toString());

      if (j % 5 == 0) {
        tick.setAttribute("x2", x2.toString());
        tick.setAttribute("y2", y2.toString());


        let tp = (j * minuteAngle) - 15 * minuteAngle;
        let x3 = midPoint + midPoint / 1.4 * Math.cos(tp);
        let y3 = midPoint + 5 + midPoint / 1.4 * Math.sin(tp);
        if (j) {
          let text = this.createSVGElement("text");
          text.classList.add("hourNumber");
          text.setAttribute("y", y3.toString());
          text.setAttribute("x", x3.toString());
          text.setAttribute("font-size", (midPoint / 6.8).toString());
          text.setAttribute("text-anchor", "middle");
          text.innerHTML = (j / 5).toString();
          faceGroup.appendChild(text);
        }

      } else {
        tick.setAttribute("x2", x1.toString());
        tick.setAttribute("y2", y1.toString());
      }

      faceGroup.appendChild(tick);
      j++;
    }
  }

  renderStaticElement(midPoint: number) {
    let updateGroup = this.createSVGElement("g");
    updateGroup.classList.add("updateGroup");

    this.renderHourHand(updateGroup, midPoint);
    this.renderMinuteHand(updateGroup, midPoint);
    this.renderSecondHand(updateGroup, midPoint);
    this.renderDateHand(updateGroup, midPoint);

    let circle = this.createSVGElement("circle");
    circle.setAttribute("cx", midPoint.toString());
    circle.setAttribute("cy", midPoint.toString());
    circle.setAttribute("r", (midPoint / 18.3).toString());
    circle.setAttribute("fill", "#444");

    updateGroup.appendChild(circle);

    return updateGroup;
  }

  updateDate(day: number) {
    let sDay = (day < 10) ? ("0" + day) : day.toString();
    this.dateHand.innerHTML = sDay;
  }

  renderDateHand(updateGroup: SVGElement, midPoint) {

    let rectSize = midPoint / 6.9;
    let rect = this.createSVGElement("rect");
    rect.setAttribute("x", (midPoint * 1.5 - rectSize).toString());
    rect.setAttribute("y", (midPoint - rectSize / 2).toString());
    rect.setAttribute("width", rectSize.toString());
    rect.setAttribute("height", rectSize.toString());
    rect.classList.add("dateRect");
    updateGroup.appendChild(rect);

    let text = this.createSVGElement("text");
    text.setAttribute("x", (midPoint * 1.5 - rectSize + 1).toString());
    text.setAttribute("y", (midPoint + rectSize / 4).toString());
    text.setAttribute("font-size", (midPoint / 10).toString());
    text.classList.add("dateText");
    updateGroup.appendChild(text);
    this.dateHand = text;
  }

  renderHourHand(updateGroup: SVGElement, midPoint) {

    let lineWidth = midPoint / 15;

    let line = this.createSVGElement("line");
    line.classList.add("hourHand");
    line.setAttribute("x1", (midPoint).toString());
    line.setAttribute("y1", (midPoint).toString());
    line.setAttribute("stroke-width", (lineWidth).toString());
    updateGroup.appendChild(line);
    this.hourHand = line;
  }

  renderMinuteHand(updateGroup: SVGElement, midPoint) {
    let lineWidth = midPoint / 22;

    let line = this.createSVGElement("line");
    line.classList.add("minuteHand");
    line.setAttribute("x1", (midPoint).toString());
    line.setAttribute("y1", (midPoint).toString());
    line.setAttribute("stroke-width", (lineWidth).toString());
    updateGroup.appendChild(line);
    this.minuteHand = line;
  }

  renderSecondHand(updateGroup: SVGElement, midPoint) {
    let lineWidth = midPoint / 36.6;

    let line = this.createSVGElement("line");
    line.classList.add("secondHand");
    line.setAttribute("x1", (midPoint).toString());
    line.setAttribute("y1", (midPoint).toString());
    line.setAttribute("stroke-width", (lineWidth).toString());
    updateGroup.appendChild(line);
    this.secondHand = line;
  }
  updateHour(midPoint: number, hour: number) {
    this.hourHand.setAttribute("x2", (midPoint + midPoint / 2 * Math.cos(hour)).toString());
    this.hourHand.setAttribute("y2", (midPoint + midPoint / 2 * Math.sin(hour)).toString());
  }

  updateMinute(midPoint: number, min: number) {
    this.minuteHand.setAttribute("x2", (midPoint + midPoint / 1.5 * Math.cos(min)).toString());
    this.minuteHand.setAttribute("y2", (midPoint + midPoint / 1.6 * Math.sin(min)).toString());
  }

  updateSecond(midPoint: number, sec: number) {
    this.secondHand.setAttribute("x2", (midPoint + midPoint / 1.28 * Math.cos(sec)).toString());
    this.secondHand.setAttribute("y2", (midPoint + midPoint / 1.28 * Math.sin(sec)).toString());
  }

  update(midPoint) {

    let d = new Date();
    let date = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
    date.setMilliseconds(d.getUTCMilliseconds() + (this.timeOffset * 60 * 60 * 1000));

    let day = date.getDate();
    let rawMs = date.getMilliseconds();
    let rawSec = date.getSeconds();
    let rawMin = date.getMinutes();
    let rawHour = date.getHours();

    let hourAngle = (2 * Math.PI) / 12;
    let minuteAngle = hourAngle / 5;
    let secondAngle = minuteAngle;
    let msAngle = secondAngle / 1000;

    let currection = Math.PI / 2;
    let ms = (rawMs * msAngle);
    let sec = (rawSec * secondAngle) - currection;// + ((rawMs * msAngle));
    let min = (rawMin * minuteAngle) + ((rawSec * secondAngle) / 60) - currection;
    let hour = (rawHour * hourAngle) + ((rawMin * minuteAngle) / 12) - currection;

    this.updateDate(day);
    this.updateHour(midPoint, hour);
    this.updateMinute(midPoint, min);
    this.updateSecond(midPoint, sec);


  }
}

new Clock(document.getElementById('clock1'), -4);
new Clock(document.getElementById('clock2'), 3.5);
new Clock(document.getElementById('clock3'), -7);
new Clock(document.getElementById('clock4'), +2);
