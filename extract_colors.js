const Vibrant = require('node-vibrant');

Vibrant.from('logo.png').getPalette()
  .then((palette) => {
    console.log('Vibrant:', palette.Vibrant ? palette.Vibrant.hex : null);
    console.log('Muted:', palette.Muted ? palette.Muted.hex : null);
    console.log('DarkVibrant:', palette.DarkVibrant ? palette.DarkVibrant.hex : null);
    console.log('DarkMuted:', palette.DarkMuted ? palette.DarkMuted.hex : null);
    console.log('LightVibrant:', palette.LightVibrant ? palette.LightVibrant.hex : null);
    console.log('LightMuted:', palette.LightMuted ? palette.LightMuted.hex : null);
  })
  .catch(console.error);
