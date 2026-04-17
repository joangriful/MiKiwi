export function charSplit(text, startDelay = 0) {
    return text.split('').map((char, i) => (
        <span
            key={i}
            className="char"
            data-scroll-reveal
            data-delay={startDelay + (i * 50)}
            style={{ color: char === '.' ? 'inherit' : (i >= 6 && i <= 10 ? 'var(--kiwi)' : 'inherit') }}
        >
            {char}
        </span>
    ));
}
