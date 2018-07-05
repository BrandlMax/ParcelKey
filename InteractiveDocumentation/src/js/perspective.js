/**
 * Vom lieben lieben Flo (dem Lebensretter)
 */
(() => {
  const $container = document.getElementById('perspectiveBox');
  const $inner = $container.querySelector('.perspective-inner');
  const updateRate = 5;
  let counter = 0;

  class Mouse {
    constructor() {
      this._x = 0;
      this._y = 0;
    }

    updatePosition(event) {
      const relativeX = event.clientX - this._ox;
      const relativeY = event.clientY - this._oy;

      this._x = relativeX;
      this._y = relativeY * -1;
    }

    setOrigin($element) {
      const rect = $element.getBoundingClientRect();
      this._ox = rect.left + Math.floor($element.offsetWidth / 2);
      this._oy = rect.top + Math.floor($element.offsetHeight / 2);
    }

    show() {
      console.log(`(${this._x},${this._y})`);
    }

    get x() {
      return this._x;
    }

    get y() {
      return this._y;
    }
  }

  const mouse = new Mouse();

  const isTimeToUpdate = () => {
    counter += 1;
    return counter % updateRate === 0;
  };

  const updateTransformStyle = (x, y) => {
    const style = `rotateX(${x}deg) rotateY(${y}deg)`;

    $inner.style.transform = style;
    $inner.style.webkitTransform = style;
    $inner.style.mozTransform = style;
    $inner.style.msTransform = style;
    $inner.style.oTransform = style;
  };

  const update = (event) => {
    mouse.updatePosition(event);

    updateTransformStyle(
      (mouse.y / $inner.offsetHeight / 2).toFixed(2),
      (mouse.x / $inner.offsetWidth / 2).toFixed(2),
    );
  };

  const onMouseEnterHandler = (event) => {
    update(event);
  };

  const onMouseLeaveHandler = () => {
    $inner.style = '';
  };

  const onMouseMoveHandler = (event) => {
    if (isTimeToUpdate()) {
      requestAnimationFrame(() => update(event));
    }
  };

  window.addEventListener('resize', () => mouse.setOrigin($container));
  window.addEventListener('scroll', () => {
    if (window.isInViewPort($container)) {
      mouse.setOrigin($container);
    }
  });
  window.addEventListener('DOMContentLoaded', () => mouse.setOrigin($container));
  $container.onmouseenter = onMouseEnterHandler;
  $container.onmouseleave = onMouseLeaveHandler;
  $container.onmousemove = onMouseMoveHandler;
})();
