const Snake = ({ snake }) => {
  return (
    <>
      {snake.map((segment, i) => (
        <div
          key={i}
          className={i === 0 ? "snake-head" : "snake-body"}
          style={{ top: segment[0] * 20, left: segment[1] * 20 }}
        />
      ))}
    </>
  );
};

export default Snake;