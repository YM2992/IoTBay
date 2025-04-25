import { strictEmailRegex } from "./helper";
import { expect, test } from "vitest";

test("valid email should pass", () => {
  expect("test@example.com").toMatch(strictEmailRegex);
});

test("invalid email should fail", () => {
  expect("invalid-email").not.toMatch(strictEmailRegex);
});
