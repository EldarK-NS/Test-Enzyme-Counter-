import React from "react";
import App from "./App";
import Enzyme, { shallow } from "enzyme";
import EnzymeAdapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * factory function to create a ShallowWrapper for the App component.
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = () => shallow(<App />);

const findByTestAttr = (wrapper, val) => wrapper.find(`[data-test='${val}']`);

//!1. проверка отсутсвия ошибок
test("renders without error", () => {
  const wrapper = setup();
  const appComponent = findByTestAttr(wrapper, "component-app");
  expect(appComponent.length).toBe(1);
});

//!2. проверка рендера заголовка

test("renders counter display", () => {
  const wrapper = setup();
  const counterDisplay = findByTestAttr(wrapper, "counter-display");
  expect(counterDisplay.length).toBe(1);
});

//!3. проверка рендера счетчика с 0
test("counter display starts at 0", () => {
  const wrapper = setup();
  const count = findByTestAttr(wrapper, "count").text();
  expect(count).toBe("0");
});
//!4. Кнопка +
describe("Increment", () => {
  //! 4.1 рендер кнопки +
  test("renders increment button", () => {
    const wrapper = setup();
    const button = findByTestAttr(wrapper, "increment-button");
    expect(button.length).toBe(1);
  });
  //! 4.2 нажатие кнопки увеличивает счетчик
  test("clicking button increments counter display", () => {
    const wrapper = setup();
    //find the button
    const button = findByTestAttr(wrapper, "increment-button");
    //click the button
    button.simulate("click");
    //find the display, and test that the number has been incremented
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("1");
    //! тут важен порядок проведения теста сперва мы должны найти кнопку, затем эмулируем нажатие и затем находим отображение на экране и ожидаем его изменения, нельзя сразу определять кнопку и отображение, потому что после эмуляции нажатия происходит перерендер, и тест ломается
  });
});
//! 5.  кнопка -
describe("decrement button", () => {
  //! 5.1 рендер  кнопка -
  test("renders decrement button", () => {
    const wrapper = setup();
    const decrementButton = wrapper.find("[data-test='decrement-button']");
    expect(decrementButton.length).toBe(1);
  });
  //! 5.2 уменьшение счетчика когда счетчик больше 0
  test("clicking decrement button decrements counter display when state is greater than 0", () => {
    const wrapper = setup();

    // click the increment button so that the counter is greater than 0
    const incButton = findByTestAttr(wrapper, "increment-button");
    incButton.simulate("click");

    // find decrement button and click
    const decrementButton = findByTestAttr(wrapper, "decrement-button");
    decrementButton.simulate("click");

    //
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("0");
  });
});
//! 6. скрытие ошибки при счетчике 0
describe("error when counter goes below 0", () => {
  test("error does not show when not needed", () => {
    const wrapper = setup();
    const errorText = findByTestAttr(wrapper, "error-text");
    // using enzyme's ".hasClass()" method
    const errorTextHidden = errorText.hasClass("hidden");
    expect(errorTextHidden).toBe(true);
  });
});
//! 7. появление ошибки при счетчике 0 и нажатии кнопки -
describe("counter is 0 and decrement is clicked", () => {
  // using a describe here so I can use a "beforeEach" for shared setup

  // scoping wrapper to the describe, so it can be used in beforeEach and the tests
  let wrapper;
  beforeEach(() => {
    // no need to set counter value here; default value of 0 is good
    wrapper = setup();

    // find button and click
    const button = findByTestAttr(wrapper, "decrement-button");
    button.simulate("click");
  });

  test("error shows", () => {
    // check the class of the error message
    const errorText = findByTestAttr(wrapper, "error-text");
    const errorTextHidden = errorText.hasClass("hidden");
    expect(errorTextHidden).toBe(false);
  });

  test("counter still displays 0", () => {
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("0");
  });

  test("clicking increment clears the error", () => {
    // find and click the increment button
    const incButton = findByTestAttr(wrapper, "increment-button");
    incButton.simulate("click");

    // check the class of the error message
    const errorText = findByTestAttr(wrapper, "error-text");
    const errorTextHidden = errorText.hasClass("hidden");
    expect(errorTextHidden).toBe(true);
  });
});
