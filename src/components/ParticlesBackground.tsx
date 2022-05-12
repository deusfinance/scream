import Particles from 'react-tsparticles'

export default function ParticlesBackground() {
    return (
        <div className="pointer-events-none fixed z-0 inset-0 w-full h-full top-0 left-0 bg-opacity-10">
            <Particles
                className="w-full h-full"
                params={{
                    particles: {
                        number: {
                            value: 20
                        },
                        move: {
                            speed: 0.5,
                            direction: 'left',
                            outMode: 'out'
                        },
                        color: {
                            value: ['#6AE2DC', '#FFB8D2', '#F4DC62', '#FFC78B', '#CDC5FF', '#4D4D4D']
                        },
                        opacity: {
                            value: 0.5,
                            anim: {
                                enable: true,
                                speed: 0.2
                            }
                        },
                        shape: {
                            type: 'images',
                            images: [
                                {
                                    src: '/img/screampack/scream-1.png',
                                    width: 449,
                                    height: 449
                                },
                                {
                                    src: '/img/screampack/scream-2.png',
                                    width: 449,
                                    height: 449
                                },
                                {
                                    src: '/img/screampack/scream-3.png',
                                    width: 449,
                                    height: 449
                                },
                                {
                                    src: '/img/screampack/scream-4.png',
                                    width: 449,
                                    height: 449
                                }
                            ]
                        },
                        line_linked: {
                            enable: false
                        },
                        size: {
                            value: 28,
                            random: false,
                            anim: {
                                enable: false,
                                speed: 12.181158184520175,
                                size_min: 0.1,
                                sync: true
                            }
                        }
                    }
                }}
            />
        </div>
    )
}
