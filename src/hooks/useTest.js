import { useReducer } from "react";
import { operations } from "../config/fields";

const initState = {
  tot: 0,
  operationsQue: [],
};

const handleMath = (state) => {
  const operationsToCalc = [...state.operationsQue];

  let isErr = false;
  let i = 0;

  do {
    // give alias cause shorter and arg share memory ref so i can splice and update original
    const curr = operationsToCalc[i];
    const arg = operationsToCalc;

    if (["×", "÷", "%"].includes(curr)) {
      const prev = +arg[i - 1];
      const next = +arg[i + 1];

      if (curr === "÷" && next === 0) {
        isErr = true;
        break;
      }

      const res =
        curr === "×"
          ? prev * next
          : curr === "÷"
          ? prev / next
          : curr === "%"
          ? (prev / 100) * next
          : "Invalid";

      if (res === "Invalid") {
        isErr = true;
        break;
      }

      arg.splice(i - 1, 3, res + "");

      // rollback
      i--;
      // nothing happen so next
    } else i++;
    //  arg and operationsToCalc share same ref in memory
  } while (i < operationsToCalc.length);

  let res = null;
  if (isErr)
    return {
      res,
    };

  if (operationsToCalc.length < 2) {
    res = +operationsToCalc[0];
  } else {
    //  inner scope so i can name it as i want even already existing above
    const arg = operationsToCalc;
    // start from first cause i assign res to first number, is like if inside a reduce i assign the acc to a number i know is to make additions instead of starting from 0
    res = +arg[0];
    let j = 1;

    do {
      const curr = arg[j];
      const next = arg[j + 1];

      res = ["+", "-"].includes(curr)
        ? curr === "+"
          ? res + +next
          : res - +next
        : res;
      // go next block operations couple
      j += 2;
    } while (j < operationsToCalc.length);
  }
  return { res };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "NUM_CLICK": {
      const { val } = action.payload;

      let updated = [...state.operationsQue];

      if (isNaN(updated?.at(-1))) updated = [...updated, ""];
      let updatedCurr = updated.at(-1);

      if (!isNaN(val)) {
        if (!updatedCurr) updatedCurr = val;
        else updatedCurr += val;
      }
      if (updatedCurr && isNaN(+val))
        updatedCurr += updatedCurr?.includes(".") ? "" : ".";

      updated = [...updated.slice(0, updated.length - 1), updatedCurr];

      return {
        ...state,
        operationsQue: updated,
      };
    }
    case "ACT_CLICK": {
      const { act } = action.payload;

      if (!state.operationsQue.length) return state;

      let updated = [...state.operationsQue];
      if (!isNaN(updated.at(-1))) {
        updated = [...updated, act];
      } else if (operations.includes(updated.at(-1))) {
        updated = [...updated.slice(0, updated.length - 1), act];
      }

      return {
        ...state,
        operationsQue: updated,
      };
    }

    case "TOGGLE_LAST": {
      let updated = [...state.operationsQue];

      if (isNaN(updated.at(-1))) return state;

      updated = [
        ...updated.slice(0, updated.length - 1),
        //  shortcut ES6 => convert to number make negative convert to string faster, just cut - for negative num
        updated.at(-1) > 0 ? -+updated.at(-1) + "" : updated.at(-1).slice(1),
      ];

      return {
        ...state,
        operationsQue: updated,
      };
    }

    case "GET_RES": {
      if (state.operationsQue.length < 3 || isNaN(state.operationsQue.at(-1)))
        return state;

      const { res } = handleMath(state);

      if (res === null)
        return {
          operationsQue: [],
          tot: "Error",
        };

      return {
        operationsQue: [res + ""],
        tot: res,
      };
    }

    case "CLEAR":
      return initState;
    default:
      return state;
  }
};

export const useTest = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  const handleTestClick = (val) => {
    dispatch({ type: "NUM_CLICK", payload: { val } });
  };
  const handleClearTest = () => dispatch({ type: "CLEAR" });

  const handleChangeAction = (val) => {
    dispatch({ type: "ACT_CLICK", payload: { act: val } });
  };
  const getRes = () => dispatch({ type: "GET_RES" });

  const handleToggleTest = () => dispatch({ type: "TOGGLE_LAST" });

  console.log(state);

  return {
    handleTestClick,
    handleClearTest,
    handleChangeAction,
    getRes,
    handleToggleTest,
  };
};
