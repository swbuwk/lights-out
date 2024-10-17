import gsap from "gsap";

export const scaleZ = {
  name: "scaleZ", 
  priority: -1, // make it run last so that the other transforms are already applied
  init(target, value) {
    target._gsap || gsap.set(target, {x: "+=0"}); // force creation
    const cache = this.cache = target._gsap;
    if (!("scaleZ" in cache)) {
      cache.scaleZ = 1;
      let oldRender = cache.renderTransform;
      cache.renderTransform = (ratio, data) => {
        oldRender(ratio, data); // takes care of everything except scaleZ()
        target.style.transform += " scaleZ(" + data.scaleZ + ")";
      }
    }
    this.add(cache, "scaleZ", cache.scaleZ, value);
    this._props.push("scaleZ");
  },
  render(ratio, data) {
    let pt = data._pt;
		while (pt) {
			pt.r(ratio, pt.d);
			pt = pt._next;
		}
    data.cache.renderTransform(ratio, data.cache);
  }
}