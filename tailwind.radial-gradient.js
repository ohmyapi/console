/**
 * Radial gradient for tailwindcss
 * @link https://stackoverflow.com/questions/76673267/how-to-use-radial-gradient-in-tailwindcss
 */

const plugin = require('tailwindcss/plugin')

const RadialGradientPlugin = plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                'bg-radial': value => ({
                    'background-image': `radial-gradient(${value},var(--tw-gradient-stops))`,
                }),
            },
            { values: theme('radialGradients') }
        )
    },
    {
        theme: {
            radialGradients: _presets(),
        },
    }
)

/**
 * utility class presets
 */
function _presets() {
    const shapes = ['circle', 'ellipse'];
    const pos = {
        c: 'center',
        t: 'top',
        b: 'bottom',
        l: 'left',
        r: 'right',
        tl: 'top left',
        tr: 'top right',
        bl: 'bottom left',
        br: 'bottom right',
    };
    let result = {};
    for (const shape of shapes)
        for (const [posName, posValue] of Object.entries(pos))
            result[`${shape}-${posName}`] = `${shape} at ${posValue}`;

    return result;
}

module.exports = RadialGradientPlugin;