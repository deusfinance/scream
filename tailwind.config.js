module.exports = {
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    textColor: {
        babyblue: '#6AE2DC',
        babypink: '#FFB8D2',
        babyyellow: '#F4DC62',
        babyorange: '#FFC78B',
        babygray: '#CDC5FF',
        babypurple: '#4D4D4D'
    },
    theme: {
        extend: {
            colors: {
                babyblue: '#6AE2DC',
                babypink: '#FFB8D2',
                babyyellow: '#F4DC62',
                babypurple: '#4D4D4D'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: []
}
