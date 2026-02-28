const Food = ({ food }) => {
  return (
    <div
      className="food"
      style={{ top: food[0] * 20, left: food[1] * 20 }}
    />
  );
};

export default Food;