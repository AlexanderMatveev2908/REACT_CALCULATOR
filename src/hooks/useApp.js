import { useEffect, useMemo, useRef, useState } from "react";
import { operations } from "../config/fields";
import { REG_OP } from "../config/reg";

const formatTxt = (txt) =>
  txt.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("%", "/100*");

export const useApp = () => {
  const [textUser, setTextUser] = useState("0");
  const [resMath, setResMath] = useState(null);
  const resRef = useRef(null);

  // made just for me
  const totDev = useMemo(() => {
    if (isNaN(textUser.split("")?.at(-1))) return;
    const formatted = formatTxt(textUser);
    try {
      return new Function(`return ${formatted}`)();
    } catch (err) {
      console.log(err);
    }
  }, [textUser]);

  useEffect(() => {
    const listenMouseDown = (e) => {
      // chain prev tot with new calc, used ref but also id is ok
      if (!resRef?.current) return;
      if (!resRef.current.contains(e.target)) {
        setResMath(null);
      }
    };

    document.addEventListener("mousedown", listenMouseDown);
    return () => document.removeEventListener("mousedown", listenMouseDown);
  }, []);

  const handleToggleLastNum = () => {
    if (isNaN(textUser.at(-1)) || textUser === "0") return;
    // i do not affect original array cause virtual DOM react is not triggered by changes that does not return new memory ref of var

    setTextUser((prev) => {
      let lastNum = [];
      const splitted = prev.split("");

      // start from bottom
      let i = splitted.length - 1;
      let lastOp = null;
      do {
        // recreate num
        if (!operations.includes(splitted[i])) lastNum.push(splitted[i]);
        // at op stop
        else {
          lastOp = splitted[i];
          break;
        }

        i--;
      } while (i >= 0);

      //  remake of number correct order
      lastNum = +lastNum.reverse().join("");
      // start processing

      if (!lastOp) return -lastNum + "";

      // toggle op if not  * or / but toggle num if yes
      if (lastOp === "+") lastOp = "-";
      else if (lastOp === "-") lastOp = "+";
      else lastNum = -lastNum;

      //  make less 1 to each one to think in index logic and less i to know where we stopped above and exclude the op we will replace
      const whereToStopCut = prev.length - 1 - (splitted.length - 1 - i);
      const cutted = prev.slice(0, whereToStopCut);

      //  last char is op cause we toggleled in past it and now would be x ++el or +-el that is ok and makes sense but is better show simple nums
      if (operations.includes(cutted.at(-1)) && lastOp === "+") lastOp = "";
      // i think is ok allow toggle first num to start making negative calc, just i do not show + if num is positive making it implicit positive
      if (!cutted && lastOp === "+") lastOp = "";

      return cutted + lastOp + lastNum;
    });
  };

  const handleChainStr = (val) => {
    if (textUser.length >= 14 && window.innerWidth <= 640) {
      alert("Exceeded 14 chars");
      return;
    }
    setTextUser((prev) => {
      if (prev === "Error") prev = "";

      const lastIndex = prev.length - 1;
      const lastChar = prev?.slice(lastIndex);
      // switch operations
      if (operations.includes(lastChar) && operations.includes(val))
        return prev.slice(0, lastIndex) + val;
      // replace placeholder
      if (prev === "0") return isNaN(val) ? prev + val : val;

      // not allow two . or in general NaN val consecutive
      const lastBlock = prev.split(REG_OP).pop();
      if (lastBlock.includes(".") && val === ".") return prev;
      if (isNaN(lastChar) && isNaN(val)) return prev;

      return prev + val;
    });
  };

  const handleClear = () => {
    setTextUser("0");
    setResMath(null);
  };

  const handleShowRes = () => {
    if (isNaN(textUser.at(-1))) return;

    const formatted = formatTxt(textUser);

    const checkFormatted = formatted.split("");
    let i = 0;
    let isErr = false;
    do {
      // if no division no chance divide by 0, or if there is no 0 then will be ok division
      if (checkFormatted[i] !== "/" || checkFormatted[i + 1] !== "0") {
        i++;
        continue;
      }

      //  delete / cause would create bugs in findIndex
      const blockToCheck = checkFormatted.slice(i + 1);
      // isolate from next op
      const nextOp = blockToCheck.findIndex((el) => operations.includes(el));
      // create final block to check
      const blockLoop =
        nextOp !== -1 ? blockToCheck.slice(0, nextOp) : blockToCheck;

      // or is zero or does not include floating prime number then is err
      if (
        blockLoop.join("") === "0" ||
        !blockLoop.some((el) => !["0", "."].includes(el))
      ) {
        isErr = true;
        break;
      }
      i++;
    } while (i < checkFormatted.length);

    if (isErr) {
      alert("Error");
      setResMath(null);
      setTextUser("Error");
      return;
    }

    try {
      const res = new Function(`return ${formatted}`)();
      setResMath(res);
      setTextUser(res + "");
    } catch (err) {
      console.log(err);
    }
  };

  return {
    resMath,
    textUser,
    handleShowRes,
    handleClear,
    handleChainStr,
    resRef,
    totDev,
    handleToggleLastNum,
  };
};
