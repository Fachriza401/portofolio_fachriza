const meteors = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  '--meteor-left': `${(index * 47 + 13) % 100}%`,
  '--meteor-top': `${-((index * 31 + 7) % 90)}%`,
  '--meteor-delay': `-${(index * 1.73) % 12}s`,
  '--meteor-duration': `${8 + ((index * 7) % 9)}s`,
  '--meteor-height': `${72 + ((index * 29) % 66)}px`
}));

const MeteorBackground = () => (
  <div className='meteor-background' aria-hidden='true'>
    {meteors.map(({ id, ...style }) => (
      <span className='meteor' key={id} style={style} />
    ))}
  </div>
);

export default MeteorBackground;
