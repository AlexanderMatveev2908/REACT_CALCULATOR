import { genID } from "../utils/genID";

export const fieldsLeftSide = [
  "C",
  "±",
  "%",
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
].map((el) => ({
  field: el,
  id: genID(),
}));

export const fieldsLeftSideBottom = ["0", "."].map((el) => ({
  field: el,
  id: genID(),
}));

export const operations = ["÷", "×", "-", "+", "%"];

export const fieldsRightSide = [
  ...operations.filter((el) => el !== "%"),
  "=",
].map((el) => ({
  field: el,
  id: genID(),
}));
