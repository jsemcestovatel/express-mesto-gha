const randomizer = require('./randomizer');

it ('число от 10 до 80', ()=>{
  expect(typeof randomizer()).toBe('number');
  expect(randomizer()).toBeGreaterThanOrEqual(10);
  expect(randomizer()).toBeLessThanOrEqual(80);
});
