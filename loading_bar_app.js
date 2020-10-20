// colors updating the SVG through the currentColor property
const colors = [
    'hsl(166, 100%, 55%)',
    'hsl(38, 100%, 60%)',
    'hsl(316, 98%, 59%)',
    'hsl(273, 100%, 68%)',
    'hsl(252, 65%, 63%)',
  ];
  
  /** syntax updating the SVG through the d attribute
   * horizontal line
   * heart rate
   * lightning bolt
   * star
   * hourglass
   */
  // the coordinates describe absolute points followed by the path element
  // ! remember the M command at the beginning of the d attribute
  const shapes = [
    '0 50 100 50',
    '0 50 12.5 50 18.75 65.5 25 50 37.5 50 43.75 34.1 56.25 60.87 62.5 50 68.75 50 75 15.38 81.25 50 87.5 50 93.75 71.33 100 50',
    '50 0 80 0 60 30 75 30 45 70 70 70 20 100 35 70 20 70 45 30 30 30 50 0',
    '50 10 65 40 90 40 70 60 80 90 50 75 20 90 30 60 10 40 35 40 50 10',
    '15 15 85 15 15 85 85 85 15 15',
  ];
  
  // ! to smoothly animate between the shapes it is necessary to maintain a consistent number of points
  const pointRegex = /[\d\.]+ [\d\.]+/gi;
  // create an array describing the points of each shape
  const points = shapes.map(shape => shape.match(pointRegex));
  // create an array detailing the length of the points' array, for each shape
  const pointsLength = points.map(point => point.length);
  // retrieve the highest number of points
  const maxPoint = [...pointsLength].sort((a, b) => (a > b ? -1 : 1))[0];
  
  // create an array of shapes adding to each string as many points to make up the difference between the shapes's points and the maximum amount
  // include copies of the last point
  const fixedShapes = shapes.map((shape, index) => {
    const difference = maxPoint - pointsLength[index];
    const lastPoint = points[index][points[index].length - 1];
    const addendum = ` ${lastPoint}`;
    return `${shape}${addendum.repeat(difference)}`;
  });
  
  // function updating the color property set on the body
  const updateColor = (color) => { document.querySelector('body').style.color = color; };
  
  // function updating the stroke-dash properties to match the length of the input element
  const updateDash = (path) => {
    const length = path.getTotalLength();
    path.setAttribute('stroke-dasharray', length);
    path.setAttribute('stroke-dashoffset', length);
  };
  
  // function updating the d attribute of both path elements
  const updateShape = (shape) => {
    const paths = document.querySelectorAll('svg#progress g path');
    anime({
      targets: paths,
      d: `M ${shape}`,
      duration: 800,
      // as you animate the points attribute update the stroke-dash properties with the new length of the path
      update() {
        updateDash(paths[1]);
      },
      easing: 'easeInOutCirc',
    });
  };
  
  // target the path elements and single out the colored one
  const progressPaths = document.querySelectorAll('svg#progress g path');
  const progressPath = progressPaths[1];
  
  // update the d attribute with the first fixed value
  progressPaths.forEach(path => path.setAttribute('d', `M ${fixedShapes[0]}`));
  
  // update the dash properties on the colored path
  updateDash(progressPath);
  
  // begin the endless animation to draw the colored path and and out of sight
  progressPath.style.animation = 'drawPath 7s ease-in-out infinite alternate';
  
  
  // for the controls include one button for each color, one button for each shape
  const controls = document.querySelector('.controls');
  const controlsColor = controls.querySelector('.controls__color');
  const controlsShape = controls.querySelector('.controls__shape');
  
  // for each color add a button to update the path element with the prescribed hue
  colors.forEach((color) => {
    const button = document.createElement('button');
    button.addEventListener('click', () => updateColor(color));
    // in the button include a circle matching the input color
    button.innerHTML = `
    <svg viewBox="0 0 100 100" width="50" height="50">
      <circle
          cx="50"
          cy="50"
          r="50"
          fill="${color}">
      </circle>
    </svg>`;
  
    controlsColor.appendChild(button);
  });
  
  
  // for each shape add a button to change both path elements with the connected points attribute
  fixedShapes.forEach((shape) => {
    const button = document.createElement('button');
    button.addEventListener('click', () => updateShape(shape));
    // ! use the currentColor property to match the selected color
    // ! use a larger viewBox to reduce the size of the path elements
    button.innerHTML = `
    <svg viewBox="0 0 150 150" width="50" height="50">
      <g
        transform="translate(25 25)">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="20"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M ${shape}">
        </path>
      </g>
    </svg>`;
  
    controlsShape.appendChild(button);
  });
  