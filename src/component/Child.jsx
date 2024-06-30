import React from "react";

function Count({ value, onIncrement, onDecrement }) {
  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={onIncrement}>Increment</button>
      <button onClick={onDecrement}>Decrement</button>
    </div>
  );
}

export default Count;
