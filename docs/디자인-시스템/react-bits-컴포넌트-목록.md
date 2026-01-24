# React Bits (reactbits.dev) 컴포넌트/애니메이션 목록

React Bits는 애니메이션, 인터랙션, 배경 효과 중심 컴포넌트를 모아둔 레지스트리입니다.
Tasteam에서는 **`shared/ui` 래퍼만** 외부 레이어에 노출하며 `features/`, `widgets/`, `pages/`는 직접 import하지 않습니다.

이 목록은 `npx shadcn@latest search @react-bits` 결과(2026-01-24 기준)를 자동화하여 정리한 것입니다. 각 항목은 base 컴포넌트 한 줄 + `TS-TW` 설치 인자를 함께 보여줍니다.

## 사용 방법(권장)

- 기본 선택은 `TS-TW` (TypeScript + Tailwind)입니다.
- 설치 예시:

```bash
npx shadcn@latest add @react-bits/<Component>-TS-TW
```

- 설치한 컴포넌트는 `src/shared/ui/shadcn/react-bits/`처럼 내부 구현 공간에 보관한 뒤, `src/shared/ui/<Component>` 같은 표준 API로 래핑해서 노출하는 방식을 권장합니다.

## 애니메이션 간단 가이드

- 목적: 정보 위계(강조), 상태 피드백(로딩/성공/오류), 전환 맥락(페이지/모달), 미적 배경(히어로/배너)
- 원칙: 핵심 흐름을 방해하지 않도록 모션을 절제하고, 중요한 순간에만 애니메이션을 사용합니다.
- 성능: 가능한 `transform`/`opacity` 기반 애니메이션으로 처리하고, 레이아웃 리플로우를 유발하는 효과는 지양합니다.
- 접근성: `prefers-reduced-motion`을 존중하여 모션 감축/비활성화 옵션을 제공합니다.

## 컴포넌트 리스트

| Base              | 설명                                                                                                                                 | Variants                     | shadcn add (권장)                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | ------------------------------------- |
| AnimatedContent   | Wrapper that animates any children on scroll or mount with configurable direction, distance, duration, easing and disappear options. | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/AnimatedContent-TS-TW`   |
| AnimatedList      | List items enter with staggered motion variants for polished reveals.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/AnimatedList-TS-TW`      |
| Antigravity       | 3D antigravity particle field that repels from the cursor with smooth motion.                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Antigravity-TS-TW`       |
| ASCIIText         | Renders text with an animated ASCII background for a retro feel.                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ASCIIText-TS-TW`         |
| Aurora            | Flowing aurora gradient background.                                                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Aurora-TS-TW`            |
| Balatro           | The balatro shader, fully customizalbe and interactive.                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Balatro-TS-TW`           |
| Ballpit           | Physics ball pit simulation with bouncing colorful spheres.                                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Ballpit-TS-TW`           |
| Beams             | Crossing animated ribbons with customizable properties.                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Beams-TS-TW`             |
| BlobCursor        | Organic blob cursor that smoothly follows the pointer with inertia and elastic morphing.                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/BlobCursor-TS-TW`        |
| BlurText          | Text starts blurred then crisply resolves for a soft-focus reveal effect.                                                            | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/BlurText-TS-TW`          |
| BounceCards       | Cards bounce that bounce in on mount.                                                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/BounceCards-TS-TW`       |
| BubbleMenu        | Floating circular expanding menu with staggered item reveal.                                                                         | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/BubbleMenu-TS-TW`        |
| CardNav           | Expandable navigation bar with card panels revealing nested links.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/CardNav-TS-TW`           |
| CardSwap          | Cards animate position swapping with smooth layout transitions.                                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/CardSwap-TS-TW`          |
| Carousel          | Responsive carousel with touch gestures, looping and transitions.                                                                    | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Carousel-TS-TW`          |
| ChromaGrid        | A responsive grid of grayscale tiles. Hovering the grid reaveals their colors.                                                       | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ChromaGrid-TS-TW`        |
| CircularGallery   | Circular orbit gallery rotating images.                                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/CircularGallery-TS-TW`   |
| CircularText      | Layouts characters around a circle with optional rotation animation.                                                                 | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/CircularText-TS-TW`      |
| ClickSpark        | Creates particle spark bursts at click position.                                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ClickSpark-TS-TW`        |
| ColorBends        | Vibrant color bends with smooth flowing animation.                                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ColorBends-TS-TW`        |
| Counter           | Flexible animated counter supporting increments + easing.                                                                            | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Counter-TS-TW`           |
| CountUp           | Animated number counter supporting formatting and decimals.                                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/CountUp-TS-TW`           |
| Crosshair         | Custom crosshair cursor with tracking, and link hover effects.                                                                       | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Crosshair-TS-TW`         |
| Cubes             | 3D rotating cube cluster. Supports auto-rotation or hover interaction.                                                               | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Cubes-TS-TW`             |
| CurvedLoop        | Flowing looping text path along a customizable curve with drag interaction.                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/CurvedLoop-TS-TW`        |
| DarkVeil          | Subtle dark background with a smooth animation and postprocessing.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/DarkVeil-TS-TW`          |
| DecayCard         | Hover parallax effect that disintegrates the content of a card.                                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/DecayCard-TS-TW`         |
| DecryptedText     | Hacker-style decryption cycling random glyphs until resolving to real text.                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/DecryptedText-TS-TW`     |
| Dither            | Retro dithered noise shader background.                                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Dither-TS-TW`            |
| Dock              | macOS style magnifying dock with proximity scaling of icons.                                                                         | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Dock-TS-TW`              |
| DomeGallery       | Immersive 3D dome gallery projecting images on a hemispheric surface.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/DomeGallery-TS-TW`       |
| DotGrid           | Animated dot grid with cursor interactions.                                                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/DotGrid-TS-TW`           |
| ElasticSlider     | Slider handle stretches elastically then snaps with spring physics.                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ElasticSlider-TS-TW`     |
| ElectricBorder    | Jittery electric energy border with animated arcs, glow and adjustable intensity.                                                    | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ElectricBorder-TS-TW`    |
| FadeContent       | Simple directional fade / slide entrance / exit wrapper with threshold-based activation.                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FadeContent-TS-TW`       |
| FallingText       | Characters fall with gravity + bounce creating a playful entrance.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FallingText-TS-TW`       |
| FaultyTerminal    | Terminal CRT scanline squares effect with flicker + noise.                                                                           | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FaultyTerminal-TS-TW`    |
| FloatingLines     | 3D floating lines that react to cursor movement.                                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FloatingLines-TS-TW`     |
| FlowingMenu       | Liquid flowing active indicator glides between menu items.                                                                           | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FlowingMenu-TS-TW`       |
| FluidGlass        | Glassmorphism container with animated liquid distortion refraction.                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FluidGlass-TS-TW`        |
| FlyingPosters     | 3D posters rotate on scroll infinitely.                                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FlyingPosters-TS-TW`     |
| Folder            | Interactive folder opens to reveal nested content smooth motion.                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Folder-TS-TW`            |
| FuzzyText         | Vibrating fuzzy text with controllable hover intensity.                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/FuzzyText-TS-TW`         |
| Galaxy            | Parallax realistic starfield with pointer interactions.                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Galaxy-TS-TW`            |
| GhostCursor       | Semi-transparent ghost cursor that smoothly follows the real cursor with a trailing effect.                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GhostCursor-TS-TW`       |
| GlareHover        | Adds a realistic moving glare highlight on hover over any element.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GlareHover-TS-TW`        |
| GlassIcons        | Icon set styled with frosted glass blur.                                                                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GlassIcons-TS-TW`        |
| GlassSurface      | Advanced Apple-style glass surface with real-time distortion + lighting.                                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GlassSurface-TS-TW`      |
| GlitchText        | RGB split and distortion glitch effect with jitter effects.                                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GlitchText-TS-TW`        |
| GooeyNav          | Navigation indicator morphs with gooey blob transitions between items.                                                               | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GooeyNav-TS-TW`          |
| GradientBlinds    | Layered gradient blinds with spotlight and noise distortion.                                                                         | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GradientBlinds-TS-TW`    |
| GradientText      | Animated gradient sweep across live text with speed and color control.                                                               | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GradientText-TS-TW`      |
| GradualBlur       | Progressively un-blurs content based on scroll or trigger creating a cinematic reveal.                                               | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GradualBlur-TS-TW`       |
| GridDistortion    | Warped grid mesh distorts smoothly reacting to cursor.                                                                               | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GridDistortion-TS-TW`    |
| GridMotion        | Perspective moving grid lines based on cusror position.                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GridMotion-TS-TW`        |
| GridScan          | Animated grid room 3D scan effect and cool interactions.                                                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/GridScan-TS-TW`          |
| Hyperspeed        | Animated lines continuously moving to simulate hyperspace travel on click hold.                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Hyperspeed-TS-TW`        |
| ImageTrail        | Cursor-based image trail with several built-in variants.                                                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ImageTrail-TS-TW`        |
| InfiniteMenu      | Horizontally looping menu effect that scrolls endlessly with seamless wrap.                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/InfiniteMenu-TS-TW`      |
| Iridescence       | Slick iridescent shader with shifting waves.                                                                                         | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Iridescence-TS-TW`       |
| Lanyard           | Swinging 3D lanyard / badge card with realistic inertial motion.                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Lanyard-TS-TW`           |
| LaserFlow         | Dynamic laser light that flows onto a surface, customizable effect.                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/LaserFlow-TS-TW`         |
| LetterGlitch      | Matrix style letter animation.                                                                                                       | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/LetterGlitch-TS-TW`      |
| Lightning         | Procedural lightning bolts with branching and glow flicker.                                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Lightning-TS-TW`         |
| LightPillar       | Vertical pillar of light with glow effects.                                                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/LightPillar-TS-TW`       |
| LightRays         | Volumetric light rays/beams with customizable direction.                                                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/LightRays-TS-TW`         |
| LiquidChrome      | Liquid metallic chrome shader with flowing reflective surface.                                                                       | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/LiquidChrome-TS-TW`      |
| LiquidEther       | Interactive liquid shader with flowing distortion and customizable colors.                                                           | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/LiquidEther-TS-TW`       |
| LogoLoop          | Continuously looping marquee of brand or tech logos with seamless repeat and hover pause.                                            | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/LogoLoop-TS-TW`          |
| MagicBento        | Interactive bento grid tiles expand + animate with various options.                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/MagicBento-TS-TW`        |
| Magnet            | Elements magnetically ease toward the cursor then settle back with spring physics.                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Magnet-TS-TW`            |
| MagnetLines       | Animated field lines bend toward the cursor.                                                                                         | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/MagnetLines-TS-TW`       |
| Masonry           | Responsive masonry layout with animated reflow + gaps optimization.                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Masonry-TS-TW`           |
| MetaBalls         | Liquid metaball blobs that merge and separate with smooth implicit surface animation.                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/MetaBalls-TS-TW`         |
| MetallicPaint     | Liquid metallic paint shader which can be applied to SVG elements.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/MetallicPaint-TS-TW`     |
| ModelViewer       | Three.js model viewer with orbit controls and lighting presets.                                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ModelViewer-TS-TW`       |
| Noise             | Animated film grain / noise overlay adding subtle texture and motion.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Noise-TS-TW`             |
| Orb               | Floating energy orb with customizable hover effect.                                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Orb-TS-TW`               |
| Particles         | Configurable particle system.                                                                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Particles-TS-TW`         |
| PillNav           | Minimal pill nav with sliding active highlight + smooth easing.                                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/PillNav-TS-TW`           |
| PixelBlast        | Exploding pixel particle bursts with optional liquid postprocessing.                                                                 | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/PixelBlast-TS-TW`        |
| PixelCard         | Card content revealed through pixel expansion transition.                                                                            | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/PixelCard-TS-TW`         |
| PixelSnow         | Falling pixelated snow effect with customizable density and speed.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/PixelSnow-TS-TW`         |
| PixelTrail        | Pixelated cursor trail emitting fading squares with retro digital feel.                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/PixelTrail-TS-TW`        |
| PixelTransition   | Pixel dissolve transition for content reveal on hover.                                                                               | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/PixelTransition-TS-TW`   |
| Plasma            | Organic plasma gradients swirl + morph with smooth turbulence.                                                                       | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Plasma-TS-TW`            |
| Prism             | Rotating prism with configurable intensity, size, and colors.                                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Prism-TS-TW`             |
| PrismaticBurst    | Burst of light rays with controllable color, distortion, amount.                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/PrismaticBurst-TS-TW`    |
| ProfileCard       | Animated profile card glare with 3D hover effect.                                                                                    | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ProfileCard-TS-TW`       |
| ReflectiveCard    | Card with dynamic webcam reflection and glare effects that respond to cursor movement.                                               | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ReflectiveCard-TS-TW`    |
| Ribbons           | Flowing responsive ribbons/cursor trail driven by physics and pointer motion.                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Ribbons-TS-TW`           |
| RippleGrid        | A grid that continuously animates with a ripple effect.                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/RippleGrid-TS-TW`        |
| RotatingText      | Cycles through multiple phrases with 3D rotate / flip transitions.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/RotatingText-TS-TW`      |
| ScrambledText     | Detects cursor position and applies a distortion effect to text.                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ScrambledText-TS-TW`     |
| ScrollFloat       | Text gently floats / parallax shifts on scroll.                                                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ScrollFloat-TS-TW`       |
| ScrollReveal      | Text gently unblurs and reveals on scroll.                                                                                           | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ScrollReveal-TS-TW`      |
| ScrollStack       | Overlapping card stack reveals on scroll with depth layering.                                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ScrollStack-TS-TW`       |
| ScrollVelocity    | Text marquee animatio - speed and distortion scale with user's scroll velocity.                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ScrollVelocity-TS-TW`    |
| ShapeBlur         | Morphing blurred geometric shape. The effect occurs on hover.                                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ShapeBlur-TS-TW`         |
| ShinyText         | Metallic sheen sweeps across text producing a reflective highlight.                                                                  | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/ShinyText-TS-TW`         |
| Shuffle           | Animated text reveal where characters shuffle before settling.                                                                       | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Shuffle-TS-TW`           |
| Silk              | Smooth waves background with soft lighting.                                                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Silk-TS-TW`              |
| SplashCursor      | Liquid splash burst at cursor with curling ripples and waves.                                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/SplashCursor-TS-TW`      |
| SplitText         | Splits text into characters / words for staggered entrance animation.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/SplitText-TS-TW`         |
| SpotlightCard     | Dynamic spotlight follows cursor casting gradient illumination.                                                                      | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/SpotlightCard-TS-TW`     |
| Squares           | Animated squares with scaling + direction customization.                                                                             | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Squares-TS-TW`           |
| Stack             | Layered stack with swipe animations, autoplay and smooth transitions.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Stack-TS-TW`             |
| StaggeredMenu     | Menu with staggered item animations and smooth transitions on open/close.                                                            | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/StaggeredMenu-TS-TW`     |
| StarBorder        | Animated star / sparkle border orbiting content with twinkle pulses.                                                                 | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/StarBorder-TS-TW`        |
| Stepper           | Animated multi-step progress indicator with active state transitions.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Stepper-TS-TW`           |
| StickerPeel       | Sticker corner lift + peel interaction using 3D transform and shadow depth.                                                          | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/StickerPeel-TS-TW`       |
| TargetCursor      | A cursor follow animation with 4 corners that lock onto targets.                                                                     | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/TargetCursor-TS-TW`      |
| TextCursor        | Make any text element follow your cursor, leaving a trail of copies behind it.                                                       | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/TextCursor-TS-TW`        |
| TextPressure      | Characters scale / warp interactively based on pointer pressure zone.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/TextPressure-TS-TW`      |
| TextType          | Typewriter effect with blinking cursor and adjustable typing cadence.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/TextType-TS-TW`          |
| Threads           | Animated pattern of lines forming a fabric-like motion.                                                                              | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Threads-TS-TW`           |
| TiltedCard        | 3D perspective tilt card reacting to pointer.                                                                                        | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/TiltedCard-TS-TW`        |
| TrueFocus         | Applies dynamic blur / clarity based over a series of words in order.                                                                | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/TrueFocus-TS-TW`         |
| VariableProximity | Letter styling changes continuously with pointer distance mapping.                                                                   | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/VariableProximity-TS-TW` |
| Waves             | Layered lines that form smooth wave patterns with animation.                                                                         | JS-CSS, JS-TW, TS-CSS, TS-TW | `@react-bits/Waves-TS-TW`             |
